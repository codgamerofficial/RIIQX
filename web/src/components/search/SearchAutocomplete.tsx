"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/lib/shopify/types";

interface SearchAutocompleteProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchAutocomplete({ isOpen, onClose }: SearchAutocompleteProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Mock recent searches from localStorage
    const recentSearches = ["Oversized T-Shirt", "Joggers", "Hoodies"];
    const popularSearches = ["Streetwear", "Graphic Tees", "Sneakers", "Accessories"];

    const handleSearch = async (searchQuery: string) => {
        setQuery(searchQuery);
        if (searchQuery.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setResults(data.products || []);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?q=${encodeURIComponent(query)}`);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
        >
            <div className="max-w-4xl mx-auto px-4 pt-24">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-8 h-8" />
                </button>

                {/* Search Form */}
                <form onSubmit={handleSubmit} className="relative mb-12">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search for products..."
                        autoFocus
                        className="w-full bg-transparent border-b-2 border-white/10 text-5xl md:text-6xl font-black text-white placeholder-white/10 py-8 pr-20 focus:outline-none focus:border-bewakoof-yellow transition-colors uppercase tracking-tight"
                    />
                    <button
                        type="submit"
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-bewakoof-yellow transition-colors"
                    >
                        <Search className="w-10 h-10" />
                    </button>
                </form>

                {/* Results */}
                {query.length >= 2 && (
                    <div className="space-y-6">
                        {loading ? (
                            <p className="text-white/50 text-center">Searching...</p>
                        ) : results.length > 0 ? (
                            <>
                                <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                                    Products ({results.length})
                                </h3>
                                <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                                    {results.slice(0, 5).map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                router.push(`/shop/${product.handle}`);
                                                onClose();
                                            }}
                                            className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                                        >
                                            <div className="relative w-16 h-16 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
                                                {product.featuredImage && (
                                                    <Image
                                                        src={product.featuredImage.url}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-bold">{product.title}</p>
                                                <p className="text-bewakoof-yellow text-sm">
                                                    ₹{product.priceRange.minVariantPrice.amount}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-white/50 text-center">No products found</p>
                        )}
                    </div>
                )}

                {/* Suggestions */}
                {query.length < 2 && (
                    <div className="space-y-8">
                        {/* Recent Searches */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-4 h-4 text-white/50" />
                                <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                                    Recent Searches
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {recentSearches.map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => handleSearch(term)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-sm transition-all"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Popular Searches */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-4 h-4 text-bewakoof-yellow" />
                                <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                                    Trending Now
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {popularSearches.map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => handleSearch(term)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-bewakoof-yellow rounded-full text-white text-sm transition-all"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <p className="mt-8 text-center text-white/30 text-sm tracking-widest uppercase">
                    Press Enter to search
                </p>
            </div>
        </motion.div>
    );
}
