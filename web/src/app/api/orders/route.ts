import { createServerClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { items, shippingAddress, paymentMethod, totalAmount, discountAmount, shippingAmount } = await request.json();

        // Verify user is authenticated
        const supabase = await createServerClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Generate order number
        const orderNumber = `RIIQX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order in database
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                order_number: orderNumber,
                status: 'pending',
                total_amount: totalAmount,
                discount_amount: discountAmount || 0,
                shipping_amount: shippingAmount || 0,
                payment_method: paymentMethod,
                payment_status: 'pending',
                shipping_address: shippingAddress,
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.id,
            variant_id: item.variantId,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            image_url: item.image,
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                orderNumber: order.order_number,
                total: order.total_amount,
            },
        });
    } catch (error: any) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}
