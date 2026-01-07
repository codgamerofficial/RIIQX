"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/shopify/types";

export function TrendingCarouselClient({ products }: { products: Product[] }) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-b from-background to-secondary/5 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-sm font-medium text-secondary tracking-widest uppercase">Best Sellers</span>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
                        TRENDING GEAR
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/shop/${product.handle}`} className="group block h-full">
                                <div className="bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                                    {/* Image */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                        {product.featuredImage && (
                                            <Image
                                                src={product.featuredImage.url}
                                                alt={product.featuredImage.altText || product.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        )}

                                        {/* Quick Add Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <button className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-primary hover:text-white transition-colors shadow-lg">
                                                <ShoppingBag className="w-4 h-4" />
                                                <span>View Details</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-5 flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {product.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-lg font-bold text-white">
                                                ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
