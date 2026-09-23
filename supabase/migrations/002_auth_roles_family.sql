-- Roles, family access, parent PIN, doctor access, audit log

create type app_role as enum ('parent', 'doctor');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null default 'parent',
  display_name text,
  doctor_slug text unique,
  created_at timestamptz default now()
);

create table if not exists parent_pins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  pin_hash text not null,
  updated_at timestamptz default now()
);

create table if not exists family_members (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  relation text not null default 'parent',
  access_level text not null default 'full' check (access_level in ('full', 'temporary', 'view')),
  created_at timestamptz default now(),
  unique (child_id, user_id)
);

create table if not exists doctor_patient_access (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references auth.users(id) on delete cascade not null,
  child_id uuid references children(id) on delete cascade not null,
  active boolean not null default true,
  granted_by uuid references auth.users(id),
  note text,
  created_at timestamptz default now(),
  unique (doctor_id, child_id)
);

create table if not exists medical_access_log (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children(id) on delete set null,
  viewer_id uuid references auth.users(id) on delete set null,
  viewer_label text not null,
  action text not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table parent_pins enable row level security;
alter table family_members enable row level security;
alter table doctor_patient_access enable row level security;
alter table medical_access_log enable row level security;

create policy "Users read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Parent manages own pin"
  on parent_pins for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Family members visible to child parents"
  on family_members for select
  using (
    child_id in (select id from children where parent_id = auth.uid())
    or user_id = auth.uid()
  );

create policy "Primary parent manages family members"
  on family_members for all
  using (
    child_id in (select id from children where parent_id = auth.uid())
  )
  with check (
    child_id in (select id from children where parent_id = auth.uid())
  );

create policy "Doctors see own patient grants"
  on doctor_patient_access for select
  using (doctor_id = auth.uid());

create policy "Parents manage doctor access for own children"
  on doctor_patient_access for all
  using (
    child_id in (select id from children where parent_id = auth.uid())
  )
  with check (
    child_id in (select id from children where parent_id = auth.uid())
  );

create policy "Parents view access log for own children"
  on medical_access_log for select
  using (
    child_id in (select id from children where parent_id = auth.uid())
  );

create policy "Authenticated users insert access log"
  on medical_access_log for insert
  with check (auth.uid() is not null);

-- Auto-create profile on signup (run in Supabase SQL editor if using Auth hooks)
-- create function public.handle_new_user() ...
