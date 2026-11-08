// =============================================================================
// RIIQX — Festive Price Drop Sniper API Route
// GET & POST /api/twin/price-sniper
// Supabase-Backed Persistence • Authenticated User Ownership • Evidence-Backed Tracking
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { FestiveDropSniperService } from '@/services/product-intelligence/festive-drop-sniper';

export async function GET(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const report = await FestiveDropSniperService.getDashboardReport(userId);
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: any) {
    console.error('[API/PriceSniper] GET Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve price sniper dashboard' },
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
      currentPrice,
      targetPrice,
      productUrl,
      retailerName,
      sellerName,
      variantAttributes,
      preferredBank,
    } = body;

    if (!productTitle || !currentPrice || !targetPrice) {
      return NextResponse.json(
        { success: false, error: 'Product title, current price, and target price are required' },
        { status: 400 }
      );
    }

    const item = await FestiveDropSniperService.addSniperTarget(
      {
        productTitle: String(productTitle),
        currentPrice: Number(currentPrice),
        targetPrice: Number(targetPrice),
        productUrl: productUrl ? String(productUrl) : undefined,
        retailerName: retailerName ? String(retailerName) : undefined,
        sellerName: sellerName ? String(sellerName) : undefined,
        variantAttributes: variantAttributes || {},
        preferredBank: preferredBank ? String(preferredBank) : undefined,
      },
      userId
    );

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (err: any) {
    console.error('[API/PriceSniper] POST Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to register sniper target' },
      { status: 500 }
    );
  }
}
