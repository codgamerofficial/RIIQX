"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const categories = ["All", "T-Shirts", "Hoodies", "Jackets", "Accessories"];

export function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category") || "All";

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === "All") {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleCategoryChange = (category: string) => {
        router.push(`/shop?${createQueryString("category", category)}`);
    };

    return (
        <aside className="w-full md:w-64 space-y-8 flex-shrink-0">
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentCategory === category
                                    ? "bg-primary/20 text-primary font-medium border border-primary/50"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range Filter (Placeholder) */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Price Range</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-white/20 bg-black/50" />
                        <span>$0 - $50</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-white/20 bg-black/50" />
                        <span>$50 - $100</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-white/20 bg-black/50" />
                        <span>$100+</span>
                    </label>
                </div>
            </div>
        </aside>
    );
}
