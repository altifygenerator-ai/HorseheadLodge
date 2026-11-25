type Address = { emailAddress?: { address?: string; name?: string } };
export type Mail = {
  id: string;
  subject?: string;
  body?: { content?: string };
  receivedDateTime: string;
  from?: Address;
  replyTo?: Address[];
  isDraft?: boolean;
  internetMessageHeaders?: { name: string; value: string }[];
};

type Busy = {
  id: string;
  start: { dateTime: string };
  end: { dateTime: string };
  showAs?: string;
  isCancelled?: boolean;
};

export class GraphError extends Error {
  constructor(public status: number) {
    super('Microsoft Graph response ' + status);
  }
}

let token: { value: string; expires: number } | undefined;
const base = 'https://graph.microsoft.com/v1.0';
const timeout = () => AbortSignal.timeout(10_000);
export const graphConfigured = () => Boolean(
  process.env.HORSEHEAD_GRAPH_CLIENT_ID && process.env.HORSEHEAD_GRAPH_CLIENT_SECRET &&
  process.env.HORSEHEAD_GRAPH_TENANT_ID && process.env.HORSEHEAD_GRAPH_MAILBOX,
);
export const calendarConfigured = () => graphConfigured() && Boolean(process.env.HORSEHEAD_GRAPH_CALENDAR_ID);

async function accessToken() {
  if (token && token.expires > Date.now()) return token.value;
  if (!graphConfigured()) throw new Error('Outlook is not configured.');
  const tenant = encodeURIComponent(process.env.HORSEHEAD_GRAPH_TENANT_ID!);
  const response = await fetch('https://login.microsoftonline.com/' + tenant + '/oauth2/v2.0/token', {
    method: 'POST',
    signal: timeout(),
    body: new URLSearchParams({
      client_id: process.env.HORSEHEAD_GRAPH_CLIENT_ID!,
      client_secret: process.env.HORSEHEAD_GRAPH_CLIENT_SECRET!,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });
  if (!response.ok) throw new GraphError(response.status);
  const result: { access_token: string; expires_in: number } = await response.json();
  token = { value: result.access_token, expires: Date.now() + (result.expires_in - 60) * 1000 };
  return token.value;
}

async function graph<T = undefined>(url: string, method = 'GET', body?: object): Promise<T> {
  const endpoint = new URL(url, base + '/');
  if (endpoint.origin !== 'https://graph.microsoft.com') throw new Error('Invalid Graph pagination origin.');
  const response = await fetch(endpoint, {
    method,
    cache: 'no-store',
    signal: timeout(),
    headers: {
      Authorization: 'Bearer ' + await accessToken(),
      'Content-Type': 'application/json',
      Prefer: 'IdType="ImmutableId", outlook.body-content-type="text", outlook.timezone="UTC"',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new GraphError(response.status);
  return response.status === 204 || response.status === 202 ? undefined as T : response.json();
}

const mailbox = () => base + '/users/' + encodeURIComponent(process.env.HORSEHEAD_GRAPH_MAILBOX!);
const calendar = () => mailbox() + '/calendars/' + encodeURIComponent(process.env.HORSEHEAD_GRAPH_CALENDAR_ID!);

async function list<T>(url: string, limit: number) {
  const results: T[] = [];
  let next: string | undefined = url;
  while (next && results.length < limit) {
    const page: { value: T[]; '@odata.nextLink'?: string } = await graph(next);
    results.push(...page.value);
    next = page['@odata.nextLink'];
  }
  if (next) throw new Error('The Graph result exceeded the configured limit.');
  return results;
}

export async function inbox(since: Date) {
  const folder = process.env.HORSEHEAD_GRAPH_INQUIRY_FOLDER_ID;
  if (!folder) throw new Error('An Outlook inquiry folder is required.');
  const params = new URLSearchParams({
    '$filter': 'receivedDateTime ge ' + since.toISOString(),
    '$select': 'id,subject,body,receivedDateTime,from,replyTo,isDraft,internetMessageHeaders',
    '$top': '50',
  });
  return list<Mail>(mailbox() + '/mailFolders/' + encodeURIComponent(folder) + '/messages?' + params, 1000);
}

export async function busyTimes(start: Date, end: Date) {
  if (!calendarConfigured()) return [];
  const params = new URLSearchParams({
    startDateTime: start.toISOString(), endDateTime: end.toISOString(),
    '$top': '100', '$select': 'id,start,end,isCancelled,showAs',
  });
  const items = await list<Busy>(calendar() + '/calendarView?' + params, 1000);
  const utc = (s: string) => new Date(/(?:Z|[+-]\d\d:\d\d)$/.test(s) ? s : s + 'Z');
  return items.filter(e => !e.isCancelled && e.showAs !== 'free')
    .map(e => ({ start: utc(e.start.dateTime), end: utc(e.end.dateTime) }));
}

export async function projectTour(tour: { id: string; starts_at: Date; ends_at: Date }) {
  return graph<{ id: string }>(calendar() + '/events', 'POST', {
    subject: 'Horsehead Lake Lodge tour',
    start: { dateTime: tour.starts_at.toISOString().slice(0, -1), timeZone: 'UTC' },
    end: { dateTime: tour.ends_at.toISOString().slice(0, -1), timeZone: 'UTC' },
    showAs: 'busy',
    transactionId: tour.id,
  });
}

export async function removeTour(id: string) {
  try {
    await graph(mailbox() + '/events/' + encodeURIComponent(id), 'DELETE');
  } catch (error) {
    if (!(error instanceof GraphError && error.status === 404)) throw error;
  }
}

export async function createDraft(to: string, subject: string, text: string, replyToId?: string) {
  const drafts = mailbox() + '/messages';
  const content = {
    body: { contentType: 'Text', content: text },
    toRecipients: [{ emailAddress: { address: to } }],
  };
  if (!replyToId) return graph<{ id: string }>(drafts, 'POST', { subject, ...content });
  const original = drafts + '/' + encodeURIComponent(replyToId);
  const draft = await graph<{ id: string }>(original + '/createReply', 'POST', { message: content });
  return draft;
}

export async function sendDraft(id: string) {
  const message = mailbox() + '/messages/' + encodeURIComponent(id);
  const draft = await graph<{ isDraft: boolean }>(message + '?$select=isDraft');
  if (draft.isDraft) await graph(message + '/send', 'POST');
}

export async function draftStillPending(id: string) {
  const draft = await graph<{ isDraft: boolean }>(mailbox() + '/messages/' + encodeURIComponent(id) + '?$select=isDraft');
  return draft.isDraft;
}
