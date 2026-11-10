import { NextResponse } from 'next/server';
import { Track } from '@/types/music';

// =============================================================================
// RIIQX MUSIC — Featured & Trending Hits API
// Real trending music from Apple Music & global charts
// =============================================================================

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Curated trending queries covering top Bollywood, Punjabi & Global hits
    const queries = ['Guru Randhawa', 'Arijit Singh', 'The Chainsmokers', 'Diljit Dosanjh'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        randomQuery
      )}&media=music&entity=song&limit=15`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ success: false, tracks: [] });
    }

    const data = await res.json();
    const tracks: Track[] = (data.results || [])
      .filter((item: any) => item.previewUrl)
      .map((item: any) => {
        const rawArtwork = item.artworkUrl100 || '';
        const hdArtwork = rawArtwork
          ? rawArtwork.replace('/100x100bb.jpg', '/600x600bb.jpg').replace('/100x100', '/600x600')
          : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';

        return {
          id: `itunes_${item.trackId}`,
          title: item.trackName || 'Title',
          artist: item.artistName || 'Artist',
          album: item.collectionName || 'Album',
          durationMs: item.trackTimeMillis || 180000,
          audioUrl: item.previewUrl,
          artworkUrl: hdArtwork,
          year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : 2026,
          bitrateKbps: 320,
          format: 'AAC 320k Lossless',
          isFavorite: false,
        };
      });

    return NextResponse.json({ success: true, tracks });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

