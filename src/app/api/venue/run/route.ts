import { sameSecret } from '@/lib/venue/access';
import { pollMailbox, runJobs } from '@/lib/venue/worker';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET(request: Request) {
  const bearer = request.headers.get('authorization')?.replace(/^Bearer /i, '') ?? '';
  if (!sameSecret(bearer, process.env.CRON_SECRET)) return new Response(null, { status: 401 });
  const start = Date.now();
  let ingested: number | null = null;
  try {
    ingested = await pollMailbox();
  } catch {
    // Process existing jobs even when Outlook polling has an issue.
  }
  const processed = await runJobs(Math.max(1000, 38_000 - (Date.now() - start)));
  return Response.json({ ingested, processed }, { status: ingested === null ? 503 : 200 });
}
