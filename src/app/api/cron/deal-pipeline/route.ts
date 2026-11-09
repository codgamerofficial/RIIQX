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
    const authHeader = req.headers.get('authorization') || '';
    const xCronSecret = req.headers.get('x-cron-secret') || '';
    const cronSecret = process.env.CRON_SECRET;

    // Strict Cron Security: CRON_SECRET is mandatory in production environment
    if (!cronSecret) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: CRON_SECRET environment variable is required to execute deal pipeline sweeps.' },
        { status: 500 }
      );
    }

    const isBearerValid = authHeader === `Bearer ${cronSecret}`;
    const isHeaderValid = xCronSecret === cronSecret;

    if (!isBearerValid && !isHeaderValid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or missing CRON_SECRET authorization.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const minSavings = Number(searchParams.get('minDrop')) || 10;
    const maxVideos = Number(searchParams.get('maxVideos')) || 3;
    const autoPublish =
      searchParams.get('autoPublish') === 'true' && process.env.AUTONOMOUS_PUBLISHING === 'true';

    const result = await AutonomousDealPipeline.runAutonomousSweep({
      minSavingsPct: minSavings,
      maxVideosPerRun: maxVideos,
      autoPublish,
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

