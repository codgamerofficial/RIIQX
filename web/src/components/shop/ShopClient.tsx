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
            <div className="flex flex-col gap-12 mb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-8">
                    <div className="relative w-full">
                        <h1 className="text-[8vw] font-black tracking-tighter text-white uppercase leading-[0.8] font-display select-none">
                            {categoryParam ? categoryParam.replace(/-/g, ' ') : "All Products"}
                        </h1>

                        <div className="flex items-center gap-6 mt-6 md:mt-2 pl-2">
                            <div className="h-px w-24 bg-white/30" />
                            <span className="text-white/60 font-mono text-sm uppercase tracking-[0.2em] font-bold">
                                {initialProductCount} Items Arrived
                            </span>
                        </div>
                    </div>

                    <div className="flex-shrink-0 mb-4 md:mb-8">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="group relative flex items-center gap-3 px-10 py-5 bg-white text-black transition-all hover:bg-accent"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="text-sm font-black uppercase tracking-widest">Filter & Sort</span>
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-black/10 transition-colors pointer-events-none" />
                        </button>
                    </div>
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
