import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { entryEnabled, eventAvailability, tourTime } from '@/lib/venue/operations';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Available Event Dates', robots: { index: false } };

export default async function EventAvailability() {
  if (!entryEnabled()) redirect('/plan-your-event');
  const windows = await eventAvailability().catch(() => []);
  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  return <section className="content-width venue-tool">
    <p className="section-label">Horsehead Lake Lodge</p>
    <h1>Available event dates</h1>
    <p>Ask the lodge to confirm your package and hold your preferred date.</p>
    {windows.length ? <ul className="venue-windows">{windows.map(item =>
      <li key={item.id}>
        <strong>{item.label}</strong>
        <span>{tourTime(item.starts_at)} through {tourTime(item.ends_at)}</span>
        <span>{usd.format(item.price_cents / 100)}</span>
      </li>)}</ul> : <p>There are no event dates to show right now.</p>}
    <Link className="button button-dark" href="/event-inquiry">Ask about an event</Link>
  </section>;
}
