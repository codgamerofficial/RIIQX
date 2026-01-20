import { getProducts } from "@/lib/shopify";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Product } from "@/lib/shopify/types";
import { SortSelect } from "@/components/shop/SortSelect";

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
    let queryParts: string[] = [];

    if (queryParam) queryParts.push(queryParam);
    if (categoryParam) queryParts.push(`product_type:${categoryParam}`);

    // Note: Filtering by variant_title works for now but relies on titles containing the option value (e.g. "Red / L")
    // A more robust way is using tags if they are synced (e.g. "color:Red"), but standard setup uses variant titles.
    if (colorParam) queryParts.push(`variant_title:${colorParam}`);
    if (sizeParam) queryParts.push(`variant_title:${sizeParam}`);

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
    const { products: allProducts } = await getProducts({ limit: 50 });

    const availableTypes = Array.from(new Set(allProducts.map(p => p.productType).filter(Boolean)));

    // Extract Options
    const extractOptions = (products: Product[], optionName: string) => {
        const values = new Set<string>();
        products.forEach(p => {
            const option = p.options?.find(o => o.name.toLowerCase() === optionName.toLowerCase() || o.name.toLowerCase() === optionName.toLowerCase() + 's'); // "Color" or "Colors"
            if (option) {
                option.values.forEach(v => values.add(v));
            }
        });
        return Array.from(values);
    };

    const availableColors = extractOptions(allProducts, 'Color');
    const availableSizes = extractOptions(allProducts, 'Size');

    // Simple Price Range calc
    const prices = allProducts.flatMap(p => [
        parseFloat(p.priceRange.minVariantPrice.amount),
        parseFloat(p.priceRange.maxVariantPrice.amount)
    ]);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 1000;


    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase mb-2">
                            {categoryParam ? categoryParam : "Shop"}
                        </h1>
                        <p className="text-white/50 text-lg font-medium">
                            {products.length} Items Found {queryParam && `for "${queryParam}"`}
                        </p>
                    </div>

                    {/* Sort Control */}
                    <div className="flex items-center space-x-4">
                        <span className="text-xs font-bold text-white/50 uppercase tracking-widest hidden md:block">Sort By:</span>
                        <SortSelect />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <ProductFilters
                        availableTypes={availableTypes}
                        availableColors={availableColors}
                        availableSizes={availableSizes}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />

                    {/* Grid & View Toggle */}
                    <div className="flex-1">
                        {products.length > 0 ? (
                            <>
                                <ProductGrid products={products} />

                                {/* Pagination */}
                                {pageInfo?.hasNextPage && (
                                    <div className="flex justify-center mt-12">
                                        <a
                                            href={`?cursor=${pageInfo.endCursor}${sort ? `&sort=${sort}` : ''}${queryParam ? `&q=${queryParam}` : ''}${categoryParam ? `&category=${categoryParam}` : ''}`}
                                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-white/10 hover:border-white/30 transition-all flex items-center space-x-2"
                                        >
                                            <span>Load More Products</span>
                                        </a>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
                                <a href="/shop" className="text-[#D9F99D] underline mt-2 inline-block">Clear all filters</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
