// =============================================================================
// RIIQX — Autonomous Deal Shorts Scheduled Sweep Cron Route
// GET & POST /api/cron/deal-pipeline
// Triggers background price monitoring sweep and renders 9:16 Shorts for top drops
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { AutonomousDealPipeline } from '@/services/video/autonomous-deal-pipeline';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Validate authorization if CRON_SECRET is configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const urlSecret = new URL(req.url).searchParams.get('key');
      if (urlSecret !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized cron request.' }, { status: 401 });
      }
    }

    const { searchParams } = new URL(req.url);
    const minSavings = Number(searchParams.get('minDrop')) || 10;
    const maxVideos = Number(searchParams.get('maxVideos')) || 3;

    const result = await AutonomousDealPipeline.runAutonomousSweep({
      minSavingsPct: minSavings,
      maxVideosPerRun: maxVideos,
      autoPublish: true,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: any) {
    console.error('[API/Cron/DealPipeline] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Cron sweep failed' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
