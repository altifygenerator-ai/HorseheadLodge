import { applyReceipt } from '@/lib/venue/inventory';
import { verifyReceipt } from '@/lib/venue/access';
import { BookingConflict, emailValid, uuidValid } from '@/lib/venue/operations';

const identifier = (s: unknown): s is string => typeof s === 'string' && /^[a-zA-Z0-9_.:-]{1,160}$/.test(s);

export async function POST(request: Request) {
  const input = await request.text();
  if (input.length > 8192 || !verifyReceipt(request, input)) return new Response(null, { status: 401 });
  let event;
  try { event = JSON.parse(input); } catch { return new Response(null, { status: 400 }); }
  if (!event || event.kind !== 'deposit_paid' || event.currency !== 'USD' || !identifier(event.eventId) ||
      !identifier(event.providerReference) || typeof event.windowId !== 'string' || !uuidValid(event.windowId) ||
      typeof event.email !== 'string' || !emailValid(event.email.trim().toLowerCase()) ||
      !Number.isInteger(event.amountCents) || event.amountCents <= 0 || event.amountCents > 50_000_000) {
    return new Response(null, { status: 400 });
  }
  try {
    const outcome = await applyReceipt({ ...event, email: event.email.trim().toLowerCase() });
    return Response.json({ outcome });
  } catch (error) {
    if (error instanceof BookingConflict) return Response.json({ error: error.message }, { status: 409 });
    throw error;
  }
}
