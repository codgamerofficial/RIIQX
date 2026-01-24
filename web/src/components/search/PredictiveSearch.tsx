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
                    className="fixed inset-0 z-[100] bg-[#0B0B0B]/98 backdrop-blur-3xl flex flex-col pt-4 sm:pt-12 px-6"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-[110]"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative group w-full mb-12">
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="SEARCH ARCHIVE..."
                                className="w-full bg-transparent border-b border-white/10 text-4xl md:text-6xl font-black text-white placeholder-white/10 py-8 pr-16 focus:outline-none focus:border-white transition-all uppercase tracking-tighter"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Search className="w-8 h-8" />}
                            </button>
                        </form>

                        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">

                            {/* RESULTS VIEW */}
                            {query.length >= 2 ? (
                                <div className="space-y-12">
                                    {/* Typo Suggestion */}
                                    {typoSuggestion && results.products.length === 0 && (
                                        <div className="flex items-center gap-3 text-white/60 text-lg">
                                            <AlertCircle className="w-5 h-5 text-accent" />
                                            <span>Did you mean </span>
                                            <button onClick={handleTypoClick} className="text-white font-bold underline decoration-accent decoration-2 underline-offset-4">
                                                {typoSuggestion}
                                            </button>
                                            <span>?</span>
                                        </div>
                                    )}

                                    {/* Product Results */}
                                    {results.products.length > 0 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {results.products.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${product.handle}`}
                                                    onClick={onClose}
                                                    className="group block"
                                                >
                                                    <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-neutral-900 mb-4">
                                                        {product.featuredImage && (
                                                            <Image
                                                                src={product.featuredImage.url}
                                                                alt={product.title}
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                                    </div>
                                                    <h4 className="text-white font-bold uppercase tracking-tight text-sm truncate group-hover:text-gray-300 transition-colors">
                                                        {product.title}
                                                    </h4>
                                                    <span className="text-white/50 text-xs font-mono mt-1 block">
                                                        {product.priceRange?.minVariantPrice?.amount} {product.priceRange?.minVariantPrice?.currencyCode}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Suggestions / Topics */}
                                    {results.queries.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Suggested</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {results.queries.map((q) => (
                                                    <button
                                                        key={q.text}
                                                        onClick={() => setQuery(q.text)}
                                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-sm transition-colors"
                                                    >
                                                        {q.styledText || q.text}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Collections */}
                                    {results.collections.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Collections</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {results.collections.map((col) => (
                                                    <Link
                                                        key={col.id}
                                                        href={`/collections/${col.handle}`}
                                                        onClick={onClose}
                                                        className="p-4 border border-white/10 hover:border-white/30 rounded flex items-center justify-between group transition-colors"
                                                    >
                                                        <span className="text-white font-bold">{col.title}</span>
                                                        <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white -translate-x-2 group-hover:translate-x-0 transition-all" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {!loading && results.products.length === 0 && results.collections.length === 0 && !typoSuggestion && (
                                        <div className="text-center py-20">
                                            <p className="text-white/30 text-xl font-light">No results found for "{query}"</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* DEFAULT STATE (Empty Query) */
                                <div className="grid md:grid-cols-2 gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div>
                                        <h3 className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-[0.2em] mb-8">
                                            <TrendingUp className="w-4 h-4" /> Trending Now
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {TRENDING_TERMS.map((term) => (
                                                <button
                                                    key={term}
                                                    onClick={() => setQuery(term)}
                                                    className="px-5 py-2.5 rounded-none border border-white/20 text-white hover:bg-white hover:text-black hover:border-white transition-all text-sm font-bold uppercase tracking-wider"
                                                >
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-8">
                                            Explore Collections
                                        </h3>
                                        <ul className="space-y-1">
                                            {[
                                                { name: "New Arrivals", href: "/new-arrivals" },
                                                { name: "Best Sellers", href: "/best-sellers" },
                                                { name: "Accessories", href: "/collections/accessories" },
                                                { name: "Streetwear", href: "/collections/streetwear" }
                                            ].map((link) => (
                                                <li key={link.name}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={onClose}
                                                        className="flex items-center justify-between group py-3 border-b border-white/5 hover:border-white/20 transition-colors"
                                                    >
                                                        <span className="text-2xl text-white font-black uppercase tracking-tighter group-hover:pl-4 transition-all duration-300">{link.name}</span>
                                                        <ArrowRight className="w-6 h-6 text-white/30 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                                    </Link>
                                                </li>
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

