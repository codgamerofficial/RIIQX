"use client";

import { Product } from "@/lib/shopify/types";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Clock } from "lucide-react";

interface ActiveDropsProps {
    products: Product[];
}

export function ActiveDrops({ products }: ActiveDropsProps) {
    if (!products?.length) return null;

    return (
        <section className="py-20 bg-black relative overflow-hidden">
            {/* Section Header */}
            <div className="container mx-auto px-6 md:px-12 mb-10 flex items-end justify-between">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 text-[#CCFF00] mb-2"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#CCFF00]"></span>
                        </span>
                        <span className="font-mono text-sm tracking-widest font-bold">LIVE DROPS</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white tracking-tighter"
                    >
                        ACTIVE NOW
                    </motion.h2>
                </div>

                <Link href="/collections/all" className="hidden md:flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                    <span className="font-mono text-sm">VIEW ALL</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="relative w-full overflow-x-auto pb-10 hide-scrollbar cursor-grab active:cursor-grabbing snap-x snap-mandatory">
                <div className="flex gap-6 px-6 md:px-12 w-max">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="group relative w-[280px] md:w-[350px] flex-shrink-0 snap-center"
                        >
                            {/* Card Image */}
                            <Link href={`/product/${product.handle}`} className="block relative aspect-[3/4] overflow-hidden bg-[#111] mb-4">
                                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                                {product.featuredImage && (
                                    <Image
                                        src={product.featuredImage.url}
                                        alt={product.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {i === 0 && (
                                        <span className="px-2 py-1 bg-[#CCFF00] text-black text-[10px] font-bold font-mono uppercase">
                                            SELLING FAST
                                        </span>
                                    )}
                                    {i === 2 && (
                                        <span className="px-2 py-1 bg-white text-black text-[10px] font-bold font-mono uppercase">
                                            LIMITED
                                        </span>
                                    )}
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Quick Add (Hover) */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <button className="w-full bg-white text-black font-bold py-3 text-sm tracking-widest hover:bg-[#CCFF00] transition-colors">
                                        QUICK ADD
                                    </button>
                                </div>
                            </Link>

                            {/* Card Details */}
                            <div className="relative">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-lg font-bold text-white leading-tight pr-4 group-hover:underline decoration-[#CCFF00] underline-offset-4">
                                        <Link href={`/product/${product.handle}`}>{product.title}</Link>
                                    </h3>
                                    <span className="text-[#CCFF00] font-mono font-bold">
                                        {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                                    </span>
                                </div>
                                <p className="text-white/40 text-xs font-mono uppercase tracking-wider">
                                    {product.variants?.edges?.length || 0} VARIANTS
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {/* "View All" Card */}
                    <Link href="/collections/all" className="w-[200px] flex-shrink-0 flex items-center justify-center border border-white/10 hover:border-white/30 transition-colors group">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-mono text-white/60 group-hover:text-white">VIEW ARCHIVE</span>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
