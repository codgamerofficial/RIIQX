"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, TrendingUp, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // Mock data - syncing with SearchAutocomplete
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
        }
    };

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">
                        Search <span className="text-[#D9F99D]">Store</span>
                    </h1>
                    <p className="text-white/50 text-lg">Find your next favorite piece.</p>
                </header>

                {/* Search Input */}
                <form onSubmit={handleSubmit} className="relative mb-16">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="SEARCH PRODUCTS..."
                        autoFocus
                        className="w-full bg-transparent border-b-2 border-white/20 text-3xl md:text-5xl font-black text-white placeholder-white/10 py-6 pr-16 focus:outline-none focus:border-[#D9F99D] transition-colors uppercase tracking-tight"
                    />
                    <button
                        type="submit"
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/30 hover:text-[#D9F99D] transition-colors"
                    >
                        <ArrowRight className="w-8 h-8 md:w-10 md:h-10" />
                    </button>
                </form>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                    {query.length >= 2 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="w-8 h-8 border-2 border-[#D9F99D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-white/50 uppercase tracking-widest text-sm">Searching Catalog...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                                            Found {results.length} Results
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {results.map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() => router.push(`/shop/${product.handle}`)}
                                                className="group flex items-center gap-6 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/10"
                                            >
                                                <div className="relative w-20 h-24 md:w-24 md:h-32 bg-neutral-900 rounded-xl overflow-hidden flex-shrink-0">
                                                    {product.featuredImage && (
                                                        <Image
                                                            src={product.featuredImage.url}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-white font-bold text-lg md:text-xl uppercase mb-1">{product.title}</h3>
                                                    <p className="text-[#D9F99D] font-mono text-lg">
                                                        {Number(product.priceRange.minVariantPrice.amount).toLocaleString('en-IN', { style: 'currency', currency: product.priceRange.minVariantPrice.currencyCode })}
                                                    </p>
                                                </div>
                                                <div className="hidden md:block">
                                                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#D9F99D] group-hover:border-[#D9F99D] transition-colors">
                                                        <ArrowRight className="w-5 h-5 text-white group-hover:text-black" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
                                    <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/50 text-lg">No products found for "{query}"</p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid md:grid-cols-2 gap-12"
                        >
                            {/* Recent Searches */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <Clock className="w-5 h-5 text-[#D9F99D]" />
                                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                                        Recent Searches
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {recentSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => handleSearch(term)}
                                            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full text-white font-medium transition-all"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Searches */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <TrendingUp className="w-5 h-5 text-[#D9F99D]" />
                                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">
                                        Trending Now
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {popularSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => handleSearch(term)}
                                            className="px-6 py-3 bg-transparent border border-white/20 hover:border-[#D9F99D] hover:text-[#D9F99D] rounded-full text-white font-medium transition-all"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
