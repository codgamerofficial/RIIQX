import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// RIIQX MUSIC — YouTube Official Music Video Integration API
// Powered by YouTube Data API v3 from environment configuration
// =============================================================================

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || '';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || '';
    const artist = searchParams.get('artist') || '';

    if (!title && !artist) {
      return NextResponse.json({ success: false, error: 'Title or artist required' }, { status: 400 });
    }

    const query = `${title} ${artist} official music video`.trim();
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&maxResults=1&type=video&key=${YOUTUBE_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'YouTube search failed' }, { status: 502 });
    }

    const data = await res.json();
    const item = data.items?.[0];

    if (!item || !item.id?.videoId) {
      return NextResponse.json({ success: false, error: 'No video found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      videoId: item.id.videoId,
      videoTitle: item.snippet?.title,
      thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
      channelTitle: item.snippet?.channelTitle,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

