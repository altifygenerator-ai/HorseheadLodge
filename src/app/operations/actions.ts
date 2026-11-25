'use server';

import { redirect } from 'next/navigation';
import { isStaff, signIn } from '@/lib/venue/access';
import { activity, database, inventoryLock } from '@/lib/venue/db';
import { setEvent } from '@/lib/venue/inventory';
import { bookTour, BookingConflict, changeTourStatus, emailValid, uuidValid } from '@/lib/venue/operations';

const read = (form: FormData, name: string) => String(form.get(name) ?? '').trim();
const localDate = (s: string) => /^20\d\d-\d\d-\d\dT\d\d:\d\d(?::\d\d)?$/.test(s);

export async function staffLogin(form: FormData) {
  if (!await signIn(read(form, 'secret'))) redirect('/operations?error=login');
  redirect('/operations');
}

async function apply(action: () => Promise<unknown>) {
  if (!await isStaff()) redirect('/operations');
  try {
    await action();
  } catch (error) {
    redirect('/operations?error=' + (error instanceof BookingConflict ? 'conflict' : 'save'));
  }
  redirect('/operations?saved=1');
}

export async function saveEventWindow(form: FormData) {
  await apply(async () => {
    const startsAt = read(form,'start');
    const endsAt = read(form,'end');
    const expiresAt = read(form,'expiration') || null;
    const id = read(form,'id') || null;
    const cents = (value: string) => /^(?:0|[1-9]\d{0,6})(?:\.\d{1,2})?$/.test(value)
      ? Math.round(Number(value) * 100) : NaN;
    const priceCents = cents(read(form,'price'));
    const deposit = read(form,'deposit');
    if (!localDate(startsAt) || !localDate(endsAt) || (expiresAt && !localDate(expiresAt)) ||
        (id && !uuidValid(id))) throw new Error('Invalid date or id.');
    const state = read(form,'state') as 'open' | 'held' | 'booked' | 'closed';
    return setEvent({ id, startsAt, endsAt, expiresAt, state, label: read(form,'label'), priceCents, depositCents: deposit ? cents(deposit) : null, published: read(form,'published') === 'yes',
      resources: form.getAll('resource').map(String), email: read(form,'email').toLowerCase() });
  });
}

export async function saveTourHours(form: FormData) {
  await apply(async () => {
    const weekday = Number(read(form,'weekday'));
    const start = read(form,'start');
    const end = read(form,'end');
    const duration = Number(read(form,'duration'));
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6 ||
        !/^\d\d:\d\d$/.test(start) || !/^\d\d:\d\d$/.test(end) ||
        !Number.isInteger(duration) || duration < 15 || duration > 180) throw new Error('Invalid tour hours.');
    return database().begin(async tx => {
      await inventoryLock(tx);
      await tx`insert into venue_tour_hours(weekday,start_time,end_time,duration_minutes)
        values (${weekday},${start},${end},${duration})
        on conflict(weekday,start_time,end_time) do update set duration_minutes=excluded.duration_minutes`;
    });
  });
}

export async function removeTourHours(form: FormData) {
  await apply(async () => {
    const id = read(form,'id');
    if (!uuidValid(id)) throw new Error('Unknown tour schedule.');
    return database().begin(async tx => {
      await inventoryLock(tx);
      await tx`delete from venue_tour_hours where id=${id}`;
    });
  });
}

export async function staffBookTour(form: FormData) {
  await apply(async () => {
    const at = new Date(read(form,'slot'));
    const email = read(form,'email').toLowerCase();
    const requestId = read(form,'requestId');
    if (!Number.isFinite(+at) || !emailValid(email) || !uuidValid(requestId)) throw new Error('Invalid tour.');
    return bookTour({ at, email, name: read(form,'name').slice(0,120), requestId, source: 'staff', method: 'staff' });
  });
}

export async function resolveTour(form: FormData) {
  await apply(async () => {
    const id = read(form,'id');
    const status = read(form,'status');
    if (!uuidValid(id) || !['confirmed','canceled','attended','no_show'].includes(status)) throw new Error('Invalid outcome.');
    return changeTourStatus(id, status);
  });
}

export async function approveFact(form: FormData) {
  await apply(async () => {
    const topic = read(form,'topic');
    const answer = read(form,'answer');
    if (!['general','tours','availability','pricing','lodging','capacity','policies'].includes(topic) ||
        answer.length < 3 || answer.length > 1200) throw new Error('Invalid answer.');
    return database().begin(async tx => {
      await tx`select pg_advisory_xact_lock(hashtext(${'horsehead-fact:' + topic})::bigint)`;
      const [version] = await tx<{ n: number }[]>`select coalesce(max(revision),0)+1 as n from venue_facts where topic=${topic}`;
      await tx`update venue_facts set enabled=false,updated_at=now() where topic=${topic} and enabled`;
      const [fact] = await tx<{ id: string }[]>`insert into venue_facts(topic,answer,revision)
        values (${topic},${answer},${version.n}) returning id`;
      await activity(tx, null, 'fact_approved', { factId: fact.id, topic, revision: version.n });
    });
  });
}

export async function resolveLead(form: FormData) {
  await apply(async () => {
    const id = read(form,'id');
    const stage = read(form,'stage');
    if (!uuidValid(id) || !['contacted','closed'].includes(stage)) throw new Error('Invalid lead status.');
    return database().begin(async tx => {
      const [lead] = await tx`update venue_leads set stage=case when stage in ('tour','booked') then stage else ${stage} end,
        touch_version=touch_version+1 where id=${id} returning id`;
      if (lead) await activity(tx, id, 'staff_' + stage);
    });
  });
}

export async function retryJob(form: FormData) {
  await apply(async () => {
    const id = read(form,'id');
    if (!uuidValid(id)) throw new Error('Invalid job.');
    await database()`update venue_jobs set status='queued',attempts=0,due_at=now(),last_error=null
      where id=${id} and status='failed'`;
  });
}
