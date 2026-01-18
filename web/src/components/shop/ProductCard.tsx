"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Database } from "@/types/database.types";
import { motion } from "framer-motion";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    // Fallback image if images array is empty
    const mainImage = product.images?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8 }}
            className="group block h-full"
        >
            <div className="bg-black border border-white/5 rounded-xl overflow-hidden hover:border-luxury-gold/30 transition-all duration-500 h-full flex flex-col relative shadow-2xl">
                <Link href={`/shop/${product.id}`} className="absolute inset-0 z-10" />

                {/* Edge-to-Edge Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-black">
                    <motion.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Image
                            src={mainImage}
                            alt={product.title}
                            fill
                            className="object-cover"
                        />
                    </motion.div>

                    {/* Floating Price Badge - Premium Gold */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-4 right-4 z-20"
                    >
                        <div className="bg-luxury-gold text-black px-4 py-2 rounded-full font-display font-bold text-sm uppercase tracking-wider shadow-lg backdrop-blur-sm">
                            ${product.selling_price.toFixed(2)}
                        </div>
                    </motion.div>

                    {/* Category Tag - Top Left */}
                    <div className="absolute top-4 left-4 z-20">
                        <div className="bg-black/60 backdrop-blur-md text-white/90 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest border border-white/10">
                            {product.category || "Apparel"}
                        </div>
                    </div>

                    {/* Quick Add Overlay - Enhanced */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                    >
                        <button className="w-full py-4 bg-white text-black font-display font-bold text-sm uppercase tracking-wider rounded-lg flex items-center justify-center space-x-2 hover:bg-luxury-gold transition-all duration-300 shadow-2xl transform hover:scale-105">
                            <ShoppingBag className="w-5 h-5" />
                            <span>Add to Cart</span>
                        </button>
                    </motion.div>

                    {/* Subtle Gradient Overlay for Depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
                </div>

                {/* Minimal Info Section */}
                <div className="p-4 flex-grow flex flex-col justify-center pointer-events-none bg-gradient-to-b from-black to-zinc-900">
                    <h3 className="text-base font-display font-medium text-white group-hover:text-luxury-gold transition-colors duration-300 line-clamp-2 tracking-wide">
                        {product.title}
                    </h3>
                </div>
            </div>
        </motion.div>
    );
}
