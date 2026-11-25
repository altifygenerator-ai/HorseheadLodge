import { createHmac, randomUUID } from 'node:crypto';
import { activity, database, enqueue, inventoryLock, type Transaction } from './db';
import { busyTimes, calendarConfigured } from './graph';
import { sameSecret } from './access';

export const zone = 'America/Chicago';
export const entryEnabled = () => process.env.NEXT_PUBLIC_HORSEHEAD_AUTOMATION_LIVE === 'true' && Boolean(process.env.DATABASE_URL);
export const emailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
export const uuidValid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
export const tourTime = (date: Date) => new Intl.DateTimeFormat('en-US', {
  dateStyle: 'full', timeStyle: 'short', timeZone: zone,
}).format(date) + ' Central time';

export class BookingConflict extends Error {}
type Source = 'website' | 'outlook' | 'weddingwire' | 'the-knot' | 'eventective' | 'public-calendar' | 'staff';

export async function upsertLead(tx: Transaction, email: string, name: string, source: Source) {
  const [lead] = await tx<{ id: string; opted_out: boolean; touch_version: number }[]>`
    insert into venue_leads(email,name,first_source) values (${email},${name},${source})
    on conflict (email) do update set name = case when venue_leads.name = '' then excluded.name else venue_leads.name end
    returning id, opted_out, touch_version`;
  return lead;
}

export async function recordInquiry(input: {
  email: string; name: string; body: string; subject: string; source: Source;
  id: string; outlookId?: string; receivedAt?: Date;
}) {
  return database().begin(async tx => {
    const [seen] = await tx`select id from venue_messages where external_id = ${input.id}`;
    if (seen) return false;
    const lead = await upsertLead(tx, input.email, input.name, input.source);
    const [message] = await tx<{ id: string }[]>`
      insert into venue_messages(external_id,lead_id,source,body,subject,outlook_id,received_at)
      values (${input.id},${lead.id},${input.source},${input.body},${input.subject},${input.outlookId ?? null},${input.receivedAt ?? new Date()})
      on conflict (external_id) do nothing returning id`;
    if (!message) return false;
    const optOut = /^(?:stop|unsubscribe|remove me|please unsubscribe)(?:[.!\s]|$)/i.test(input.body.trim());
    const [version] = await tx<{ touch_version: number }[]>`
      update venue_leads set touch_version = touch_version + 1, opted_out = opted_out or ${optOut}
      where id = ${lead.id} returning touch_version`;
    await activity(tx, lead.id, optOut ? 'opt_out' : 'inquiry_received', { source: input.source, messageId: message.id });
    if (!optOut && !lead.opted_out) {
      await enqueue(tx, 'reply:' + message.id, 'respond', lead.id, { messageId: message.id, version: version.touch_version });
    }
    return true;
  });
}

type Window = { id: string; label: string; starts_at: Date; ends_at: Date; price_cents: number };
export async function eventAvailability(day: string | null = null, limit = 100) {
  return database()<Window[]>`
    select w.id,w.label,w.starts_at,w.ends_at,w.price_cents from venue_event_windows w
    where w.public_listing and (w.state='open' or (w.state='held' and w.expires_at<=now())) and w.starts_at>now()
      and (${day}::date is null or
        (w.starts_at at time zone ${zone})::date <= ${day}::date
        and (w.ends_at at time zone ${zone})::date >= ${day}::date)
      and not exists (
        select 1 from venue_event_windows reserved where
          (reserved.state = 'booked' or (reserved.state = 'held' and reserved.expires_at > now()))
          and reserved.resources && w.resources
          and tstzrange(reserved.starts_at,reserved.ends_at,'[)') && tstzrange(w.starts_at,w.ends_at,'[)')
      )
    order by w.starts_at,w.price_cents limit ${limit}`;
}

type Slot = { starts_at: Date; ends_at: Date };
async function availableTours(tx: Transaction | ReturnType<typeof database>, days: number, exact: Date | null = null) {
  return tx<Slot[]>`
    with dates as (
      select (now() at time zone ${zone})::date + g as d
      from generate_series(0,${days}) g
    ), slots as (
      select distinct a at time zone ${zone} as starts_at,
        (a + make_interval(mins=>h.duration_minutes)) at time zone ${zone} as ends_at
      from dates join venue_tour_hours h on extract(dow from dates.d) = h.weekday
      cross join lateral generate_series(dates.d + h.start_time,
        dates.d + h.end_time - make_interval(mins=>h.duration_minutes),
        make_interval(mins=>h.duration_minutes)) a
    )
    select s.starts_at,s.ends_at from slots s
    where s.starts_at > now() and (${exact}::timestamptz is null or s.starts_at = ${exact}::timestamptz)
      and not exists (select 1 from venue_tours t
        where t.status in ('scheduled','confirmed','attended')
        and tstzrange(t.starts_at,t.ends_at,'[)') && tstzrange(s.starts_at,s.ends_at,'[)'))
      and not exists (select 1 from venue_event_windows w
        where 'tour' = any(w.resources)
        and (w.state = 'booked' or (w.state = 'held' and w.expires_at > now()))
        and tstzrange(w.starts_at,w.ends_at,'[)') && tstzrange(s.starts_at,s.ends_at,'[)'))
    order by s.starts_at
    limit 1000`;
}

