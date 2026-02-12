"use client";

import { Product } from "@/lib/shopify/types";
import { ProductCardFuture } from "@/components/ProductCardFuture";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface BestsellersProps {
    products: Product[];
}

export function Bestsellers({ products = [] }: BestsellersProps) {
    if (!products.length) return null;

    // Use a mix of layout styles for "Editorial" feel
    const featuredProduct = products[0];
    const gridProducts = products.slice(1, 4);

    return (
        <section className="py-24 bg-[#0A0A0A] border-t border-white/5">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold text-white tracking-tight">
                        Trending Now
                    </h2>
                    <Link href="/collections/bestsellers" className="text-sm font-mono text-white/50 hover:text-white transition-colors flex items-center gap-2">
                        GLOBAL RANKINGS <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Big Feature Card */}
                    <div className="lg:col-span-8 relative group">
                        <div className="relative h-[600px] w-full rounded-xl overflow-hidden bg-[#111]">
                            {featuredProduct?.featuredImage && (
                                <img
                                    src={featuredProduct.featuredImage.url}
                                    alt={featuredProduct.title}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8">
                                <span className="bg-white text-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                                    #1 Bestseller
                                </span>
                                <h3 className="text-3xl font-bold text-white mb-2">{featuredProduct?.title}</h3>
                                <p className="text-white/70 max-w-md mb-6 line-clamp-2">{featuredProduct?.description}</p>
                                <Link href={`/product/${featuredProduct?.handle}`} className="inline-flex items-center gap-2 text-white font-bold border-b border-white pb-1 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors">
                                    SHOP NOW <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Side Grid */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        {gridProducts.map((product) => (
                            <div key={product.id} className="flex gap-4 items-center group">
                                <div className="relative w-24 h-32 flex-shrink-0 bg-[#111] rounded-md overflow-hidden">
                                    {product.featuredImage && (
                                        <img
                                            src={product.featuredImage.url}
                                            alt={product.title}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1 group-hover:underline decoration-white/30 underline-offset-4">
                                        <Link href={`/product/${product.handle}`}>{product.title}</Link>
                                    </h4>
                                    <p className="text-white/50 text-sm font-mono mb-2">
                                        {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                                    </p>
                                    <button className="text-[10px] font-bold uppercase text-white tracking-wider border border-white/20 px-3 py-1 hover:bg-white hover:text-black transition-colors">
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
