"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/shopify";
import { Product } from "@/lib/shopify/types";

interface RelatedProductsProps {
    products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
    if (!products.length) return null;

    return (
        <div className="py-24 border-t border-white/5">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl md:text-4xl font-black font-display text-white uppercase tracking-tighter">
                    <span className="text-cherry-red mr-3">///</span>
                    You Might Also Like
                </h2>
                <Link href="/shop" className="hidden md:block text-sm font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors">
                    View All Drops
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {products.map((product) => (
                    <Link key={product.id} href={`/product/${product.handle}`} className="group block">
                        <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden mb-4">
                            {product.featuredImage ? (
                                <Image
                                    src={product.featuredImage.url}
                                    alt={product.featuredImage.altText || product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                                    No Image
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                            {/* Quick Add Button (Visible on Hover) */}
                            <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <button className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 text-xs hover:bg-gold transition-colors">
                                    Quick View
                                </button>
                            </div>
                        </div>

                        <h3 className="text-white font-bold uppercase tracking-tight mb-1 truncate group-hover:text-cherry-red transition-colors">
                            {product.title}
                        </h3>
                        {product.priceRange && (
                            <p className="text-white/60 text-sm font-medium">
                                {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
