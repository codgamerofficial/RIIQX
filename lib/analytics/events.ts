import posthog from 'posthog-js';

export interface AnalyticsProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  category?: string;
  variantId?: string;
  color?: string;
  size?: string;
}

export function trackViewItem(product: AnalyticsProduct) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture('view_item', {
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      price: product.price,
      currency: 'INR',
      category: product.category || 'Apparel',
    });
  }
}

export function trackAddToCart(product: AnalyticsProduct, quantity = 1) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      variant_id: product.variantId,
      color: product.color,
      size: product.size,
      price: product.price,
      quantity,
      currency: 'INR',
    });
  }
}

export function trackBeginCheckout(itemCount: number, totalAmount: number) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture('begin_checkout', {
      item_count: itemCount,
      total_amount: totalAmount,
      currency: 'INR',
    });
  }
}

export function trackPurchaseComplete(orderNumber: string, totalAmount: number, itemCount: number) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture('purchase_complete', {
      order_number: orderNumber,
      total_amount: totalAmount,
      item_count: itemCount,
      currency: 'INR',
    });
  }
}
