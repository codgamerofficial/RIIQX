import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch order with items
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (*)
      `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (orderError) throw orderError;

        return NextResponse.json({ order });
    } catch (error: any) {
        console.error('Order fetch error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch order' },
            { status: 500 }
        );
    }
}
