-- =============================================================================
-- RIIQX Phase 1 Migration: Affiliate Smart-Router, Revenue & Click Telemetry
-- Migration: 20261109130000_riiqx_affiliate_and_revenue_schema.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.affiliate_click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(64) NOT NULL DEFAULT 'usr_guest_local',
    product_identifier VARCHAR(128) NOT NULL,
    product_title TEXT NOT NULL,
    retailer_name VARCHAR(64) NOT NULL,
    seller_name VARCHAR(128),
    selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    expected_commission_pct NUMERIC(5, 2) NOT NULL DEFAULT 3.5,
    projected_earnings_inr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    destination_url TEXT NOT NULL,
    affiliate_url TEXT NOT NULL,
    category VARCHAR(64) DEFAULT 'Electronics',
    referrer_page VARCHAR(128) DEFAULT 'Decision Lab',
    user_agent TEXT,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Aggregated revenue earnings summary table (fast dashboard queries)
CREATE TABLE IF NOT EXISTS public.affiliate_earnings_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_date DATE NOT NULL DEFAULT CURRENT_DATE,
    retailer_name VARCHAR(64) NOT NULL,
    total_clicks INTEGER NOT NULL DEFAULT 0,
    total_gross_order_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_projected_commission NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_affiliate_daily_summary UNIQUE (period_date, retailer_name)
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user ON public.affiliate_click_events(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_retailer ON public.affiliate_click_events(retailer_name);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_date ON public.affiliate_click_events(created_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_summary_date ON public.affiliate_earnings_summary(period_date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.affiliate_click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_earnings_summary ENABLE ROW LEVEL SECURITY;

-- Allow read of own clicks or public aggregate summary
CREATE POLICY "Users can view their own click history"
    ON public.affiliate_click_events
    FOR SELECT
    USING (auth.uid()::text = user_id OR user_id = 'usr_guest_local');

CREATE POLICY "Public can view aggregate earnings summary"
    ON public.affiliate_earnings_summary
    FOR SELECT
    USING (true);

-- Service role full access
CREATE POLICY "Service role full access on affiliate clicks"
    ON public.affiliate_click_events
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access on affiliate summary"
    ON public.affiliate_earnings_summary
    FOR ALL
    USING (true)
    WITH CHECK (true);

