import type { Metadata } from 'next';
import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { entryEnabled } from '@/lib/venue/operations';
import { submitInquiry } from './actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Ask About an Event', robots: { index: false } };

export default async function EventInquiry({ searchParams }: { searchParams: Promise<{ error?: string; sent?: string }> }) {
  if (!entryEnabled()) redirect('/contact');
  const query = await searchParams;
  return <section className="content-width venue-tool">
    <p className="section-label">Horsehead Lake Lodge</p>
    <h1>Ask about your event</h1>
    {query.sent ? <p role="status">We received your inquiry. Look for a reply at the email address you provided.</p> :
      <form action={submitInquiry} className="venue-form">
        {query.error && <p role="alert">{query.error === 'details' ? 'Check your contact information and message.' : 'We couldn’t send your inquiry. Please try again or contact the lodge directly.'}</p>}
        <input type="hidden" name="requestId" value={randomUUID()} />
        <label>Your name<input name="name" autoComplete="name" maxLength={120} required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
        <label>What are you planning?
          <select name="event" defaultValue="Wedding">
            {['Wedding','Private event','Corporate event','Tour','Cabin stay','Other'].map(event => <option key={event}>{event}</option>)}
          </select>
        </label>
        <label>Tell us about your plans<textarea name="message" rows={5} minLength={5} maxLength={3000} required /></label>
        <label hidden>Website<input tabIndex={-1} name="website" autoComplete="off" /></label>
        <button className="button button-dark">Send inquiry</button>
      </form>}
  </section>;
}
