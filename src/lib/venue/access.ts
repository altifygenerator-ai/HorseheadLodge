import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export function sameSecret(given: string, secret: string | undefined) {
  if (!secret || secret.length < 24) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

function signature(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export async function isStaff() {
  const secret = process.env.HORSEHEAD_STAFF_SECRET;
  const session = (await cookies()).get('horsehead-operations')?.value;
  if (!secret || !session) return false;
  const [until, mac] = session.split('.');
  return Boolean(mac && Number(until) > Date.now() && sameSecret(mac, signature(until, secret)));
}

export async function signIn(secret: string) {
  const expected = process.env.HORSEHEAD_STAFF_SECRET;
  if (!sameSecret(secret, expected) || !expected) return false;
  const until = String(Date.now() + 8 * 60 * 60 * 1000);
  (await cookies()).set('horsehead-operations', until + '.' + signature(until, expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/operations',
    maxAge: 8 * 60 * 60,
  });
  return true;
}

export function verifyReceipt(request: Request, body: string) {
  const secret = process.env.HORSEHEAD_RECEIPT_SECRET;
  const timestamp = request.headers.get('x-horsehead-timestamp') ?? '';
  const mac = request.headers.get('x-horsehead-signature') ?? '';
  if (!secret || secret.length < 24 || !/^\d{10}$/.test(timestamp) ||
      Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  return sameSecret(mac, signature(timestamp + '.' + body, secret));
}
