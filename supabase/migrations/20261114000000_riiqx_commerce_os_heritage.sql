-- =============================================================================
-- RIIQX 2.0 — Modern Indian Heritage D2C Commerce OS Schema
-- Migration: 20261114000000_riiqx_commerce_os_heritage.sql
-- Multi-Supplier, Inventory-Free, India-First D2C Infrastructure
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Suppliers Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.riiqx_suppliers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('POD', 'DROPSHIPPING', 'ARTISANAL', 'PRIVATE_LABEL')),
    status TEXT NOT NULL DEFAULT 'RESEARCH_ONLY' CHECK (status IN (
        'RESEARCH_ONLY', 'DOCUMENTATION_VERIFIED', 'ACCOUNT_REQUIRED',
        'CREDENTIALS_REQUIRED', 'SANDBOX_CONNECTED', 'SANDBOX_TESTED',
        'LIVE_ACCESS_APPROVED', 'PRODUCTION_VERIFIED', 'DISABLED'
    )),
    api_endpoint TEXT,
    dispatch_days_min INTEGER NOT NULL DEFAULT 2,
    dispatch_days_max INTEGER NOT NULL DEFAULT 5,
    supports_cod BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC(3, 2) DEFAULT 4.80,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. Commerce Categories Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.riiqx_commerce_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. Commerce Products Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.riiqx_commerce_products (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    collection_id TEXT REFERENCES public.riiqx_commerce_categories(id) ON DELETE SET NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    material TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    origin TEXT NOT NULL DEFAULT 'India',
    retail_price INTEGER NOT NULL CHECK (retail_price > 0),
    cogs INTEGER NOT NULL CHECK (cogs >= 0),
    shipping_cost INTEGER NOT NULL DEFAULT 0,
    gst_percent INTEGER NOT NULL DEFAULT 18,
    supplier_id TEXT REFERENCES public.riiqx_suppliers(id) ON DELETE RESTRICT,
    supplier_sku TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK')),
    images TEXT[] NOT NULL DEFAULT '{}',
    is_heritage BOOLEAN NOT NULL DEFAULT true,
    dispatch_days TEXT NOT NULL DEFAULT '2-4 business days',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_riiqx_products_collection ON public.riiqx_commerce_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_riiqx_products_status ON public.riiqx_commerce_products(status);
CREATE INDEX IF NOT EXISTS idx_riiqx_products_sku ON public.riiqx_commerce_products(sku);

-- -----------------------------------------------------------------------------
-- 4. Commerce Orders Table (Prepaid Single Source of Truth)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.riiqx_commerce_orders (
    id TEXT PRIMARY KEY,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN (
        'pending_payment', 'paid', 'supplier_routed', 'supplier_acknowledged',
        'in_production', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'
    )),
    subtotal_inr INTEGER NOT NULL CHECK (subtotal_inr >= 0),
    shipping_inr INTEGER NOT NULL DEFAULT 0,
    tax_inr INTEGER NOT NULL DEFAULT 0,
    total_inr INTEGER NOT NULL CHECK (total_inr > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'card', 'netbanking')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
    payment_id TEXT,
    gateway_name TEXT NOT NULL DEFAULT 'razorpay',
    currency TEXT NOT NULL DEFAULT 'INR',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_riiqx_orders_customer ON public.riiqx_commerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_riiqx_orders_status ON public.riiqx_commerce_orders(status);
CREATE INDEX IF NOT EXISTS idx_riiqx_orders_created ON public.riiqx_commerce_orders(created_at DESC);

-- -----------------------------------------------------------------------------
-- 5. Order Items Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.riiqx_commerce_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.riiqx_commerce_orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.riiqx_commerce_products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL CHECK (unit_price > 0),
    total_price INTEGER NOT NULL CHECK (total_price > 0),
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_riiqx_order_items_order ON public.riiqx_commerce_order_items(order_id);

-- -----------------------------------------------------------------------------
-- 6. Supplier Purchase Orders Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.riiqx_commerce_supplier_orders (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.riiqx_commerce_orders(id) ON DELETE CASCADE,
    supplier_id TEXT NOT NULL REFERENCES public.riiqx_suppliers(id) ON DELETE RESTRICT,
    supplier_po_number TEXT,
    status TEXT NOT NULL DEFAULT 'QUEUED' CHECK (status IN (
        'QUEUED', 'DISPATCHED', 'ACKNOWLEDGED', 'PROCESSING', 'SHIPPED', 'CANCELLED', 'FAILED'
    )),
    total_wholesale_cost INTEGER NOT NULL CHECK (total_wholesale_cost >= 0),
    estimated_dispatch TIMESTAMPTZ,
    actual_dispatch TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_riiqx_supplier_orders_order ON public.riiqx_commerce_supplier_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_riiqx_supplier_orders_supplier ON public.riiqx_commerce_supplier_orders(supplier_id);

-- -----------------------------------------------------------------------------
-- 7. Shipments Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.riiqx_commerce_shipments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.riiqx_commerce_orders(id) ON DELETE CASCADE,
    supplier_order_id TEXT REFERENCES public.riiqx_commerce_supplier_orders(id) ON DELETE SET NULL,
    courier TEXT NOT NULL,
    tracking_number TEXT NOT NULL,
    tracking_url TEXT,
    current_status TEXT NOT NULL DEFAULT 'MANIFESTED',
    manifested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_riiqx_shipments_order ON public.riiqx_commerce_shipments(order_id);

-- -----------------------------------------------------------------------------
-- 8. Row Level Security (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.riiqx_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riiqx_commerce_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riiqx_commerce_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riiqx_commerce_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riiqx_commerce_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riiqx_commerce_supplier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riiqx_commerce_shipments ENABLE ROW LEVEL SECURITY;

-- Public read for categories & active products
CREATE POLICY "Public can view active categories"
    ON public.riiqx_commerce_categories FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active products"
    ON public.riiqx_commerce_products FOR SELECT USING (status = 'ACTIVE');

-- Customer can view their own orders and items
CREATE POLICY "Customers can view their own orders"
    ON public.riiqx_commerce_orders FOR SELECT
    USING (auth.uid() = customer_id OR auth.role() = 'service_role');

CREATE POLICY "Customers can create orders"
    ON public.riiqx_commerce_orders FOR INSERT
    WITH CHECK (auth.uid() = customer_id OR auth.role() = 'service_role');

CREATE POLICY "Customers can view their order items"
    ON public.riiqx_commerce_order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.riiqx_commerce_orders o
            WHERE o.id = order_id AND (o.customer_id = auth.uid() OR auth.role() = 'service_role')
        )
    );

-- Customer can view their shipments
CREATE POLICY "Customers can view shipments"
    ON public.riiqx_commerce_shipments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.riiqx_commerce_orders o
            WHERE o.id = order_id AND (o.customer_id = auth.uid() OR auth.role() = 'service_role')
        )
    );

