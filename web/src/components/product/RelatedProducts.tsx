"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";
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
                        <ProductCard key={product.id} product={product} index={idx} />
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

function ProductCard({ product, index }: { product: Product; index: number }) {
    return (
        <motion.div
            className="group relative min-w-[160px] md:min-w-[400px]"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <Link href={`/product/${product.handle}`} className="block">
                <div className="relative aspect-[3/4] bg-[#0A0A0A] overflow-hidden mb-6 border border-white/5 group-hover:border-white/20 transition-colors">
                    {product.featuredImage ? (
                        <>
                            <Image
                                src={product.featuredImage.url}
                                alt={product.featuredImage.altText || product.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                            {/* Secondary Image on Hover (if available) - For now just scale effect */}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                            No Image
                        </div>
                    )}

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-white text-black px-6 py-3 font-black uppercase tracking-widest text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <Plus className="w-4 h-4" /> Quick View
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                        {product.availableForSale ? (
                            <span className="bg-accent text-black text-[9px] font-black uppercase tracking-widest px-2 py-1">New Season</span>
                        ) : (
                            <span className="bg-white/10 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 backdrop-blur-md">Sold Out</span>
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all">
                        {product.title}
                    </h3>
                    {product.priceRange && (
                        <p className="text-accent font-mono text-sm font-bold">
                            {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                        </p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
