-- Create drops table
create table if not exists public.drops (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  release_date timestamp with time zone not null,
  status text check (status in ('upcoming', 'live', 'archived')) default 'upcoming',
  hero_image text,
  accent_color text default '#CCFF00',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create drop_products junction table
create table if not exists public.drop_products (
  drop_id uuid references public.drops(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  primary key (drop_id, product_id)
);

-- Enable RLS
alter table public.drops enable row level security;
alter table public.drop_products enable row level security;

-- Create policies
create policy "Drops are viewable by everyone." on public.drops for select using ( true );
create policy "Drop products are viewable by everyone." on public.drop_products for select using ( true );

-- Insert a sample drop (optional, for testing)
insert into public.drops (name, description, release_date, status, hero_image, accent_color)
values 
('Cyberpunk Collection', 'The future is now. Limited edition release.', now() + interval '2 days', 'upcoming', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80', '#CCFF00');
