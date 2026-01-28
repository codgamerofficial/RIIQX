import { getProducts } from "@/lib/shopify";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Product } from "@/lib/shopify/types";
import { ShopClient } from "@/components/shop/ShopClient";

export const revalidate = 0; // No cache - always fetch fresh data

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const sort = resolvedSearchParams.sort as string | undefined;
    const queryParam = resolvedSearchParams.q as string | undefined;
    const categoryParam = resolvedSearchParams.category as string | undefined;
    const genderParam = resolvedSearchParams.gender as string | undefined;

    const colorParam = resolvedSearchParams.color as string | undefined;
    const sizeParam = resolvedSearchParams.size as string | undefined;
    const minPriceParam = resolvedSearchParams.min_price as string | undefined;
    const maxPriceParam = resolvedSearchParams.max_price as string | undefined;

    // Map query params to Shopify sort keys
    let sortKey: 'TITLE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING' | undefined = 'CREATED_AT';
    let reverse = false;

    if (sort === "newest") {
        sortKey = 'CREATED_AT';
        reverse = true;
    } else if (sort === "best_selling") {
        sortKey = 'BEST_SELLING';
        reverse = false;
    } else if (sort === "price_low") {
        sortKey = 'PRICE';
        reverse = false;
    } else if (sort === "price_high") {
        sortKey = 'PRICE';
        reverse = true;
    }

    const cursor = resolvedSearchParams.cursor as string | undefined;

    // Construct the Shopify query
    // We append conditions using AND
    // Using wildcards (*) for flexible matching (case-insensitive in some fields)
    let queryParts: string[] = [];

    if (queryParam) queryParts.push(`title:*${queryParam}*`); // Wildcard search on title

    if (genderParam) {
        // Assuming products are tagged with 'Men', 'Women', 'Unisex'
        // We capitalize it to match standard conventions if needed, or just exact match
        queryParts.push(`tag:${genderParam}`);
    }

    if (categoryParam) {
        // Handle multi-word types (e.g. "t-shirts" -> "t-shirts")
        // Adding wildcards helps with partials
        queryParts.push(`product_type:*${categoryParam.replace(/-/g, ' ')}*`);
    }

    // Note: Filtering by variant_title works for now but relies on titles containing the option value (e.g. "Red / L")
    // A more robust way is using tags if they are synced (e.g. "color:Red"), but standard setup uses variant titles.
    if (colorParam) queryParts.push(`variant_title:*${colorParam}*`);
    if (sizeParam) queryParts.push(`variant_title:*${sizeParam}*`);

    if (minPriceParam) queryParts.push(`price:>=${minPriceParam}`);
    if (maxPriceParam) queryParts.push(`price:<=${maxPriceParam}`);

    const shopifyQuery = queryParts.join(" AND ");

    const { products, pageInfo } = await getProducts({
        sortKey,
        reverse,
        query: shopifyQuery,
        after: cursor
    });

    // --- Aggregation Step ---
    // Extract available filters (Types, Colors, Sizes) from a larger batch to show what's possible
    // Fetch all products for filter aggregation (46 products total)
    // Fetch collections for sidebar
    const { products: allProducts } = await getProducts({ limit: 10 }); // Reduced limit for simpler fetch
    // Actually we need getCollections() here.
    const collections = await import("@/lib/shopify").then(mod => mod.getCollections());

    // Extract available filters (Types, Colors, Sizes) from a larger batch to show what's possible
    const availableTypes = Array.from(new Set(allProducts.map(p => p.productType).filter(Boolean)));
    const prices = allProducts.flatMap(p => [
        parseFloat(p.priceRange.minVariantPrice.amount),
        parseFloat(p.priceRange.maxVariantPrice.amount)
    ]);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 1000;


    return (
        <div className="min-h-screen bg-[#0B0B0B] pt-32 pb-24">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* @ts-ignore */}
                <ShopClient
                    initialProductCount={products.length}
                    queryParam={queryParam}
                    categoryParam={categoryParam}
                    // @ts-ignore
                    collections={collections}
                />

                {/* Grid & View Toggle */}
                <div className="w-full">
                    {products.length > 0 ? (
                        <>
                            <ProductGrid products={products} />

                            {/* Pagination */}
                            {pageInfo?.hasNextPage && (
                                <div className="flex justify-center mt-24">
                                    <a
                                        href={`?cursor=${pageInfo?.endCursor}${sort ? `&sort=${sort}` : ''}${queryParam ? `&q=${queryParam}` : ''}${categoryParam ? `&category=${categoryParam}` : ''}`}
                                        className="px-8 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                    >
                                        Load More
                                    </a>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10">
                            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">No products found.</p>
                            <a href="/shop" className="text-white font-bold underline mt-4 text-sm">Clear Filters</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
