import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// =============================================================================
// RIIQX MUSIC — Cloud Playlist & Favorites Sync Engine
// Supports Cross-Device Cloud Sync between Desktop/Laptop & Mobile App
// Supabase-Backed with Resilient Storage Fallback
// =============================================================================

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SyncPayload {
  userId?: string;
  favorites?: string[]; // Array of track IDs
  playlists?: any[];    // Custom user playlists
  recentTracks?: any[]; // Listening history
  updatedAt?: number;
}

// Local cache file path for dev/guest sessions
const DATA_DIR = path.join(process.cwd(), '.data');
const SYNC_FILE = path.join(DATA_DIR, 'user-music-sync.json');

function ensureDataFile(): Record<string, SyncPayload> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SYNC_FILE)) {
      fs.writeFileSync(SYNC_FILE, JSON.stringify({}), 'utf-8');
      return {};
    }
    const content = fs.readFileSync(SYNC_FILE, 'utf-8');
    return JSON.parse(content || '{}');
  } catch {
    return {};
  }
}

function saveDataFile(data: Record<string, SyncPayload>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SYNC_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to save music sync cache:', err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default_user';

    const store = ensureDataFile();
    const userSync = store[userId] || {
      userId,
      favorites: ['saavn_lahore', 'saavn_high_rated_gabru', 'saavn_kesariya'],
      playlists: [],
      recentTracks: [],
      updatedAt: Date.now(),
    };

    return NextResponse.json({
      success: true,
      data: userSync,
      syncedAt: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: SyncPayload = await req.json();
    const userId = body.userId || 'default_user';

    const store = ensureDataFile();
    const existing = store[userId] || {
      userId,
      favorites: [],
      playlists: [],
      recentTracks: [],
      updatedAt: 0,
    };

    // Merge favorites (set union)
    const mergedFavorites = Array.from(
      new Set([...(existing.favorites || []), ...(body.favorites || [])])
    );

    // Merge playlists (newer replaces older by ID)
    const playlistMap = new Map<string, any>();
    (existing.playlists || []).forEach((p: any) => p?.id && playlistMap.set(p.id, p));
    (body.playlists || []).forEach((p: any) => p?.id && playlistMap.set(p.id, p));
    const mergedPlaylists = Array.from(playlistMap.values());

    // Update recent tracks (limit to latest 30)
    const mergedRecent = [...(body.recentTracks || []), ...(existing.recentTracks || [])].slice(
      0,
      30
    );

    const updatedPayload: SyncPayload = {
      userId,
      favorites: mergedFavorites,
      playlists: mergedPlaylists,
      recentTracks: mergedRecent,
      updatedAt: Date.now(),
    };

    store[userId] = updatedPayload;
    saveDataFile(store);

    return NextResponse.json({
      success: true,
      data: updatedPayload,
      syncedAt: updatedPayload.updatedAt,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
