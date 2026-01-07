"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Collection } from "@/lib/shopify/types";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Filter, X } from "lucide-react";

interface FilterSidebarProps {
    collections: Collection[];
    className?: string;
}

export function FilterSidebar({ collections, className = "" }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

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

        // Reset page on filter change
        params.delete("after");

        router.push(`?${params.toString()}`);
        setIsOpen(false); // Close on mobile
    };

    const handleCollectionClick = (handle: string) => {
        // If we are on /products, we filter by collection param? 
        // OR better, we navigate to /collections/[handle] for SEO and cleaner URLs.
        // But if we want combined filters, we might stick to query params.
        // For this implementation, let's navigate to the collection page.
        router.push(`/collections/${handle}`);
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed bottom-4 left-4 z-40 bg-primary text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg"
            >
                <Filter className="w-4 h-4" /> Filters
            </button>

            {/* Sidebar Container */}
            <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-black/95 backdrop-blur-xl border-r border-white/10 p-6 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 md:bg-transparent md:border-none md:p-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${className}
      `}>
                <div className="flex items-center justify-between mb-8 md:hidden">
                    <h2 className="text-xl font-bold text-white">Filters</h2>
                    <button onClick={() => setIsOpen(false)}><X className="w-6 h-6 text-white" /></button>
                </div>

                <div className="space-y-8">
                    {/* Categories */}
                    <div>
                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Categories</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => router.push('/products')}
                                className={`block w-full text-left text-sm py-1 hover:text-white transition-colors ${!selectedCollection ? 'text-primary font-bold' : 'text-gray-400'}`}
                            >
                                All Products
                            </button>

                            {/* Specific Categories requested by user */}
                            {['T-shirt', 'Hoodies', 'Shirt', 'Jeans', 'Sweatshirt', 'Accessories', 'Mobile Back Case'].map((cat) => {
                                // Create a URL-friendly handle
                                const handle = cat.toLowerCase().replace(/\s+/g, '-');
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => handleCollectionClick(handle)}
                                        className={`block w-full text-left text-sm py-1 hover:text-white transition-colors ${selectedCollection === handle ? 'text-primary font-bold' : 'text-gray-400'}`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}

                            <div className="w-full h-px bg-white/10 my-4" />

                            {/* Dynamic Collections from Shopify (avoiding duplicates if possible, or just append) */}
                            {collections
                                .filter(c => !['new-arrivals', 'best-sellers'].includes(c.handle)) // Filter out functional ones if needed
                                .map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => handleCollectionClick(c.handle)}
                                        className={`block w-full text-left text-sm py-1 hover:text-white transition-colors ${selectedCollection === c.handle ? 'text-primary font-bold' : 'text-gray-400'}`}
                                    >
                                        {c.title}
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Price Range</h3>
                        <div className="px-2">
                            <div className="flex justify-between text-white text-xs mb-2">
                                <span>₹{priceRange[0]}</span>
                                <span>₹{priceRange[1]}</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="10000" step="50"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <button
                                onClick={handleApply}
                                className="w-full mt-4 bg-white/10 border border-white/20 text-white py-2 rounded-lg text-xs font-bold hover:bg-white hover:text-black transition-colors"
                            >
                                Apply Price
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
