"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { X, Check, Minus, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
    maxPrice = 10000 // Adjusted default for INR
}: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpenMobile, setIsOpenMobile] = useState(false);

    // State for local inputs
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
            params.delete('cursor');

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

    // Helper: Categorize Sizes
    const categorizedSizes = availableSizes.reduce((acc, size) => {
        const lowerSize = size.toLowerCase();
        if (lowerSize.includes("iphone") || /\d/.test(size) && (lowerSize.includes("pro") || lowerSize.includes("max") || lowerSize.includes("mini") || lowerSize.includes("plus"))) {
            acc.tech.push(size);
        } else if (['xs', 's', 'm', 'l', 'xl', 'xxl', '2xl', '3xl', 'small', 'medium', 'large'].some(s => lowerSize.includes(s))) {
            acc.clothing.push(size);
        } else {
            acc.other.push(size);
        }
        return acc;
    }, { clothing: [] as string[], tech: [] as string[], other: [] as string[] });

    // Helper: Color Styles
    const getColorStyle = (color: string) => {
        const map: Record<string, string> = {
            'white': '#ffffff', 'black': '#000000', 'red': '#ef4444',
            'blue': '#3b82f6', 'green': '#10b981', 'yellow': '#f59e0b',
            'purple': '#a855f7', 'pink': '#ec4899', 'orange': '#f97316',
            'grey': '#6b7280', 'beige': '#d6d3d1', 'navy': '#1e3a8a',
            'maroon': '#7f1d1d', 'olive': '#3f6212', 'teal': '#14b8a6'
        };
        return map[color.toLowerCase()] || color;
    };

    const hasActiveFilters = currentCategory || currentColor || currentSize || localMinPrice || localMaxPrice;

    return (
        <>
            {/* Mobile Filter Toggle */}
            <button
                onClick={() => setIsOpenMobile(!isOpenMobile)}
                className="md:hidden w-full flex items-center justify-between p-4 border border-white/10 bg-[#050505] text-white uppercase tracking-widest text-sm font-bold font-mono mb-4"
            >
                <span>Filter Protocol</span>
                <SlidersHorizontal className="w-4 h-4 text-[#B4F000]" />
            </button>

            <aside className={cn(
                "w-full md:w-72 flex-shrink-0 space-y-12 pr-4 md:block",
                isOpenMobile ? "block" : "hidden"
            )}>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter font-[family-name:var(--font-oswald)]">
                        Filter By
                    </h2>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAll}
                            className="text-[10px] font-bold text-black hover:bg-white hover:text-black transition-colors uppercase tracking-widest flex items-center gap-1 group bg-[#B4F000] px-3 py-1"
                        >
                            Reset <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                        </button>
                    )}
                    {/* Decorative Dot */}
                    <div className="absolute -bottom-[1px] right-0 w-8 h-[2px] bg-[#B4F000]" />
                </div>

                {/* Categories */}
                <FilterSection title="Category" isOpen={true}>
                    <div className="space-y-1">
                        <FilterOption
                            label="All"
                            isActive={!currentCategory}
                            onClick={() => handleFilterChange("category", "All")}
                        />
                        {availableTypes.map((type) => (
                            <FilterOption
                                key={type}
                                label={type}
                                isActive={currentCategory === type}
                                onClick={() => handleFilterChange("category", type)}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="Price (INR)" isOpen={true}>
                    <div className="grid grid-cols-2 gap-4">
                        <PriceInput
                            label="Min"
                            value={localMinPrice}
                            onChange={setLocalMinPrice}
                            placeholder={Math.floor(minPrice).toString()}
                        />
                        <PriceInput
                            label="Max"
                            value={localMaxPrice}
                            onChange={setLocalMaxPrice}
                            placeholder={Math.ceil(maxPrice).toString()}
                        />
                    </div>
                </FilterSection>

                {/* Colors */}
                {availableColors.length > 0 && (
                    <FilterSection title="Colorway" isOpen={true}>
                        <div className="grid grid-cols-5 gap-2">
                            {availableColors.map((color) => {
                                const isActive = currentColor === color;
                                const colorHex = getColorStyle(color);
                                const isWhite = colorHex.toLowerCase() === '#ffffff' || color.toLowerCase() === 'white';

                                return (
                                    <button
                                        key={color}
                                        onClick={() => handleFilterChange("color", isActive ? "" : color)}
                                        className={cn(
                                            "w-10 h-10 flex items-center justify-center transition-all relative group clip-path-slant-right",
                                            isActive ? "scale-110" : "hover:opacity-80"
                                        )}
                                        style={{ backgroundColor: colorHex }}
                                        title={color}
                                    >
                                        {/* Border Overlay */}
                                        <div className={cn(
                                            "absolute inset-0 border-[2px] pointer-events-none transition-colors",
                                            isActive ? "border-[#B4F000]" : "border-transparent group-hover:border-white/20"
                                        )} />

                                        {isActive && <Check className={cn("w-4 h-4", isWhite ? "text-black" : "text-white")} />}
                                        <span className="sr-only">{color}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </FilterSection>
                )}

                {/* Sizes */}
                {availableSizes.length > 0 && (
                    <FilterSection title="specs / Size" isOpen={true}>
                        {/* Clothing Sizes */}
                        {categorizedSizes.clothing.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-[10px] text-[#B4F000] uppercase font-bold tracking-widest mb-2 font-mono">Apparel</h4>
                                <div className="grid grid-cols-4 gap-2">
                                    {categorizedSizes.clothing.map(size => (
                                        <SizeButton
                                            key={size}
                                            label={size}
                                            isActive={currentSize === size}
                                            onClick={() => handleFilterChange("size", currentSize === size ? "" : size)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tech/Other Sizes */}
                        {(categorizedSizes.tech.length > 0 || categorizedSizes.other.length > 0) && (
                            <div>
                                <h4 className="text-[10px] text-[#B4F000] uppercase font-bold tracking-widest mb-2 font-mono">Tech Specs</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {[...categorizedSizes.tech, ...categorizedSizes.other].map(size => (
                                        <SizeButton
                                            key={size}
                                            label={size}
                                            isActive={currentSize === size}
                                            onClick={() => handleFilterChange("size", currentSize === size ? "" : size)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </FilterSection>
                )}

            </aside>
        </>
    );
}

// Sub-components for cleaner code
const FilterSection = ({ title, children, isOpen = true }: { title: string, children: React.ReactNode, isOpen?: boolean }) => (
    <div className="space-y-4">
        <h3 className="text-xs font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-2 font-[family-name:var(--font-oswald)]">
            <span className="w-2 h-2 bg-white/20" />
            {title}
        </h3>
        {children}
    </div>
);

const FilterOption = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="w-full text-left flex items-center group py-2"
    >
        <div className={cn(
            "w-4 h-4 mr-3 border flex items-center justify-center transition-all duration-300",
            isActive ? "bg-[#B4F000] border-[#B4F000]" : "border-white/20 bg-transparent group-hover:border-[#B4F000]"
        )}>
            {isActive && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
        </div>
        <span className={cn(
            "text-sm uppercase tracking-wider font-bold transition-all duration-300 font-mono",
            isActive ? "text-white" : "text-white/60 group-hover:text-white"
        )}>
            {label}
        </span>
    </button>
);

const PriceInput = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder: string }) => (
    <div className="space-y-1">
        <label className="text-[9px] text-[#B4F000] uppercase font-bold tracking-widest font-mono">{label}</label>
        <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B4F000] text-xs font-bold">₹</span>
            <input
                type="number"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 text-xs text-white font-mono py-3 pl-7 pr-2 focus:border-[#B4F000] focus:ring-1 focus:ring-[#B4F000]/50 placeholder:text-white/10 transition-all outline-none"
            />
            {/* Corner Markers */}
            <div className="absolute top-0 right-0 w-1 h-1 bg-white/20 group-focus-within:bg-[#B4F000]" />
            <div className="absolute bottom-0 left-0 w-1 h-1 bg-white/20 group-focus-within:bg-[#B4F000]" />
        </div>
    </div>
);

const SizeButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "py-2 px-1 text-[10px] font-bold uppercase transition-all truncate border relative overflow-hidden",
            isActive
                ? "bg-[#B4F000] text-black border-[#B4F000]"
                : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white"
        )}
        title={label}
    >
        <span className="relative z-10">{label}</span>
        {isActive && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
    </button>
);
