"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { FilterModal } from "./FilterModal";
import { SortSelect } from "./SortSelect";

interface ShopClientProps {
    initialProductCount: number;
    queryParam?: string;
    categoryParam?: string;
    availableTypes: string[];
    availableColors: string[];
    availableSizes: string[];
    minPrice: number;
    maxPrice: number;
}

export function ShopClient({
    initialProductCount,
    queryParam,
    categoryParam,
    availableTypes,
    availableColors,
    availableSizes,
    minPrice,
    maxPrice,
}: ShopClientProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleApplyFilters = (filters: any) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('cursor'); // Reset pagination

        // Handle Sort
        if (filters.sort) params.set("sort", filters.sort);

        // Handle Price
        if (filters.priceRange) {
            params.set("min_price", filters.priceRange[0].toString());
            params.set("max_price", filters.priceRange[1].toString());
        }

        // Handle Colors
        if (filters.colors && filters.colors.length > 0) {
            // For now, join with comma or just take the first one if backend supports one
            // The page.tsx logic supports single 'color' param for variants. 
            // Ideally backend handles multiples. Let's support one for now or join.
            // page.tsx uses "variant_title:${colorParam}".
            // Multi-select might need backend update. Let's send the first one or logic update.
            // Safe bet: just send the first one or loop.
            // Updated plan: just filter by the first selected color for now to match current backend logic.
            params.set("color", filters.colors[0]);
        } else {
            params.delete("color");
        }

        // Handle Sizes
        if (filters.sizes && filters.sizes.length > 0) {
            params.set("size", filters.sizes[0]);
        } else {
            params.delete("size");
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="mb-8">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase mb-2">
                        {categoryParam ? categoryParam : "Shop"}
                    </h1>
                    <p className="text-white/50 text-lg font-medium">
                        {initialProductCount} Items Found {queryParam && `for "${queryParam}"`}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                    </button>
                    {/* Sort Select is also in Modal, but good to have quick access or hide it? 
                 Design typically has one main Filter/Sort area. 
                 I'll keep SortSelect here too or rely on Modal. 
                 Let's keep it clean and rely on Modal for advanced sort, or keep simple Sort dropdown.
                 The Modal has Sort. I'll hide this standalone SortSelect on mobile maybe, or just keep it.
             */}
                    <div className="hidden md:block">
                        <SortSelect />
                    </div>
                </div>
            </div>

            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
            />
        </div>
    );
}
