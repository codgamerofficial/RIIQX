import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import type { OrderStatus } from '@/types/database.types';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-qikink-signature');
    const secret = process.env.QIKINK_WEBHOOK_SECRET || '';

    // 1. Signature Verification
    if (secret && process.env.NODE_ENV === 'production') {
      const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (signature !== computedSignature) {
        return NextResponse.json(
          { success: false, error: 'Invalid HMAC signature' },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const { event_id, event_type, qikink_order_id, tracking_details } = payload;

    const supabase = await createClient();

    // 2. Idempotency Shield Check via processed_webhooks
    if (event_id) {
      const { data: existingEvent } = await supabase
        .from('processed_webhooks')
        .select('id')
        .eq('event_id', event_id)
        .single();

      if (existingEvent) {
        // Return 200 immediately to stop duplicate retries
        return NextResponse.json(
          { success: true, message: 'Event already processed' },
          { status: 200 }
        );
      }
    }

    // 3. Status Mapping & Database Update
    let newStatus: OrderStatus = 'processing';
    const trackingNumber = tracking_details?.awb_number || tracking_details?.tracking_number || null;
    const carrierName = tracking_details?.courier_name || tracking_details?.carrier_name || null;
    const trackingUrl = tracking_details?.tracking_url || null;

    switch (event_type) {
      case 'ORDER_PRINTED':
        newStatus = 'printed';
        break;
      case 'ORDER_DISPATCHED':
      case 'ORDER_SHIPPED':
        newStatus = 'shipped';
        break;
      case 'ORDER_DELIVERED':
        newStatus = 'delivered';
        break;
      case 'ORDER_CANCELLED':
        newStatus = 'cancelled';
        break;
    }

    const updatePayload: any = { status: newStatus };
    if (trackingNumber) updatePayload.tracking_number = trackingNumber;
    if (carrierName) updatePayload.carrier_name = carrierName;
    if (trackingUrl) updatePayload.tracking_url = trackingUrl;

    const { error: updateErr } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('qikink_order_id', qikink_order_id);

    if (updateErr) {
      return NextResponse.json(
        { success: false, error: updateErr.message },
        { status: 500 }
      );
    }

    // 4. Mark Event as Processed in Idempotency Table
    if (event_id) {
      await supabase.from('processed_webhooks').insert({
        event_id,
        provider: 'qikink',
      });
    }

    return NextResponse.json({ success: true, status: newStatus }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Webhook internal error' },
      { status: 500 }
    );
  }
}
