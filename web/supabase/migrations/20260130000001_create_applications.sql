
create table if not exists public.applications (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  full_name text not null,
  email text not null,
  role text not null,
  portfolio_url text null,
  message text null,
  status text not null default 'pending'::text,
  constraint applications_pkey primary key (id)
);

alter table public.applications enable row level security;

create policy "Enable insert for all users" on public.applications as permissive for insert to public using (true);

create policy "Enable read access for service role only" on public.applications as permissive for select to service_role using (true);
