"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Collection } from "@/lib/shopify/types";
import { Filter, X, ChevronRight } from "lucide-react";

interface FilterSidebarProps {
    collections: Collection[];
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export function FilterSidebar({ collections, className = "", isOpen, onClose }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State from URL
    const selectedCollection = searchParams.get("collection");
    const minPrice = searchParams.get("minPrice") || "0";
    const maxPrice = searchParams.get("maxPrice") || "10000";

    // Local state for slider
    const [priceRange, setPriceRange] = useState([parseInt(minPrice), parseInt(maxPrice)]);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", priceRange[0].toString());
        params.set("maxPrice", priceRange[1].toString());
        params.delete("after");
        router.push(`?${params.toString()}`);
        if (onClose) onClose();
    };

    const handleCollectionClick = (handle: string) => {
        router.push(`/collections/${handle}`);
        if (onClose) onClose();
    };

    return (
        <>
            <div className={`
                fixed inset-y-0 left-0 z-50 w-full md:w-80 bg-[#0B0B0B] border-r border-white/5 p-8 transform transition-transform duration-500 ease-[0.16,1,0.3,1]
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                ${className}
            `}>
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter font-display">Filter</h2>
                    <button onClick={onClose}>
                        <X className="w-6 h-6 text-white hover:text-white/50 transition-colors" />
                    </button>
                </div>

                <div className="space-y-12">
                    {/* Categories */}
                    <div>
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Collections</h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => router.push('/products')}
                                className={`block w-full text-left text-sm uppercase tracking-wider hover:text-white transition-all ${!selectedCollection ? 'text-white font-bold pl-2 border-l-2 border-white' : 'text-white/40'}`}
                            >
                                All Products
                            </button>

                            {collections.length > 0 && collections
                                .filter(c => !['new-arrivals', 'best-sellers'].includes(c.handle))
                                .map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => handleCollectionClick(c.handle)}
                                        className={`group block w-full text-left text-sm uppercase tracking-wider hover:text-white transition-all ${selectedCollection === c.handle ? 'text-white font-bold pl-2 border-l-2 border-white' : 'text-white/40'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{c.title}</span>
                                            <ChevronRight className={`w-3 h-3 opacity-0 -translate-x-2 transition-all duration-300 ${selectedCollection === c.handle ? 'opacity-100 translate-x-0' : 'group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                        </div>
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Price Range</h3>
                        <div className="px-1">
                            <div className="flex justify-between text-white font-mono text-xs mb-4">
                                <span>₹ {priceRange[0]}</span>
                                <span>₹ {priceRange[1]}+</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="10000" step="100"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="w-full h-px bg-white/20 appearance-none cursor-pointer accent-white"
                            />
                            <button
                                onClick={handleApply}
                                className="w-full mt-8 bg-white text-black py-4 text-xs font-black uppercase tracking-widest hover:bg-white/90 transition-colors"
                            >
                                Update Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-500"
                    onClick={onClose}
                />
            )}
        </>
    );
}
