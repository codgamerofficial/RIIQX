"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";

interface ShopClientProps {
    initialProductCount: number;
    queryParam?: string;
    categoryParam?: string;
    availableTypes?: string[];
    availableColors?: string[];
    availableSizes?: string[];
    minPrice?: number;
    maxPrice?: number;
}

export function ShopClient({
    initialProductCount,
    queryParam,
    categoryParam
}: ShopClientProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Note: We are using FilterSidebar as a drawer now, managed here.
    // In a fuller implementation, we might pass the available filters to FilterSidebar.
    // For now, since page.tsx fetches static collections for sidebar or uses hardcoded list,
    // we'll rely on FilterSidebar's internal fetching or pass data if we want dynamic collections.
    // The previous implementation used FilterModal. We are switching to Sidebar.

    // We need to fetch collections here or pass them. page.tsx doesn't pass collections to ShopClient currently.
    // To fix this without fetching in Client, we'd update page.tsx to pass collections.
    // however, FilterSidebar can be used directly.
    // Let's assume we pass [] for now or update page.tsx to pass collections.

    return (
        <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                <div>
                    <h1 className="text-[10vw] md:text-8xl font-black tracking-tighter text-white uppercase leading-none font-display">
                        {categoryParam ? categoryParam.replace(/-/g, ' ') : "All Products"}
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
                        <span className="h-px w-12 bg-white/20"></span>
                        <p className="text-white/40 text-sm font-mono uppercase tracking-widest">
                            {initialProductCount} Items Arrived
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="group flex items-center gap-2 px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-[#CCFF00] transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filter & Sort</span>
                    </button>
                </div>
            </div>

            {/* Filter Sidebar Drawer */}
            <FilterSidebar
                collections={[]} // TODO: Pass real collections from page.tsx
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />
        </div>
    );
}
