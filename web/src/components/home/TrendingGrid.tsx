"use client";

import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface TrendingGridProps {
    products: Product[];
}

export function TrendingGrid({ products = [] }: TrendingGridProps) {
    if (!products.length) return null;

    // Use up to 12 products for a Bento Grid layout
    const featured = products[0];
    const rest = products.slice(1, 12); // Show up to 11 more products


    return (
        <section className="py-24 bg-black px-4 max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
                        Trending <span className="text-primary">Now</span>
                    </h2>
                    <p className="text-white/60 mt-4 max-w-md">
                        Curated picks making waves in the streetwear scene.
                        Cop them before they're gone.
                    </p>
                </div>
                <Link href="/shop" className="hidden md:flex items-center space-x-2 text-white font-bold uppercase tracking-widest hover:text-primary transition-colors">
                    <span>View Collection</span>
                    <ArrowUpRight className="w-5 h-5" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[800px]">

                {/* Large Featured Item */}
                {featured && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-[#0A0A0A] border border-white/5 hover:border-[#B4F000] transition-colors duration-300 rounded-lg"
                    >
                        {featured.featuredImage && (
                            <img
                                src={featured.featuredImage.url}
                                alt={featured.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <span className="bg-[#B4F000] text-black text-xs font-bold px-2 py-1 uppercase mb-3 inline-block tracking-widest">
                                #1 Best Seller
                            </span>
                            <h3 className="text-5xl font-black text-white mb-2 font-[family-name:var(--font-oswald)] uppercase tracking-tighter">{featured.title}</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-2xl font-bold text-white">
                                    {formatPrice(featured.priceRange.minVariantPrice.amount, featured.priceRange.minVariantPrice.currencyCode)}
                                </p>
                                <Link href={`/shop/${featured.handle}`}>
                                    <button className="bg-white text-black px-6 py-2 font-black uppercase tracking-widest text-sm hover:bg-[#B4F000] transition-colors clip-path-slant-right">
                                        Shop Now
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Smaller Grid Items */}
                {rest.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className={`relative group overflow-hidden bg-[#0A0A0A] border border-white/5 hover:border-[#B4F000] transition-colors duration-300 rounded-lg ${idx === 0 || idx === 3 ? 'md:col-span-2' : ''
                            }`}
                    >
                        {product.featuredImage && (
                            <img
                                src={product.featuredImage.url}
                                alt={product.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                        <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <h4 className="text-2xl font-black text-white leading-none mb-1 font-[family-name:var(--font-oswald)] uppercase tracking-tight">{product.title}</h4>
                            <p className="text-primary font-mono text-sm">
                                {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                            </p>

                            <Link href={`/shop/${product.handle}`} className="absolute bottom-6 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white p-2 rounded-full">
                                    <ArrowUpRight className="w-4 h-4 text-black" />
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 text-center md:hidden">
                <Link href="/shop" className="inline-flex items-center space-x-2 text-white font-bold uppercase tracking-widest border-b border-white pb-1">
                    <span>View Collection</span>
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
}
