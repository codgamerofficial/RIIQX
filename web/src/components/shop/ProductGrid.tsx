"use client";

import { useState } from "react";
import { LayoutGrid, List, Columns } from "lucide-react"; // Columns icon or similar for wide view
import { ShopifyProductCard } from "@/components/shop/ShopifyProductCard";
import { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
    products: Product[];
}

type ViewMode = "grid" | "list" | "wide";

export function ProductGrid({ products }: ProductGridProps) {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    return (
        <div className="space-y-6">
            {/* View Controls */}
            <div className="flex justify-end items-center gap-2 border-b border-white/10 pb-4">
                <span className="text-sm text-muted-foreground mr-2">View:</span>
                <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                        "p-2 rounded-md transition-colors",
                        viewMode === "grid" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                    )}
                    title="Grid View"
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                        "p-2 rounded-md transition-colors",
                        viewMode === "list" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                    )}
                    title="List View"
                >
                    <List className="w-5 h-5" />
                </button>
            </div>

            {/* Grid Container */}
            <div className={cn(
                "w-full transition-all duration-500",
                viewMode === "grid" && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
                viewMode === "list" && "space-y-4",
                viewMode === "wide" && "grid grid-cols-1 gap-8" // Wide view just 1 col larger cards usually
            )}>
                {products.map((product) => (
                    <div
                        key={product.id}
                        className={cn(
                            viewMode === "list" ? "flex gap-4 border border-white/5 rounded-xl p-4 bg-white/5" : ""
                        )}
                    >
                        <ShopifyProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Pagination Logic placeholder can go here if moved to Client */}
        </div>
    );
}
