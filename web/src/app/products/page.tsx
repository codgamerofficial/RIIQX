import { getProducts, getCollections } from "@/lib/shopify";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import ProductGridClient from "@/components/shop/ProductGridClient";
import Link from "next/link";

export const revalidate = 60;

export default async function AllProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const sortKey = (params.sort as any) || 'TITLE';
    const reverse = params.reverse === 'true';
    const minPrice = params.minPrice ? parseFloat(params.minPrice as string) : undefined;

    // Construct query for filtering
    // Storefront API `products` `query` parameter supports:
    // "variants.price:>100" etc.
    let query = "";
    if (minPrice) query += `variants.price:>=${minPrice} `;
    if (params.maxPrice) query += `variants.price:<=${params.maxPrice} `;

    const { products, pageInfo } = await getProducts({
        sortKey,
        reverse,
        query: query.trim() || undefined
    });

    const collections = await getCollections();

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <FilterSidebar collections={collections} />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
                            <div>
                                <h1 className="text-4xl font-black text-white mb-2">All Products</h1>
                                <p className="text-white/60 text-sm">Showing {products.length} results</p>
                            </div>
                            {/* Simple Sort (could be componentized) */}
                            <div className="flex gap-2">
                                <Link href="?sort=BEST_SELLING" className="text-xs text-white/60 hover:text-white">Best Selling</Link>
                                <Link href="?sort=PRICE&reverse=false" className="text-xs text-white/60 hover:text-white">Price: Low-High</Link>
                                <Link href="?sort=PRICE&reverse=true" className="text-xs text-white/60 hover:text-white">Price: High-Low</Link>
                            </div>
                        </div>

                        <ProductGridClient initialProducts={products} pageInfo={pageInfo} />
                    </div>
                </div>
            </div>
        </div>
    );
}
