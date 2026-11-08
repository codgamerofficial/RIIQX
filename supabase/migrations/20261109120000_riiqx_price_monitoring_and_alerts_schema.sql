-- =============================================================================
-- RIIQX 2.6 — Price Monitoring, Watchlist Persistence & Alert Events Schema
-- Migration: 20261109120000_riiqx_price_monitoring_and_alerts_schema.sql
-- Zero Simulation • Verified Observations • State-Transition Alert Deduplication • Strict RLS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENHANCE PRICE WATCHLISTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.price_watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_title TEXT NOT NULL,
  product_identifier TEXT NOT NULL,
  target_price NUMERIC(10, 2) NOT NULL,
  initial_price NUMERIC(10, 2) NOT NULL,
  lowest_recorded_price NUMERIC(10, 2) NOT NULL,
  preferred_platform TEXT DEFAULT 'any',
  notification_channel TEXT DEFAULT 'in_app' CHECK (notification_channel IN ('in_app', 'email', 'push')),
  is_active BOOLEAN DEFAULT TRUE,
  last_alerted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Backward-compatible columns for exact variant, leasing, and failure recovery
ALTER TABLE public.price_watchlists ADD COLUMN IF NOT EXISTS product_url TEXT;
ALTER TABLE public.price_watchlists ADD COLUMN IF NOT EXISTS retailer_name TEXT;
ALTER TABLE public.price_watchlists ADD COLUMN IF NOT EXISTS seller_name TEXT;
ALTER TABLE public.price_watchlists ADD COLUMN IF NOT EXISTS variant_attributes JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.price_watchlists ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ;
ALTER TABLE public.price_watchlists ADD COLUMN IF NOT EXISTS monitoring_lease_until TIMESTAMPTZ;
ALTER TABLE public.price_watchlists ADD COLUMN IF NOT EXISTS consecutive_failures INT DEFAULT 0;
ALTER TABLE public.price_watchlists ADD COLUMN IF NOT EXISTS last_error TEXT;
ALTER TABLE public.price_watchlists ADD COLUMN IF NOT EXISTS alert_status TEXT DEFAULT 'monitoring';

CREATE INDEX IF NOT EXISTS idx_watchlist_user ON public.price_watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_active ON public.price_watchlists(is_active);
CREATE INDEX IF NOT EXISTS idx_watchlist_lease ON public.price_watchlists(monitoring_lease_until);
CREATE INDEX IF NOT EXISTS idx_watchlist_last_checked ON public.price_watchlists(last_checked_at);

-- -----------------------------------------------------------------------------
-- 2. ENHANCE PRODUCT PRICE OBSERVATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_price_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_identifier TEXT NOT NULL,
  product_title TEXT NOT NULL,
  platform TEXT NOT NULL,
  observed_price NUMERIC(10, 2) NOT NULL,
  observed_mrp NUMERIC(10, 2) NOT NULL,
  discount_pct NUMERIC(5, 2),
  seller_name TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  coupon_code TEXT,
  coupon_discount NUMERIC(10, 2) DEFAULT 0,
  bank_discount NUMERIC(10, 2) DEFAULT 0,
  source_url TEXT,
  verified_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Backward-compatible columns for evidence-backed price observations
ALTER TABLE public.product_price_observations ADD COLUMN IF NOT EXISTS watchlist_id UUID REFERENCES public.price_watchlists(id) ON DELETE SET NULL;
ALTER TABLE public.product_price_observations ADD COLUMN IF NOT EXISTS variant_attributes JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.product_price_observations ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';
ALTER TABLE public.product_price_observations ADD COLUMN IF NOT EXISTS delivery_charge NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.product_price_observations ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'unknown';
ALTER TABLE public.product_price_observations ADD COLUMN IF NOT EXISTS mandatory_fees NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.product_price_observations ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'provider_reported';
ALTER TABLE public.product_price_observations ADD COLUMN IF NOT EXISTS verification_method TEXT;
ALTER TABLE public.product_price_observations ADD COLUMN IF NOT EXISTS raw_evidence JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_obs_identifier ON public.product_price_observations(product_identifier);
CREATE INDEX IF NOT EXISTS idx_obs_verified ON public.product_price_observations(verified_at DESC);
CREATE INDEX IF NOT EXISTS idx_obs_watchlist ON public.product_price_observations(watchlist_id);

-- -----------------------------------------------------------------------------
-- 3. QUALIFYING PRICE DROP ALERT EVENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.price_drop_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID NOT NULL REFERENCES public.price_watchlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_title TEXT NOT NULL,
  retailer_name TEXT NOT NULL,
  seller_name TEXT,
  previous_price NUMERIC(10, 2) NOT NULL,
  observed_price NUMERIC(10, 2) NOT NULL,
  target_price NUMERIC(10, 2) NOT NULL,
  price_drop_amount NUMERIC(10, 2) NOT NULL,
  price_drop_pct NUMERIC(5, 2) NOT NULL,
  source_url TEXT,
  verification_status TEXT NOT NULL,
  notification_channel TEXT NOT NULL DEFAULT 'in_app',
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'delivered', 'failed')),
  delivery_response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pda_user ON public.price_drop_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_pda_watchlist ON public.price_drop_alerts(watchlist_id);
CREATE INDEX IF NOT EXISTS idx_pda_created ON public.price_drop_alerts(created_at DESC);

-- -----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.price_watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_price_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_drop_alerts ENABLE ROW LEVEL SECURITY;

-- Price Watchlists RLS
DROP POLICY IF EXISTS "Users can view their own watchlists" ON public.price_watchlists;
CREATE POLICY "Users can view their own watchlists"
  ON public.price_watchlists FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can insert their own watchlists" ON public.price_watchlists;
CREATE POLICY "Users can insert their own watchlists"
  ON public.price_watchlists FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can update their own watchlists" ON public.price_watchlists;
CREATE POLICY "Users can update their own watchlists"
  ON public.price_watchlists FOR UPDATE
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can delete their own watchlists" ON public.price_watchlists;
CREATE POLICY "Users can delete their own watchlists"
  ON public.price_watchlists FOR DELETE
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Price Observations RLS (Public read for price history transparency)
DROP POLICY IF EXISTS "Public can view price observations" ON public.product_price_observations;
CREATE POLICY "Public can view price observations"
  ON public.product_price_observations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can insert price observations" ON public.product_price_observations;
CREATE POLICY "Service role can insert price observations"
  ON public.product_price_observations FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Price Drop Alerts RLS
DROP POLICY IF EXISTS "Users can view their own price drop alerts" ON public.price_drop_alerts;
CREATE POLICY "Users can view their own price drop alerts"
  ON public.price_drop_alerts FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can insert price drop alerts" ON public.price_drop_alerts;
CREATE POLICY "Service role can insert price drop alerts"
  ON public.price_drop_alerts FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
