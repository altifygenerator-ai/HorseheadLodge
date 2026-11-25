import { randomUUID } from 'node:crypto';
import { activity, database, enqueue, inventoryLock } from './db';
import { calendarConfigured, createDraft, draftStillPending, graphConfigured, inbox, projectTour, removeTour, sendDraft, type Mail } from './graph';
import { bookTour, BookingConflict, changeTourStatus, emailValid, readOffer, recordInquiry, tourTime, uuidValid } from './operations';
import { composeReply } from './concierge';

type Job = {
  id: string; job_key: string; lead_id: string | null; kind: string; status: string;
  payload: { [key: string]: string | number }; attempts: number; lease_token: string; provider_id: string | null;
};
type Lead = { id: string; email: string; opted_out: boolean; touch_version: number; stage: string };
type Message = { id: string; body: string; subject: string; outlook_id: string | null };
type Tour = { id: string; starts_at: Date; ends_at: Date; status: string; outlook_id: string | null };
const base = () => (process.env.HORSEHEAD_PUBLIC_URL || 'https://horseheadlakelodge.com').replace(/\/$/, '');
const workerMode = () => process.env.HORSEHEAD_SEND_MODE === 'live' ? 'live' : 'shadow';

function identifyMail(item: Mail) {
  const address = item.from?.emailAddress?.address?.trim().toLowerCase() ?? '';
  const reply = item.replyTo?.[0]?.emailAddress?.address?.trim().toLowerCase() ?? '';
  const mailbox = process.env.HORSEHEAD_GRAPH_MAILBOX?.toLowerCase();
  const automatic = item.internetMessageHeaders?.some(({name,value}) =>
    (name.toLowerCase() === 'auto-submitted' && value.trim().toLowerCase() !== 'no') ||
    (name.toLowerCase() === 'precedence' && ['bulk','junk','list'].includes(value.trim().toLowerCase())),
  );
  if (item.isDraft || !emailValid(address) || address === mailbox ||
      /\b(?:out of office|automatic reply|undeliverable|delivery status notification)\b/i.test(item.subject ?? '')) return null;
  const sourceAddresses = [
    ['weddingwire', process.env.HORSEHEAD_WEDDINGWIRE_SENDERS],
    ['the-knot', process.env.HORSEHEAD_THE_KNOT_SENDERS],
    ['eventective', process.env.HORSEHEAD_EVENTECTIVE_SENDERS],
  ] as const;
  const source = sourceAddresses.find(([, allow]) => allow?.toLowerCase().split(',').map(s => s.trim()).includes(address))?.[0];
  if (source) {
    if (!emailValid(reply) || reply === address || reply === mailbox) return { source, email: '', name: '' };
    return { source, email: reply, name: item.replyTo?.[0]?.emailAddress?.name?.slice(0, 120) ?? '' };
  }
  if (automatic || /^(?:no[-_.]?reply|mailer-daemon|postmaster|bounce)@/i.test(address)) return null;
  return { source: 'outlook' as const, email: address, name: item.from?.emailAddress?.name?.slice(0, 120) ?? '' };
}

