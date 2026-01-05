import { createClient } from "@/lib/supabase/server";
import { getQikinkProducts } from "@/lib/qikink";
import { NextResponse } from "next/server";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        // Use Service Role for Admin Write Access
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = new SupabaseClient<Database>(supabaseUrl, supabaseServiceKey);

        const products = await getQikinkProducts();
        console.log("Fetched Products for Sync:", products.length);
        const results = [];

        for (const p of products) {
            // 1. Manual Upsert Check for Product
            let productData;
            const { data: existingProduct } = await supabase
                .from("products")
                .select("id")
                .eq("title", p.name)
                .single();

            if (existingProduct) {
                // Update
                const { data, error } = await supabase
                    .from("products")
                    // @ts-ignore
                    .update({
                        description: p.description,
                        base_price: p.price,
                        selling_price: p.price,
                        images: p.images,
                        is_active: true
                    })
                    .eq("id", existingProduct.id)
                    .select()
                    .single();
                productData = data;
            } else {
                // Insert
                const { data, error } = await supabase
                    .from("products")
                    // @ts-ignore
                    .insert({
                        title: p.name,
                        description: p.description,
                        base_price: p.price,
                        selling_price: p.price,
                        category: "Apparel",
                        images: p.images,
                        is_active: true
                    })
                    .select()
                    .single();
                productData = data;
            }

            if (!productData) {
                console.error(`Failed to sync product ${p.name}`);
                continue;
            }

            // 2. Manual Upsert for Variants
            for (const v of p.variants) {
                const { data: existingVariant } = await supabase
                    .from("product_variants")
                    .select("id")
                    .eq("sku", v.sku)
                    .single();

                if (existingVariant) {
                    await supabase
                        .from("product_variants")
                        // @ts-ignore
                        .update({
                            stock: v.stock,
                            price_adjustment: 0
                        })
                        .eq("id", existingVariant.id);
                } else {
                    await supabase
                        .from("product_variants")
                        // @ts-ignore
                        .insert({
                            product_id: (productData as any).id,
                            color: v.color,
                            size: v.size,
                            stock: v.stock,
                            sku: v.sku,
                            price_adjustment: 0
                        });
                }
            }

            results.push((productData as any).title);
        }

        return NextResponse.json({ success: true, synced: results });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
