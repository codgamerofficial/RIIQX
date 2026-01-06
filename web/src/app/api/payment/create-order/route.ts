import { createClient } from "@/lib/supabase/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { NextResponse } from "next/server";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = new SupabaseClient<Database>(supabaseUrl, supabaseServiceKey);

        const standardClient = await createClient();
        const { data: { user } } = await standardClient.auth.getUser();

        const body = await req.json();
        const { orderAmount, customerName, customerPhone, customerEmail, shippingAddress } = body;

        // 1. Create Order in Supabase
        const { data: order, error: orderError } = await supabase
            .from("orders")
            // @ts-ignore
            .insert({
                user_id: user?.id || null, // Guest checkout supported
                total_amount: orderAmount,
                status: "pending",
                shipping_address: shippingAddress,
                payment_method: "razorpay",
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Create Order in Razorpay
        const razorpayOrder = await createRazorpayOrder(orderAmount);

        // 3. Update Supabase with Payment ID
        await supabase
            .from("orders")
            // @ts-ignore
            .update({ payment_id: razorpayOrder.id })
            .eq("id", (order as any).id);

        return NextResponse.json({
            id: razorpayOrder.id,
            amount: razorpayOrder.amount, // in paise
            currency: razorpayOrder.currency,
            order_id: (order as any).id, // Supabase Order ID
        });
    } catch (error: any) {
        console.error("Payment Creation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
