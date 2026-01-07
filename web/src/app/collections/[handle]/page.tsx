import { getCollectionProducts, getCollections, getProducts } from "@/lib/shopify";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import ProductGridClient from "@/components/shop/ProductGridClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Product, Connection } from "@/lib/shopify/types";

export const revalidate = 60;

export default async function CollectionPage({
    params,
    searchParams,
}: {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { handle } = await params;
    const queryParams = await searchParams;

    const sortKey = (queryParams.sort as any) || 'TITLE';
    const reverse = queryParams.reverse === 'true';

    let products: Product[] = [];
    let pageInfo: Connection<Product>['pageInfo'] = { hasNextPage: false, hasPreviousPage: false };

    // Smart Fallbacks for Standard Pages
    if (handle === 'new-arrivals') {
        const res = await getProducts({ sortKey: 'CREATED_AT', reverse: true, limit: 24 });
        products = res.products;
        pageInfo = res.pageInfo;
    } else if (handle === 'best-sellers') {
        const res = await getProducts({ sortKey: 'BEST_SELLING', limit: 24 });
        products = res.products;
        pageInfo = res.pageInfo;
    } else {
        // Standard Collection Fetch
        const res = await getCollectionProducts({
            handle,
            sortKey,
            reverse
        });
        products = res.products;
        pageInfo = res.pageInfo;
    }

    const collections = await getCollections();

    const currentCollection = collections.find(c => c.handle === handle);

    if (!currentCollection && products.length === 0) {
        // If collection doesn't exist in list AND returns no products, it might be invalid.
        // But getCollectionProducts returns empty array if not found.
        // We can check if `currentCollection` is found or handle 404.
    }

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
                                <p className="text-secondary text-xs uppercase tracking-widest mb-2 font-bold">Collection</p>
                                <h1 className="text-4xl font-black text-white mb-2 capitalize">{currentCollection?.title || handle.replace('-', ' ')}</h1>
                                <p className="text-white/60 text-sm max-w-2xl">{currentCollection?.description}</p>
                            </div>
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
