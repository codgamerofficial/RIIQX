"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { useWishlistStore } from "@/store/useWishlistStore";
import { cn } from "@/lib/utils";

interface StreetwearProductCardProps {
    product: Product;
    priority?: boolean;
    className?: string;
}

export function StreetwearProductCard({ product, priority = false, className }: StreetwearProductCardProps) {
    const { addItem } = useWishlistStore();

    // Format Price
    const priceAmount = parseFloat(product.priceRange.minVariantPrice.amount);
    const currency = product.priceRange.minVariantPrice.currencyCode;
    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(priceAmount);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("group relative bg-[#0A0A0A] border border-white/5 hover:border-[#B4F000] transition-colors duration-300", className)}
        >
            {/* ═ TOP BAR ═ */}
            <div className="flex justify-between items-center p-3 border-b border-white/5 bg-[#080808] relative z-20">
                <span className="text-[10px] font-mono text-[#B4F000] uppercase tracking-widest">
                    //{product.handle.slice(0, 8)}
                </span>
                <div className="flex gap-2">
                    <span className="w-1.5 h-1.5 bg-[#B4F000] rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">In Stock</span>
                </div>
            </div>

            {/* ═ IMAGE CONTAINER ═ */}
            <div className="relative aspect-[3/4] overflow-hidden bg-black/50">
                <Link href={`/product/${product.handle}`} className="block w-full h-full">
                    {product.featuredImage ? (
                        <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            priority={priority}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <span className="text-white/20 font-mono text-xs">NO IMAGE</span>
                        </div>
                    )}
                </Link>

                {/* Hover Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                {/* ═ QUICK ACTIONS (Bottom Slide-in) ═ */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addItem(product);
                        }}
                        className="w-full py-3 bg-[#B4F000] text-black font-black uppercase tracking-widest text-xs hover:bg-[#c2ff0a] flex items-center justify-center gap-2 clip-path-slant-right"
                    >
                        <Plus className="w-4 h-4" /> Quick Add
                    </button>
                </div>
            </div>

            {/* ═ INFO SECTION ═ */}
            <div className="p-5 flex flex-col gap-2 relative bg-[#0A0A0A]">
                {/* Decoration Line */}
                <div className="absolute top-0 left-0 w-0 h-[1px] bg-[#B4F000] group-hover:w-full transition-all duration-500 delay-100" />

                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black font-[family-name:var(--font-oswald)] text-white uppercase leading-none tracking-wide group-hover:text-[#B4F000] transition-colors line-clamp-2 w-3/4">
                        <Link href={`/product/${product.handle}`}>
                            {product.title}
                        </Link>
                    </h3>
                    <Link href={`/product/${product.handle}`} className="text-white/20 group-hover:text-[#B4F000] transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="flex justify-between items-end mt-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Price</span>
                        <span className="text-xl font-mono text-white font-bold tracking-tighter">
                            {formattedPrice}
                        </span>
                    </div>
                    {/* Collection Tag */}
                    <span className="text-[9px] px-2 py-1 border border-white/10 text-white/40 uppercase tracking-widest rounded-full group-hover:border-[#B4F000]/30 group-hover:text-[#B4F000]/80 transition-colors">
                        FW26
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
