// =============================================================================
// RIIQX — Autonomous Faceless Deal Shorts API Route
// POST & GET /api/twin/deal-shorts/generate
// Generates viral 9:16 Shorts/Reels video with verified affiliate attribution
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { DealShortsVideoFactory, DealShortsRequest } from '@/services/video/deal-shorts-factory';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit')) || 20;

    const history = await DealShortsVideoFactory.getHistory(limit);

    return NextResponse.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (err: any) {
    console.error('[API/DealShorts] GET Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch deal shorts history' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const body = await req.json();

    const {
      productTitle,
      productIdentifier,
      retailerName,
      originalPrice,
      lowestPrice,
      productImageUrl,
      productUrl,
      category,
      language,
      theme,
      autoPublish,
      targetPlatform,
    } = body;

    if (!productTitle || !retailerName || !productUrl) {
      return NextResponse.json(
        { success: false, error: 'Product title, retailer name, and product URL are required.' },
        { status: 400 }
      );
    }

    const origPrice = Number(originalPrice) || Number(lowestPrice) || 1000;
    const lowPrice = Number(lowestPrice) || origPrice;

    const requestParams: DealShortsRequest = {
      productTitle,
      productIdentifier,
      retailerName,
      originalPrice: origPrice,
      lowestPrice: lowPrice,
      productImageUrl,
      productUrl,
      category,
      language: language || 'en',
      theme: theme || 'obsidian_emerald',
      autoPublish: Boolean(autoPublish),
      targetPlatform: targetPlatform || 'all',
      userId,
    };

    const shortResult = await DealShortsVideoFactory.generateDealShort(requestParams);

    return NextResponse.json({
      success: true,
      dealShort: shortResult,
      videoUrl: shortResult.videoUrl,
      thumbnailUrl: shortResult.thumbnailUrl,
      affiliateUrl: shortResult.affiliateUrl,
      projectedCommissionINR: shortResult.projectedCommissionINR,
    });
  } catch (err: any) {
    console.error('[API/DealShorts] POST Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate deal short video' },
      { status: 500 }
    );
  }
}

