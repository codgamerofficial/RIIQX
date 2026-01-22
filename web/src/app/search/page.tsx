"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, TrendingUp, Clock, ArrowLeft, ArrowRight, Filter } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
        <main className="min-h-screen bg-white text-rich-black pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tighter mb-2">
                        Search <span className="text-cherry-red">Store</span>
                    </h1>
                    <p className="text-neutral-gray text-lg">Find your next favorite piece.</p>
                </header>

                {/* Search Input */}
                <div className="flex gap-4 mb-16">
                    <form onSubmit={handleSubmit} className="relative flex-1">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="SEARCH PRODUCTS..."
                            autoFocus
                            className="w-full bg-transparent border-b-2 border-neutral-gray text-3xl md:text-5xl font-black text-rich-black placeholder-neutral-gray py-6 pr-16 focus:outline-none focus:border-cherry-red transition-colors uppercase tracking-tight"
                        />
                        <button
                            type="submit"
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-gray hover:text-cherry-red transition-colors"
                        >
                            <ArrowRight className="w-8 h-8 md:w-10 md:h-10" />
                        </button>
                    </form>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="px-6 py-3 border-neutral-gray text-rich-black hover:bg-cherry-red hover:text-white">
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Filter Products</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Category</label>
                                    <select className="w-full mt-1 p-2 border border-neutral-gray rounded">
                                        <option>All</option>
                                        <option>Men</option>
                                        <option>Women</option>
                                        <option>Accessories</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Price Range</label>
                                    <div className="flex gap-2 mt-1">
                                        <input type="number" placeholder="Min" className="flex-1 p-2 border border-neutral-gray rounded" />
                                        <input type="number" placeholder="Max" className="flex-1 p-2 border border-neutral-gray rounded" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Color</label>
                                    <div className="flex gap-2 mt-1">
                                        <button className="w-8 h-8 bg-red-500 rounded-full"></button>
                                        <button className="w-8 h-8 bg-blue-500 rounded-full"></button>
                                        <button className="w-8 h-8 bg-black rounded-full"></button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Size</label>
                                    <div className="flex gap-2 mt-1 flex-wrap">
                                        <button className="px-3 py-1 border border-neutral-gray rounded">S</button>
                                        <button className="px-3 py-1 border border-neutral-gray rounded">M</button>
                                        <button className="px-3 py-1 border border-neutral-gray rounded">L</button>
                                    </div>
                                </div>
                                <Button className="w-full bg-cherry-red hover:bg-cherry-red/90 text-white">Apply Filters</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

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
                                    <div className="w-8 h-8 border-2 border-cherry-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-neutral-gray uppercase tracking-widest text-sm">Searching Catalog...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between border-b border-neutral-gray pb-4 mb-6">
                                        <h3 className="text-sm font-bold text-neutral-gray uppercase tracking-widest">
                                            Found {results.length} Results
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {results.map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() => router.push(`/shop/${product.handle}`)}
                                                className="group flex items-center gap-6 p-4 bg-neutral-light hover:bg-neutral-light/80 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-neutral-gray"
                                            >
                                                <div className="relative w-20 h-24 md:w-24 md:h-32 bg-neutral-light rounded-xl overflow-hidden flex-shrink-0">
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
                                                    <h3 className="text-rich-black font-bold text-lg md:text-xl uppercase mb-1">{product.title}</h3>
                                                    <p className="text-cherry-red font-mono text-lg">
                                                        {Number(product.priceRange.minVariantPrice.amount).toLocaleString('en-IN', { style: 'currency', currency: product.priceRange.minVariantPrice.currencyCode })}
                                                    </p>
                                                </div>
                                                <div className="hidden md:block">
                                                    <div className="w-10 h-10 rounded-full border border-neutral-gray flex items-center justify-center group-hover:bg-cherry-red group-hover:border-cherry-red transition-colors">
                                                        <ArrowRight className="w-5 h-5 text-rich-black group-hover:text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-24 border border-dashed border-neutral-gray rounded-3xl">
                                    <Search className="w-12 h-12 text-neutral-gray mx-auto mb-4" />
                                    <p className="text-neutral-gray text-lg">No products found for "{query}"</p>
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
                                    <Clock className="w-5 h-5 text-cherry-red" />
                                    <h3 className="text-sm font-bold text-neutral-gray uppercase tracking-widest">
                                        Recent Searches
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {recentSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => handleSearch(term)}
                                            className="px-6 py-3 bg-neutral-light hover:bg-neutral-light/80 border border-neutral-gray hover:border-cherry-red rounded-full text-rich-black font-medium transition-all"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Searches */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <TrendingUp className="w-5 h-5 text-cherry-red" />
                                    <h3 className="text-sm font-bold text-neutral-gray uppercase tracking-widest">
                                        Trending Now
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {popularSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => handleSearch(term)}
                                            className="px-6 py-3 bg-transparent border border-neutral-gray hover:border-cherry-red hover:text-cherry-red rounded-full text-rich-black font-medium transition-all"
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
