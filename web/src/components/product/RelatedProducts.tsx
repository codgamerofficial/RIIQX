"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
import { StreetwearProductCard } from "@/components/ui/StreetwearProductCard";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";

interface RelatedProductsProps {
    products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    if (!products.length) return null;

    return (
        <div className="py-24 border-t border-white/5 relative bg-[#050505] overflow-hidden">
            <div className="flex items-end justify-between mb-16 px-6 md:px-0">
                <div>
                    <h2 className="text-4xl md:text-8xl font-black font-display text-white uppercase tracking-tighter leading-[0.8]">
                        <span className="block text-white/20 text-4xl md:text-6xl mb-2">You Might</span>
                        Also Like
                    </h2>
                </div>
                <Link href="/shop" className="hidden md:flex items-center gap-2 group">
                    <span className="text-sm font-bold text-white uppercase tracking-widest group-hover:text-accent transition-colors">View All Drops</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 group-hover:text-accent transition-all" />
                </Link>
            </div>

            {/* Carousel Container */}
            <div className="relative w-full cursor-grab active:cursor-grabbing" ref={containerRef}>
                <motion.div
                    className="flex gap-2 md:gap-8 px-4 md:px-6"
                    drag="x"
                    dragConstraints={containerRef}
                    whileTap={{ cursor: "grabbing" }}
                >
                    {products.map((product, idx) => (
                        <StreetwearProductCard key={product.id} product={product} className="aspect-[3/4]" />
                    ))}

                    {/* View All Card */}
                    <Link href="/shop" className="min-w-[160px] md:min-w-[320px] aspect-[3/4] bg-white/5 flex flex-col items-center justify-center group hover:bg-white/10 transition-colors border border-white/5 hover:border-white/20">
                        <span className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-accent transition-all">
                            <ArrowRight className="w-6 h-6 text-white group-hover:text-accent" />
                        </span>
                        <span className="text-white font-black uppercase tracking-widest text-sm">View Collection</span>
                    </Link>
                </motion.div>
            </div>

            <div className="flex gap-4 mt-8 justify-center opacity-30">
                <div className="text-[10px] uppercase font-bold text-white tracking-widest flex items-center gap-2">
                    Drag to explore <ArrowRight className="w-3 h-3" />
                </div>
            </div>
        </div>
    );
}


