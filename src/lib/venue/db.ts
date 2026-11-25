import postgres from 'postgres';
type JSONValue = Parameters<postgres.Sql['json']>[0];

let connection: ReturnType<typeof postgres> | undefined;
export type Transaction = postgres.TransactionSql;

export function database() {
  if (!process.env.DATABASE_URL) throw new Error('Venue database is not configured.');
  connection ??= postgres(process.env.DATABASE_URL, {
    max: 4,
    idle_timeout: 20,
    prepare: false,
  });
  return connection;
}

export async function inventoryLock(tx: Transaction) {
  await tx`select pg_advisory_xact_lock(7649861)`;
}

export async function activity(tx: Transaction, leadId: string | null, kind: string, payload: JSONValue = {}) {
  await tx`insert into venue_activity (lead_id, kind, payload) values (${leadId}, ${kind}, ${tx.json(payload)})`;
}

export async function enqueue(
  tx: Transaction,
  key: string,
  kind: 'respond' | 'follow_up' | 'tour_sync' | 'email' | 'tour_outcome',
  leadId: string | null,
  payload: JSONValue,
  due = new Date(),
) {
  await tx`insert into venue_jobs (job_key, kind, lead_id, payload, due_at)
    values (${key}, ${kind}, ${leadId}, ${tx.json(payload)}, ${due})
    on conflict (job_key) do nothing`;
}
