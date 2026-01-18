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
            {/* Filter Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Filters</h2>
                <button
                    onClick={() => router.push('/shop')}
                    className="text-[10px] font-bold text-white/50 hover:text-[#D9F99D] transition-colors uppercase tracking-widest"
                >
                    Clear All
                </button>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Categories */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center justify-between">
                    Categories
                </h3>
                <div className="space-y-1">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 border ${currentCategory === category
                                ? "bg-[#D9F99D] text-black border-[#D9F99D] shadow-[0_0_15px_rgba(217,249,157,0.3)]"
                                : "bg-white/5 text-white/70 border-transparent hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Price Range</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] text-white/30 uppercase font-bold">Min</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs font-bold">$</span>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-md py-2.5 pl-7 pr-2 text-xs text-white font-bold focus:border-[#D9F99D] focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-white/30 uppercase font-bold">Max</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs font-bold">$</span>
                            <input
                                type="number"
                                placeholder="1000"
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-md py-2.5 pl-7 pr-2 text-xs text-white font-bold focus:border-[#D9F99D] focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Colors */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Color</h3>
                <div className="flex flex-wrap gap-3">
                    {['#000000', '#ffffff', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map((color) => (
                        <button
                            key={color}
                            className="w-8 h-8 rounded-full border border-white/10 hover:border-white transition-all relative group shadow-lg"
                            style={{ backgroundColor: color }}
                        >
                            <span className="sr-only">Select color</span>
                            <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:scale-110 transition-transform" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Sizes */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                        <button
                            key={size}
                            className="border border-white/10 bg-white/5 rounded-md py-2.5 text-xs text-white/70 font-bold hover:bg-white hover:text-black transition-all uppercase"
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );

}
