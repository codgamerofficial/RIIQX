"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, ArrowRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { getPredictiveSearchResults } from "@/lib/shopify";
// We need a server action to call the private API function
import { predictiveSearchAction } from "@/app/actions/search";

// Simple debounce hook
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

const TRENDING_TERMS = ["Oversized", "Hoodie", "Cyberpunk", "Cargo", "Limited"];
const TYPO_CORRECTIONS: Record<string, string> = {
    "tshrt": "T-Shirt",
    "hodie": "Hoodie",
    "oversze": "Oversized",
    "shos": "Shoes",
    "pnts": "Pants",
};

export function PredictiveSearch({ isOpen, onClose }: PredictiveSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ products: any[], collections: any[], queries: any[] }>({ products: [], collections: [], queries: [] });
    const [loading, setLoading] = useState(false);
    const [typoSuggestion, setTypoSuggestion] = useState<string | null>(null);
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
                setResults({ products: [], collections: [], queries: [] });
                setTypoSuggestion(null);
                return;
            }
            setLoading(true);
            setTypoSuggestion(null);

            try {
                // Try to correct typo client-side quickly
                const normalized = debouncedQuery.toLowerCase();
                let effectiveQuery = debouncedQuery;

                // Simple dictionary check for basic typos
                for (const [typo, correct] of Object.entries(TYPO_CORRECTIONS)) {
                    if (normalized.includes(typo)) {
                        setTypoSuggestion(correct);
                        // We don't auto-search corrected term to avoid confusion, but we suggest it
                        // effectiveQuery = correct; 
                    }
                }

                // Call Server Action that wraps shopifyFetch
                const data = await predictiveSearchAction(effectiveQuery);
                setResults(data || { products: [], collections: [], queries: [] });

            } catch (error) {
                console.error("Search error", error);
            } finally {
                setLoading(false);
            }
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

    const handleTypoClick = () => {
        if (typoSuggestion) {
            setQuery(typoSuggestion);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-[#050505]/98 backdrop-blur-3xl flex flex-col pt-8 sm:pt-16 px-6 sm:px-12"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-[110] hover:rotate-90 duration-300"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative group w-full mb-16">
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="SEARCH ARCHIVE..."
                                className="w-full bg-transparent border-b-2 border-white/10 text-5xl md:text-8xl font-black text-white placeholder-white/10 py-8 pr-20 focus:outline-none focus:border-accent transition-all uppercase tracking-tighter font-display italic"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-accent transition-colors"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Search className="w-10 h-10" />}
                            </button>
                        </form>

                        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">

                            {/* RESULTS VIEW */}
                            {query.length >= 2 ? (
                                <div className="space-y-16">
                                    {/* Product Results */}
                                    {results.products.length > 0 && (
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                                            {results.products.map((product, idx) => (
                                                <motion.div
                                                    key={product.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                >
                                                    <Link
                                                        href={`/product/${product.handle}`}
                                                        onClick={onClose}
                                                        className="group block"
                                                    >
                                                        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-6 clip-path-slant-right-bottom">
                                                            {product.featuredImage && (
                                                                <Image
                                                                    src={product.featuredImage.url}
                                                                    alt={product.title}
                                                                    fill
                                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                                />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                                                                <span className="text-accent font-mono text-xs font-bold">VIEW ITEM</span>
                                                            </div>
                                                        </div>
                                                        <h4 className="text-white text-2xl font-black uppercase tracking-tighter font-display italic leading-none group-hover:text-accent transition-colors mb-2">
                                                            {product.title}
                                                        </h4>
                                                        <span className="text-white/50 text-sm font-mono block">
                                                            {product.priceRange?.minVariantPrice?.amount} {product.priceRange?.minVariantPrice?.currencyCode}
                                                        </span>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Fallback / Empty */}
                                    {!loading && results.products.length === 0 && results.collections.length === 0 && !typoSuggestion && (
                                        <div className="text-center py-20">
                                            <p className="text-white/30 text-2xl font-black uppercase tracking-widest font-display">No matches found for "{query}"</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* DEFAULT STATE (Empty Query) */
                                <div className="grid md:grid-cols-12 gap-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                    <div className="md:col-span-5">
                                        <h3 className="flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-8 font-mono">
                                            <TrendingUp className="w-4 h-4 text-accent" /> Trending Now
                                        </h3>
                                        <div className="flex flex-wrap gap-4">
                                            {TRENDING_TERMS.map((term) => (
                                                <button
                                                    key={term}
                                                    onClick={() => setQuery(term)}
                                                    className="px-6 py-3 border border-white/10 text-white hover:bg-white hover:text-black hover:border-white transition-all text-sm font-black uppercase tracking-widest font-display"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="md:col-span-7">
                                        <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-8 font-mono">
                                            Explore Collections
                                        </h3>
                                        <ul className="space-y-4">
                                            {[
                                                { name: "New Arrivals", href: "/new-arrivals" },
                                                { name: "Best Sellers", href: "/best-sellers" },
                                                { name: "Accessories", href: "/collections/accessories" },
                                                { name: "Streetwear", href: "/collections/streetwear" }
                                            ].map((link, i) => (
                                                <motion.li
                                                    key={link.name}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.1 + (i * 0.1) }}
                                                >
                                                    <Link
                                                        href={link.href}
                                                        onClick={onClose}
                                                        className="flex items-center justify-between group py-2 border-b border-white/5 hover:border-accent transition-colors"
                                                    >
                                                        <span className="text-4xl md:text-5xl text-white font-black uppercase tracking-tighter group-hover:text-accent group-hover:pl-6 transition-all duration-300 font-display italic">
                                                            {link.name}
                                                        </span>
                                                        <ArrowRight className="w-8 h-8 text-white/30 group-hover:text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-4" />
                                                    </Link>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

