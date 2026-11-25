begin;

create table if not exists venue_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  name text not null default '',
  first_source text not null,
  stage text not null default 'inquiry' check (stage in ('inquiry','contacted','tour','review','booked','closed')),
  opted_out boolean not null default false,
  touch_version integer not null default 0,
  received_at timestamptz not null default now()
);

create table if not exists venue_messages (
  id uuid primary key default gen_random_uuid(),
  external_id text not null unique,
  lead_id uuid not null references venue_leads,
  source text not null,
  body text not null,
  subject text not null,
  outlook_id text,
  received_at timestamptz not null default now()
);

create table if not exists venue_resources (
  id text primary key,
  label text not null
);
insert into venue_resources (id,label) values
  ('tour','Tour availability'), ('ceremony','Ceremony Hall'), ('reception','Reception Hall'),
  ('deck','Ceremony Deck'), ('enclave','The Enclave'), ('lodge','Main Lodge'),
  ('bridal','Bridal Suite'), ('guest-quarters','Guest quarters'),
  ('waterfall-1','Waterfall Cabin 1'), ('waterfall-2','Waterfall Cabin 2'), ('waterfall-3','Waterfall Cabin 3'),
  ('glamping-1','Glamping Cabin 1'), ('glamping-2','Glamping Cabin 2')
on conflict do nothing;

create table if not exists venue_event_windows (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  resources text[] not null check (cardinality(resources) > 0),
  price_cents integer not null check (price_cents >= 0),
  public_listing boolean not null default true,
  deposit_cents integer check (deposit_cents > 0 and deposit_cents <= price_cents),
  state text not null check (state in ('open','held','booked','closed')),
  expires_at timestamptz,
  lead_id uuid references venue_leads,
  updated_at timestamptz not null default now(),
  check (state <> 'held' or expires_at is not null)
);
create index if not exists venue_event_window_range on venue_event_windows using gist (tstzrange(starts_at,ends_at,'[)'));

create table if not exists venue_tour_hours (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null check (end_time > start_time),
  duration_minutes smallint not null check (duration_minutes between 15 and 180),
  unique (weekday,start_time,end_time)
);

create table if not exists venue_tours (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  lead_id uuid not null references venue_leads,
  source text not null check (source in ('direct','agent','staff')),
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  status text not null default 'scheduled' check (status in ('scheduled','confirmed','canceled','attended','no_show')),
  outlook_id text,
  created_at timestamptz not null default now(),
  exclude using gist (tstzrange(starts_at,ends_at,'[)') with &&)
    where (status in ('scheduled','confirmed','attended'))
);

create table if not exists venue_facts (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  answer text not null,
  enabled boolean not null default true,
  revision integer not null default 1,
  updated_at timestamptz not null default now()
);
create unique index if not exists venue_facts_enabled_topic on venue_facts(topic) where enabled;

create table if not exists venue_deposits (
  event_id text primary key,
  provider_reference text not null unique,
  window_id uuid not null references venue_event_windows,
  amount_cents integer not null check (amount_cents > 0),
  recorded_at timestamptz not null default now()
);

create table if not exists venue_activity (
  id bigint generated always as identity primary key,
  lead_id uuid references venue_leads,
  kind text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists venue_activity_lead on venue_activity(lead_id,created_at);

create table if not exists venue_jobs (
  id uuid primary key default gen_random_uuid(),
  job_key text not null unique,
  kind text not null check (kind in ('respond','follow_up','tour_sync','email','tour_outcome')),
  lead_id uuid references venue_leads,
  payload jsonb not null default '{}',
  status text not null default 'queued' check (status in ('queued','running','sent','skipped','failed')),
  due_at timestamptz not null default now(),
  lease_until timestamptz,
  lease_token uuid,
  attempts integer not null default 0,
  provider_id text,
  last_error text
);
create index if not exists venue_jobs_ready on venue_jobs(due_at) where status in ('queued','running');

create table if not exists venue_public_requests (
  id uuid not null,
  category text not null,
  fingerprint text not null,
  contact_key text not null,
  created_at timestamptz not null default now(),
  primary key (id,category)
);
create index if not exists venue_public_requests_rate on venue_public_requests(fingerprint,category,created_at);

create table if not exists venue_state (
  key text primary key,
  value text not null
);

create table if not exists venue_receipts (
  event_id text primary key,
  recorded_at timestamptz not null default now()
);

-- The server connects as the migration owner or a trusted database role.
-- Default PostgREST/API roles must not be able to read lead or calendar records.
alter table venue_leads enable row level security;
alter table venue_messages enable row level security;
alter table venue_resources enable row level security;
alter table venue_event_windows enable row level security;
alter table venue_tour_hours enable row level security;
alter table venue_tours enable row level security;
alter table venue_facts enable row level security;
alter table venue_deposits enable row level security;
alter table venue_activity enable row level security;
alter table venue_jobs enable row level security;
alter table venue_public_requests enable row level security;
alter table venue_state enable row level security;
alter table venue_receipts enable row level security;

commit;
