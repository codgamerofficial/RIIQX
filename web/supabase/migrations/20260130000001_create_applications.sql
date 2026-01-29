drop table if exists public.applications cascade;

create table if not exists public.applications (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null default now(),
  full_name text not null,
  email text not null check (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
  role text not null,
  portfolio_url text null,
  message text null,
  status text not null default 'pending'::text check (status in ('pending', 'reviewed', 'contacted', 'rejected')),
  constraint applications_pkey primary key (id)
);

comment on table public.applications is 'Stores career applications submitted via the website.';
comment on column public.applications.status is 'Current status of the application: pending, reviewed, contacted, rejected.';

alter table public.applications enable row level security;

create policy "Enable insert for all users" on public.applications as permissive for insert to public with check (true);

create policy "Enable read access for service role only" on public.applications as permissive for select to service_role using (true);
