// =============================================================================
// LRCLIB Synchronized Lyrics Service for RIIQX Music
// Official API: https://lrclib.net/docs
// =============================================================================

import { LyricLine, Lyrics } from '@/types/music';

const LRC_REGEX = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

export function parseLrcString(lrcContent?: string | null): LyricLine[] {
  if (!lrcContent) return [];
  const lines = lrcContent.split('\n');
  const result: LyricLine[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const match = LRC_REGEX.exec(trimmed);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const millisPart = match[3];
      const millis = millisPart.length === 2 ? parseInt(millisPart, 10) * 10 : parseInt(millisPart, 10);

      const timestampMs = (minutes * 60 + seconds) * 1000 + millis;
      const text = match[4].trim();

      if (text.length > 0) {
        result.push({ timestampMs, text });
      }
    }
  }

  return result.sort((a, b) => a.timestampMs - b.timestampMs);
}

const lyricsCache = new Map<string, Lyrics>();

export async function fetchLyrics(
  trackId: string,
  trackName: string,
  artistName: string,
  albumName: string,
  durationSeconds: number
): Promise<Lyrics> {
  const cacheKey = `${trackName}_${artistName}`.toLowerCase();
  if (lyricsCache.has(cacheKey)) {
    return lyricsCache.get(cacheKey)!;
  }

  try {
    const query = new URLSearchParams({
      track_name: trackName,
      artist_name: artistName,
      album_name: albumName,
      duration: Math.round(durationSeconds).toString(),
    });

    let res = await fetch(`https://lrclib.net/api/get?${query.toString()}`, {
      headers: { 'User-Agent': 'RIIQX-Music-Web/1.0 (https://riiqx.vercel.app)' },
    });

    if (!res.ok) {
      // Fallback: search endpoint
      const searchRes = await fetch(
        `https://lrclib.net/api/search?q=${encodeURIComponent(`${trackName} ${artistName}`)}`,
        { headers: { 'User-Agent': 'RIIQX-Music-Web/1.0 (https://riiqx.vercel.app)' } }
      );
      if (searchRes.ok) {
        const searchItems = await searchRes.json();
        if (Array.isArray(searchItems) && searchItems.length > 0) {
          const item = searchItems[0];
          const parsed = parseLrcString(item.syncedLyrics);
          const lyricsObj: Lyrics = {
            trackId,
            plainLyrics: item.plainLyrics || null,
            syncedLyrics: parsed,
            isSynced: parsed.length > 0,
          };
          lyricsCache.set(cacheKey, lyricsObj);
          return lyricsObj;
        }
      }
      return { trackId, plainLyrics: null, syncedLyrics: [], isSynced: false };
    }

    const data = await res.json();
    const parsed = parseLrcString(data.syncedLyrics);
    const lyricsObj: Lyrics = {
      trackId,
      plainLyrics: data.plainLyrics || null,
      syncedLyrics: parsed,
      isSynced: parsed.length > 0,
    };
    lyricsCache.set(cacheKey, lyricsObj);
    return lyricsObj;
  } catch (err) {
    console.warn('[RIIQX Music] Failed to fetch lyrics from LRCLIB:', err);
    return { trackId, plainLyrics: null, syncedLyrics: [], isSynced: false };
  }
}

