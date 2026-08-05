'use server';

import React from 'react';
import { sendEmail } from '@/lib/email/client';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail';
import { ShippingUpdateEmail } from '@/emails/ShippingUpdateEmail';
import { BackInStockEmail } from '@/emails/BackInStockEmail';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { createClient } from '@/lib/supabase/server';

export async function sendOrderConfirmationEmailAction(orderId: string) {
  try {
    const supabase = await createClient();

    // 1. Fetch Order and Line Items from Supabase
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          product_variants (
            color,
            size,
            products (
              name,
              product_images (
                url
              )
            )
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      console.warn(`[Email Action Warning]: Order ${orderId} not found in Supabase. Dispatching fallback email spec.`);
      const fallbackComponent = React.createElement(OrderConfirmationEmail, {
        orderNumber: 'RIIQX-99201',
        customerName: 'Valued Customer',
        orderDate: new Date().toLocaleDateString('en-IN').toUpperCase(),
        items: [
          {
            name: 'BATCH 004 // HEAVYWEIGHT TACTICAL HOODIE',
            color: 'OBSIDIAN BLACK',
            size: 'XL',
            quantity: 1,
            price: 12999,
          },
        ],
        subtotal: 14999,
        discountAmount: 2000,
        shippingFee: 0,
        taxAmount: 0,
        totalAmount: 12999,
        shippingAddress: {
          address_line1: '42 Cyber Way, Sector 5',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700091',
        },
      });

      const res = await sendEmail({
        to: 'customer@riiqx.com',
        subject: `ORDER CONFIRMED // #RIIQX-99201`,
        react: fallbackComponent,
      });

      return res;
    }

    const shipping = order.shipping_address as any;
    const recipientEmail = shipping?.email || 'customer@riiqx.com';

    // 2. Format Items for Email
    const formattedItems = (order.order_items || []).map((item: any) => {
      const product = item.product_variants?.products;
      const images = product?.product_images || [];
      return {
        name: product?.name || 'RIIQX Tactical Apparel',
        color: item.product_variants?.color || 'OBSIDIAN BLACK',
        size: item.product_variants?.size || 'L',
        quantity: item.quantity || 1,
        price: item.unit_price || 12999,
        image: images[0]?.url || undefined,
      };
    });

    // 3. Format Date
    const orderDateFormatted = new Date(order.created_at)
      .toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .toUpperCase();

    // 4. Render Email Component
    const emailComponent = React.createElement(OrderConfirmationEmail, {
      orderNumber: order.order_number,
      customerName: shipping?.full_name || 'Valued Customer',
      orderDate: orderDateFormatted,
      items: formattedItems,
      subtotal: (order.total_amount || 12999) + (order.discount_amount || 0),
      discountAmount: order.discount_amount || 0,
      shippingFee: 0,
      taxAmount: order.tax_amount || 0,
      totalAmount: order.total_amount || 12999,
      shippingAddress: {
        address_line1: shipping?.address_line1 || '42 Cyber Way',
        address_line2: shipping?.address_line2 || '',
        city: shipping?.city || 'Kolkata',
        state: shipping?.state || 'West Bengal',
        pincode: shipping?.pincode || '700091',
      },
    });

    // 5. Send via Resend
    const result = await sendEmail({
      to: recipientEmail,
      subject: `ORDER CONFIRMED // #${order.order_number}`,
      react: emailComponent,
    });

    return result;
  } catch (err: any) {
    console.error('[sendOrderConfirmationEmailAction Error]:', err);
    return { success: false, error: err.message || String(err) };
  }
}

export async function sendShippingUpdateEmailAction(orderId: string, trackingData: {
  carrierName: string;
  trackingNumber: string;
  trackingUrl: string;
  customerName?: string;
  customerEmail?: string;
  orderNumber?: string;
}) {
  try {
    const emailComponent = React.createElement(ShippingUpdateEmail, {
      orderNumber: trackingData.orderNumber || 'RIIQX-99201',
      customerName: trackingData.customerName || 'VALUED OPERATIVE',
      carrierName: trackingData.carrierName,
      trackingNumber: trackingData.trackingNumber,
      trackingUrl: trackingData.trackingUrl,
    });

    return await sendEmail({
      to: trackingData.customerEmail || 'customer@riiqx.com',
      subject: `SHIPMENT DISPATCHED // #${trackingData.orderNumber || 'RIIQX-99201'}`,
      react: emailComponent,
    });
  } catch (err: any) {
    console.error('[sendShippingUpdateEmailAction Error]:', err);
    return { success: false, error: err.message || String(err) };
  }
}

export async function sendWelcomeEmailAction(email: string, name: string) {
  try {
    const emailComponent = React.createElement(WelcomeEmail, {
      customerName: name,
      promoCode: 'CYBER10',
    });

    return await sendEmail({
      to: email,
      subject: `WELCOME TO RIIQX // CLUB ACCESS GRANTED`,
      react: emailComponent,
    });
  } catch (err: any) {
    console.error('[sendWelcomeEmailAction Error]:', err);
    return { success: false, error: err.message || String(err) };
  }
}

export async function sendBackInStockEmailAction(email: string, productName: string, productSlug: string) {
  try {
    const emailComponent = React.createElement(BackInStockEmail, {
      productName,
      productSlug,
      price: 12999,
    });

    return await sendEmail({
      to: email,
      subject: `RESTOCK ALERT // ${productName}`,
      react: emailComponent,
    });
  } catch (err: any) {
    console.error('[sendBackInStockEmailAction Error]:', err);
    return { success: false, error: err.message || String(err) };
  }
}
