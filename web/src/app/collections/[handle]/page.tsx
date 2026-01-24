import { getCollectionProducts, getProducts } from "@/lib/shopify";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { LoadMoreProducts } from "@/components/shop/LoadMoreProducts";
import { Metadata } from "next";

export const revalidate = 60;


export async function generateMetadata({
    params
}: {
    params: Promise<{ handle: string }>;
}): Promise<Metadata> {
    const { handle } = await params;

    // We fetch a small amount just to get the collection info
    const { collectionInfo } = await getCollectionProducts({ handle, limit: 1 });

    if (!collectionInfo) {
        return {
            title: 'Collection Not Found',
            description: 'The requested collection could not be found.'
        };
    }

    return {
        title: collectionInfo.seo.title || collectionInfo.title,
        description: collectionInfo.seo.description || collectionInfo.description || `Browse our latest ${collectionInfo.title} collection.`,
        openGraph: {
            title: collectionInfo.seo.title || collectionInfo.title,
            description: collectionInfo.seo.description || collectionInfo.description,
            type: 'website'
        }
    };
}

export default async function CollectionPage({
    params,
    searchParams,
}: {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { handle } = await params;
    const resolvedSearchParams = await searchParams;
    const sort = resolvedSearchParams.sort as string | undefined;

    let sortKey: 'TITLE' | 'PRICE' | 'CREATED' | 'BEST_SELLING' | undefined = undefined;
    let reverse = false;

    if (sort === "newest") {
        sortKey = 'CREATED';
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

    // 1. Fetch products (Server Side Pagination)
    // Note: detailed client side filtering with pagination is complex with Shopify Storefront API
    // because you can't filter purely by generic tags AND paginate efficiently without retrieving all.
    // For now, we will fetch a larger batch if filters are present, or standard batch if not.
    // Ideally, we rely on Shopify's `filters` if possible, but our `getCollectionProducts` 
    // implementation currently mostly does client sorting/limiting or passes filters if designed.

    // Check if we have specific filters to decide strategy
    const hasFilters = resolvedSearchParams.category || resolvedSearchParams.color || resolvedSearchParams.size || resolvedSearchParams.min_price || resolvedSearchParams.max_price;
    const limit = hasFilters ? 100 : 24; // Fetch more if we are filtering client side to ensure we have matches

    const { products, pageInfo, collectionInfo } = await getCollectionProducts({
        handle,
        sortKey,
        reverse,
        limit
    });

    const categoryParam = resolvedSearchParams.category as string | undefined;
    const colorParam = resolvedSearchParams.color as string | undefined;
    const sizeParam = resolvedSearchParams.size as string | undefined;
    const minPriceParam = resolvedSearchParams.min_price ? parseFloat(resolvedSearchParams.min_price as string) : undefined;
    const maxPriceParam = resolvedSearchParams.max_price ? parseFloat(resolvedSearchParams.max_price as string) : undefined;

    // 2. Filter Logic (Client-Side for Collection Context)
    let displayProducts = products;

    if (categoryParam) {
        displayProducts = displayProducts.filter(p => p.productType === categoryParam);
    }

    if (colorParam) {
        displayProducts = displayProducts.filter(p =>
            p.options.some(o =>
                (o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour') &&
                o.values.includes(colorParam)
            )
        );
    }

    if (sizeParam) {
        displayProducts = displayProducts.filter(p =>
            p.options.some(o =>
                o.name.toLowerCase() === 'size' &&
                o.values.includes(sizeParam)
            )
        );
    }

    if (minPriceParam !== undefined) {
        displayProducts = displayProducts.filter(p =>
            parseFloat(p.priceRange.minVariantPrice.amount) >= minPriceParam
        );
    }

    if (maxPriceParam !== undefined) {
        displayProducts = displayProducts.filter(p =>
            parseFloat(p.priceRange.minVariantPrice.amount) <= maxPriceParam
        );
    }


    // 3. Extract Available Options (from the FULL set, so filters don't disappear)
    const availableTypes = Array.from(new Set(products.map(p => p.productType).filter(Boolean)));

    // Aggregation Helper
    const extractOptions = (items: typeof products, optionName: string) => {
        const values = new Set<string>();
        items.forEach(p => {
            const option = p.options?.find(o => o.name.toLowerCase() === optionName.toLowerCase() || o.name.toLowerCase() === optionName.toLowerCase() + 's');
            if (option) option.values.forEach(v => values.add(v));
        });
        return Array.from(values);
    };

    const availableColors = extractOptions(products, 'Color');
    const availableSizes = extractOptions(products, 'Size');

    const prices = products.flatMap(p => [
        parseFloat(p.priceRange.minVariantPrice.amount),
        parseFloat(p.priceRange.maxVariantPrice.amount)
    ]);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 1000;


    // Title from Shopify Collection Data
    const title = collectionInfo?.title || handle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const description = collectionInfo?.description;

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 border-b border-white/10 pb-6">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase mb-4">
                        {categoryParam ? `${title} / ${categoryParam}` : title}
                    </h1>
                    {description && (
                        <div className="prose prose-invert max-w-2xl mb-4 text-white/60">
                            {description}
                        </div>
                    )}
                    <p className="text-white/40 text-sm font-mono tracking-widest uppercase">
                        {displayProducts.length} Items
                    </p>
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

                    {/* Grid */}
                    <div className="flex-1">
                        {displayProducts.length > 0 ? (
                            <>
                                <ProductGrid products={displayProducts} />
                                {!hasFilters && (
                                    <LoadMoreProducts
                                        handle={handle}
                                        startCursor={pageInfo?.endCursor}
                                        initialHasNextPage={pageInfo?.hasNextPage ?? false}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="space-y-12">
                                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                                    <p className="text-muted-foreground text-lg mb-2">
                                        This collection is currently empty or loading.
                                    </p>
                                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
                                        Check Out Our Best Sellers
                                    </h3>
                                </div>
                                <RecommendedFallback />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

async function RecommendedFallback() {
    const { products } = await getProducts({ sortKey: 'BEST_SELLING', limit: 8 });
    if (!products.length) return null;

    return (
        <div>
            <ProductGrid products={products} />
        </div>
    );
}
