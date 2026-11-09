-- =============================================================================
-- RIIQX — Master Consolidated Production Persistence Migration
-- Migration: 20261109160000_riiqx_production_persistence_consolidation.sql
-- Non-Destructive • Idempotent • Strict RLS • DPDP Act Compliance • Zero Data Loss
-- Preserves Existing User Accounts, Profiles, and Products
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 0. EXTEND PROFILES WITH ROLE COLUMN (Non-Destructive)
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'creator';

-- -----------------------------------------------------------------------------
-- 1. PRICE INTELLIGENCE & WATCHLISTS (For Price Monitoring & Sniper)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.price_watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  target_price NUMERIC(10, 2) NOT NULL,
  initial_price NUMERIC(10, 2) NOT NULL,
  current_price NUMERIC(10, 2) NOT NULL,
  product_url TEXT,
  retailer_name TEXT,
  seller_name TEXT,
  variant_attributes JSONB DEFAULT '{}'::jsonb,
  last_checked_at TIMESTAMPTZ,
  monitoring_lease_until TIMESTAMPTZ,
  consecutive_failures INT DEFAULT 0,
  last_error TEXT,
  alert_status TEXT DEFAULT 'monitoring',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_watchlist_user ON public.price_watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_active ON public.price_watchlists(is_active);
CREATE INDEX IF NOT EXISTS idx_watchlist_lease ON public.price_watchlists(monitoring_lease_until);
CREATE INDEX IF NOT EXISTS idx_watchlist_last_checked ON public.price_watchlists(last_checked_at);

ALTER TABLE public.price_watchlists ENABLE ROW LEVEL SECURITY;

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
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can delete their own watchlists" ON public.price_watchlists;
CREATE POLICY "Users can delete their own watchlists"
  ON public.price_watchlists FOR DELETE
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Price Observations
CREATE TABLE IF NOT EXISTS public.product_price_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID REFERENCES public.price_watchlists(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  retailer TEXT NOT NULL,
  seller_name TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  currency TEXT NOT NULL DEFAULT 'INR',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  evidence_url TEXT,
  evidence_snapshot_id TEXT,
  bank_offers JSONB DEFAULT '[]'::jsonb,
  effective_price NUMERIC(10, 2),
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_observations_product ON public.product_price_observations(product_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_observations_watchlist ON public.product_price_observations(watchlist_id, observed_at DESC);

ALTER TABLE public.product_price_observations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Observations are viewable by authenticated users" ON public.product_price_observations;
CREATE POLICY "Observations are viewable by authenticated users"
  ON public.product_price_observations FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Observations can be recorded by service role" ON public.product_price_observations;
CREATE POLICY "Observations can be recorded by service role"
  ON public.product_price_observations FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Price Drop Alerts
CREATE TABLE IF NOT EXISTS public.price_drop_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID NOT NULL REFERENCES public.price_watchlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  previous_price NUMERIC(10, 2) NOT NULL,
  new_price NUMERIC(10, 2) NOT NULL,
  drop_percentage NUMERIC(5, 2) NOT NULL,
  retailer TEXT NOT NULL,
  deal_url TEXT,
  dispatched_channels TEXT[] DEFAULT '{}',
  dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drop_alerts_user ON public.price_drop_alerts(user_id, dispatched_at DESC);

ALTER TABLE public.price_drop_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own price drop alerts" ON public.price_drop_alerts;
CREATE POLICY "Users can view their own price drop alerts"
  ON public.price_drop_alerts FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- 2. PERSONAL AI TWIN PLATFORM (Profiles, Memories, Goals, Purchases)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.twin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  twin_name TEXT NOT NULL DEFAULT 'RIIQX Twin',
  autonomy_level INT NOT NULL DEFAULT 1 CHECK (autonomy_level BETWEEN 1 AND 3),
  tone TEXT NOT NULL DEFAULT 'pragmatic_analytical' CHECK (tone IN ('pragmatic_analytical', 'warm_supportive', 'direct_concise')),
  budget_tier TEXT NOT NULL DEFAULT 'balanced' CHECK (budget_tier IN ('frugal', 'balanced', 'premium', 'luxury')),
  skin_type TEXT,
  preferred_brands TEXT[] DEFAULT '{}',
  avoid_keywords TEXT[] DEFAULT '{}',
  notification_frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (notification_frequency IN ('daily', 'weekly', 'important_only', 'off')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_twin_profiles_user UNIQUE (user_id)
);

ALTER TABLE public.twin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "twin_profiles_user_manage" ON public.twin_profiles;
CREATE POLICY "twin_profiles_user_manage" ON public.twin_profiles
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_twin_profiles_user_id ON public.twin_profiles(user_id);

-- Twin Memories
CREATE TABLE IF NOT EXISTS public.twin_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('brand', 'budget', 'food', 'lifestyle', 'tech', 'health', 'travel', 'general')),
  memory_text TEXT NOT NULL,
  memory_type TEXT NOT NULL DEFAULT 'confirmed_preference' 
    CHECK (memory_type IN ('confirmed_preference', 'inferred_preference', 'temporary_context', 'unverified_assumption')),
  confidence_score NUMERIC(4,3) NOT NULL DEFAULT 1.000 CHECK (confidence_score BETWEEN 0.000 AND 1.000),
  source_type TEXT NOT NULL DEFAULT 'direct_user_statement' 
    CHECK (source_type IN ('direct_user_statement', 'purchase_analysis', 'user_feedback', 'inferred_pattern')),
  verified_by_user BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.twin_memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "twin_memories_user_manage" ON public.twin_memories;
CREATE POLICY "twin_memories_user_manage" ON public.twin_memories
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_twin_memories_user_active ON public.twin_memories(user_id, is_active);

-- Twin Goals
CREATE TABLE IF NOT EXISTS public.twin_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'purchase_budget' CHECK (category IN ('purchase_budget', 'savings_milestone', 'brand_ban', 'habit_change', 'custom')),
  target_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.twin_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "twin_goals_user_manage" ON public.twin_goals;
CREATE POLICY "twin_goals_user_manage" ON public.twin_goals
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_twin_goals_user ON public.twin_goals(user_id, status);

-- Purchase Analyses
CREATE TABLE IF NOT EXISTS public.purchase_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  retailer TEXT,
  brand TEXT,
  product_url TEXT,
  category TEXT,
  recommendation TEXT NOT NULL CHECK (recommendation IN ('buy_now', 'wait_for_drop', 'skip', 'alternative_suggested')),
  alignment_score INT NOT NULL CHECK (alignment_score BETWEEN 0 AND 100),
  reasoning TEXT NOT NULL,
  tradeoffs TEXT[] DEFAULT '{}',
  alternative_products JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.purchase_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "purchase_analyses_user_manage" ON public.purchase_analyses;
CREATE POLICY "purchase_analyses_user_manage" ON public.purchase_analyses
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_purchase_analyses_user ON public.purchase_analyses(user_id, created_at DESC);

-- Opportunities
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('deal', 'coupon', 'cashback', 'credit_card_offer', 'loyalty')),
  provider TEXT NOT NULL,
  source_url TEXT NOT NULL,
  terms TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat', 'cashback', 'free_shipping')),
  discount_value NUMERIC(10, 2) NOT NULL,
  minimum_order_value NUMERIC(10, 2),
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified', 'expired')),
  last_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "opportunities_select" ON public.opportunities;
