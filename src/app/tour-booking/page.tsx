import type { Metadata } from 'next';
import Link from 'next/link';
import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { entryEnabled, tourAvailability, tourTime } from '@/lib/venue/operations';
import { submitTour } from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Schedule a Venue Tour', robots: { index: false } };

export default async function TourBooking({ searchParams }: { searchParams: Promise<{ scheduled?: string; error?: string }> }) {
  if (!entryEnabled()) redirect('/contact');
  const query = await searchParams;
  const slots = query.scheduled ? [] : await tourAvailability().catch(() => []);
  return <section className="content-width venue-tool">
    <p className="section-label">Horsehead Lake Lodge</p>
    <h1>Schedule a venue tour</h1>
    {query.scheduled ? <p role="status">Your tour is scheduled. Look for a confirmation by email.</p> :
      slots.length ? <form action={submitTour} className="venue-form">
        {query.error && <p role="alert">{query.error === 'taken' ? 'That time is unavailable, or you already have a tour scheduled. Choose another time or contact the lodge.' : 'We couldn’t book that tour. Please check your details and try again.'}</p>}
        <input type="hidden" name="requestId" value={randomUUID()} />
        <label>Tour time<select name="slot" required defaultValue="">
          <option value="" disabled>Choose a time</option>
          {slots.map(slot => <option key={slot.starts_at.toISOString()} value={slot.starts_at.toISOString()}>{tourTime(slot.starts_at)}</option>)}
        </select></label>
        <label>Your name<input name="name" autoComplete="name" maxLength={120} required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
        <label hidden>Website<input tabIndex={-1} name="website" autoComplete="off" /></label>
        <button className="button button-dark">Book tour</button>
      </form> :
        <p>There are no tour times to show right now. <Link href="/event-inquiry">Ask the lodge about a visit.</Link></p>}
  </section>;
}
