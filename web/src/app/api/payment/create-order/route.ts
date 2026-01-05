import { createClient } from "@/lib/supabase/server";
import { createCashfreeOrder } from "@/lib/cashfree";
import { NextResponse } from "next/server";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        // Use Service Role to allow Guest (and User) Order Creation bypassing RLS
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = new SupabaseClient<Database>(supabaseUrl, supabaseServiceKey);

        // We still need to know who the user is, if any.
        // But since we are using Service Role, auth.getUser() won't work directly on this client 
        // because it doesn't have the user's token.
        // We need a separate client for Auth check IF we want to link the user.

        // Let's get the user ID from the request headers/cookies separately if needed,
        // OR just rely on the client passing the user ID? No, that's insecure.

        // CORRECT APPROACH:
        // 1. Get User using standard server client (safe).
        const standardClient = await createClient();
        const { data: { user } } = await standardClient.auth.getUser();

        // 2. Perform DB operations using Admin client (bypasses RLS).

        const body = await req.json();
        const { orderAmount, customerName, customerPhone, customerEmail } = body;

        // 1. Create Order in Supabase
        const { data: order, error: orderError } = await supabase
            .from("orders")
            // @ts-ignore
            .insert({
                user_id: user?.id || null, // Guest checkout supported
                total_amount: orderAmount,
                status: "pending",
                shipping_address: body.shippingAddress,
                payment_method: "cashfree",
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Create Order in Cashfree
        const cashfreeOrder = await createCashfreeOrder({
            order_id: (order as any).id,
            order_amount: orderAmount,
            order_currency: "INR",
            customer_details: {
                customer_id: user?.id || `guest_${Date.now()}`,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                customer_name: customerName,
            },
            order_meta: {
                // Cashfree Prod requires HTTPS. Fallback for Localhost.
                return_url: process.env.NODE_ENV === "development"
                    ? `https://example.com/checkout/success?order_id={order_id}`
                    : `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id={order_id}`,
                notify_url: process.env.NODE_ENV === "development"
                    ? `https://example.com/api/payment/webhook`
                    : `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
            },
        });

        // 3. Update Supabase with Payment Session ID (optional but good for debugging)
        await supabase
            .from("orders")
            // @ts-ignore
            .update({ payment_id: cashfreeOrder.payment_session_id })
            .eq("id", (order as any).id);

        return NextResponse.json({
            payment_session_id: cashfreeOrder.payment_session_id,
            order_id: (order as any).id,
        });
    } catch (error: any) {
        console.error("Payment Creation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
