"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

interface ProductFiltersProps {
    availableTypes: string[];
    availableSizes?: string[];
    availableColors?: string[];
    minPrice?: number;
    maxPrice?: number;
}

export function ProductFilters({
    availableTypes = [],
    availableSizes = [],
    availableColors = [],
    minPrice = 0,
    maxPrice = 1000
}: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for local inputs (like price) to avoid URL spamming on every keystroke
    const [localMinPrice, setLocalMinPrice] = useState(searchParams.get("min_price") || "");
    const [localMaxPrice, setLocalMaxPrice] = useState(searchParams.get("max_price") || "");

    const currentCategory = searchParams.get("category");
    const currentColor = searchParams.get("color");
    const currentSize = searchParams.get("size");

    // Debounce Price Update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localMinPrice !== (searchParams.get("min_price") || "") ||
                localMaxPrice !== (searchParams.get("max_price") || "")) {

                const params = new URLSearchParams(searchParams.toString());
                if (localMinPrice) params.set("min_price", localMinPrice);
                else params.delete("min_price");

                if (localMaxPrice) params.set("max_price", localMaxPrice);
                else params.delete("max_price");

                router.push(`?${params.toString()}`);
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [localMinPrice, localMaxPrice, router, searchParams]);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('cursor'); // Reset pagination

            if (value === "All" || !value) {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (name: string, value: string) => {
        router.push(`?${createQueryString(name, value)}`);
    };

    const clearAll = () => {
        router.push('?');
        setLocalMinPrice("");
        setLocalMaxPrice("");
    };

    // Helper for color swatches
    const getColorStyle = (color: string) => {
        switch (color.toLowerCase()) {
            case 'white': return '#ffffff';
            case 'black': return '#000000';
            case 'red': return '#ef4444';
            case 'blue': return '#3b82f6';
            case 'green': return '#10b981';
            case 'yellow': return '#f59e0b';
            case 'purple': return '#a855f7';
            case 'pink': return '#ec4899';
            case 'orange': return '#f97316';
            case 'grey': return '#6b7280';
            case 'beige': return '#d6d3d1';
            default: return color; // Fallback to name or try to use it as CSS string
        }
    };

    const hasActiveFilters = currentCategory || currentColor || currentSize || localMinPrice || localMaxPrice;

    return (
        <aside className="w-full md:w-64 space-y-8 flex-shrink-0">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Filters</h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="text-[10px] font-bold text-white/50 hover:text-[#D9F99D] transition-colors uppercase tracking-widest flex items-center gap-1"
                    >
                        Clear <X className="w-3 h-3" />
                    </button>
                )}
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Categories (Product Types) */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center justify-between">
                    Product Types
                </h3>
                <div className="space-y-1">
                    <button
                        onClick={() => handleFilterChange("category", "All")}
                        className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 border ${!currentCategory
                            ? "bg-[#D9F99D] text-black border-[#D9F99D] shadow-[0_0_15px_rgba(217,249,157,0.3)]"
                            : "bg-white/5 text-white/70 border-transparent hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        All Products
                    </button>
                    {availableTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleFilterChange("category", type)}
                            className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide transition-all duration-300 border ${currentCategory === type
                                ? "bg-[#D9F99D] text-black border-[#D9F99D] shadow-[0_0_15px_rgba(217,249,157,0.3)]"
                                : "bg-white/5 text-white/70 border-transparent hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {type}
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
                                placeholder={String(Math.floor(minPrice))}
                                value={localMinPrice}
                                onChange={(e) => setLocalMinPrice(e.target.value)}
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
                                placeholder={String(Math.ceil(maxPrice))}
                                value={localMaxPrice}
                                onChange={(e) => setLocalMaxPrice(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-md py-2.5 pl-7 pr-2 text-xs text-white font-bold focus:border-[#D9F99D] focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Colors */}
            {availableColors.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Color</h3>
                        {currentColor && (
                            <button onClick={() => handleFilterChange("color", "")} className="text-[10px] text-white/30 hover:text-white uppercase font-bold">Reset</button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {availableColors.map((color) => (
                            <button
                                key={color}
                                onClick={() => handleFilterChange("color", currentColor === color ? "" : color)}
                                className={`w-8 h-8 rounded-full border transition-all relative group shadow-lg ${currentColor === color ? 'border-[#D9F99D] scale-110' : 'border-white/10 hover:border-white'}`}
                                style={{ backgroundColor: getColorStyle(color) }}
                                title={color}
                            >
                                <span className="sr-only">Select {color}</span>
                                {currentColor === color && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-1 h-1 bg-black rounded-full shadow-white shadow-[0_0_5px_white]" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {availableColors.length > 0 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            )}

            {/* Sizes */}
            {availableSizes.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Size</h3>
                        {currentSize && (
                            <button onClick={() => handleFilterChange("size", "")} className="text-[10px] text-white/30 hover:text-white uppercase font-bold">Reset</button>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {availableSizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => handleFilterChange("size", currentSize === size ? "" : size)}
                                className={`border rounded-md py-2.5 text-xs font-bold transition-all uppercase ${currentSize === size
                                    ? "bg-[#D9F99D] text-black border-[#D9F99D]"
                                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white hover:text-black"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );

}
