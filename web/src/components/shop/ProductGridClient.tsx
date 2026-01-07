"use client";

import { useState } from "react";
import { Product, Connection } from "@/lib/shopify/types";
import { ShopifyProductCard } from "./ShopifyProductCard";
// import { useInView } from "react-intersection-observer"; // Optional for infinite scroll

interface ProductGridClientProps {
    initialProducts: Product[];
    pageInfo: Connection<Product>['pageInfo'];
}

export default function ProductGridClient({ initialProducts, pageInfo }: ProductGridClientProps) {
    const [products, setProducts] = useState(initialProducts);
    const [cursor, setCursor] = useState(pageInfo?.endCursor);
    const [hasNextPage, setHasNextPage] = useState(pageInfo?.hasNextPage);
    const [loading, setLoading] = useState(false);

    // In a real implementation with Server Actions, we would fetch more products here.
    // For this "Cinematic" MVP, we'll start with the initial batch.
    // The logic for fetching more would involve calling `getProducts` again with `after: cursor`.

    const loadMore = async () => {
        /*
        setLoading(true);
        const newProducts = await fetchMoreProducts(cursor); 
        setProducts([...products, ...newProducts]);
        setCursor(newInfo.endCursor);
        setHasNextPage(newInfo.hasNextPage);
        setLoading(false);
        */
        console.log("Load more triggered - impl pending server action");
    };

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-2xl font-bold text-white mb-4">No products found</p>
                <p className="text-gray-400">Try adjusting your filters.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ShopifyProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Load More Trigger (Hidden for now until server action is ready) */}
            {hasNextPage && (
                <div className="mt-12 text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-colors disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}
        </div>
    );
}