export async function pollMailbox() {
  if (!graphConfigured() || !process.env.HORSEHEAD_GRAPH_INQUIRY_FOLDER_ID || !process.env.HORSEHEAD_INBOX_START_AT) return 0;
  const initial = new Date(process.env.HORSEHEAD_INBOX_START_AT);
  if (!Number.isFinite(+initial)) throw new Error('Invalid inbox start date.');
  const [cursor] = await database()<{ value: string }[]>`select value from venue_state where key='inbox_cursor'`;
  const since = new Date(Math.max(+initial, cursor ? Date.parse(cursor.value) - 15 * 60 * 1000 : +initial));
  const cursorEnd = new Date();
  const messages = (await inbox(since)).sort((a,b) => Date.parse(a.receivedDateTime) - Date.parse(b.receivedDateTime));
  let count = 0;
  for (const item of messages) {
    const from = identifyMail(item);
    if (!from) continue;
    if (!from.email) {
      await database().begin(async tx => {
        const [receipt] = await tx`insert into venue_receipts(event_id) values (${'marketplace:' + item.id})
          on conflict do nothing returning event_id`;
        if (!receipt) return;
        await activity(tx, null, 'marketplace_needs_recipient', { source: from.source });
        await enqueue(tx, 'sender-review:' + item.id, 'email', null, {
          template: 'staff', subject: 'Review a ' + from.source + ' inquiry',
          text: 'The inquiry did not provide a verified guest reply address. Check the inquiry folder in Outlook.',
        });
      });
      continue;
    }
    const body = item.body?.content?.trim().slice(0, 12000);
    if (body && await recordInquiry({ ...from, body, id: 'outlook:' + item.id, outlookId: item.id,
      subject: (item.subject ?? 'Your Horsehead Lake Lodge inquiry').slice(0, 180), receivedAt: new Date(item.receivedDateTime) })) count++;
  }
  await database()`insert into venue_state(key,value) values ('inbox_cursor',${cursorEnd.toISOString()})
    on conflict (key) do update set value=greatest(venue_state.value,excluded.value)`;
  return count;
}

async function claim() {
  const lease = randomUUID();
  return database().begin(async tx => {
    const [job] = await tx<Job[]>`
      with next_job as (
        select id from venue_jobs where due_at<=now() and
          (status='queued' or (status='running' and lease_until < now()))
        order by case when kind='respond' then 0 when kind='follow_up' then 2 else 1 end,due_at
        limit 1 for update skip locked
      )
      update venue_jobs j set status='running', attempts=attempts+1, lease_until=now()+interval '5 minutes',lease_token=${lease}
      from next_job where j.id=next_job.id returning j.*`;
    return job;
  });
}

async function finish(job: Job, status: 'sent' | 'skipped') {
  await database()`update venue_jobs set status=${status},lease_until=null,lease_token=null,last_error=null
    where id=${job.id} and lease_token=${job.lease_token}`;
  return status;
}

async function prepare(job: Job, to: string, subject: string, text: string, replyTo?: string) {
  if (workerMode() === 'shadow') {
    await database().begin(async tx => {
      await activity(tx, job.lead_id, 'draft_prepared', { subject, text, jobId: job.id });
      await tx`update venue_jobs set status='skipped',lease_until=null,lease_token=null
        where id=${job.id} and lease_token=${job.lease_token}`;
    });
    return 'skipped' as const;
  }
  let id = job.provider_id;
  if (!id) {
    id = (await createDraft(to, subject, text, replyTo)).id;
    const [lease] = await database()`update venue_jobs set provider_id=${id} where id=${job.id}
      and lease_token=${job.lease_token} returning id`;
    if (!lease) throw new Error('Job lease was lost.');
  }
  if (job.kind === 'follow_up' || job.kind === 'respond') {
    const [current] = await database()<Lead[]>`select * from venue_leads where id=${job.lead_id}`;
    if (!current || current.opted_out || current.touch_version !== Number(job.payload.version)) {
      return finish(job, 'skipped');
    }
  }
  await sendDraft(id);
  return recordSent(job);
}

async function recordSent(job: Job) {
  await database().begin(async tx => {
    const [done] = await tx<Job[]>`update venue_jobs set status='sent',lease_until=null,lease_token=null,last_error=null
      where id=${job.id} and lease_token=${job.lease_token} returning *`;
    if (!done) return;
    await activity(tx, job.lead_id, 'email_sent', { jobId: job.id });
    if (job.kind !== 'respond' || Number(done.payload.review) !== 0 || !job.lead_id) return;
    const version = Number(job.payload.version);
    const [owner] = await tx`update venue_leads set stage='contacted' where id=${job.lead_id}
      and stage in ('inquiry','contacted') and touch_version=${version} and not opted_out returning id`;
    if (!owner) return;
    const cadence = (process.env.HORSEHEAD_FOLLOWUP_DAYS ?? '1,4,11').split(',').map(Number)
      .filter(day => Number.isInteger(day) && day > 0 && day <= 45).slice(0, 7);
    for (const day of cadence) {
      await enqueue(tx, 'follow-up:' + job.payload.messageId + ':' + day, 'follow_up', job.lead_id,
        { messageId: job.payload.messageId, version }, new Date(Date.now() + day * 86400000));
    }
  });
  return 'sent' as const;
}

