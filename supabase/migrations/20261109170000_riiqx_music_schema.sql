-- =============================================================================
-- RIIQX MUSIC — Isolated Cloud Database Schema & Row-Level Security (RLS)
-- Dedicated to RIIQX Native Android Music Application
-- Isolation: Completely decoupled from main e-commerce and retail tables.
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Music User Profiles (Audiophile settings, bio, streaming preferences)
CREATE TABLE IF NOT EXISTS public.music_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    streaming_quality TEXT DEFAULT 'high' CHECK (streaming_quality IN ('low', 'medium', 'high', 'lossless')),
    equalizer_preset TEXT DEFAULT 'balanced',
    bass_boost_level INTEGER DEFAULT 0 CHECK (bass_boost_level BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Music Playlists
CREATE TABLE IF NOT EXISTS public.music_playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    track_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Music Playlist Tracks
CREATE TABLE IF NOT EXISTS public.music_playlist_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.music_playlists(id) ON DELETE CASCADE,
    track_id TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    duration_ms BIGINT DEFAULT 0 NOT NULL,
    artwork_url TEXT,
    uri TEXT,
    position INTEGER DEFAULT 0 NOT NULL,
    added_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Music Favorites
CREATE TABLE IF NOT EXISTS public.music_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    duration_ms BIGINT DEFAULT 0 NOT NULL,
    artwork_url TEXT,
    uri TEXT,
    favorited_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_music_favorites_user_track UNIQUE (user_id, track_id)
);

-- 5. Music Listening History (Scrobbling & Playback logs)
CREATE TABLE IF NOT EXISTS public.music_listening_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    played_ms BIGINT DEFAULT 0 NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    listened_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Music User Preferences
CREATE TABLE IF NOT EXISTS public.music_user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    offline_cache_enabled BOOLEAN DEFAULT TRUE,
    crossfade_seconds INTEGER DEFAULT 0 CHECK (crossfade_seconds BETWEEN 0 AND 12),
    gapless_playback BOOLEAN DEFAULT TRUE,
    lyrics_sync_enabled BOOLEAN DEFAULT TRUE,
    dynamic_theme_enabled BOOLEAN DEFAULT TRUE,
    sleep_timer_minutes INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Music Connected Streaming Accounts (External providers)
CREATE TABLE IF NOT EXISTS public.music_connected_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('spotify', 'lastfm', 'apple_music', 'youtube_music')),
    provider_account_id TEXT,
    encrypted_access_token TEXT,
    encrypted_refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_music_connected_accounts_user_provider UNIQUE (user_id, provider)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_music_playlists_user ON public.music_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_music_playlist_tracks_playlist ON public.music_playlist_tracks(playlist_id, position);
CREATE INDEX IF NOT EXISTS idx_music_favorites_user ON public.music_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_music_history_user_time ON public.music_listening_history(user_id, listened_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.music_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_connected_accounts ENABLE ROW LEVEL SECURITY;

-- Music Profiles RLS
CREATE POLICY "Users can read own music profile"
    ON public.music_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own music profile"
    ON public.music_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own music profile"
    ON public.music_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Music Playlists RLS (Users see their own or public playlists)
CREATE POLICY "Users can read own and public playlists"
    ON public.music_playlists FOR SELECT
    USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can create own playlists"
    ON public.music_playlists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own playlists"
    ON public.music_playlists FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own playlists"
    ON public.music_playlists FOR DELETE
    USING (auth.uid() = user_id);

-- Music Playlist Tracks RLS
CREATE POLICY "Users can read playlist tracks if playlist is accessible"
    ON public.music_playlist_tracks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.music_playlists
            WHERE public.music_playlists.id = music_playlist_tracks.playlist_id
            AND (public.music_playlists.user_id = auth.uid() OR public.music_playlists.is_public = TRUE)
        )
    );

CREATE POLICY "Users can insert tracks to own playlists"
    ON public.music_playlist_tracks FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.music_playlists
            WHERE public.music_playlists.id = music_playlist_tracks.playlist_id
            AND public.music_playlists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete tracks from own playlists"
    ON public.music_playlist_tracks FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.music_playlists
            WHERE public.music_playlists.id = music_playlist_tracks.playlist_id
            AND public.music_playlists.user_id = auth.uid()
        )
    );

-- Music Favorites RLS
CREATE POLICY "Users can view own favorites"
    ON public.music_favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add own favorites"
    ON public.music_favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own favorites"
    ON public.music_favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Music Listening History RLS
CREATE POLICY "Users can view own history"
    ON public.music_listening_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can record own history"
    ON public.music_listening_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Music Preferences RLS
CREATE POLICY "Users can view own preferences"
    ON public.music_user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON public.music_user_preferences FOR ALL
    USING (auth.uid() = user_id);

-- Music Connected Accounts RLS
CREATE POLICY "Users can manage own connected music accounts"
    ON public.music_connected_accounts FOR ALL
    USING (auth.uid() = user_id);

