// =============================================================================
// RIIQX — Master Authentication API Route Handler
// Authoritative Supabase Auth Integration • Server-Side Validation
// Zero Local In-Memory / Ephemeral Bypass • Fail-Closed Production Security
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
      const profile = await getUserProfile(user.id);
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: profile?.displayName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'RIIQX User',
          role: profile?.role || 'creator',
          createdAt: user.created_at,
          avatarUrl: profile?.avatarUrl,
        },
        profile,
        provider: 'supabase',
      });
    }

    // Strictly Unauthenticated (Never authenticate simply because a cookie exists)
    return NextResponse.json({
      authenticated: false,
      user: null,
      profile: null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Session verification error';
    return NextResponse.json({ authenticated: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, email, password, name } = body;

    // -------------------------------------------------------------------------
    // ACTION: SIGNOUT
    // -------------------------------------------------------------------------
    if (action === 'signout') {
      const supabase = await createClient();
      await supabase.auth.signOut();
      const res = NextResponse.json({ success: true, message: 'Signed out successfully' });
      res.cookies.delete('riiqx_session');
      return res;
    }

    // -------------------------------------------------------------------------
    // ACTION: DEMO LOGIN (EXPLICITLY REJECTED)
    // -------------------------------------------------------------------------
    if (action === 'demo_login') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Demo login bypass has been removed for production security.' },
        { status: 403 }
      );
    }

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = await createClient();

    // -------------------------------------------------------------------------
    // ACTION: REGISTER
    // -------------------------------------------------------------------------
    if (action === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: name || normalizedEmail.split('@')[0],
            display_name: name || normalizedEmail.split('@')[0],
          },
        },
      });

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      }

      if (!data.user) {
        return NextResponse.json(
          { success: false, error: 'Registration failed: No user returned by authoritative provider.' },
          { status: 500 }
        );
      }

      const profile = await ensureUserProfile({
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      });

      const requiresConfirmation = !data.session;

      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile.displayName,
          role: profile.role,
          createdAt: data.user.created_at,
        },
        requiresConfirmation,
        provider: 'supabase',
      });
    }

    // -------------------------------------------------------------------------
    // ACTION: LOGIN
    // -------------------------------------------------------------------------
    if (action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error || !data.user) {
        return NextResponse.json(
          { success: false, error: error?.message || 'Invalid email or password.' },
          { status: 401 }
        );
      }

      const profile = await ensureUserProfile({
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile.displayName || data.user.email?.split('@')[0],
          role: profile.role,
          createdAt: data.user.created_at,
          avatarUrl: profile.avatarUrl,
        },
        provider: 'supabase',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid auth action' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Auth error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
