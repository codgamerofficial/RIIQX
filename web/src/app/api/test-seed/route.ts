import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function GET() {
    // Attempt to use Service Role for bypassing RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = new SupabaseClient<Database>(supabaseUrl, supabaseServiceKey);

    // Check if products exist
    const { count } = await supabase.from("products").select("*", { count: "exact", head: true });

    if (count && count > 0) {
        return NextResponse.json({ message: "Products already exist", count });
    }

    // Insert Product
    const { data: product, error: prodError } = await supabase
        .from("products")
        // @ts-ignore
        .insert({
            title: "Cyberpunk Hoodie",
            description: "High-tech streetwear for the modern runner.",
            base_price: 89.99,
            selling_price: 89.99,
            category: "Hoodies",
            images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800"],
            is_active: true,
        })
        .select()
        .single();

    if (prodError) return NextResponse.json({ error: prodError.message }, { status: 500 });

    // Insert Variant
    const { error: matchError } = await supabase
        .from("product_variants")
        // @ts-ignore
        .insert({
            product_id: (product as any).id,
            color: "Neon Black",
            size: "L",
            stock: 50,
            sku: "CYBER-HOOD-BLK-L",
        });

    if (matchError) return NextResponse.json({ error: matchError.message }, { status: 500 });

    return NextResponse.json({ message: "Seeded test product", product });
}
