// =============================================================================
// RIIQX — Scheduled Price Monitoring Worker Trigger API Route
// POST /api/twin/price-sniper/check
// Bounded Batch Execution • Lease Locking • Idempotent Observations & Alerting
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { PriceMonitoringService } from '@/services/product-intelligence/price-monitoring-service';

export async function POST(req: NextRequest) {
  try {
    // Cron authorization check (if CRON_SECRET is configured in server env)
    const expectedSecret = process.env.CRON_SECRET;
    if (expectedSecret) {
      const authHeader = req.headers.get('authorization') || '';
      const secretHeader = req.headers.get('x-cron-secret') || '';
      const isAuthorized =
        authHeader === `Bearer ${expectedSecret}` || secretHeader === expectedSecret;

      if (!isAuthorized) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Invalid cron authorization token.' },
          { status: 401 }
        );
      }
    }

    const url = new URL(req.url);
    const batchSize = parseInt(url.searchParams.get('limit') || '5', 10);

    const result = await PriceMonitoringService.executeScheduledMonitoringBatch(
      Math.min(20, Math.max(1, batchSize))
    );

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (err: any) {
    console.error('[API/PriceSniper/Check] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Scheduled price monitoring execution failed.' },
      { status: 500 }
    );
  }
}
