// =============================================================================
// RIIQX — Request Session & Authenticated User Resolver
// Resolves Authenticated User ID Exclusively from Authoritative Supabase SSR
// Zero Local In-Memory / Ephemeral Bypass • Server-Side Validation
// =============================================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function resolveAuthUserId(req: NextRequest): Promise<string | null> {
  // 1. Try Authorization Header Bearer Token via Supabase Auth
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  try {
    const supabase = await createClient();

    if (bearerToken) {
      const { data: { user }, error } = await supabase.auth.getUser(bearerToken);
      if (!error && user?.id) {
        return user.id;
      }
    }

    // 2. Authoritative Supabase Auth from Request SSR Cookies
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!error && user?.id) {
      return user.id;
    }
  } catch {
    // Supabase validation error
  }

  // Strict Supabase Auth Authority:
  // Never authenticate simply because a custom cookie exists.
  // Never allow query param ?userId= fallback or hardcoded fallbacks.
  return null;
}
