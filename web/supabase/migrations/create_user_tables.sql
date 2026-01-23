-- Create a table for public profiles if it doesn't exist
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

-- Policies for profiles (safely)
do $$
begin
  if not exists (select from pg_policies where policyname = 'Public profiles are viewable by everyone.' and tablename = 'profiles') then
    create policy "Public profiles are viewable by everyone." on profiles for select using (true);
  end if;

  if not exists (select from pg_policies where policyname = 'Users can insert their own profile.' and tablename = 'profiles') then
    create policy "Users can insert their own profile." on profiles for insert with check ((select auth.uid()) = id);
  end if;

  if not exists (select from pg_policies where policyname = 'Users can update own profile.' and tablename = 'profiles') then
    create policy "Users can update own profile." on profiles for update using ((select auth.uid()) = id);
  end if;
end $$;

-- Create a table for addresses if it doesn't exist
create table if not exists addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  full_name text not null,
  street_address text not null,
  apt_suite text,
  city text not null,
  state text not null,
  zip_code text not null,
  country text not null,
  phone text,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table addresses enable row level security;

-- Policies for addresses (safely)
do $$
begin
  if not exists (select from pg_policies where policyname = 'Users can view their own addresses.' and tablename = 'addresses') then
    create policy "Users can view their own addresses." on addresses for select using ((select auth.uid()) = user_id);
  end if;

  if not exists (select from pg_policies where policyname = 'Users can insert their own addresses.' and tablename = 'addresses') then
    create policy "Users can insert their own addresses." on addresses for insert with check ((select auth.uid()) = user_id);
  end if;

  if not exists (select from pg_policies where policyname = 'Users can update their own addresses.' and tablename = 'addresses') then
    create policy "Users can update their own addresses." on addresses for update using ((select auth.uid()) = user_id);
  end if;

  if not exists (select from pg_policies where policyname = 'Users can delete their own addresses.' and tablename = 'addresses') then
    create policy "Users can delete their own addresses." on addresses for delete using ((select auth.uid()) = user_id);
  end if;
end $$;

-- Create a table for mirroring Shopify orders if it doesn't exist
create table if not exists orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  shopify_order_id text unique not null,
  order_number text not null,
  total_price decimal(10, 2) not null,
  currency_code text not null default 'INR',
  status text not null,
  fulfillment_status text,
  items jsonb not null, -- Store order line items as JSON
  shipping_address jsonb, -- Store shipping address snapshot
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table orders enable row level security;

-- Policies for orders (safely)
do $$
begin
  if not exists (select from pg_policies where policyname = 'Users can view their own orders.' and tablename = 'orders') then
    create policy "Users can view their own orders." on orders for select using ((select auth.uid()) = user_id);
  end if;
end $$;

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
