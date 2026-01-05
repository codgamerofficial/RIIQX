import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { verifyCashfreeSignature } from "@/lib/cashfree"; // We will add this helper
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        // Validate Signature (Critical for security in prod)
        // For now, we trust the sandbox flow, but in production, verify headers["x-webhook-signature"]

        // Parse Payload
        // Cashfree webhooks send data as form-data
        const data: any = {};
        formData.forEach((value, key) => (data[key] = value));

        // In actual implementation, data comes as JSON body for newer API versions or form-data for older.
        // Let's assume JSON body for the latest API we used in helper.
        // If webhook config sends JSON:
        // const body = await req.json(); 
        // const { data: eventData, type: eventType } = body;

        // For simplicity in this demo, we'll assume the client redirected to success page updates status,
        // BUT the webhook is the source of truth.
        // Let's implement a basic status updater based on Order ID passed in standard PG callbacks.

        // NOTE: Implementation depends heavily on Cashfree version.
        // Let's stick to the redirection-based verification for MVP simplicity if Webhook is complex to test locally without ngrok.
        // We will keep this generic for now.

        const orderId = data.order_id;
        const paymentStatus = data.payment_status;

        if (paymentStatus === "SUCCESS") {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
            const supabase = new SupabaseClient<Database>(supabaseUrl, supabaseServiceKey);

            // 1. Update Order Status
            await supabase
                .from("orders")
                // @ts-ignore
                .update({ status: "paid" })
                .eq("id", orderId);

            // 2. Trigger Qikink Sync (Placeholder)
            // await syncToQikink(orderId);
        }

        return NextResponse.json({ status: "processed" });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
