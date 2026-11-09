// =============================================================================
// RIIQX — User Profile Management Service
// Authoritative Supabase Database Persistence (public.profiles)
// Zero Ephemeral Local Filesystem State • Production Durable
// =============================================================================

import { getServiceSupabase } from '@/lib/supabase/server';

export interface RiiqxProfile {
  id: string;
  email?: string;
  displayName: string;
  avatarUrl?: string;
  preferredLanguage: 'en' | 'bn' | 'hi';
  role: 'creator' | 'developer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

/**
 * Retrieves a user's profile from public.profiles by their Supabase Auth User ID
 */
export async function getUserProfile(userId: string): Promise<RiiqxProfile | null> {
  if (!userId || typeof userId !== 'string') return null;

  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          displayName: data.display_name || 'RIIQX User',
          avatarUrl: data.avatar_url || undefined,
          preferredLanguage: (data.preferred_language as 'en' | 'bn' | 'hi') || 'en',
          role: 'creator',
          createdAt: data.created_at || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString(),
        };
      }
    } catch (err) {
      console.error('[Profiles] Error fetching profile from Supabase:', err);
    }
  }

  return null;
}

/**
 * Creates or updates a user profile directly in public.profiles table in Supabase
 */
export async function upsertUserProfile(profile: {
  id: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  preferredLanguage?: 'en' | 'bn' | 'hi';
  role?: 'creator' | 'developer' | 'admin';
}): Promise<RiiqxProfile> {
  const now = new Date().toISOString();
  const existing = await getUserProfile(profile.id);

  const merged: RiiqxProfile = {
    id: profile.id,
    email: profile.email || existing?.email,
    displayName: profile.displayName || existing?.displayName || profile.email?.split('@')[0] || 'RIIQX User',
    avatarUrl: profile.avatarUrl || existing?.avatarUrl,
    preferredLanguage: profile.preferredLanguage || existing?.preferredLanguage || 'en',
    role: profile.role || existing?.role || 'creator',
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { error } = await (supabase as any).from('profiles').upsert(
        {
          id: merged.id,
          display_name: merged.displayName,
          avatar_url: merged.avatarUrl || null,
          preferred_language: merged.preferredLanguage,
          updated_at: now,
        },
        { onConflict: 'id' }
      );

      if (error) {
        console.error('[Profiles] Supabase upsert error:', error.message);
      }
    } catch (err) {
      console.error('[Profiles] Unexpected error upserting profile:', err);
    }
  }

  return merged;
}

/**
 * Ensures a profile exists for an authenticated user, creating one if absent
 */
export async function ensureUserProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}): Promise<RiiqxProfile> {
  const existing = await getUserProfile(user.id);
  if (existing) {
    return existing;
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.display_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'RIIQX User';

  const avatarUrl = user.user_metadata?.avatar_url || undefined;
  const preferredLanguage = user.user_metadata?.preferred_language || 'en';

  return await upsertUserProfile({
    id: user.id,
    email: user.email,
    displayName,
    avatarUrl,
    preferredLanguage,
    role: 'creator',
  });
}