-- Service role full access on all tables
CREATE POLICY "Service role full access on suppliers"
    ON public.riiqx_suppliers FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on products"
    ON public.riiqx_commerce_products FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on orders"
    ON public.riiqx_commerce_orders FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on supplier orders"
    ON public.riiqx_commerce_supplier_orders FOR ALL USING (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- 9. Initial Seed Data (Verified Suppliers & Core Collections)
-- -----------------------------------------------------------------------------
INSERT INTO public.riiqx_suppliers (id, name, code, category, status, api_endpoint, dispatch_days_min, dispatch_days_max, supports_cod, rating)
VALUES
    ('sup_qikink', 'Qikink India', 'QIKINK', 'POD', 'SANDBOX_CONNECTED', 'https://admins.qikink.com/api', 2, 4, false, 4.80),
    ('sup_printrove', 'Printrove India', 'PRINTROVE', 'POD', 'DOCUMENTATION_VERIFIED', 'https://api.printrove.com/v1', 2, 5, false, 4.65),
    ('sup_cjdropshipping', 'CJdropshipping', 'CJ', 'DROPSHIPPING', 'DOCUMENTATION_VERIFIED', 'https://developers.cjdropshipping.com/api2.0', 7, 14, false, 4.50),
    ('sup_artisanal_rajasthan', 'Jodhpur Wood & Brass Guild', 'ARTISAN_RAJ', 'ARTISANAL', 'LIVE_ACCESS_APPROVED', 'https://api.riiqx.internal/artisanal/v1', 3, 5, false, 4.95)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.riiqx_commerce_categories (id, name, slug, tagline, description, display_order)
VALUES
    ('col_objects', 'RIIQX Objects', 'objects', 'Sculptural desk and everyday precision instruments', 'Desk organization and everyday items cast in solid brass, hand-turned Sheesham wood, and Jaipur stoneware.', 1),
    ('col_living', 'RIIQX Living', 'living', 'Earthy luxury for contemporary living spaces', 'Handmade ceramic vessels, organic terracotta tableware, and hand-loomed textiles from Indian master weavers.', 2),
    ('col_carry', 'RIIQX Carry', 'carry', 'Travel and everyday carry handcrafted from full-grain leather', 'Vegetable-tanned leather folios, brass key hooks, and ballistic canvas organizers designed to last a lifetime.', 3),
    ('col_everyday', 'RIIQX Everyday', 'everyday', 'Original RIIQX heritage essentials', 'Organic cotton everyday essentials, notebooks, and architectural desk accessories.', 4)
ON CONFLICT (id) DO NOTHING;
