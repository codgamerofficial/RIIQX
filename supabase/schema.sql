-- Enable UUID usage
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  wallet_balance decimal default 0.0,
  referral_code text unique,
  referred_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS
create table products (
  id uuid default uuid_generate_v4() primary key,
  qikink_product_id text, -- ID from Qikink
  title text not null,
  description text,
  base_price decimal not null,
  selling_price decimal not null,
  category text,
  tags text[],
  images text[],
  glb_model_url text, -- For 3D viewer
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- PRODUCT VARIANTS
create table product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade,
  color text,
  size text,
  sku text,
  stock integer default 0,
  qikink_variant_id text
);

-- ORDERS
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  status text default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount decimal not null,
  shipping_address jsonb,
  payment_id text,
  payment_method text,
  tracking_id text,
  courier_name text,
  qikink_order_id text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ORDER ITEMS
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  quantity integer default 1,
  price_at_purchase decimal not null
);

-- CART
create table cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id),
  variant_id uuid references product_variants(id),
  quantity integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- WALLET TRANSACTIONS
create table wallet_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  amount decimal not null,
  type text check (type in ('credit', 'debit')),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS POLICIES (Templates)
alter table profiles enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Policy: Users can view their own profile
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- Policy: Products are viewable by everyone
create policy "Products are viewable by everyone." on products for select using ( true );

-- Policy: Users can view own orders
create policy "Users can view own orders." on orders for select using ( auth.uid() = user_id );

-- USER MANAGEMENT TRIGGERS
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED DATA
insert into public.products (title, description, base_price, selling_price, category, images, is_active)
values 
('Cyberpunk Hoodie', 'Neon-infused streetwear.', 89.99, 89.99, 'Hoodies', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'], true),
('Neon Abstract Tee', 'Glow in the dark aesthetics.', 29.99, 29.99, 'T-Shirts', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'], true)
on conflict do nothing;

DO $$
DECLARE
    hoodie_id UUID;
    tee_id UUID;
BEGIN
    SELECT id INTO hoodie_id FROM public.products WHERE title = 'Cyberpunk Hoodie' LIMIT 1;
    SELECT id INTO tee_id FROM public.products WHERE title = 'Neon Abstract Tee' LIMIT 1;

    IF hoodie_id IS NOT NULL THEN
        INSERT INTO public.product_variants (product_id, color, size, stock, sku)
        VALUES (hoodie_id, 'Black', 'L', 100, 'HOOD-BLK-L')
        ON CONFLICT DO NOTHING;
    END IF;

    IF tee_id IS NOT NULL THEN
        INSERT INTO public.product_variants (product_id, color, size, stock, sku)
        VALUES (tee_id, 'White', 'M', 100, 'TEE-WHT-M')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