async function reply(job: Job, lead: Lead, message: Message) {
  const subject = /^re:/i.test(message.subject) ? message.subject : 'Re: ' + message.subject;
  if (lead.opted_out || lead.touch_version !== Number(job.payload.version)) return finish(job, 'skipped');
  const line = message.body.split(/\r?\n/).find(l => l.trim())?.trim() ?? '';
  const book = /^BOOK (\S+)$/i.exec(line);
  const update = /^(CONFIRM|CANCEL) ([0-9a-f-]+)$/i.exec(line);
  if (message.outlook_id && workerMode() === 'live' && book) {
    const offer = readOffer(lead.email, book[1]);
    if (offer) {
      try {
        await bookTour({ email: lead.email, name: '', at: offer.at, requestId: offer.id, source: 'agent', method: 'reply' });
        return finish(job, 'skipped');
      } catch (error) {
        if (!(error instanceof BookingConflict)) throw error;
      }
    }
    return prepare(job, lead.email, subject, 'That tour time is no longer available. Choose another time at ' + base() + '/tour-booking.', message.outlook_id);
  }
  if (message.outlook_id && workerMode() === 'live' && update && uuidValid(update[2])) {
    await changeTourStatus(update[2], update[1].toLowerCase() === 'confirm' ? 'confirmed' : 'canceled', lead.email);
    return finish(job, 'skipped');
  }
  const answer = await composeReply(lead.email, message.body);
  await database().begin(async tx => {
    if (answer.review) {
      await activity(tx, lead.id, 'review_requested', { messageId: message.id });
      await tx`update venue_leads set stage='review' where id=${lead.id} and stage in ('inquiry','contacted','review')`;
      await enqueue(tx, 'staff-inquiry:' + message.id, 'email', lead.id, {
        template: 'staff', subject: 'Horsehead inquiry needs your help',
        text: 'An inquiry is ready for review in the Horsehead operations dashboard: ' + base() + '/operations.',
      });
    }
    await tx`update venue_jobs set payload=payload || ${tx.json({ review: answer.review ? 1 : 0 })}::jsonb
      where id=${job.id} and lease_token=${job.lease_token}`;
    await activity(tx, lead.id, 'reply_sourced', { messageId: message.id, facts: answer.facts, windows: answer.windows });
  });
  return prepare(job, lead.email, subject, answer.text, message.outlook_id ?? undefined);
}

