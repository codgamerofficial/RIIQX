import { ProductGrid } from "@/components/shop/ProductGrid";
import { getCollectionProducts } from "@/lib/shopify";
import { Suspense } from "react";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { SortSelect } from "@/components/shop/SortSelect";
import { Product } from "@/lib/shopify/types";

export const metadata = {
    title: 'Streetwear | RIIQX',
    description: 'Urban combat ready apparel.',
};

export default async function StreetwearPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const sort = resolvedSearchParams.sort as string | undefined;

    // Filters
    const colorParam = resolvedSearchParams.color as string | undefined;
    const sizeParam = resolvedSearchParams.size as string | undefined;
    const minPriceParam = resolvedSearchParams.min_price as string | undefined;
    const maxPriceParam = resolvedSearchParams.max_price as string | undefined;
    const typeParam = resolvedSearchParams.category as string | undefined;

    // Map Sort
    let sortKey: 'TITLE' | 'PRICE' | 'CREATED' | 'BEST_SELLING' | undefined = 'CREATED';
    let reverse = true;

    if (sort === "best_selling") {
        sortKey = 'BEST_SELLING';
        reverse = false;
    } else if (sort === "price_low") {
        sortKey = 'PRICE';
        reverse = false;
    } else if (sort === "price_high") {
        sortKey = 'PRICE';
        reverse = true;
    } else if (sort === "newest") {
        sortKey = 'CREATED';
        reverse = true;
    }

    // Build Filters
    const filters: any[] = [];
    if (colorParam) filters.push({ variantOption: { name: 'Color', value: colorParam } });
    if (sizeParam) filters.push({ variantOption: { name: 'Size', value: sizeParam } });
    if (typeParam) filters.push({ productType: typeParam });
    if (minPriceParam || maxPriceParam) {
        filters.push({
            price: {
                min: minPriceParam ? parseFloat(minPriceParam) : undefined,
                max: maxPriceParam ? parseFloat(maxPriceParam) : undefined
            }
        });
    }

    const { products } = await getCollectionProducts({
        handle: 'streetwear',
        sortKey,
        reverse,
        filters
    });

    // Aggregation
    const { products: allCollectionProducts } = await getCollectionProducts({
        handle: 'streetwear',
        limit: 100
    });

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

    const availableTypes = Array.from(new Set(allCollectionProducts.map(p => p.productType).filter(Boolean)));
    const availableColors = extractOptions(allCollectionProducts, 'Color');
    const availableSizes = extractOptions(allCollectionProducts, 'Size');

    const prices = allCollectionProducts.flatMap(p => [
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
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
                            Street <span className="text-primary">Ops</span>
                        </h1>
                        <p className="text-white/50 text-lg font-medium">
                            {products.length} Items Found
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
                                    <p className="text-muted-foreground text-lg">No street ops found.</p>
                                    <a href="/streetwear" className="text-[#D9F99D] underline mt-2 inline-block">Clear all filters</a>
                                </div>
                            )}
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
