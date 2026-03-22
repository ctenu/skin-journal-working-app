create table if not exists entries (
  id          bigint primary key generated always as identity,
  created_at  timestamptz default now() not null,
  date        date not null,
  foods       text[] default '{}',
  stress      smallint check (stress between 1 and 5),
  sleep       smallint check (sleep between 1 and 5),
  skincare    text[] default '{}',
  exposures   text[] default '{}',
  exercise    text,
  meds        text[] default '{}',
  symptoms    text[] default '{}',
  severity    smallint default 0 check (severity between 0 and 5),
  notes       text,
  photo       text,
  user_id     uuid references auth.users(id) on delete cascade
);

-- Enable RLS (open policy until auth is configured)
alter table entries enable row level security;

create policy "allow all for now"
  on entries
  for all
  using (true)
  with check (true);

-- When auth is added, replace the policy above with:
-- create policy "users can manage own entries"
--   on entries
--   for all
--   using (auth.uid() = user_id)
--   with check (auth.uid() = user_id);