async function processJob(job: Job) {
  const [lead] = job.lead_id
    ? await database()<Lead[]>`select * from venue_leads where id=${job.lead_id}` : [];
  const tourId = typeof job.payload.tourId === 'string' ? job.payload.tourId : null;
  const [tour] = tourId ? await database()<Tour[]>`select * from venue_tours where id=${tourId}` : [];
  if (job.kind === 'tour_sync') {
    if (!tour || !calendarConfigured() || workerMode() !== 'live') return finish(job, 'skipped');
    if (tour.status === 'canceled') {
      if (tour.outlook_id) await removeTour(tour.outlook_id);
    } else if (!tour.outlook_id) {
      const event = await projectTour(tour);
      await database().begin(async tx => {
        await inventoryLock(tx);
        await tx`update venue_tours set outlook_id=${event.id} where id=${tour.id}`;
      });
      const [current] = await database()<Tour[]>`select * from venue_tours where id=${tour.id}`;
      if (current.status === 'canceled') await removeTour(event.id);
    }
    return finish(job, 'sent');
  }
  if (job.kind === 'tour_outcome') {
    if (!tour || !['scheduled','confirmed'].includes(tour.status)) return finish(job, 'skipped');
    return staffMessage(job, 'Record the Horsehead tour outcome',
      'The tour at ' + tourTime(tour.starts_at) + ' has ended. Record the outcome at ' + base() + '/operations.');
  }
  if (job.kind === 'email') {
    if (job.payload.template === 'staff') return staffMessage(job, String(job.payload.subject), String(job.payload.text));
    if (job.payload.template === 'deposit' && lead) {
      return prepare(job, lead.email, 'Horsehead Lake Lodge | Deposit received', String(job.payload.text));
    }
    if (!tour || !lead || lead.opted_out) return finish(job, 'skipped');
    if (tour.status === 'canceled' && job.payload.template !== 'canceled') return finish(job, 'skipped');
    const templates: Record<string, string> = {
      confirmation: 'Your tour is scheduled for ' + tourTime(tour.starts_at) + '. Reply CONFIRM ' + tour.id +
        ' to confirm, or CANCEL ' + tour.id + ' to cancel. We’ll meet at Horsehead Lake Lodge.',
      reminder: 'Your Horsehead Lake Lodge tour is at ' + tourTime(tour.starts_at) + '. See you at the lodge.',
      canceled: 'Your Horsehead Lake Lodge tour has been canceled. You can pick a new time at ' + base() + '/tour-booking.',
      thanks: 'Thanks for visiting Horsehead Lake Lodge. If you have a question about the date or package you saw, reply here and we’ll help.',
    };
    return prepare(job, lead.email, 'Your Horsehead Lake Lodge tour', templates[String(job.payload.template)]);
  }
  if (!lead || lead.opted_out) return finish(job, 'skipped');
  const [message] = await database()<Message[]>`select id,body,subject,outlook_id from venue_messages where id=${String(job.payload.messageId)}`;
  if (!message) return finish(job, 'skipped');
  if (job.kind === 'respond') return reply(job, lead, message);
  if (lead.stage !== 'contacted' || lead.touch_version !== Number(job.payload.version)) return finish(job, 'skipped');
  return prepare(job, lead.email, 'Horsehead Lake Lodge | Checking in',
    'Are you still looking for a venue? If you have a date in mind, reply and we can help. You can also choose a tour at ' +
    base() + '/tour-booking. Reply STOP to end follow-ups.', message.outlook_id ?? undefined);
}

async function staffMessage(job: Job, subject: string, text: string) {
  const to = process.env.HORSEHEAD_STAFF_EMAIL?.trim().toLowerCase() ?? '';
  return emailValid(to) ? prepare(job, to, subject, text) : finish(job, 'skipped');
}

export async function runJobs(budgetMs = 40_000) {
  const stoppedAt = Date.now() + budgetMs;
  let count = 0;
  while (count < 25 && Date.now() < stoppedAt) {
    const job = await claim();
    if (!job) break;
    try {
      if (job.provider_id && graphConfigured() && workerMode() === 'live' && !(await draftStillPending(job.provider_id))) {
        await recordSent(job);
      } else {
        await processJob(job);
      }
    } catch (error) {
      const message = error instanceof Error ? error.name + ': ' + error.message : 'Unknown delivery error';
      const safe = message.replace(/[\w.%+-]+@[\w.-]+\.[a-z]{2,}/ig, '[email]').slice(0, 220);
      await database()`update venue_jobs set status=${job.attempts >= 5 ? 'failed' : 'queued'},
        due_at=now()+make_interval(mins=>${Math.min(60, 2 ** job.attempts)}),last_error=${safe},
        lease_until=null,lease_token=null where id=${job.id} and lease_token=${job.lease_token}`;
    }
    count++;
  }
  return count;
}
