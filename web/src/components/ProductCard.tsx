"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { Star } from "lucide-react";

interface ProductCardProps {
    product: Product;
    priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
    const { handle, title, priceRange, featuredImage, variants } = product;
    const price = priceRange.minVariantPrice;

    // Check for "New" status (mock logic or real if available)
    const isNew = true; // For now, we'll follow the visual mock

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="group relative flex flex-col"
        >
            <Link href={`/product/${handle}`} className="block h-full">
                {/* Card Container - iOS Style */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[32px] bg-[#1c1c1e] border border-white/5 shadow-2xl">

                    {/* Badge: NEW (White Box, Black Text) */}
                    {isNew && (
                        <div className="absolute top-4 left-4 z-20 bg-white text-black text-[10px] font-black px-3 py-1.5 uppercase tracking-widest rounded-sm">
                            New
                        </div>
                    )}

                    {/* Wishlist / Star Icon */}
                    <button className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                        <Star className="w-4 h-4" />
                    </button>

                    {/* Image */}
                    <div className="relative h-full w-full bg-[#1c1c1e]">
                        <Image
                            src={featuredImage?.url}
                            alt={featuredImage?.altText || title}
                            fill
                            className="object-cover transition-transform duration-700 ease-[0.25,0.1,0.25,1] group-hover:scale-105"
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                            priority={priority}
                        />

                        {/* Subtle inner shadow for depth */}
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[32px] pointer-events-none" />
                    </div>
                </div>

                {/* Typography - Below Card */}
                <div className="mt-5 px-1 space-y-1">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-sm font-black uppercase tracking-wide text-white group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-tight w-[80%]">
                            {title}
                        </h3>
                        {/* Rating Mock */}
                        <div className="flex items-center gap-1 opacity-40 shrink-0">
                            <Star className="w-3 h-3 fill-white text-white" />
                            <span className="text-[10px] font-bold">4.8</span>
                        </div>
                    </div>

                    <div className="text-sm font-medium text-white/60 font-mono">
                        {formatPrice(price.amount, price.currencyCode)}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
