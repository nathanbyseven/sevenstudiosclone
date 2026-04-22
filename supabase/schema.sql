-- ============================================================
-- SEVEN STUDIOS — CLIENT PORTAL DATABASE SCHEMA
-- Run this entire file in the Supabase SQL Editor once
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 0. EXTENSIONS
-- ────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- 1. CLIENT PROFILES
-- One row per Supabase Auth user (admin-created only).
-- ────────────────────────────────────────────────────────────
create table if not exists public.client_profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  company       text,
  avatar_url    text,
  created_at    timestamptz default now() not null
);

alter table public.client_profiles enable row level security;

-- A client can only read their own profile row
create policy "client_profiles: own read"
  on public.client_profiles for select
  using ( auth.uid() = id );

-- ────────────────────────────────────────────────────────────
-- 2. PROJECTS & TIMELINE MILESTONES
-- ────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid not null references public.client_profiles(id) on delete cascade,
  name          text not null,
  description   text,
  status        text not null default 'active'
                  check (status in ('active','paused','completed')),
  start_date    date,
  end_date      date,
  created_at    timestamptz default now() not null
);

alter table public.projects enable row level security;

create policy "projects: own read"
  on public.projects for select
  using ( auth.uid() = client_id );

-- Timeline milestones belong to a project
create table if not exists public.milestones (
  id            uuid primary key default uuid_generate_v4(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  client_id     uuid not null references public.client_profiles(id) on delete cascade,
  title         text not null,
  description   text,
  due_date      date,
  completed     boolean not null default false,
  completed_at  timestamptz,
  created_at    timestamptz default now() not null
);

alter table public.milestones enable row level security;

create policy "milestones: own read"
  on public.milestones for select
  using ( auth.uid() = client_id );

-- ────────────────────────────────────────────────────────────
-- 3. MEETINGS
-- ────────────────────────────────────────────────────────────
create table if not exists public.meetings (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid not null references public.client_profiles(id) on delete cascade,
  title         text not null,
  meeting_date  timestamptz not null,
  duration_min  integer,
  notes         text,
  recording_url text,
  created_at    timestamptz default now() not null
);

alter table public.meetings enable row level security;

create policy "meetings: own read"
  on public.meetings for select
  using ( auth.uid() = client_id );

-- ────────────────────────────────────────────────────────────
-- 4. INVOICES
-- ────────────────────────────────────────────────────────────
create table if not exists public.invoices (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid not null references public.client_profiles(id) on delete cascade,
  invoice_number text not null,
  title         text not null,
  amount        numeric(10,2) not null,
  currency      text not null default 'ZAR',
  status        text not null default 'pending'
                  check (status in ('draft','pending','paid','overdue')),
  issued_date   date not null,
  due_date      date,
  paid_date     date,
  pdf_url       text,
  notes         text,
  created_at    timestamptz default now() not null
);

alter table public.invoices enable row level security;

create policy "invoices: own read"
  on public.invoices for select
  using ( auth.uid() = client_id );

-- ────────────────────────────────────────────────────────────
-- 5. DOCUMENTS (confidential files via Supabase Storage)
-- ────────────────────────────────────────────────────────────
create table if not exists public.documents (
  id            uuid primary key default uuid_generate_v4(),
  client_id     uuid not null references public.client_profiles(id) on delete cascade,
  name          text not null,
  description   text,
  category      text not null default 'general'
                  check (category in ('contract','brief','asset','report','proposal','general')),
  storage_path  text not null,
  file_size     bigint,
  mime_type     text,
  created_at    timestamptz default now() not null
);

alter table public.documents enable row level security;

create policy "documents: own read"
  on public.documents for select
  using ( auth.uid() = client_id );

-- ────────────────────────────────────────────────────────────
-- 6. STORAGE BUCKET SETUP
-- Run separately in the Supabase dashboard → Storage section
-- OR execute here:
-- ────────────────────────────────────────────────────────────

-- Create a PRIVATE bucket named 'client-documents'
-- (Supabase Dashboard → Storage → New Bucket → private, name: client-documents)
-- Then add this RLS policy on objects:

-- Policy: clients can only download their own files
-- (stored under path: {client_id}/filename)

-- In the SQL editor, after creating the bucket, run:
/*
create policy "client-documents: own read"
  on storage.objects for select
  using (
    bucket_id = 'client-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "client-documents: admin upload"
  on storage.objects for insert
  with check (
    bucket_id = 'client-documents'
  );
*/

-- ────────────────────────────────────────────────────────────
-- 7. HELPER FUNCTION — get current user's profile
-- ────────────────────────────────────────────────────────────
create or replace function public.get_my_profile()
returns public.client_profiles
language sql security definer
as $$
  select * from public.client_profiles where id = auth.uid();
$$;

-- ────────────────────────────────────────────────────────────
-- 8. SEED DEMO DATA (optional — remove in production)
-- Replace 'YOUR_AUTH_USER_UUID' with actual UUID from auth.users
-- ────────────────────────────────────────────────────────────
/*
-- Step 1: In Supabase Dashboard → Authentication → Users → Add User
-- Step 2: Copy the UUID from the newly created user
-- Step 3: Paste below and uncomment

do $$
declare
  demo_client_id uuid := 'YOUR_AUTH_USER_UUID';
  demo_project_id uuid := uuid_generate_v4();
begin

  insert into public.client_profiles (id, full_name, company) values
    (demo_client_id, 'Jane Smith', 'Acme Corp');

  insert into public.projects (id, client_id, name, description, status, start_date, end_date) values
    (demo_project_id, demo_client_id, 'Brand Identity Redesign',
     'Full visual identity overhaul — logo, type system, colour palette, brand guidelines.',
     'active', current_date - 30, current_date + 60);

  insert into public.milestones (project_id, client_id, title, due_date, completed) values
    (demo_project_id, demo_client_id, 'Discovery & Research', current_date - 20, true),
    (demo_project_id, demo_client_id, 'Mood Boards Presented', current_date - 10, true),
    (demo_project_id, demo_client_id, 'Logo Concepts (Round 1)', current_date + 5, false),
    (demo_project_id, demo_client_id, 'Client Review & Refinement', current_date + 20, false),
    (demo_project_id, demo_client_id, 'Final Delivery', current_date + 55, false);

  insert into public.meetings (client_id, title, meeting_date, duration_min, notes) values
    (demo_client_id, 'Kickoff Call', now() - interval '25 days', 60,
     'Covered scope, timelines, reference brands, and communication cadence.'),
    (demo_client_id, 'Mood Board Review', now() - interval '8 days', 45,
     'Client preferred direction 2 (clean geometric). Approved colour temperature.');

  insert into public.invoices (client_id, invoice_number, title, amount, currency, status, issued_date, due_date) values
    (demo_client_id, 'SS-2025-001', 'Deposit — Brand Identity Project', 12500.00, 'ZAR', 'paid', current_date - 28, current_date - 14),
    (demo_client_id, 'SS-2025-002', 'Milestone 2 — Concepts & Presentation', 8750.00, 'ZAR', 'pending', current_date - 3, current_date + 14);

end $$;
*/
