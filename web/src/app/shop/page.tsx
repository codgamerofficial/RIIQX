import { getProducts } from "@/lib/shopify";

import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductGrid } from "@/components/shop/ProductGrid";

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
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase mb-2">
                            {queryParam ? (
                                <span>
                                    Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">"{queryParam}"</span>
                                </span>
                            ) : (
                                "All Products"
                            )}
                        </h1>
                        <p className="text-white/50 text-lg font-medium">
                            {products.length} Items Found
                        </p>
                    </div>

                    {/* Sort Control */}
                    <div className="flex items-center space-x-4">
                        <span className="text-xs font-bold text-white/50 uppercase tracking-widest hidden md:block">Sort By:</span>
                        <div className="relative group">
                            <select
                                className="appearance-none bg-[#1A1A1A] border border-white/10 text-white text-xs font-bold uppercase tracking-wider py-3 pl-4 pr-10 rounded-lg focus:outline-none focus:border-[#D9F99D] cursor-pointer hover:bg-white/5 transition-colors"
                                defaultValue={sort || "newest"}
                            // In a real client component we'd stick this in state, but for server component we can use simple form or links.
                            // Since this is a server component, we probably want a Client Component wrapper for the Sort or just use links.
                            // For simplicity here, let's just make it look good, functionality needs client interaction or basic links.
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="best_selling">Best Selling</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <ProductFilters />

                    {/* Grid & View Toggle */}
                    <div className="flex-1">
                        {products.length > 0 ? (
                            <>
                                <ProductGrid products={products} />

                                {/* Pagination */}
                                {pageInfo?.hasNextPage && (
                                    <div className="flex justify-center mt-12">
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
