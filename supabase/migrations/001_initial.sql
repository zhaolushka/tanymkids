-- TanymKids initial schema (apply when Supabase is connected)

create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  birth_date date,
  stars_total int default 0,
  daily_streak int default 0,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade not null,
  module text not null check (module in ('lfk', 'hands')),
  duration_sec int not null,
  avg_accuracy float not null,
  stars_earned int default 0,
  started_at timestamptz not null,
  ended_at timestamptz not null
);

create table if not exists exercise_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade not null,
  exercise_id text not null,
  accuracy float not null,
  stars_earned int default 0,
  metrics jsonb,
  completed_at timestamptz default now()
);

alter table children enable row level security;
alter table sessions enable row level security;
alter table exercise_results enable row level security;

create policy "Parents manage own children"
  on children for all
  using (auth.uid() = parent_id)
  with check (auth.uid() = parent_id);

create policy "Parents view own sessions"
  on sessions for all
  using (
    child_id in (select id from children where parent_id = auth.uid())
  );

create policy "Parents view own exercise results"
  on exercise_results for all
  using (
    session_id in (
      select s.id from sessions s
      join children c on c.id = s.child_id
      where c.parent_id = auth.uid()
    )
  );
