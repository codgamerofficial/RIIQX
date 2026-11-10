import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// RIIQX MUSIC — 320kbps Audio Download & Offline Stream Proxy
// Pipes cross-origin CDN media with proper attachment headers for 1-click download
// =============================================================================

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const audioUrl = searchParams.get('url');
    const rawFileName = searchParams.get('name') || 'RIIQX_Track';

    if (!audioUrl || !audioUrl.startsWith('http')) {
      return NextResponse.json({ error: 'Valid audio URL required' }, { status: 400 });
    }

    const cleanFileName = rawFileName.replace(/[^a-zA-Z0-9_\-\. ]/g, '').trim() || 'Track';

    const cdnRes = await fetch(audioUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!cdnRes.ok || !cdnRes.body) {
      return NextResponse.json({ error: 'Failed to stream audio file' }, { status: 502 });
    }

    const headers = new Headers();
    headers.set('Content-Type', cdnRes.headers.get('content-type') || 'audio/mpeg');
    headers.set('Content-Disposition', `attachment; filename="${cleanFileName}.mp3"`);
    if (cdnRes.headers.get('content-length')) {
      headers.set('Content-Length', cdnRes.headers.get('content-length')!);
    }

    return new Response(cdnRes.body, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

