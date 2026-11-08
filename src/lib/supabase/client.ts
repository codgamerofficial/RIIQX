// =============================================================================
// RIIQX — Supabase Browser Client (SSR-Compatible)
// Uses @supabase/ssr createBrowserClient with Cookie-Backed Sessions
// Public Anon Access Only • Never exposes Service Role Key
// =============================================================================

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ojtngzqsrdralrhipjzt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdG5nenFzcmRyYWxyaGlwanp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzODA1NzcsImV4cCI6MjEwNjk1NjU3N30.TuZdeSyZpWSYJmUz6VP3EJPduM9t5dxeV1rPQrrnMko';

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
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Singleton instance for client components
export const supabase = createClient();
