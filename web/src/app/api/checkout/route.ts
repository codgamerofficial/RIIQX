import { createShopifyCheckout } from '@/lib/shopify/checkout';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { items } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items provided' }, { status: 400 });
        }

        // Convert cart items to Shopify line items
        const lineItems = items.map((item: any) => ({
            variantId: item.variantId || item.id,
            quantity: item.quantity,
        }));

        // Create Shopify checkout
        const checkout = await createShopifyCheckout(lineItems);

        return NextResponse.json({
            checkoutId: checkout.id,
            checkoutUrl: checkout.webUrl,
        });
    } catch (error: any) {
        console.error('Checkout creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout' },
            { status: 500 }
        );
    }
}
