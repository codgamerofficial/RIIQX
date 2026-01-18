"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
        <div className="relative group">
            <select
                className="appearance-none bg-[#1A1A1A] border border-white/10 text-white text-xs font-bold uppercase tracking-wider py-3 pl-4 pr-10 rounded-lg focus:outline-none focus:border-[#D9F99D] cursor-pointer hover:bg-white/5 transition-colors"
                value={currentSort}
                onChange={handleSortChange}
            >
                <option value="newest">Newest Arrivals</option>
                <option value="best_selling">Best Selling</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
}
