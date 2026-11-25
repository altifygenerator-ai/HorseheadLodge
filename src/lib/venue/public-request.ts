import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { database } from './db';

export async function claimSubmission(id: string, email: string, category: 'inquiry' | 'tour') {
  const fields = await headers();
  const address = fields.get('x-real-ip') || fields.get('x-forwarded-for')?.split(',').at(-1)?.trim() || 'unknown';
  const key = createHash('sha256').update(address).digest('hex');
  const contactKey = createHash('sha256').update(email).digest('hex');
  return database().begin(async tx => {
    await tx`select pg_advisory_xact_lock(hashtext(${category + ':' + key})::bigint)`;
    const [existing] = await tx`select id from venue_public_requests where id=${id} and category=${category}
      and fingerprint=${key} and contact_key=${contactKey}`;
    if (existing) return true;
    const [recent] = await tx<{ count: number }[]>`select count(*)::integer from venue_public_requests
      where fingerprint=${key} and category=${category} and created_at > now()-interval '1 hour'`;
    await tx`select pg_advisory_xact_lock(hashtext(${'recipient:' + category + ':' + contactKey})::bigint)`;
    const [recipient] = await tx<{ count: number }[]>`select count(*)::integer from venue_public_requests
      where contact_key=${contactKey} and category=${category} and created_at > now()-interval '1 hour'`;
    if (recent.count >= 10 || recipient.count >= 4) return false;
    const [inserted] = await tx`insert into venue_public_requests(id,category,fingerprint,contact_key)
      values (${id},${category},${key},${contactKey}) on conflict do nothing returning id`;
    return Boolean(inserted);
  });
}
