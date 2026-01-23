-- Enable moddatetime extension
create extension if not exists moddatetime schema extensions;

-- Create Carts table
create table public.carts (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone not null default now(),
  constraint carts_pkey primary key (id),
  constraint carts_user_id_key unique (user_id)
);

-- RLS Policies
alter table public.carts enable row level security;

create policy "Users can view their own cart" on public.carts
  for select using (auth.uid() = user_id);

create policy "Users can insert/update their own cart" on public.carts
  for all using (auth.uid() = user_id);

-- Updated_at trigger
create trigger handle_updated_at before update on public.carts
  for each row execute procedure moddatetime (updated_at);
