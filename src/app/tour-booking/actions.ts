'use server';

import { redirect } from 'next/navigation';
import { claimSubmission } from '@/lib/venue/public-request';
import { bookTour, BookingConflict, emailValid, entryEnabled, uuidValid } from '@/lib/venue/operations';

export async function submitTour(form: FormData) {
  if (!entryEnabled()) redirect('/contact');
  const value = (name: string) => String(form.get(name) ?? '').trim();
  const requestId = value('requestId');
  const email = value('email').toLowerCase();
  const name = value('name');
  const at = new Date(value('slot'));
  if (value('website')) redirect('/tour-booking?error=booking');
  if (!uuidValid(requestId) || !emailValid(email) || !name || name.length > 120 || !Number.isFinite(+at)) {
    redirect('/tour-booking?error=details');
  }
  try {
    if (!await claimSubmission(requestId, email, 'tour')) throw new Error('Too many requests.');
    await bookTour({ at, email, name, requestId, source: 'direct', method: 'website' });
  } catch (error) {
    redirect('/tour-booking?error=' + (error instanceof BookingConflict ? 'taken' : 'booking'));
  }
  redirect('/tour-booking?scheduled=1');
}
