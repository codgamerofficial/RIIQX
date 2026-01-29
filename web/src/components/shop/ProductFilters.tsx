"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { X, Check, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
            } else { // Toggle logic could go here, but stick to single select for now for simplicity
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

    // Helper: Categorize Sizes (Simple Heuristic)
    const categorizedSizes = availableSizes.reduce((acc, size) => {
        const lowerSize = size.toLowerCase();
        // Check for phone models
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
        <aside className="w-full md:w-72 flex-shrink-0 space-y-12 pr-4">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] font-mono">
                    Filter By
                </h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="text-[10px] font-bold text-accent hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1 group"
                    >
                        Clear All <X className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                    </button>
                )}
            </div>

            {/* Categories */}
            <FilterSection title="Category" isOpen={true}>
                <div className="space-y-1">
                    <FilterOption
                        label="All Products"
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
                <FilterSection title="Color" isOpen={true}>
                    <div className="grid grid-cols-5 gap-2">
                        {availableColors.map((color) => {
                            const isActive = currentColor === color;
                            const colorHex = getColorStyle(color);
                            const isWhite = colorHex.toLowerCase() === '#ffffff' || color.toLowerCase() === 'white';

                            return (
                                <button
                                    key={color}
                                    onClick={() => handleFilterChange("color", isActive ? "" : color)}
                                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all relative group ${isActive ? 'border-accent scale-110' : 'border-white/10 hover:border-white/40'}`}
                                    style={{ backgroundColor: colorHex }}
                                    title={color}
                                >
                                    {isActive && <Check className={`w-4 h-4 ${isWhite ? 'text-black' : 'text-white'}`} />}
                                    <span className="sr-only">{color}</span>
                                </button>
                            );
                        })}
                    </div>
                </FilterSection>
            )}

            {/* Sizes */}
            {availableSizes.length > 0 && (
                <FilterSection title="Size" isOpen={true}>
                    {/* Clothing Sizes */}
                    {categorizedSizes.clothing.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">Apparel</h4>
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
                            <h4 className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">Accessories / Tech</h4>
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
    );
}

// Sub-components for cleaner code
const FilterSection = ({ title, children, isOpen = true }: { title: string, children: React.ReactNode, isOpen?: boolean }) => (
    <div className="space-y-4">
        <h3 className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] flex items-center justify-between">
            {title}
        </h3>
        {children}
    </div>
);

const FilterOption = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full text-left flex items-center justify-between group py-1`}
    >
        <span className={`text-sm uppercase tracking-wider font-bold transition-colors ${isActive ? "text-accent" : "text-white/60 group-hover:text-white"}`}>
            {label}
        </span>
        {isActive && <div className="w-1.5 h-1.5 bg-accent rounded-full" />}
    </button>
);

const PriceInput = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder: string }) => (
    <div className="space-y-1">
        <label className="text-[10px] text-white/30 uppercase font-bold">{label}</label>
        <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs font-bold">₹</span>
            <input
                type="number"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-neutral-900/50 border border-white/10 rounded-none py-3 pl-7 pr-2 text-xs text-white font-mono focus:border-accent focus:outline-none transition-all placeholder:text-white/10"
            />
        </div>
    </div>
);

const SizeButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`border py-2 px-1 text-[10px] font-bold uppercase transition-all truncate hover:border-white/40 ${isActive
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/70 border-white/10"
            }`}
        title={label}
    >
        {label}
    </button>
);
