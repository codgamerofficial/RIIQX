-- ==============================================================================
-- RIIQX x QIKINK INTEGRATION SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure Qikink columns exist on pre-existing products and variants tables
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS qikink_product_id VARCHAR(100);
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS qikink_variant_id VARCHAR(100);
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS qikink_sku VARCHAR(100);

-- 2. PRODUCTS TABLE (Maps RIIQX Core Product to Qikink Base Product)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    base_price DECIMAL(10, 2) NOT NULL, -- Retail price in INR (₹)
    sale_price DECIMAL(10, 2),
    qikink_product_id VARCHAR(100),    -- Qikink's Master Design/Product ID (e.g., 'QKP_98412')
    is_published BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,  -- Stores fabric specs, GSM (e.g., {"gsm": 500, "fit": "oversized"})
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS TABLE (Maps Color/Size Matrix to Qikink Variant SKU & ID)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,       -- Local RIIQX SKU (e.g., 'HOOD-BLK-XL')
    color VARCHAR(50) NOT NULL,            -- e.g., 'Obsidian Black'
    size VARCHAR(20) NOT NULL,             -- e.g., 'S', 'M', 'L', 'XL', 'XXL'
    price_override DECIMAL(10, 2),        -- Variant price if different from base product
    stock_quantity INT DEFAULT 0,          -- Local / Synced stock cache
    
    -- Qikink Specific Mappings
    qikink_variant_id VARCHAR(100),       -- Qikink Variant ID (e.g., 'QKV_55102')
    qikink_sku VARCHAR(100),              -- Qikink specific vendor SKU
    
    status VARCHAR(50) DEFAULT 'active',   -- 'active', 'pre_order', 'out_of_stock'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_product_color_size UNIQUE(product_id, color, size)
);

-- 5. QIKINK SYNC LOGS TABLE (Tracks Automated Webhook/API Sync Events)
CREATE TABLE IF NOT EXISTS public.qikink_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,      -- 'product', 'variant', 'order', 'stock'
    entity_id UUID,                        -- References product_id or order_id
    qikink_reference_id VARCHAR(100),     -- Qikink ID or Order ID
    status VARCHAR(50) NOT NULL,           -- 'success', 'failed', 'pending'
    payload JSONB,                         -- Raw API response/request data
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR INSTANT LOOKUPS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_qikink_id ON public.products(qikink_product_id);
CREATE INDEX IF NOT EXISTS idx_variants_qikink_id ON public.product_variants(qikink_variant_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON public.product_variants(sku);

-- ==============================================================================
-- AUTOMATIC UPDATED_AT TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_modtime ON public.products;
CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS update_variants_modtime ON public.product_variants;
CREATE TRIGGER update_variants_modtime
    BEFORE UPDATE ON public.product_variants
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view published products and variants
DROP POLICY IF EXISTS "Public Read Published Products" ON public.products;
CREATE POLICY "Public Read Published Products" ON public.products
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public Read Product Variants" ON public.product_variants;
CREATE POLICY "Public Read Product Variants" ON public.product_variants
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Product Images" ON public.product_images;
CREATE POLICY "Public Read Product Images" ON public.product_images
    FOR SELECT USING (true);

-- Only Admin Service Role can modify catalog items
DROP POLICY IF EXISTS "Admin Full Access Products" ON public.products;
CREATE POLICY "Admin Full Access Products" ON public.products
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

DROP POLICY IF EXISTS "Admin Full Access Variants" ON public.product_variants;
CREATE POLICY "Admin Full Access Variants" ON public.product_variants
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));
