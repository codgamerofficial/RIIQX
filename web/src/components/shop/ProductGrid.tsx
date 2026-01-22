"use client";

import { useState } from "react";
import { LayoutGrid, List, Columns } from "lucide-react"; // Columns icon or similar for wide view
import { ShopifyProductCard } from "@/components/shop/ShopifyProductCard";
import { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
    products: Product[];
    recommendationMode?: boolean;
}

type ViewMode = "grid" | "list";

export function ProductGrid({ products, recommendationMode = false }: ProductGridProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    // In a real app, recommendationMode would trigger a different sort or fetch
    // For now, if recommendationMode is on, we just slice the products to show a "curated" list
    const displayedProducts = recommendationMode ? products.slice(0, 4) : products;

    return (
        <div className="space-y-6">
            {/* View Controls - Hide in recommendation mode */}
            {!recommendationMode && (
                <div className="flex justify-end items-center gap-2 border-b border-white/10 pb-4">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest mr-2">View</span>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                            "p-2 rounded-md transition-all duration-300",
                            viewMode === "grid"
                                ? "bg-cherry-red text-white shadow-[0_0_15px_rgba(227,28,121,0.5)]"
                                : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                        title="Grid View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                            "p-2 rounded-md transition-all duration-300",
                            viewMode === "list"
                                ? "bg-cherry-red text-white shadow-[0_0_15px_rgba(227,28,121,0.5)]"
                                : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                        title="List View"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Grid Container */}
            <div className={cn(
                "w-full transition-all duration-500",
                viewMode === "grid" && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
                viewMode === "list" && "space-y-4"
            )}>
                {displayedProducts.map((product) => (
                    <div
                        key={product.id}
                        className={cn(
                            "group",
                            viewMode === "list" ? "flex gap-6 border border-white/5 rounded-2xl p-4 bg-white/5 hover:border-white/10 transition-colors" : ""
                        )}
                    >
                        <ShopifyProductCard product={product} />
                        {viewMode === "list" && (
                            <div className="flex-1 py-2">
                                <h3 className="text-xl font-black font-display text-white uppercase tracking-tight">{product.title}</h3>
                                <p className="text-cherry-red font-bold mt-2">{product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</p>
                                <p className="text-white/60 text-sm mt-4 line-clamp-2">{product.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {recommendationMode && (
                <div className="mt-8 text-center border-t border-white/10 pt-8">
                    <p className="text-white/40 text-sm italic">
                        Selected just for you based on your recent activity.
                    </p>
                </div>
            )}
        </div>
    );
}