export async function tourAvailability(days = 28) {
  const slots = await availableTours(database(), days);
  if (!slots.length) return [];
  const [first, last] = [slots[0], slots[slots.length - 1]];
  const outlook = await busyTimes(first.starts_at, last.ends_at);
  return slots.filter(slot => !outlook.some(event => event.start < slot.ends_at && slot.starts_at < event.end));
}

type Booking = { id: string; lead_id: string; starts_at: Date; ends_at: Date; source: string };
export async function bookTour(input: {
  email: string; name: string; at: Date; requestId: string;
  source: 'direct' | 'agent' | 'staff'; method: 'website' | 'reply' | 'staff';
}) {
  return database().begin(async tx => {
    await inventoryLock(tx);
    const [existing] = await tx<Booking[]>`select t.* from venue_tours t join venue_leads l on l.id=t.lead_id
      where t.request_id=${input.requestId} and l.email=${input.email}`;
    if (existing) return existing;
    const [slot] = await availableTours(tx, 42, input.at);
    if (!slot) throw new BookingConflict('That time is no longer open.');
    const busy = calendarConfigured() && (await busyTimes(slot.starts_at, slot.ends_at)).some(
      event => event.start < slot.ends_at && slot.starts_at < event.end,
    );
    if (busy) throw new BookingConflict('That time is no longer open.');
    const lead = await upsertLead(tx, input.email, input.name, input.source === 'staff' ? 'staff' : 'public-calendar');
    const [active] = await tx`select id from venue_tours where lead_id=${lead.id}
      and status in ('scheduled','confirmed') and starts_at > now()`;
    if (active) throw new BookingConflict('A tour is already scheduled for this email.');
    const [tour] = await tx<Booking[]>`insert into venue_tours(request_id,lead_id,source,starts_at,ends_at)
      values (${input.requestId},${lead.id},${input.source},${slot.starts_at},${slot.ends_at}) returning *`;
    await tx`update venue_leads set stage=case when stage='booked' then stage else 'tour' end,
      touch_version=touch_version+1 where id=${lead.id}`;
    await activity(tx, lead.id, 'tour_scheduled', { tourId: tour.id, source: input.source, method: input.method });
    await enqueue(tx, 'calendar:' + tour.id, 'tour_sync', lead.id, { tourId: tour.id });
    await enqueue(tx, 'tour-confirmation:' + tour.id, 'email', lead.id, { tourId: tour.id, template: 'confirmation' });
    const reminder = new Date(slot.starts_at.getTime() - 24 * 60 * 60 * 1000);
    if (reminder > new Date()) {
      await enqueue(tx, 'tour-reminder:' + tour.id, 'email', lead.id, { tourId: tour.id, template: 'reminder' }, reminder);
    }
    await enqueue(tx, 'tour-outcome:' + tour.id, 'tour_outcome', lead.id, { tourId: tour.id }, slot.ends_at);
    return tour;
  });
}

function offerMac(body: string) {
  const secret = process.env.HORSEHEAD_OFFER_SECRET;
  if (!secret || secret.length < 24) return null;
  return createHmac('sha256', secret).update(body).digest('base64url');
}

export function makeOffer(email: string, at: Date) {
  const body = [randomUUID(), at.getTime(), Date.now() + 48 * 60 * 60 * 1000].join('.');
  const mac = offerMac(email + ':' + body);
  return mac ? body + '.' + mac : null;
}

export function readOffer(email: string, code: string) {
  const [id, at, expires, mac, extra] = code.split('.');
  if (extra || !uuidValid(id) || !Number.isSafeInteger(Number(at)) || !Number.isSafeInteger(Number(expires)) ||
      Number(expires) < Date.now() || !mac) return null;
  const expected = offerMac(email + ':' + [id, at, expires].join('.'));
  if (!expected || !sameSecret(mac, expected)) return null;
  return { id, at: new Date(Number(at)) };
}

export async function changeTourStatus(id: string, status: string, leadEmail?: string) {
  return database().begin(async tx => {
    await inventoryLock(tx);
    const [tour] = await tx<{ id: string; lead_id: string; status: string; ends_at: Date }[]>`
      select t.id,t.lead_id,t.status,t.ends_at from venue_tours t join venue_leads l on l.id=t.lead_id
      where t.id=${id} and (${leadEmail ?? null}::text is null or l.email=${leadEmail ?? null})
      for update of t`;
    if (!tour || tour.status === status) return;
    if (!['scheduled','confirmed'].includes(tour.status)) throw new BookingConflict('This tour already has a final outcome.');
    if (['attended','no_show'].includes(status) && tour.ends_at > new Date()) {
      throw new BookingConflict('The tour is still upcoming.');
    }
    await tx`update venue_tours set status=${status} where id=${id}`;
    await activity(tx, tour.lead_id, 'tour_' + status, { tourId: id });
    if (status === 'canceled') {
      await enqueue(tx, 'calendar-cancel:' + id, 'tour_sync', tour.lead_id, { tourId: id });
      await enqueue(tx, 'tour-canceled:' + id, 'email', tour.lead_id, { tourId: id, template: 'canceled' });
      await tx`update venue_leads set stage=case when stage='tour' then 'contacted' else stage end where id=${tour.lead_id}`;
    }
    if (status === 'attended') {
      await enqueue(tx, 'tour-thanks:' + id, 'email', tour.lead_id, { tourId: id, template: 'thanks' });
    }
  });
}
