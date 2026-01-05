import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/shop/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Accessories | RIIQX",
    description: "Completing the look.",
};

export const revalidate = 0;

export default async function AccessoriesPage() {
    const supabase = await createClient();

    // Filter by Accessories category
    const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("category", "Accessories"); // Ensure "Accessories" matches DB case

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2">
                        ACCESSORIES
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Details matter. Upgrade your loadout.
                    </p>
                </div>

                {error ? (
                    <div className="text-center text-destructive">
                        Error loading products: {error.message}
                    </div>
                ) : products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
                        <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
                        <p className="text-muted-foreground">We are currently restocking our accessories collection.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
