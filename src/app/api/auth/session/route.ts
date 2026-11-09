// =============================================================================
// RIIQX — Active User Session Route Handler
// Returns Authenticated Identity & Profile Verified Exclusively from Supabase SSR
// Zero Fake Fallback Identity • Server-Side Cryptographic Validation
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getUserProfile, ensureUserProfile } from '@/lib/riiqx/profiles';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ojtngzqsrdralrhipjzt.supabase.co';
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdG5nenFzcmRyYWxyaGlwanp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzODA1NzcsImV4cCI6MjEwNjk1NjU3N30.TuZdeSyZpWSYJmUz6VP3EJPduM9t5dxeV1rPQrrnMko';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    let user: any = null;
    let authError: any = null;

    if (bearerToken && anonKey) {
      const client = createSupabaseClient(supabaseUrl, anonKey);
      const { data, error } = await client.auth.getUser(bearerToken);
      user = data.user;
      authError = error;
    }

    if (!user) {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();
      user = data.user;
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
