// =============================================================================
// RIIQX — Outbound Affiliate Click & Revenue Attribution API Route
// GET & POST /api/twin/affiliate/click
// Tracks real user purchase intent, enriches partner affiliate tags, redirects safely
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { AffiliateSmartRouter } from '@/services/product-intelligence/affiliate-router';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // If dashboard query requested, return earnings metrics
    if (searchParams.get('dashboard') === 'true') {
      const userId = await resolveAuthUserId(req);
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
      }
      const dashboard = await AffiliateSmartRouter.getEarningsDashboard(userId);
      return NextResponse.json({ success: true, dashboard });
    }

    const rawUrl = searchParams.get('url');
    const retailer = searchParams.get('retailer') || 'Verified Store';
    const title = searchParams.get('title') || 'Product Listing';
    const price = Number(searchParams.get('price')) || 0;
    const identifier = searchParams.get('id') || title.slice(0, 32);

    if (!rawUrl) {
      return NextResponse.json({ error: 'Missing destination URL parameter.' }, { status: 400 });
    }

    const userId = await resolveAuthUserId(req);
    const clickEvent = await AffiliateSmartRouter.recordOutboundClick({
      userId: userId || undefined,
      productIdentifier: identifier,
      productTitle: title,
      retailerName: retailer,
      sellingPrice: price,
      destinationUrl: rawUrl,
      referrerPage: req.headers.get('referer') || 'Decision Lab',
      userAgent: req.headers.get('user-agent') || undefined,
    });

    const acceptHeader = req.headers.get('accept') || '';
    if (acceptHeader.includes('application/json')) {
      return NextResponse.json({
        success: true,
        affiliateUrl: clickEvent.affiliateUrl,
        projectedEarningsINR: clickEvent.projectedEarningsINR,
        commissionPct: clickEvent.expectedCommissionPct,
      });
    }

    // Direct HTTP 302 Redirect to the merchant store with affiliate tags
    return NextResponse.redirect(clickEvent.affiliateUrl, 302);
  } catch (err: any) {
    console.error('[API/AffiliateClick] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to process affiliate redirect' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await resolveAuthUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }
    const body = await req.json();

    const {
      productIdentifier,
      productTitle,
      retailerName,
      sellerName,
      sellingPrice,
      destinationUrl,
      category,
      referrerPage,
    } = body;

    if (!destinationUrl || !productTitle) {
      return NextResponse.json(
        { success: false, error: 'Destination URL and product title are required' },
        { status: 400 }
      );
    }

    const clickEvent = await AffiliateSmartRouter.recordOutboundClick({
      userId,
      productIdentifier: productIdentifier || productTitle.slice(0, 32),
      productTitle,
      retailerName: retailerName || 'Verified Store',
      sellerName,
      sellingPrice: Number(sellingPrice) || 0,
      destinationUrl,
      category,
      referrerPage: referrerPage || 'Decision Lab',
      userAgent: req.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({
      success: true,
      clickEvent,
      affiliateUrl: clickEvent.affiliateUrl,
      projectedEarningsINR: clickEvent.projectedEarningsINR,
      commissionPct: clickEvent.expectedCommissionPct,
    });
  } catch (err: any) {
    console.error('[API/AffiliateClick] POST Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to record affiliate click' },
      { status: 500 }
    );
  }
}

