// =============================================================================
// RIIQX — Active User Session Route Handler
// Returns Authenticated Identity & Profile Verified Exclusively from Supabase SSR
// Zero Fake Fallback Identity • Server-Side Cryptographic Validation
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile, ensureUserProfile } from '@/lib/riiqx/profiles';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    const supabase = await createClient();
    let user: any = null;
    let authError: any = null;

    if (bearerToken) {
      const { data, error } = await supabase.auth.getUser(bearerToken);
      user = data?.user;
      authError = error;
    } else {
      const { data, error } = await supabase.auth.getUser();
      user = data?.user;
      authError = error;
    }

    if (!authError && user) {
      let profile = await getUserProfile(user.id);
      if (!profile) {
        profile = await ensureUserProfile({
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
        });
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: profile?.displayName || user.email?.split('@')[0] || 'RIIQX User',
          role: profile?.role || 'creator',
          createdAt: user.created_at,
          avatarUrl: profile?.avatarUrl,
        },
        profile,
        provider: 'supabase',
      });
    }

    // Fail closed: User is not authenticated in Supabase
    return NextResponse.json({
      authenticated: false,
      user: null,
      profile: null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Session verification error';
    return NextResponse.json(
      {
        authenticated: false,
        error: msg,
      },
      { status: 500 }
    );
  }
}
