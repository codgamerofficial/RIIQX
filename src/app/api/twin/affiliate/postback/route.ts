// =============================================================================
// RIIQX — Affiliate Conversion Attribution Postback / Webhook Route
// POST & GET /api/twin/affiliate/postback
// Ingests verified partner conversions, orders, returns, and settled payouts
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { AffiliateSmartRouter } from '@/services/product-intelligence/affiliate-router';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const secretHeader = req.headers.get('x-affiliate-secret') || '';
    const configuredSecret = process.env.AFFILIATE_WEBHOOK_SECRET || process.env.CRON_SECRET;

    if (configuredSecret && authHeader !== `Bearer ${configuredSecret}` && secretHeader !== configuredSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized conversion query' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const conversions = await AffiliateSmartRouter.getConversionHistory(userId);

    return NextResponse.json({
      success: true,
      totalConversions: conversions.length,
      conversions,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve conversions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const secretHeader = req.headers.get('x-affiliate-secret') || '';
    const configuredSecret = process.env.AFFILIATE_WEBHOOK_SECRET || process.env.CRON_SECRET;

    // Verify webhook authenticity if secret is configured
    if (configuredSecret && authHeader !== `Bearer ${configuredSecret}` && secretHeader !== configuredSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized postback webhook' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      retailerName,
      orderId,
      orderAmountINR,
      commissionAmountINR,
      commissionRatePct,
      status,
      partnerSource,
      clickId,
      userId,
      transactionTimestamp,
      settledAt,
    } = body;

    if (!retailerName || !orderId || orderAmountINR === undefined || commissionAmountINR === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Required fields: retailerName, orderId, orderAmountINR, commissionAmountINR',
        },
        { status: 400 }
      );
    }

    const conversion = await AffiliateSmartRouter.recordConversionPostback({
      clickId,
      userId,
      retailerName,
      orderId,
      orderAmountINR: Number(orderAmountINR),
      commissionAmountINR: Number(commissionAmountINR),
      commissionRatePct: Number(commissionRatePct) || 0,
      status: status || 'approved',
      partnerSource: partnerSource || 'direct_partner_webhook',
      transactionTimestamp,
      settledAt,
    });

    return NextResponse.json({
      success: true,
      conversionId: conversion.id,
      orderId: conversion.orderId,
      status: conversion.status,
      commissionAmountINR: conversion.commissionAmountINR,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to record conversion postback' },
      { status: 500 }
    );
  }
}

