-- ============================================================================
-- RIIQX DATABASE INITIALIZATION MIGRATION
-- Migration Version: 20260805000000_init_schema.sql
-- Description: Complete schema, enums, triggers, RLS atlas, and indexing for RIIQX.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ENUM DEFINITIONS
-- ============================================================================

CREATE TYPE public.user_role AS ENUM (
  'admin',
  'customer'
);

CREATE TYPE public.order_status AS ENUM (
  'pending',
  'processing',
  'printed',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE public.payment_status AS ENUM (
  'unpaid',
  'paid',
  'failed',
  'refunded'
);

CREATE TYPE public.inventory_status AS ENUM (
  'in_stock',
  'low_stock',
  'out_of_stock',
  'pre_order'
);

CREATE TYPE public.coupon_discount_type AS ENUM (
  'flat',
  'percentage'
);

-- ============================================================================
-- 2. CORE TABLES
-- ============================================================================

-- PROFILES (Linked to Supabase Auth users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'customer',
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  sale_price NUMERIC(10, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
  is_published BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PRODUCT VARIANTS
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  price_override NUMERIC(10, 2) CHECK (price_override IS NULL OR price_override >= 0),
  qikink_variant_id TEXT,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  status public.inventory_status NOT NULL DEFAULT 'in_stock',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PRODUCT IMAGES
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  status public.order_status NOT NULL DEFAULT 'pending',
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  qikink_order_id TEXT,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ORDER ITEMS
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- WISHLISTS
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_product_wishlist UNIQUE (user_id, product_id)
);

-- COUPONS
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type public.coupon_discount_type NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (min_order_amount >= 0),
  max_uses INT CHECK (max_uses IS NULL OR max_uses > 0),
  current_uses INT NOT NULL DEFAULT 0 CHECK (current_uses >= 0),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. INDEXING & PERFORMANCE OPTIMIZATION
-- ============================================================================

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_published ON public.products(is_published);
CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX idx_product_images_product ON public.product_images(product_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_variant ON public.order_items(product_variant_id);
CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX idx_coupons_code ON public.coupons(code);

-- ============================================================================
-- 4. AUTOMATED FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply updated_at triggers
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Function: Automatically insert profile when a new user signs up via auth.users
CREATE OR REPLACE FUNCTION public.on_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'customer'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users creation
CREATE OR REPLACE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.on_auth_user_created();


-- Function: Automatically deduct variant inventory when order transitions to 'processing'
CREATE OR REPLACE FUNCTION public.deduct_inventory_on_order()
RETURNS TRIGGER AS $$
DECLARE
  item RECORD;
BEGIN
  IF NEW.status = 'processing' AND (OLD.status IS NULL OR OLD.status != 'processing') THEN
    FOR item IN
      SELECT product_variant_id, quantity
      FROM public.order_items
      WHERE order_id = NEW.id
    LOOP
      IF item.product_variant_id IS NOT NULL THEN
        UPDATE public.product_variants
        SET stock_quantity = GREATEST(0, stock_quantity - item.quantity),
            status = CASE
              WHEN (stock_quantity - item.quantity) <= 0 THEN 'out_of_stock'::public.inventory_status
              WHEN (stock_quantity - item.quantity) <= 5 THEN 'low_stock'::public.inventory_status
              ELSE status
            END
        WHERE id = item.product_variant_id;
      END IF;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for inventory deduction
CREATE TRIGGER trg_deduct_inventory_on_order
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.deduct_inventory_on_order();


-- ============================================================================
-- 5. ROW-LEVEL SECURITY (RLS) POLICY ATLAS
-- ============================================================================

-- Helper Function: Check if the executing user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can read own profile or admin can read all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile (role immutability enforced for non-admin)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    (auth.uid() = id AND (role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid())))
    OR public.is_admin()
  );

CREATE POLICY "Users can insert own profile or admin can insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- ----------------------------------------------------------------------------
-- CATEGORIES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Public categories read access"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admin full write access to categories"
  ON public.categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- PRODUCTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read published products or admin read all"
  ON public.products FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admin full write access to products"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- PRODUCT VARIANTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read published product variants or admin read all"
  ON public.product_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id AND (p.is_published = true OR public.is_admin())
    )
  );

CREATE POLICY "Admin full write access to product variants"
  ON public.product_variants FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- PRODUCT IMAGES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read product images"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Admin full write access to product images"
  ON public.product_images FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- ORDERS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can read own orders or admin read all"
  ON public.orders FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Authenticated users can create orders for themselves"
  ON public.orders FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admin update orders status & tracking"
  ON public.orders FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete orders"
  ON public.orders FOR DELETE
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- ORDER ITEMS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users can read own order items or admin read all"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Authenticated users can insert order items for own order"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Admin full write access to order items"
  ON public.order_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- WISHLISTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Users manage own wishlist entries"
  ON public.wishlists FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- COUPONS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Public read active coupons or admin read all"
  ON public.coupons FOR SELECT
  USING (
    (is_active = true AND (expires_at IS NULL OR expires_at > now()))
    OR public.is_admin()
  );

CREATE POLICY "Admin full write access to coupons"
  ON public.coupons FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
