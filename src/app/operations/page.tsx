import type { Metadata } from 'next';
import { randomUUID } from 'node:crypto';
import { database } from '@/lib/venue/db';
import { isStaff } from '@/lib/venue/access';
import { tourAvailability,tourTime } from '@/lib/venue/operations';
import {
  approveFact, removeTourHours, resolveLead, resolveTour, retryJob, saveEventWindow,
  saveTourHours, staffBookTour, staffLogin,
} from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Horsehead Operations', robots: { index: false, follow: false } };

const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const money = new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'});
const statuses: Record<string,string> = {
  scheduled: 'Scheduled', confirmed: 'Confirmed', canceled: 'Canceled', attended: 'Attended', no_show: 'No-show',
};
const sourceNames: Record<string,string> = {
  website: 'Website form', outlook: 'Outlook', 'weddingwire': 'WeddingWire', 'the-knot': 'The Knot',
  eventective: 'Eventective', 'public-calendar': 'Public calendar', agent: 'Agent', staff: 'Staff', direct: 'Direct',
};

type Resource = { id:string; label:string };
type EventWindow = {
  id:string; label:string; start:string; finish:string; expiration:string | null; state:string;
  price_cents:number; deposit_cents:number | null; public_listing:boolean; resources:string[]; email:string | null;
};

function EventForm({ resources, item }: { resources: Resource[]; item?: EventWindow }) {
  return <form action={saveEventWindow} className="venue-form">
    <input type="hidden" name="id" value={item?.id ?? ''} />
    <div className="venue-form-row">
      <label>Package or block<input name="label" defaultValue={item?.label} maxLength={120} required /></label>
      <label>State<select name="state" defaultValue={item?.state ?? 'open'}>
        <option value="open">Open</option><option value="held">Held</option>
        <option value="booked">Booked</option><option value="closed">Closed</option>
      </select></label>
      <label>Price in USD<input name="price" type="number" min="0" step=".01" defaultValue={item ? item.price_cents/100 : undefined} required /></label>
      <label>Required deposit in USD<input name="deposit" type="number" min=".01" step=".01" defaultValue={item?.deposit_cents ? item.deposit_cents/100 : undefined} /></label>
      <label>Start (Central)<input name="start" type="datetime-local" defaultValue={item?.start} required /></label>
      <label>End (Central)<input name="end" type="datetime-local" defaultValue={item?.finish} required /></label>
      <label>Hold expires (Central)<input name="expiration" type="datetime-local" defaultValue={item?.expiration ?? undefined} /></label>
      <label>Lead email<input name="email" type="email" defaultValue={item?.email ?? undefined} /></label>
    </div>
    <label className="venue-inline"><span><input type="checkbox" name="published" value="yes" defaultChecked={item?.public_listing ?? true} /> Show this package when the dates are open</span></label>
    <fieldset className="venue-checks"><legend>Rooms, cabins and tour access</legend>
      {resources.map(r => <label key={r.id}><input type="checkbox" name="resource" value={r.id}
        defaultChecked={item?.resources.includes(r.id)} /> {r.label}</label>)}
    </fieldset>
    <button className="button button-dark">Save event window</button>
  </form>;
}

