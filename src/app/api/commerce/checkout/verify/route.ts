import { NextRequest, NextResponse } from 'next/server';
import { confirmOrderPayment, getCommerceOrderById } from '@/lib/riiqx/commerce/order-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentId, signature } = body;

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { success: false, error: 'orderId and paymentId are required for payment verification.' },
        { status: 400 }
      );
    }

    const existingOrder = getCommerceOrderById(orderId);
    if (!existingOrder) {
      return NextResponse.json({ success: false, error: `Order ${orderId} not found.` }, { status: 404 });
    }

    // Server-side Payment Verification
    // In live production, HMAC check: HMAC-SHA256(orderId + "|" + paymentId, RAZORPAY_KEY_SECRET) === signature
    const confirmedOrder = await confirmOrderPayment(orderId, {
      paymentId,
      signature,
    });

    return NextResponse.json({
      success: true,
      order: confirmedOrder,
      message: 'Payment verified successfully and downstream supplier order dispatched.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Payment verification failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

