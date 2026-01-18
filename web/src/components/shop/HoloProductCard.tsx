"use client";

import { useRealityStore } from "@/store/reality-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";

export function HoloProductCard({ product, index = 0, onClick }: { product: Product, index?: number, onClick?: () => void }) {
    const mode = useRealityStore((state) => state.mode);
    const isFashion = mode === 'fashion';

    return (
        <motion.div
            layoutId={`card-${product.id}`}
            onClick={onClick}
            initial={{ y: 0 }}
            animate={isFashion ? {
                y: [0, -20, 0],
                transition: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                }
            } : {
                y: 0,
                transition: { duration: 0.5 }
            }}
            className={cn(
                "relative group cursor-none overflow-hidden transition-colors duration-700 h-full",
                isFashion
                    ? "rounded-3xl hover:shadow-2xl hover:shadow-primary/20 bg-white/5 border border-white/10"
                    : "rounded-none clip-path-polygon border border-primary/50 bg-black/80 hover:bg-black/90"
            )}
        >
            {/* Image Container */}
            <div className={cn(
                "relative aspect-square overflow-hidden transition-all duration-700",
                isFashion ? "rounded-t-3xl" : "rounded-none"
            )}>
                {/* Visual Placeholder */}
                <motion.div
                    layoutId={`image-${product.id}`}
                    className={cn(
                        "w-full h-full animate-pulse transition-colors duration-700 bg-cover bg-center",
                        isFashion ? "bg-neutral-800" : "bg-neutral-900"
                    )}
                    style={{ backgroundImage: product.featuredImage ? `url(${product.featuredImage.url})` : undefined }}
                />

                {/* Electronics overlay */}
                {!isFashion && (
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </div>

            {/* Info Section */}
            <div className="p-6 space-y-2">
                <motion.h3
                    layoutId={`title-${product.id}`}
                    className={cn(
                        "text-xl transition-all duration-500",
                        isFashion
                            ? "font-serif italic text-white"
                            : "font-mono uppercase tracking-widest text-primary"
                    )}
                >
                    {product.title}
                </motion.h3>

                <motion.p
                    layoutId={`price-${product.id}`}
                    className={cn(
                        "text-sm transition-all duration-500",
                        isFashion ? "text-white/60" : "text-white/40 font-mono"
                    )}
                >
                    {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                </motion.p>

                {/* Adaptive CTA */}
                <button className={cn(
                    "w-full mt-4 py-3 transition-all duration-300 pointer-events-none", // Pointer events none so card click takes precedence
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