export default async function Operations({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const notice = await searchParams;
  if (!await isStaff()) return <section className="content-width venue-tool">
    <h1>Horsehead operations</h1>
    <form action={staffLogin} className="venue-form">
      {notice.error && <p role="alert">Check your access code.</p>}
      <label>Staff access code<input name="secret" type="password" autoComplete="current-password" required /></label>
      <button className="button button-dark">Sign in</button>
    </form>
  </section>;
  const sql = database();
  const [resources,windows,hours,tours,leads,sourceStats,bookedBy,days,facts,draft,failed] = await Promise.all([
    sql<Resource[]>`select id,label from venue_resources order by label`,
    sql<EventWindow[]>`select w.id,w.label,w.state,w.price_cents,w.deposit_cents,w.public_listing,w.resources,l.email,
      to_char(w.starts_at at time zone 'America/Chicago','YYYY-MM-DD"T"HH24:MI') as start,
      to_char(w.ends_at at time zone 'America/Chicago','YYYY-MM-DD"T"HH24:MI') as finish,
      to_char(w.expires_at at time zone 'America/Chicago','YYYY-MM-DD"T"HH24:MI') as expiration
      from venue_event_windows w left join venue_leads l on l.id=w.lead_id
      where w.ends_at>now()-interval '30 days' order by w.starts_at limit 100`,
    sql<{id:string;weekday:number;start_time:string;end_time:string;duration_minutes:number}[]>`
      select * from venue_tour_hours order by weekday,start_time`,
    sql<{id:string;email:string;name:string;starts_at:Date;ends_at:Date;status:string;source:string}[]>`
      select t.id,t.starts_at,t.ends_at,t.status,t.source,l.email,l.name
      from venue_tours t join venue_leads l on l.id=t.lead_id
      where t.ends_at>now()-interval '60 days' order by t.starts_at limit 120`,
    sql<{id:string;name:string;email:string;first_source:string;stage:string;body:string;needs_review:boolean}[]>`
      select l.id,l.name,l.email,l.first_source,l.stage,coalesce(m.body,'') as body,
        coalesce(review.requested>coalesce(review.resolved,0),false) as needs_review
      from venue_leads l
      left join lateral (select body from venue_messages where lead_id=l.id order by received_at desc limit 1) m on true
      left join lateral (select max(id) filter (where kind='review_requested') as requested,
        max(id) filter (where kind in ('staff_contacted','staff_closed')) as resolved
        from venue_activity where lead_id=l.id) review on true
      where l.stage in ('inquiry','review','contacted') or review.requested>coalesce(review.resolved,0)
      order by needs_review desc,l.received_at desc limit 50`,
    sql<{first_source:string;leads:number;attended:number;paid:number;deposits:number}[]>`
      with visits as (select lead_id,bool_or(status='attended') as attended from venue_tours group by lead_id),
      paid as (select w.lead_id,sum(d.amount_cents)::integer as cents from venue_deposits d
        join venue_event_windows w on w.id=d.window_id group by w.lead_id)
      select l.first_source,count(*)::integer as leads,count(*) filter(where v.attended)::integer as attended,
        count(*) filter(where p.cents>0)::integer as paid,coalesce(sum(p.cents),0)::integer as deposits
      from venue_leads l left join visits v on v.lead_id=l.id left join paid p on p.lead_id=l.id group by l.first_source order by l.first_source`,
    sql<{source:string;scheduled:number;attended:number;canceled:number;no_show:number}[]>`
      select source,count(*)::integer as scheduled,count(*) filter(where status='attended')::integer as attended,
        count(*) filter(where status='canceled')::integer as canceled,count(*) filter(where status='no_show')::integer as no_show
      from venue_tours group by source order by source`,
    tourAvailability().catch(() => []),
    sql<{topic:string;answer:string;revision:number}[]>`select topic,answer,revision from venue_facts where enabled order by topic`,
    sql<{id:string;subject:string;text:string}[]>`select id,payload->>'subject' as subject,payload->>'text' as text
      from venue_activity where kind='draft_prepared' order by created_at desc limit 15`,
    sql<{id:string;kind:string;last_error:string}[]>`select id,kind,last_error from venue_jobs where status='failed' order by due_at limit 25`,
  ]);
  const awaiting = tours.filter(t => t.ends_at < new Date() && ['scheduled','confirmed'].includes(t.status)).length;
  return <div className="content-width venue-tool venue-staff">
    <p className="section-label">Horsehead Lake Lodge</p><h1>Venue operations</h1>
    {notice.saved && <p role="status">Saved.</p>}
    {notice.error && <p role="alert">{notice.error==='conflict' ? 'That time overlaps an existing booking or hold.' : 'Check the details and try again.'}</p>}
    <nav aria-label="Operations"><a href="#tours">Tours</a><a href="#events">Event dates</a>
      <a href="#inquiries">Inquiries</a><a href="#results">Results</a><a href="#answers">Agent answers</a></nav>

    <section id="tours">
      <h2>Tours</h2>
      <p>{awaiting === 1 ? '1 past tour needs an outcome.' : awaiting + ' past tours need an outcome.'}</p>
      <div className="venue-table"><table><thead><tr><th>Tour</th><th>Booked by</th><th>Status</th><th>Update</th></tr></thead>
        <tbody>{tours.map(t => <tr key={t.id}><td>{tourTime(t.starts_at)}<br />{t.name || t.email}</td><td>{sourceNames[t.source]}</td>
          <td>{t.ends_at < new Date() && ['scheduled','confirmed'].includes(t.status) ? 'Outcome due' : statuses[t.status]}</td>
          <td>{['scheduled','confirmed'].includes(t.status) && <form action={resolveTour} className="venue-inline">
            <input name="id" type="hidden" value={t.id} /><select name="status" aria-label="Tour status" defaultValue="">
              <option disabled value="">Select outcome</option><option value="confirmed">Confirmed</option><option value="canceled">Canceled</option>
              {t.ends_at < new Date() && <><option value="attended">Attended</option><option value="no_show">No-show</option></>}
            </select><button>Save</button>
          </form>}</td></tr>)}</tbody></table></div>
      <details><summary>Book a tour for a lead</summary><form action={staffBookTour} className="venue-form">
        <input type="hidden" name="requestId" value={randomUUID()} />
        <label>Tour time<select name="slot" required defaultValue=""><option value="" disabled>Choose a time</option>
          {days.map(d => <option key={d.starts_at.toISOString()} value={d.starts_at.toISOString()}>{tourTime(d.starts_at)}</option>)}
        </select></label><label>Email<input type="email" name="email" required /></label><label>Name<input name="name" /></label>
        <button className="button button-dark">Book tour</button>
      </form></details>
      <details><summary>Set recurring tour hours</summary>
        <ul className="venue-windows">{hours.map(h => <li key={h.id}>
          <span>{weekdays[h.weekday]} · {h.start_time.slice(0,5)}–{h.end_time.slice(0,5)} · {h.duration_minutes} min</span>
          <form action={removeTourHours}><input type="hidden" name="id" value={h.id} /><button>Remove hours</button></form>
        </li>)}</ul>
        <form action={saveTourHours} className="venue-form"><div className="venue-form-row">
          <label>Day<select name="weekday">{weekdays.map((d,i)=><option key={d} value={i}>{d}</option>)}</select></label>
          <label>Start (Central)<input type="time" name="start" required /></label><label>End (Central)<input type="time" name="end" required /></label>
          <label>Minutes per tour<input type="number" min={15} max={180} name="duration" defaultValue={60} required /></label>
        </div><button className="button button-dark">Save tour hours</button></form>
      </details>
    </section>

    <section id="events"><h2>Event dates</h2>
      <details><summary>Add an event window</summary><EventForm resources={resources} /></details>
      {windows.map(w => <details key={w.id}><summary>{w.label} · {w.start.replace('T',' ')} · {w.state} · {money.format(w.price_cents/100)}</summary>
        <EventForm resources={resources} item={w} /></details>)}
      {!windows.length && <p>No event windows entered yet.</p>}
    </section>

    <section id="inquiries"><h2>Inquiries</h2>
      {leads.length ? leads.map(l => <details key={l.id}>
        <summary>{l.name || l.email} · {sourceNames[l.first_source] || l.first_source} · {l.needs_review || l.stage==='review' ? 'Needs review' : l.stage}</summary>
        <p className="venue-message">{l.body}</p><a href={'mailto:'+l.email}>{l.email}</a>
        <form action={resolveLead} className="venue-inline"><input type="hidden" name="id" value={l.id} />
          <button name="stage" value="contacted">Mark contacted</button><button name="stage" value="closed">Close inquiry</button>
        </form></details>) : <p>No open inquiries.</p>}
      {!!draft.length && <details><summary>Replies prepared in preview mode</summary>
        {draft.map(d => <article key={d.id}><h3>{d.subject}</h3><p className="venue-message">{d.text}</p></article>)}
      </details>}
      {!!failed.length && <details open><summary>Automation failures</summary>{failed.map(j=><form key={j.id} action={retryJob} className="venue-inline">
        <input type="hidden" name="id" value={j.id} /><span>{j.kind} · {j.last_error}</span><button>Retry</button>
      </form>)}</details>}
    </section>

    <section id="results"><h2>Results</h2><h3>By first lead source</h3>
      <div className="venue-table"><table><thead><tr><th>First recorded source</th><th>Unique leads</th><th>Attended a tour</th><th>Paid a deposit</th><th>Deposits recorded</th></tr></thead>
        <tbody>{sourceStats.map(s=><tr key={s.first_source}><td>{sourceNames[s.first_source] || s.first_source}</td>
          <td>{s.leads}</td><td>{s.attended}</td><td>{s.paid}</td><td>{money.format(s.deposits/100)}</td></tr>)}</tbody></table></div>
      <h3>By who booked the tour</h3>
      <div className="venue-table"><table><thead><tr><th>Booked by</th><th>Ever scheduled</th><th>Attended</th><th>Canceled</th><th>No-show</th></tr></thead>
        <tbody>{bookedBy.map(s=><tr key={s.source}><td>{sourceNames[s.source]}</td><td>{s.scheduled}</td>
          <td>{s.attended}</td><td>{s.canceled}</td><td>{s.no_show}</td></tr>)}</tbody></table></div>
    </section>

    <section id="answers"><h2>Approved agent answers</h2>
      <ul className="venue-windows">{facts.map(f=><li key={f.topic}><strong>{f.topic} · revision {f.revision}</strong><span>{f.answer}</span></li>)}</ul>
      <form action={approveFact} className="venue-form">
        <label>Topic<select name="topic">{['general','tours','availability','pricing','lodging','capacity','policies'].map(t=><option key={t}>{t}</option>)}</select></label>
        <label>Approved answer<textarea name="answer" maxLength={1200} rows={4} required /></label>
        <button className="button button-dark">Approve answer</button>
      </form>
    </section>
  </div>;
}
