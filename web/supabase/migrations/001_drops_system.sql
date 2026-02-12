-- RIIQX Drop System Migration
-- Run this in Supabase SQL Editor

-- Table: drops
CREATE TABLE IF NOT EXISTS drops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    release_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'archived')),
    hero_image TEXT,
    accent_color TEXT DEFAULT '#B4F000',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: drop_products (links products to drops)
CREATE TABLE IF NOT EXISTS drop_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    drop_id UUID REFERENCES drops(id) ON DELETE CASCADE,
    product_handle TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE drop_products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can read drops" ON drops FOR SELECT USING (true);
CREATE POLICY "Public can read drop_products" ON drop_products FOR SELECT USING (true);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER drops_updated_at
    BEFORE UPDATE ON drops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Seed: Create the first drop
INSERT INTO drops (name, description, release_date, status, hero_image)
VALUES (
    'EAT DRINK BE MERRY',
    'The inaugural RIIQX drop. Premium hoodies engineered for presence. Limited stock. No restocks.',
    '2026-03-01T00:00:00Z',
    'upcoming',
    '/hero/slide-3.png'
);