CREATE POLICY "opportunities_select" ON public.opportunities
  FOR SELECT TO authenticated
  USING (true);

-- Weekly Digests
CREATE TABLE IF NOT EXISTS public.weekly_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  summary TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  delivered_via TEXT[] DEFAULT '{}',
  delivered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.weekly_digests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "weekly_digests_user_manage" ON public.weekly_digests;
CREATE POLICY "weekly_digests_user_manage" ON public.weekly_digests
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- 3. REWARD ACCOUNTS & REVENUE CONVERSIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reward_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  available_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  pending_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  lifetime_earned NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_reward_accounts_user UNIQUE (user_id)
);

ALTER TABLE public.reward_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reward_accounts_user_manage" ON public.reward_accounts;
CREATE POLICY "reward_accounts_user_manage" ON public.reward_accounts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Reward Ledger
CREATE TABLE IF NOT EXISTS public.reward_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('credit', 'debit', 'hold', 'release')),
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  reason TEXT NOT NULL,
  partner_verification_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reward_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reward_ledger_user_manage" ON public.reward_ledger;
CREATE POLICY "reward_ledger_user_manage" ON public.reward_ledger
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Affiliate Conversions
CREATE TABLE IF NOT EXISTS public.affiliate_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id TEXT NOT NULL,
  sub_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  sale_amount NUMERIC(10, 2) NOT NULL,
  commission_amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.affiliate_conversions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "affiliate_conversions_user_manage" ON public.affiliate_conversions;
CREATE POLICY "affiliate_conversions_user_manage" ON public.affiliate_conversions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- 4. CONNECTED SOCIAL ACCOUNTS & PUBLISHING JOBS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.connected_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('youtube', 'instagram', 'facebook', 'whatsapp', 'threads', 'tiktok', 'twitter', 'linkedin')),
  platform_account_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_handle TEXT,
  avatar_url TEXT,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'expired', 'error', 'revoked', 'permission_required')),
  platform_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  token_expires_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ DEFAULT NOW(),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_provider_account UNIQUE (user_id, provider, platform_account_id)
);

ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "connected_accounts_user_manage" ON public.connected_accounts;
CREATE POLICY "connected_accounts_user_manage" ON public.connected_accounts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE TABLE IF NOT EXISTS public.oauth_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connected_account_id UUID NOT NULL REFERENCES public.connected_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  encrypted_access_token TEXT NOT NULL,
  encrypted_refresh_token TEXT,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  encryption_version TEXT NOT NULL DEFAULT 'v1-aes-256-gcm',
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_oauth_credentials_account UNIQUE (connected_account_id)
);

ALTER TABLE public.oauth_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "oauth_credentials_user_manage" ON public.oauth_credentials;
CREATE POLICY "oauth_credentials_user_manage" ON public.oauth_credentials
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE TABLE IF NOT EXISTS public.social_publishing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT,
  connected_account_id UUID REFERENCES public.connected_accounts(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'facebook', 'whatsapp', 'threads', 'tiktok', 'twitter', 'linkedin')),
  title TEXT NOT NULL,
  caption TEXT NOT NULL,
  media_url TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'uploading', 'processing', 'published', 'failed', 'cancelled')),
  scheduled_for TIMESTAMPTZ,
  platform_media_id TEXT,
  platform_permalink TEXT,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  processing_logs JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.social_publishing_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "social_publishing_jobs_user_manage" ON public.social_publishing_jobs;
CREATE POLICY "social_publishing_jobs_user_manage" ON public.social_publishing_jobs
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE TABLE IF NOT EXISTS public.social_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  provider TEXT NOT NULL,
  account_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.social_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "social_audit_logs_user_manage" ON public.social_audit_logs;
CREATE POLICY "social_audit_logs_user_manage" ON public.social_audit_logs
  FOR ALL TO authenticated
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

