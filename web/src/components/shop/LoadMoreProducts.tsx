"use client";

import { useState } from "react";
import { Product } from "@/lib/shopify/types";
import { ProductGrid } from "./ProductGrid";
import { Loader2 } from "lucide-react";
// We need a server action to fetch more products securely
import { fetchMoreCollectionProducts } from "@/app/actions/shop";

interface LoadMoreProductsProps {
    handle: string; // Collection handle
    startCursor: string | null | undefined; // Standardize type
    initialHasNextPage: boolean;
}

export function LoadMoreProducts({ handle, startCursor, initialHasNextPage }: LoadMoreProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
    const [cursor, setCursor] = useState<string | undefined>(startCursor ?? undefined);
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        if (loading || !cursor) return;
        setLoading(true);

        try {
            const { products: newProducts, pageInfo } = await fetchMoreCollectionProducts({
                handle,
                after: cursor,
            });

            setProducts((prev) => [...prev, ...newProducts]);
            setHasNextPage(pageInfo.hasNextPage);
            setCursor(pageInfo.endCursor);
        } catch (error) {
            console.error("Failed to load more products collection", error);
        } finally {
            setLoading(false);
        }
    };

    if (!hasNextPage) return null;

    return (
        <div className="mt-12">
            <ProductGrid products={products} />

            <div className="mt-16 flex justify-center">
                <button
                    onClick={loadMore}
                    disabled={loading}
                    className="group relative px-8 py-4 bg-white/5 border border-white/10 hover:border-white transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                    <span className="relative flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white">
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Loading..." : "Load More Gear"}
                    </span>
                </button>
            </div>
        </div>
    );
}
