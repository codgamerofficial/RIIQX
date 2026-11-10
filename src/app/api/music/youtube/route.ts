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
    let videoId: string | null = null;
    let videoTitle = `${title} - ${artist}`;
    let thumbnailUrl = '';
    let channelTitle = 'YouTube Music';

    // 1. Try official YouTube Data API v3 if API key is configured
    if (YOUTUBE_API_KEY) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query
        )}&maxResults=1&type=video&key=${YOUTUBE_API_KEY}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const item = data.items?.[0];
          if (item?.id?.videoId) {
            videoId = item.id.videoId;
            videoTitle = item.snippet?.title || videoTitle;
            thumbnailUrl = item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '';
            channelTitle = item.snippet?.channelTitle || channelTitle;
          }
        }
      } catch (e) {
        console.warn('YouTube Data API error, falling back:', e);
      }
    }

    // 2. Fallback: Direct public YouTube search parser (zero-quota dependency)
    if (!videoId) {
      try {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        const scrapeRes = await fetch(searchUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          },
        });
        if (scrapeRes.ok) {
          const html = await scrapeRes.text();
          const match = html.match(/"videoId":"([a-zA-Z0-9_\-]{11})"/);
          if (match && match[1]) {
            videoId = match[1];
            thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
          }
        }
      } catch (scrapeErr) {
        console.warn('Direct YouTube scrape fallback error:', scrapeErr);
      }
    }

    if (!videoId) {
      return NextResponse.json({ success: false, error: 'No video found for track' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      videoId,
      videoTitle,
      thumbnailUrl,
      channelTitle,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

