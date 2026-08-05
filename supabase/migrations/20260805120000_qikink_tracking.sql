-- ====================================================================
-- RIIQX DB MIGRATION: QIKINK LOGS & SHIPPING TRACKING
-- Migration File: supabase/migrations/20260805120000_qikink_tracking.sql
-- ====================================================================

-- 1. Add Carrier Tracking Columns to Orders Table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS carrier_name TEXT,
  ADD COLUMN IF NOT EXISTS tracking_url TEXT,
  ADD COLUMN IF NOT EXISTS estimated_delivery_date TIMESTAMPTZ;

-- 2. Create Idempotency Tracking Table for Webhooks
CREATE TABLE IF NOT EXISTS public.processed_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL DEFAULT 'qikink',
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on processed_webhooks
ALTER TABLE public.processed_webhooks ENABLE ROW LEVEL SECURITY;

-- Service Role / Webhook Route access policy
DROP POLICY IF EXISTS "Admins and Service Role can read/write webhooks" ON public.processed_webhooks;
CREATE POLICY "Admins and Service Role can read/write webhooks"
  ON public.processed_webhooks
  FOR ALL USING (public.is_admin());

-- 3. Create Qikink Sync Audit Logs Table
CREATE TABLE IF NOT EXISTS public.qikink_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  request_payload JSONB,
  response_payload JSONB,
  status_code INT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast order log lookups in Admin Dashboard
CREATE INDEX IF NOT EXISTS idx_qikink_sync_logs_order ON public.qikink_sync_logs(order_id);

-- Enable RLS on qikink_sync_logs
ALTER TABLE public.qikink_sync_logs ENABLE ROW LEVEL SECURITY;

-- Only Admins can view Qikink logs
DROP POLICY IF EXISTS "Admins can view Qikink sync logs" ON public.qikink_sync_logs;
CREATE POLICY "Admins can view Qikink sync logs"
  ON public.qikink_sync_logs
  FOR ALL USING (public.is_admin());
