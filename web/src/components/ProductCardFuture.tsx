"use client";

import { Product } from "@/lib/shopify/types";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";

interface ProductCardFutureProps {
    product: Product;
    priority?: boolean;
}

export function ProductCardFuture({ product, priority = false }: ProductCardFutureProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { isInWishlist, addItem, removeItem } = useWishlistStore();
    const isLiked = isInWishlist(product.id);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);
    // const isLiked = isInWishlist(product.id); // Removed duplicate

    const price = product.priceRange.minVariantPrice.amount;
    const currency = product.priceRange.minVariantPrice.currencyCode;

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLiked) {
            removeItem(product.id);
        } else {
            addItem(product);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container - Glassmorphic feel */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#111] rounded-lg mb-4">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />

                <Link href={`/product/${product.handle}`} className="block h-full w-full">
                    {product.featuredImage && (
                        <Image
                            src={product.featuredImage.url}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                            priority={priority}
                        />
                    )}
                </Link>

                {/* Floating Action Buttons */}
                <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                    <button
                        onClick={toggleWishlist}
                        className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all"
                    >
                        <Heart className={`w-4 h-4 ${hasMounted && isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                </div>

                {/* Quick Add Overlay */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ duration: 0.3, ease: "circOut" }}
                            className="absolute bottom-0 left-0 right-0 p-4 z-20"
                        >
                            <button className="w-full py-3 bg-white/90 backdrop-blur-xl text-black font-bold text-xs tracking-widest uppercase hover:bg-white transition-colors rounded-sm flex items-center justify-center gap-2">
                                <ShoppingBag className="w-3 h-3" />
                                Quick Add
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Product Info */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-medium text-white mb-1 leading-snug group-hover:underline decoration-white/30 underline-offset-4">
                        <Link href={`/product/${product.handle}`}>{product.title}</Link>
                    </h3>
                    <p className="text-xs text-white/50 font-mono">{product.variants?.edges?.length || 0} Colors</p>
                </div>
                <div className="text-sm font-bold text-white font-mono">
                    {price} {currency}
                </div>
            </div>
        </motion.div>
    );
}
