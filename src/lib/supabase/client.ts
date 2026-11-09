// =============================================================================
// RIIQX — Supabase Browser Client (SSR-Compatible)
// Uses @supabase/ssr createBrowserClient with Cookie-Backed Sessions
// Public Anon Access Only • Never exposes Service Role Key • Fail-Closed
// =============================================================================

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database.types';

function getBrowserSupabaseConfig(): { supabaseUrl: string; supabaseAnonKey: string } {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'FATAL CONFIGURATION ERROR: Supabase browser environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are required. Client must fail closed.'
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return false;
  return (
    !url.includes('your-project') &&
    !url.includes('mock.supabase.co') &&
    !anonKey.includes('mock-anon-key')
  );
};

export const createClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getBrowserSupabaseConfig();
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Singleton instance for client components (guarded against runtime unconfigured state)
export const supabase = isSupabaseConfigured() ? createClient() : (null as any);
