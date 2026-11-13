import { NextRequest, NextResponse } from 'next/server';
import { createPendingOrder } from '@/lib/riiqx/commerce/order-engine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customer = body.customer || {
      fullName: body.shippingAddress?.fullName || body.shippingAddress?.name,
      email: body.shippingAddress?.email || body.email || 'customer@riiqx.com',
      phone: body.shippingAddress?.phone || body.phone,
      addressLine1: body.shippingAddress?.addressLine1 || body.shippingAddress?.address,
      city: body.shippingAddress?.city,
      state: body.shippingAddress?.state || 'West Bengal',
      pincode: body.shippingAddress?.pincode,
    };
    const cartItems = body.cartItems || body.items;
    const paymentMethod = body.paymentMethod;

    if (!customer || !customer.fullName || !customer.phone || !customer.pincode) {
      return NextResponse.json(
        { success: false, error: 'Full customer name, phone, and pincode are required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart must contain at least one item.' },
        { status: 400 }
      );
    }

    // Cash on Delivery is strictly blocked by default in Phase 1 (Zero Capital Rule)
    if (paymentMethod === 'cod') {
      return NextResponse.json(
        {
          success: false,
          error:
            'Cash on Delivery is currently disabled. 100% prepaid checkout (UPI, Card, Netbanking) is required for guaranteed fulfillment.',
        },
        { status: 400 }
      );
    }

    const order = createPendingOrder({
      customer,
      cartItems,
      paymentMethod: paymentMethod || 'upi',
    });

    return NextResponse.json({
      success: true,
      order,
      orderId: order.id,
      totalAmount: order.totalAmount,
      currency: order.currency,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      gstAmount: order.gstAmount,
      status: order.status,
      // In development or sandbox, returns simulated gateway credentials
      sandboxGateway: {
        gatewayKey: 'rzp_test_riiqx_sandbox',
        amountInPaise: Math.round(order.totalAmount * 100),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Checkout initiation failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

