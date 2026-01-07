import { getProducts } from "@/lib/shopify";
import { ShopifyProductCard } from "@/components/shop/ShopifyProductCard";
import { ProductFilters } from "@/components/shop/ProductFilters";

export const revalidate = 60; // Cache for 60 seconds

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const sort = resolvedSearchParams.sort as string | undefined;
    const queryParam = resolvedSearchParams.q as string | undefined;

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

    const { products, pageInfo } = await getProducts({
        sortKey,
        reverse,
        query: queryParam,
        after: cursor
    });

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-2 uppercase">
                        {queryParam ? `Results for "${queryParam}"` : "All Products"}
                    </h1>
                    <p className="text-muted-foreground">
                        {products.length} items found
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <ProductFilters />

                    {/* Grid */}
                    <div className="flex-1">
                        {products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                    {products.map((product) => (
                                        <ShopifyProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pageInfo?.hasNextPage && (
                                    <div className="flex justify-center">
                                        <a
                                            href={`?cursor=${pageInfo.endCursor}${sort ? `&sort=${sort}` : ''}${queryParam ? `&q=${queryParam}` : ''}`}
                                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-white/10 hover:border-white/30 transition-all flex items-center space-x-2"
                                        >
                                            <span>Load More Products</span>
                                        </a>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-muted-foreground text-lg">No products found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
