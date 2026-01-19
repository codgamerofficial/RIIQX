"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

interface TrendingCategoriesProps {
    products: Product[];
}

export function TrendingCategories({ products }: TrendingCategoriesProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-16 bg-neutral-50 border-t border-neutral-200">
            <div className="max-w-[1400px] mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bewakoof-section-header text-3xl md:text-5xl mb-16 text-black tracking-tighter"
                >
                    TRENDING CATEGORIES
                </motion.h2>

                <div className="bewakoof-category-grid">
                    {products.slice(0, 12).map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link
                                href={`/shop/${product.handle}`}
                                className="group block relative aspect-[4/5] overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                {product.featuredImage && (
                                    <Image
                                        src={product.featuredImage.url}
                                        alt={product.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                )}
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                                {/* Content */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    {/* Fake Category Tag based on product type or title */}
                                    <span className="inline-block px-2 py-1 mb-2 text-[10px] font-bold uppercase tracking-wider bg-white text-black rounded-sm">
                                        {product.tags?.[0] || "Trending"}
                                    </span>
                                    <h3 className="font-montserrat font-bold text-white uppercase text-sm leading-tight line-clamp-2">
                                        {product.title}
                                    </h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
