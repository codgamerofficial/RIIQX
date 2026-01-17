"use client";

import { useRealityStore } from "@/store/reality-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Product {
    id: string;
    title: string;
    price: string;
    image: string;
    category: 'fashion' | 'electronics';
}

export function HoloProductCard({ product }: { product: Product }) {
    const mode = useRealityStore((state) => state.mode);
    const isFashion = mode === 'fashion';

    return (
        <motion.div
            layout // Framer motion layout animation for smooth resizing if needed
            className={cn(
                "relative group cursor-none overflow-hidden transition-all duration-700",
                isFashion
                    ? "rounded-3xl hover:shadow-2xl hover:shadow-primary/20 bg-white/5 border border-white/10"
                    : "rounded-none clip-path-polygon border border-primary/50 bg-black/80 hover:bg-black/90"
            )}
        >
            {/* Image Container */}
            <div className={cn(
                "relative aspect-square overflow-hidden",
                isFashion ? "rounded-t-3xl" : "rounded-none"
            )}>
                {/* Placeholder Image - Would be real Next/Image */}
                <div className="w-full h-full bg-neutral-800 animate-pulse" />

                {/* Electronics overlay */}
                {!isFashion && (
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </div>

            {/* Info Section */}
            <div className="p-6 space-y-2">
                <h3 className={cn(
                    "text-xl transition-all",
                    isFashion
                        ? "font-serif italic text-white"
                        : "font-mono uppercase tracking-widest text-primary"
                )}>
                    {product.title}
                </h3>

                <p className={cn(
                    "text-sm",
                    isFashion ? "text-white/60" : "text-white/40 font-mono"
                )}>
                    {product.price}
                </p>

                {/* Adaptive CTA */}
                <button className={cn(
                    "w-full mt-4 py-3 transition-all",
                    isFashion
                        ? "rounded-full bg-white text-black font-serif hover:bg-primary hover:text-white"
                        : "rounded-none border border-primary text-primary hover:bg-primary hover:text-black font-mono uppercase tracking-widest"
                )}>
                    {isFashion ? "Add to Cart" : "INITIALIZE_PURCHASE"}
                </button>
            </div>

            {/* Electronics Decorative Corners */}
            {!isFashion && (
                <>
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary" />
                </>
            )}

        </motion.div>
    );
}
