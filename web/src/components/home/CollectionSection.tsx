"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { ArrowRight, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/shopify";
import Image from "next/image";

interface CollectionSectionProps {
    title: string;
    subtitle?: string;
    products: Product[];
    link: string;
    dark?: boolean;
}

export function CollectionSection({ title, subtitle, products = [], link, dark = false }: CollectionSectionProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className={`py-20 ${dark ? 'bg-black' : 'bg-neutral-950'} border-t border-white/5 overflow-hidden`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex items-end justify-between">
                <div>
                    {subtitle && (
                        <span className="block text-primary font-bold uppercase tracking-widest text-xs mb-2">
                            {subtitle}
                        </span>
                    )}
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                        {title}
                    </h2>
                </div>
                <Link href={link} className="hidden md:flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                    <span className="uppercase text-xs font-bold tracking-widest">View All</span>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </Link>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 scrollbar-hide snap-x snap-mandatory">
                {products.map((product, idx) => (
                    <ProductCard key={product.id} product={product} />
                ))}

                {/* View All Card */}
                <Link
                    href={link}
                    className="snap-center shrink-0 w-[280px] md:w-[320px] h-[400px] flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl group hover:bg-white/10 transition-colors"
                >
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-black uppercase tracking-widest">View All</span>
                </Link>
            </div>

            <div className="md:hidden px-4 mt-4">
                <Link href={link} className="block w-full py-4 border border-white/10 text-center text-white font-bold uppercase tracking-widest text-xs rounded-xl">
                    View Complete Collection
                </Link>
            </div>
        </section>
    );
}

function ProductCard({ product }: { product: Product }) {
    return (
        <div className="snap-center shrink-0 w-[280px] md:w-[320px] h-[400px] relative group bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden">

            {/* Image */}
            <Link href={`/shop/${product.handle}`} className="block h-full w-full">
                {product.featuredImage ? (
                    <Image
                        src={product.featuredImage.url}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white/20">
                        <ShoppingBag className="w-12 h-12" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </Link>

            {/* Info */}
            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <Link href={`/shop/${product.handle}`}>
                    <h3 className="text-white font-bold uppercase leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>
                </Link>
                <div className="flex items-center justify-between">
                    <span className="text-white/80 font-mono text-sm">
                        {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                    </span>
                    <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
