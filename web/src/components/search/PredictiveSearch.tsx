"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { searchProducts } from "@/app/actions/search";
// Note: Assuming useDebounce exists or I will implement a simple one inside if not.

// Simple debounce hook implementation if not present
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

interface PredictiveSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PredictiveSearch({ isOpen, onClose }: PredictiveSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounceValue(query, 300);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            const data = await searchProducts(debouncedQuery);
            setResults(data.products || []);
            setLoading(false);
        };

        fetchResults();
    }, [debouncedQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-rich-black/95 backdrop-blur-xl flex flex-col pt-4 sm:pt-12 px-4"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors z-50"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative group w-full mb-8">
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="SEARCH FOR GEAR..."
                                className="w-full bg-transparent border-b-2 border-white/10 text-3xl md:text-5xl font-black text-white placeholder-white/20 py-6 pr-12 focus:outline-none focus:border-cherry-red transition-all uppercase tracking-tight"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-cherry-red transition-colors"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Search className="w-8 h-8" />}
                            </button>
                        </form>

                        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                            {/* Results */}
                            {query.length >= 2 && results.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.handle}`}
                                            onClick={onClose}
                                            className="group flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold/30 transition-all"
                                        >
                                            <div className="relative w-20 h-24 overflow-hidden rounded bg-white/5">
                                                {product.featuredImage && (
                                                    <Image
                                                        src={product.featuredImage.url}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <h4 className="text-white font-bold truncate group-hover:text-gold transition-colors">
                                                    {product.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-sm text-neutral-gray">
                                                        {product.priceRange?.minVariantPrice?.amount} {product.priceRange?.minVariantPrice?.currencyCode}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : query.length >= 2 && !loading && results.length === 0 ? (
                                <div className="text-center py-20 text-white/40">
                                    <p className="text-xl">No products found matching "{query}"</p>
                                </div>
                            ) : (
                                /* Default State / Trending */
                                <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <h3 className="flex items-center gap-2 text-sm font-bold text-gold uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                                            <TrendingUp className="w-4 h-4" /> Trending Now
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {["Cyberpunk Jacket", "Neon Accessories", "Cargo Pants", "Oversized Tee", "Holo-Visor"].map((term) => (
                                                <button
                                                    key={term}
                                                    onClick={() => setQuery(term)}
                                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-cherry-red hover:text-white transition-all text-sm font-medium"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6 border-b border-white/10 pb-2">
                                            Collections
                                        </h3>
                                        <ul className="space-y-4">
                                            {[
                                                { name: "New Arrivals", href: "/new-arrivals" },
                                                { name: "Best Sellers", href: "/best-sellers" },
                                                { name: "Accessories", href: "/accessories" },
                                                { name: "Limited Edition", href: "/collections/limited-edition" }
                                            ].map((link) => (
                                                <li key={link.name}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={onClose}
                                                        className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-lg transition-colors"
                                                    >
                                                        <span className="text-lg text-white font-medium group-hover:pl-2 transition-all">{link.name}</span>
                                                        <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-cherry-red opacity-0 group-hover:opacity-100 transition-all" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hidden sm:block text-center pt-8 border-t border-white/10 text-white/30 text-xs tracking-widest uppercase">
                            Press Enter to view all results
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
