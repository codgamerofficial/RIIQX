import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/shop/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Arrivals | RIIQX",
    description: "The latest drops from RIIQX.",
};

export const revalidate = 0;

export default async function NewArrivalsPage() {
    const supabase = await createClient();

    // Fetch newest products
    const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(12);

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <div className="inline-block px-3 py-1 mb-4 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
                        Just Dropped
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
                        NEW <span className="text-primary">ARRIVALS.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Fresh from the lab. Be the first to wear the future.
                    </p>
                </div>

                {error ? (
                    <div className="text-center text-destructive">
                        Error loading products: {error.message}
                    </div>
                ) : products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-muted-foreground text-lg">No new products found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
