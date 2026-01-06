
import { createClient } from "@supabase/supabase-js";
import { getQikinkProducts } from "../src/lib/qikink";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// FORCE PRODUCTION for debugging
process.env.QIKINK_ENV = "production";
process.env.QIKINK_CLIENT_ID = "787412766423348";
process.env.QIKINK_CLIENT_SECRET = "92d9f220fa5d8388212c8f325b16edc7d4d5741d79344467b2b87406faba6750";

async function runSync() {
    console.log("Starting Manual Sync...");
    console.log("QIKINK_ENV:", process.env.QIKINK_ENV);

    try {
        const products = await getQikinkProducts();
        console.log("Fetched Products:", products.length);

        if (products.length === 0) {
            console.log("No products found. Exiting.");
            return;
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        for (const p of products) {
            console.log(`Syncing: ${p.id} - ${p.name}`);

            // 1. Upsert Product
            const { data: existingProduct, error: fetchError } = await supabase
                .from("products")
                .select("id")
                .eq("title", p.name)
                .single();

            let productId;

            if (existingProduct) {
                const { error } = await supabase
                    .from("products")
                    // @ts-ignore
                    .update({
                        description: p.description,
                        base_price: p.price,
                        selling_price: p.price,
                        images: p.images,
                        is_active: true
                    })
                    // @ts-ignore
                    .eq("id", existingProduct.id);
                if (error) console.error("Update Error:", error);

                // @ts-ignore
                productId = existingProduct.id;
            } else {
                const { data: newPro, error } = await supabase
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
                if (error) console.error("Insert Error:", error);
                // @ts-ignore
                productId = newPro?.id;
            }

            if (!productId) continue;

            // 2. Upsert Variants
            for (const v of p.variants) {
                const { data: existingVariant } = await supabase
                    .from("product_variants")
                    .select("id")
                    .eq("sku", v.sku)
                    .single();

                if (existingVariant) {
                    await supabase.from("product_variants").update({ stock: v.stock }).eq("id", (existingVariant as any).id);
                } else {
                    await supabase.from("product_variants").insert({
                        product_id: productId,
                        color: v.color,
                        size: v.size,
                        stock: v.stock,
                        sku: v.sku,
                        price_adjustment: 0
                    });
                }
            }
        }
        console.log("Sync Complete!");

    } catch (error) {
        console.error("Sync Failed:", error);
    }
}

runSync();
