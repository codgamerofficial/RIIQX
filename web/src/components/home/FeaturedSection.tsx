"use client";

import { motion } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface FeaturedSectionProps {
    products: Product[];
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
    if (!products || products.length === 0) return null;

    // Feature the first product prominently, display others in a grid
    const heroProduct = products[0];
    const gridProducts = products.slice(1, 4);

    return (
        <section className="py-24 bg-neutral-950 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                        Featured <span className="text-[#D9F99D]">Heat</span>
                    </h2>
                    <Link href="/collections/featured" className="text-white/50 hover:text-white uppercase text-xs font-bold tracking-widest flex items-center gap-2 transition-colors">
                        View Collection <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Hero Feature Card */}
                    <div className="md:col-span-8 relative group overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 aspect-[4/3] md:aspect-auto">
                        {heroProduct.featuredImage && (
                            <Image
                                src={heroProduct.featuredImage.url}
                                alt={heroProduct.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 md:p-12">
                            <span className="bg-[#D9F99D] text-black text-xs font-black uppercase px-3 py-1 mb-4 inline-block">
                                Spotlight
                            </span>
                            <h3 className="text-3xl md:text-5xl font-black text-white uppercase mb-4 leading-none">
                                {heroProduct.title}
                            </h3>
                            <div className="flex items-center gap-6">
                                <span className="text-xl md:text-2xl font-bold text-white">
                                    {formatPrice(heroProduct.priceRange.minVariantPrice.amount, heroProduct.priceRange.minVariantPrice.currencyCode)}
                                </span>
                                <Link href={`/shop/${heroProduct.handle}`}>
                                    <button className="bg-white text-black px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-[#D9F99D] transition-colors">
                                        Shop Now
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Side Grid */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        {gridProducts.map((product) => (
                            <Link href={`/shop/${product.handle}`} key={product.id} className="flex-1 relative group overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 min-h-[200px]">
                                {product.featuredImage && (
                                    <Image
                                        src={product.featuredImage.url}
                                        alt={product.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h4 className="text-white font-bold uppercase truncate">{product.title}</h4>
                                    <p className="text-[#D9F99D] text-sm font-bold">
                                        {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
