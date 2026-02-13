"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function SortSelect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "newest";

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        // Reset cursor when sorting changes to restart pagination
        params.delete("cursor");
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="relative group min-w-[200px]">
            {/* Industrial Label - Absolute Positioned or part of layout? Let's keep it simple for a select replacement */}
            <div className="absolute -top-2 left-3 px-1 bg-black z-10">
                <span className="text-[9px] font-bold text-[#B4F000] uppercase tracking-widest">Sort Protocol</span>
            </div>

            <select
                className="w-full appearance-none bg-[#050505] border border-white/20 text-white text-xs font-bold font-mono uppercase tracking-wider py-4 pl-4 pr-10 rounded-none focus:outline-none focus:border-[#B4F000] focus:ring-1 focus:ring-[#B4F000]/50 cursor-pointer hover:border-white/40 transition-all"
                value={currentSort}
                onChange={handleSortChange}
            >
                <option value="newest">Newest Drops</option>
                <option value="best_selling">Most Wanted</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
            </select>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-[#B4F000] transition-colors text-white/50">
                <ChevronDown className="w-4 h-4" />
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 group-hover:border-[#B4F000] transition-colors pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30 group-hover:border-[#B4F000] transition-colors pointer-events-none" />
        </div>
    );
}
