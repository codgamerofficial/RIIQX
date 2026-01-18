import { getProducts } from "@/lib/shopify";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Product } from "@/lib/shopify/types";
import { SortSelect } from "@/components/shop/SortSelect";
import { Suspense } from "react";

export const metadata = {
    title: 'Best Sellers | RIIQX',
    description: 'Most wanted gear. Join the movement.',
};

export default async function BestSellersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const sort = resolvedSearchParams.sort as string | undefined;

    // Filters
    const queryParam = resolvedSearchParams.q as string | undefined;
    const categoryParam = resolvedSearchParams.category as string | undefined;
    const colorParam = resolvedSearchParams.color as string | undefined;
    const sizeParam = resolvedSearchParams.size as string | undefined;
    const minPriceParam = resolvedSearchParams.min_price as string | undefined;
    const maxPriceParam = resolvedSearchParams.max_price as string | undefined;

    // Sorting - Default to BEST_SELLING
    let sortKey: 'TITLE' | 'PRICE' | 'CREATED' | 'BEST_SELLING' | undefined = 'BEST_SELLING';
    let reverse = false;

    if (sort === "newest") {
        sortKey = 'CREATED_AT';
        reverse = true;
    } else if (sort === "price_low") {
        sortKey = 'PRICE';
        reverse = false;
    } else if (sort === "price_high") {
        sortKey = 'PRICE';
        reverse = true;
    } else if (sort === "best_selling") {
        sortKey = 'BEST_SELLING';
        reverse = false;
    }

    // Build Query
    let queryParts: string[] = [];
    if (queryParam) queryParts.push(queryParam);
    if (categoryParam) queryParts.push(`product_type:${categoryParam}`);
    if (colorParam) queryParts.push(`variant_title:${colorParam}`);
    if (sizeParam) queryParts.push(`variant_title:${sizeParam}`);
    if (minPriceParam) queryParts.push(`price:>=${minPriceParam}`);
    if (maxPriceParam) queryParts.push(`price:<=${maxPriceParam}`);

    const shopifyQuery = queryParts.join(" AND ");

    const { products } = await getProducts({
        sortKey,
        reverse,
        query: shopifyQuery,
    });

    // Aggregation (Sidebar)
    const { products: allProducts } = await getProducts({ limit: 100, sortKey: 'BEST_SELLING' });

    const availableTypes = Array.from(new Set(allProducts.map(p => p.productType).filter(Boolean)));
    const extractOptions = (products: Product[], optionName: string) => {
        const values = new Set<string>();
        products.forEach(p => {
            const option = p.options?.find(o => o.name.toLowerCase() === optionName.toLowerCase() || o.name.toLowerCase() === optionName.toLowerCase() + 's');
            if (option) {
                option.values.forEach(v => values.add(v));
            }
        });
        return Array.from(values);
    };
    const availableColors = extractOptions(allProducts, 'Color');
    const availableSizes = extractOptions(allProducts, 'Size');

    const prices = allProducts.flatMap(p => [
        parseFloat(p.priceRange.minVariantPrice.amount),
        parseFloat(p.priceRange.maxVariantPrice.amount)
    ]);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 10000;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase mb-2">
                            Most <span className="text-primary">Wanted</span>
                        </h1>
                        <p className="text-white/50 text-lg font-medium">
                            {products.length} Top Rated Items
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-xs font-bold text-white/50 uppercase tracking-widest hidden md:block">Sort By:</span>
                        <SortSelect />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <ProductFilters
                        availableTypes={availableTypes}
                        availableColors={availableColors}
                        availableSizes={availableSizes}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />

                    <div className="flex-1">
                        <Suspense fallback={<div className="text-center py-20">Loading Grid...</div>}>
                            {products.length > 0 ? (
                                <ProductGrid products={products} />
                            ) : (
                                <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
                                    <p className="text-muted-foreground text-lg">No best sellers found.</p>
                                    <a href="/best-sellers" className="text-[#D9F99D] underline mt-2 inline-block">Clear all filters</a>
                                </div>
                            )}
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
