import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://scqnqibmjgkhkrepuort.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Real-time listener for automated Qikink product & inventory sync updates
 */
export function subscribeToQikinkProductSync(onSyncCallback: (payload: any) => void) {
  return supabase
    .channel('qikink-sync-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      (payload) => onSyncCallback(payload)
    )
    .subscribe();
}
