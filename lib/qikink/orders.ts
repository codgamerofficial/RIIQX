import { createClient } from '@/lib/supabase/server';
import { qikinkClient, type QikinkOrderPayload } from '@/lib/qikink/client';

export interface DispatchQikinkOrderParams {
  orderId: string;
  orderNumber: string;
  items: {
    qikinkVariantId: string;
    quantity: number;
    frontDesignUrl?: string;
    backDesignUrl?: string;
  }[];
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentType?: 'Prepaid' | 'COD';
}

/**
 * Pushes paid customer order directly to Qikink Print-on-Demand Fulfillment API
 */
export async function pushOrderToQikink(paramsOrOrderId: DispatchQikinkOrderParams | string) {
  const supabase = await createClient();

  let orderId: string;
  let orderNumber: string;
  let items: DispatchQikinkOrderParams['items'] = [];
  let shippingAddress: DispatchQikinkOrderParams['shippingAddress'];
  let paymentType: 'Prepaid' | 'COD' = 'Prepaid';

  if (typeof paramsOrOrderId === 'string') {
    orderId = paramsOrOrderId;

    // Fetch order details from Supabase database
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      throw new Error(`Order ${orderId} not found in database.`);
    }

    orderNumber = order.order_number;
    const addr = (order.shipping_address as any) || {};

    shippingAddress = {
      fullName: addr.fullName || addr.first_name || 'RIIQX Customer',
      email: addr.email || 'orders@riiqx.com',
      phone: addr.phone || '9999999999',
      addressLine1: addr.addressLine1 || addr.address1 || 'Line 1',
      addressLine2: addr.addressLine2 || addr.address2 || '',
      city: addr.city || 'New Delhi',
      state: addr.state || 'Delhi',
      pincode: addr.pincode || '110001',
    };

    items = (order.order_items || []).map((i: any) => ({
      qikinkVariantId: i.product_variant_id || `QKV_${i.id}`,
      quantity: i.quantity,
    }));
  } else {
    orderId = paramsOrOrderId.orderId;
    orderNumber = paramsOrOrderId.orderNumber;
    items = paramsOrOrderId.items;
    shippingAddress = paramsOrOrderId.shippingAddress;
    paymentType = paramsOrOrderId.paymentType || 'Prepaid';
  }

  const nameParts = shippingAddress.fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || 'RIIQX';

  const payload: QikinkOrderPayload = {
    order_number: orderNumber,
    payment_type: paymentType,
    order_items: items.map((i) => ({
      qikink_variant_id: i.qikinkVariantId,
      quantity: i.quantity,
      front_design_url: i.frontDesignUrl,
      back_design_url: i.backDesignUrl,
    })),
    shipping_address: {
      first_name: firstName,
      last_name: lastName,
      address1: shippingAddress.addressLine1,
      address2: shippingAddress.addressLine2 || '',
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.pincode,
      phone: shippingAddress.phone,
      email: shippingAddress.email,
    },
  };

  let responsePayload: any = null;
  let qikinkOrderId: string | null = null;
  let statusCode = 200;
  let errorMessage: string | null = null;

  try {
    const res = await qikinkClient.createOrder(payload);
    responsePayload = res.data || res;
    statusCode = res.status_code || (res.success ? 200 : 400);

    if (res.success && res.qikink_order_id) {
      qikinkOrderId = res.qikink_order_id;

      // Update Supabase order status to processing
      await supabase
        .from('orders')
        .update({
          qikink_order_id: qikinkOrderId,
          status: 'processing',
        })
        .eq('id', orderId);
    } else {
      errorMessage = res.message || 'Missing qikink_order_id in response';
    }
  } catch (err: any) {
    statusCode = 500;
    errorMessage = err.message || 'Network exception during Qikink dispatch';
  }

  // Write Audit Log Entry to qikink_sync_logs
  try {
    await supabase.from('qikink_sync_logs').insert({
      entity_type: 'order',
      entity_id: orderId,
      qikink_reference_id: qikinkOrderId,
      status: errorMessage ? 'failed' : 'success',
      payload: responsePayload as any,
      error_message: errorMessage,
    });
  } catch {
    // Ignore logging write failures in offline dev environment
  }

  if (errorMessage) {
    throw new Error(`Qikink Push Failed: ${errorMessage}`);
  }

  return { success: true, qikinkOrderId };
}
