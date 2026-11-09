// =============================================================================
// RIIQX — Profile Management API Route Handler
// Handles Profile Updates with Supabase Row Level Security (RLS)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile, upsertUserProfile } from '@/lib/riiqx/profiles';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    const supabase = await createClient();
    let user: any = null;

    if (bearerToken) {
      const { data, error } = await supabase.auth.getUser(bearerToken);
      if (!error && data?.user) {
        user = data.user;
      }
    }

    if (!user) {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        user = data.user;
      }
    }

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const profile = await getUserProfile(user.id);
    return NextResponse.json({ success: true, profile });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching profile';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization') || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    const supabase = await createClient();
    let user: any = null;

    if (bearerToken) {
      const { data, error } = await supabase.auth.getUser(bearerToken);
      if (!error && data?.user) {
        user = data.user;
      }
    }

    if (!user) {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        user = data.user;
      }
    }

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { displayName, avatarUrl, preferredLanguage, role } = body;

    const updated = await upsertUserProfile({
      id: user.id,
      displayName,
      avatarUrl,
      preferredLanguage,
      role,
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating profile';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
