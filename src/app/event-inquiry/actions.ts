'use server';

import { claimSubmission } from '@/lib/venue/public-request';
import { redirect } from 'next/navigation';
import { emailValid, entryEnabled, recordInquiry, uuidValid } from '@/lib/venue/operations';

export async function submitInquiry(form: FormData) {
  if (!entryEnabled()) redirect('/contact');
  const value = (name: string) => String(form.get(name) ?? '').trim();
  const id = value('requestId');
  const email = value('email').toLowerCase();
  const name = value('name');
  const body = value('message');
  const event = value('event');
  if (value('website')) redirect('/event-inquiry?sent=1');
  if (!uuidValid(id) || !emailValid(email) || !name || name.length > 120 || body.length < 5 || body.length > 3000 ||
      !['Wedding','Private event','Corporate event','Tour','Cabin stay','Other'].includes(event)) {
    redirect('/event-inquiry?error=details');
  }
  try {
    if (!await claimSubmission(id, email, 'inquiry')) throw new Error('Too many requests.');
    await recordInquiry({ id: 'website:' + id, name, email, body: event + ' inquiry\n' + body, source: 'website',
      subject: 'Your Horsehead Lake Lodge inquiry' });
  } catch {
    redirect('/event-inquiry?error=send');
  }
  redirect('/event-inquiry?sent=1');
}
