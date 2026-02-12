"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";

interface PlayerCardProps {
    product: Product;
    priority?: boolean;
}

export function PlayerCard({ product, priority = false }: PlayerCardProps) {
    const { handle, title, priceRange, featuredImage } = product;
    const price = priceRange.minVariantPrice;

    // Mock Stats Generation based on price/random
    const strikeRate = (Math.random() * (200 - 100) + 100).toFixed(1);
    const matches = Math.floor(Math.random() * 50) + 10;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative flex flex-col bg-[#121212] border-score overflow-hidden"
        >
            <Link href={`/product/${handle}`} className="block h-full">

                {/* HEADSHOT (Product Image) */}
                <div className="relative aspect-[3/4] w-full bg-[#0A0A0A] overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--mi-blue)_0%,_transparent_70%)] group-hover:opacity-40 transition-opacity" />

                    {featuredImage?.url ? (
                        <Image
                            src={featuredImage.url}
                            alt={featuredImage.altText || title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                            priority={priority}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 font-mono">
                            NO IMAGE
                        </div>
                    )}

                    {/* Overlay Gradient for Text Readability */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
                </div>

                {/* PLAYER STATS (Details) */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-['Teko'] text-3xl text-white uppercase leading-none mb-2 truncate">
                        {title}
                    </h3>

                    <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
                        <div className="bg-[#0A0A0A]/90 p-2 backdrop-blur-sm">
                            <div className="text-[10px] text-white/50 font-mono uppercase tracking-widest">RUNS (PRICE)</div>
                            <div className="text-xl font-['Rajdhani'] font-bold text-[var(--pitch-green)]">
                                {formatPrice(price.amount, price.currencyCode)}
                            </div>
                        </div>
                        <div className="bg-[#0A0A0A]/90 p-2 backdrop-blur-sm">
                            <div className="text-[10px] text-white/50 font-mono uppercase tracking-widest">S/R (RATING)</div>
                            <div className="text-xl font-['Rajdhani'] font-bold text-[var(--mi-blue)]">
                                {strikeRate}
                            </div>
                        </div>
                    </div>
                </div>

                {/* HOVER FLICKER BORDER */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--mi-blue)] transition-colors duration-300 pointer-events-none" />

            </Link>
        </motion.div>
    );
}
