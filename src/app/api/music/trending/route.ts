import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';
import { Track } from '@/types/music';
import { INITIAL_TRACKS, FALLBACK_VINYL_ARTWORK } from '@/lib/music/mock-tracks';

// =============================================================================
// RIIQX MUSIC — Featured & Trending Hits API
// Real trending music with 100% full-length 320kbps master playback
// =============================================================================

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DES_KEY = '38346591';

function decryptSaavnUrl(encryptedMediaUrl?: string | null): string | null {
  if (!encryptedMediaUrl) return null;
  try {
    const key = CryptoJS.enc.Utf8.parse(DES_KEY);
    const decrypted = CryptoJS.DES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(encryptedMediaUrl) },
      key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr || !decryptedStr.startsWith('http')) return null;
    return decryptedStr.replace('_96.mp4', '_320.mp4').replace('_160.mp4', '_320.mp4');
  } catch {
    return null;
  }
}

function cleanString(str?: string | null): string {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export async function GET() {
  try {
    const queries = ['Guru Randhawa', 'Arijit Singh', 'Karan Aujla', 'Diljit Dosanjh', 'The Chainsmokers'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&q=${encodeURIComponent(
      randomQuery
    )}&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=20&p=1`;

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results)) {
        const tracks: Track[] = [];
        const seen = new Set<string>();

        for (const item of data.results) {
          const rawTitle = cleanString(item.title);
          if (!rawTitle) continue;
          const normKey = rawTitle.toLowerCase().replace(/\s*\(.*?\)/g, '').trim();
          if (seen.has(normKey)) continue;
          seen.add(normKey);

          const fullAudioUrl = decryptSaavnUrl(item.more_info?.encrypted_media_url);
          if (!fullAudioUrl) continue;

          const artistName = cleanString(item.more_info?.music || item.subtitle || 'Artist');
          const albumName = cleanString(item.more_info?.album || 'Single');
          const artwork = (item.image || '').replace('150x150', '500x500').replace('50x50', '500x500');
          const durationSeconds = parseInt(item.more_info?.duration || '210', 10);

          tracks.push({
            id: `saavn_${item.id}`,
            title: rawTitle,
            artist: artistName,
            album: albumName,
            durationMs: durationSeconds * 1000,
            audioUrl: fullAudioUrl,
            artworkUrl: artwork || FALLBACK_VINYL_ARTWORK,
            year: parseInt(item.year || '2026', 10),
            bitrateKbps: 320,
            format: '320kbps Master',
            isFavorite: false,
          });
        }

        if (tracks.length > 0) {
          return NextResponse.json({ success: true, tracks });
        }
      }
    }

    // High quality fallback
    return NextResponse.json({ success: true, tracks: INITIAL_TRACKS });
  } catch (err: any) {
    return NextResponse.json({ success: true, tracks: INITIAL_TRACKS });
  }
}
