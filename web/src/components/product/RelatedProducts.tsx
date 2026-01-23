"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/shopify";

// Mock data for now, utilizing robust Shopify types in future
const MOCK_RELATED = [
    {
        handle: "cyber-punk-hoodie",
        title: "Cyberpunk Hoodie 2077",
        price: "4999",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
    },
    {
        handle: "neon-city-tee",
        title: "Neon City Tee",
        price: "1999",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop",
    },
    {
        handle: "future-cargo-pants",
        title: "Future Cargo Pants",
        price: "3499",
        image: "https://images.unsplash.com/photo-1552160753-117159821e01?q=80&w=1883&auto=format&fit=crop",
    },
    {
        handle: "techwear-jacket",
        title: "Techwear Shell Jacket",
        price: "7999",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop",
    }
];

export function RelatedProducts() {
    // In a real implementation, we would fetch based on category/collection of current product
    // For now, we return a static "You Might Also Like" to demonstrate the UI

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
                {MOCK_RELATED.map((product, idx) => (
                    <Link key={idx} href={`/product/${product.handle}`} className="group block">
                        <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden mb-4">
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />

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
                        <p className="text-white/60 text-sm font-medium">
                            {formatPrice(product.price, "INR")}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
