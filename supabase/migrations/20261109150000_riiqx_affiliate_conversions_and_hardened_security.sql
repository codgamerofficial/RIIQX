-- =============================================================================
-- RIIQX Phase 5 Migration: Affiliate Conversions Postback & Hardened Security
-- Migration: 20261109150000_riiqx_affiliate_conversions_and_hardened_security.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.affiliate_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    click_id VARCHAR(128),
    user_id VARCHAR(64),
    retailer_name VARCHAR(64) NOT NULL,
    order_id VARCHAR(128) NOT NULL,
    order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    commission_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'returned', 'settled'
    partner_source VARCHAR(64) NOT NULL,
    transaction_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_affiliate_conversion UNIQUE (retailer_name, order_id)
);

-- Indexes for lightning-fast queries and postback lookups
CREATE INDEX IF NOT EXISTS idx_affiliate_conv_user ON public.affiliate_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conv_order ON public.affiliate_conversions(retailer_name, order_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conv_status ON public.affiliate_conversions(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_conv_date ON public.affiliate_conversions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.affiliate_conversions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own conversion attribution
CREATE POLICY "Users can view their own conversions"
    ON public.affiliate_conversions
    FOR SELECT
    USING (auth.uid()::text = user_id);

-- Service role full access for webhook ingestion & background workers
CREATE POLICY "Service role full access on affiliate conversions"
    ON public.affiliate_conversions
    FOR ALL
    USING (true)
    WITH CHECK (true);
