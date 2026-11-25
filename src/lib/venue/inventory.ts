import { activity, database, enqueue, inventoryLock, type Transaction } from './db';
import { BookingConflict, emailValid, tourTime, upsertLead } from './operations';

type Inventory = {
  id: string; label: string; starts_at: Date; ends_at: Date; resources: string[];
  state: 'open' | 'held' | 'booked' | 'closed'; price_cents: number; deposit_cents: number | null; lead_id: string | null;
};

async function assertUnreserved(tx: Transaction, start: Date, end: Date, resources: string[], except: string | null) {
  const [conflict] = await tx`
    select id from venue_event_windows where id is distinct from ${except}::uuid
      and (state='booked' or (state='held' and expires_at>now()))
      and resources && ${resources}::text[] and tstzrange(starts_at,ends_at,'[)') && tstzrange(${start},${end},'[)')
    union all
    select id from venue_tours where 'tour'=any(${resources}::text[])
      and status in ('scheduled','confirmed') and tstzrange(starts_at,ends_at,'[)') && tstzrange(${start},${end},'[)')
    limit 1`;
  if (conflict) throw new BookingConflict('The time overlaps an existing hold, booking or tour.');
}

export async function setEvent(input: {
  id: string | null; label: string; startsAt: string; endsAt: string; state: Inventory['state'];
  resources: string[]; priceCents: number; depositCents: number | null; published: boolean; expiresAt: string | null; email: string;
}) {
  if (!input.label || input.label.length > 120 || !['open','held','booked','closed'].includes(input.state) ||
      !input.resources.length || !Number.isInteger(input.priceCents) || input.priceCents < 0 ||
      input.priceCents > 50_000_000 || (input.depositCents !== null &&
        (!Number.isInteger(input.depositCents) || input.depositCents <= 0 || input.depositCents > input.priceCents)) || (input.email && !emailValid(input.email))) throw new Error('Invalid event details.');
  const held = input.state === 'held';
  const [times] = await database()<{ starts: Date; ends: Date; expires: Date | null }[]>`
    select ${input.startsAt}::timestamp at time zone 'America/Chicago' as starts,
      ${input.endsAt}::timestamp at time zone 'America/Chicago' as ends,
      ${input.expiresAt}::timestamp at time zone 'America/Chicago' as expires`;
  if (!times || times.starts >= times.ends || (held && (!times.expires || times.expires <= new Date()))) {
    throw new Error('Enter a valid start, end and hold expiration.');
  }
  return database().begin(async tx => {
    await inventoryLock(tx);
    const valid = await tx`select id from venue_resources where id=any(${input.resources}::text[])`;
    if (valid.length !== input.resources.length) throw new Error('Invalid venue resources.');
    const [previous] = input.id ? await tx<Inventory[]>`select * from venue_event_windows where id=${input.id} for update` : [];
    if (input.id && !previous) throw new Error('Event window was not found.');
    if (input.state === 'held' || input.state === 'booked') {
      await assertUnreserved(tx, times.starts, times.ends, input.resources, input.id);
    }
    const lead = input.email ? await upsertLead(tx, input.email, '', 'staff') : null;
    const leadId = lead?.id ?? previous?.lead_id ?? null;
    const results = previous ? await tx<Inventory[]>`update venue_event_windows set
      label=${input.label},starts_at=${times.starts},ends_at=${times.ends},resources=${input.resources},
      price_cents=${input.priceCents},deposit_cents=${input.depositCents},public_listing=${input.published},state=${input.state},expires_at=${held ? times.expires : null},
      lead_id=${leadId},updated_at=now() where id=${previous.id} returning *`
      : await tx<Inventory[]>`insert into venue_event_windows
        (label,starts_at,ends_at,resources,price_cents,deposit_cents,public_listing,state,expires_at,lead_id)
        values (${input.label},${times.starts},${times.ends},${input.resources},${input.priceCents},${input.depositCents},${input.published},
          ${input.state},${held ? times.expires : null},${leadId}) returning *`;
    if (leadId && input.state === 'booked') await tx`update venue_leads set stage='booked',touch_version=touch_version+1 where id=${leadId}`;
    await activity(tx, leadId, 'event_' + input.state, { windowId: results[0].id });
  });
}

export async function applyReceipt(input: {
  eventId: string; providerReference: string; windowId: string; amountCents: number; email: string;
}) {
  return database().begin(async tx => {
    await inventoryLock(tx);
    const [already] = await tx`select event_id from venue_deposits
      where event_id=${input.eventId} or provider_reference=${input.providerReference}`;
    if (already) return 'duplicate';
    const [w] = await tx<Inventory[]>`select * from venue_event_windows where id=${input.windowId} for update`;
    if (!w || w.state === 'closed' || w.starts_at <= new Date()) {
      throw new BookingConflict('No eligible event window is linked to this receipt.');
    }
    if (!w.deposit_cents || input.amountCents !== w.deposit_cents) {
      throw new BookingConflict('The payment does not match the approved deposit for this event window.');
    }
    const lead = await upsertLead(tx, input.email, '', 'staff');
    if ((w.state === 'held' || w.state === 'booked') && w.lead_id && w.lead_id !== lead.id) {
      throw new BookingConflict('This window belongs to a different lead.');
    }
    await assertUnreserved(tx, w.starts_at, w.ends_at, w.resources, w.id);
    await tx`insert into venue_deposits(event_id,provider_reference,window_id,amount_cents)
      values (${input.eventId},${input.providerReference},${w.id},${input.amountCents})`;
    await tx`update venue_event_windows set state='booked',lead_id=${lead.id},expires_at=null,updated_at=now() where id=${w.id}`;
    await tx`update venue_leads set stage='booked',touch_version=touch_version+1 where id=${lead.id}`;
    await activity(tx, lead.id, 'deposit_recorded', { windowId: w.id, amountCents: input.amountCents });
    await enqueue(tx, 'deposit-confirmation:' + w.id, 'email', lead.id, {
      template: 'deposit', text: 'We received your deposit for ' + w.label + ', beginning ' + tourTime(w.starts_at) +
        '. Your event dates are booked. Reply to reach the Horsehead Lake Lodge team.',
    });
    return 'recorded';
  });
}
