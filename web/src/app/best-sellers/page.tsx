import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/shop/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Best Sellers | RIIQX",
    description: "Our most popular cinematic apparel.",
};

export const revalidate = 0;

export default async function BestSellersPage() {
    const supabase = await createClient();

    // Fetch products sorted by selling_price/popularity
    // For now using price desc as proxy for "premium/best"
    const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("selling_price", { ascending: false })
        .limit(12);

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
                        BEST <span className="text-primary">SELLERS.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        The gear that defines the movement. Top-rated items chosen by the community.
                    </p>
                </div>

                {error ? (
                    <div className="text-center text-destructive">
                        Error loading products: {error.message}
                    </div>
                ) : products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-muted-foreground text-lg">No best sellers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
