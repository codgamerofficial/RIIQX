import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { Database } from "@/types/database.types";

export const revalidate = 0; // Ensure fresh data on every request

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const category = resolvedSearchParams.category as string | undefined;
    const sort = resolvedSearchParams.sort as string | undefined;
    const queryParam = resolvedSearchParams.q as string | undefined;

    const supabase = await createClient();

    let query = supabase.from("products").select("*").eq("is_active", true);

    if (category && category !== "All") {
        query = query.eq("category", category);
    }

    if (queryParam) {
        query = query.ilike("title", `%${queryParam}%`);
    }

    if (sort === "newest") {
        query = query.order("created_at", { ascending: false });
    } else if (sort === "best_selling") {
        // Mock logic: assuming we have a sales_count or just random/popularity
        // For now, let's sort by price desc as a proxy for "premium" or created_at
        query = query.order("selling_price", { ascending: false });
    } else if (sort === "price_low") {
        query = query.order("selling_price", { ascending: true });
    } else if (sort === "price_high") {
        query = query.order("selling_price", { ascending: false });
    }

    const { data: products, error } = await query;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-2 uppercase">
                        {queryParam ? `Results for "${queryParam}"` : category || sort?.replace("_", " ") || "Collection"}
                    </h1>
                    <p className="text-muted-foreground">
                        {products?.length} items found
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <ProductFilters />

                    {/* Grid */}
                    <div className="flex-1">
                        {error ? (
                            <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
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
                                <p className="text-muted-foreground text-lg">No products found in this category.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
