// =============================================================================
// RIIQX — Request Session & Authenticated User Resolver
// Resolves Authenticated User ID Exclusively from Authoritative Supabase SSR
// and Cryptographically Signed Session Tokens
// =============================================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifySessionToken } from '@/lib/riiqx/auth';

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

    // 2. Try Supabase Auth from Request SSR Cookies
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!error && user?.id) {
      return user.id;
    }
  } catch {
    // Supabase validation error
  }

  // 3. Try Cryptographically Verified Session Cookie (signed with mandatory SESSION_SECRET)
  const localToken = req.cookies.get('riiqx_session')?.value;
  if (localToken) {
    const verified = verifySessionToken(localToken);
    if (verified.valid && verified.userId) {
      return verified.userId;
    }
  }

  // Strict Production Auth: Never allow query param ?userId= fallback or hardcoded fallbacks
  return null;
}
