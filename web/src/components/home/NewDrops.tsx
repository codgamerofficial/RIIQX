"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { formatPrice } from "@/lib/shopify";

interface NewDropsProps {
    products: Product[];
}

export function NewDrops({ products = [] }: NewDropsProps) {
    return (
        <>
            <div className="hidden lg:block">
                <DesktopDrops products={products} />
            </div>
            <div className="lg:hidden">
                <MobileDrops products={products} />
            </div>
        </>
    );
}

function DesktopDrops({ products }: { products: Product[] }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-neutral-950">
            {/* Sticky Container */}
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">

                {/* Title Overlay */}
                <div className="absolute top-[10%] left-[5%] z-10 pointer-events-none select-none">
                    <h2 className="text-[12vw] md:text-[14vw] font-black text-[#1A1A1A] uppercase tracking-tighter leading-none opacity-50">
                        NEW DROPS
                    </h2>
                    <div className="absolute top-[60%] left-2">
                        <span className="bg-[#C9A24D] text-black font-bold uppercase px-4 py-1 text-sm tracking-[0.2em]">
                            Limited Edition
                        </span>
                    </div>
                </div>

                <motion.div style={{ x }} className="flex gap-8 pl-[20vw] items-center relative z-20">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}

                    {/* View All Card */}
                    <div className="h-[400px] w-[200px] flex-shrink-0 flex items-center justify-center group cursor-pointer">
                        <Link href="/collections/new-arrivals" className="text-center group-hover:scale-110 transition-transform">
                            <span className="block text-4xl font-black text-white mb-4 uppercase leading-none">VIEW<br />ALL</span>
                            <div className="w-16 h-1 bg-[#C9A24D] mx-auto" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function MobileDrops({ products }: { products: Product[] }) {
    return (
        <section className="bg-neutral-950 py-16">
            <div className="px-4 mb-8">
                <span className="bg-primary text-black font-bold uppercase px-3 py-1 text-xs tracking-widest">
                    New Arrivals
                </span>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mt-4">
                    Just Dropped
                </h2>
            </div>

            <div className="flex overflow-x-auto gap-4 px-4 pb-8 snap-x snap-mandatory">
                {products.map((product) => (
                    <div key={product.id} className="snap-center shrink-0 w-[85vw]">
                        <ProductCard product={product} isMobile />
                    </div>
                ))}

                <Link href="/collections/relevance" className="snap-center shrink-0 w-[40vw] flex items-center justify-center border border-white/10 bg-white/5">
                    <span className="text-white font-black uppercase text-center">View All</span>
                </Link>
            </div>
        </section>
    );
}

function ProductCard({ product, isMobile = false }: { product: Product, isMobile?: boolean }) {
    // Generate deterministic rating based on product ID to avoid hydration mismatch
    // In production, this would come from actual product data
    const hashCode = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };
    const rating = 4.2 + (hashCode(product.id) % 8) / 10;

    return (
        <div
            className={`group relative ${isMobile ? 'h-[500px] w-full' : 'h-[600px] w-[400px] md:w-[500px]'} flex-shrink-0 bg-neutral-900 border border-white/10 overflow-hidden`}
        >
            {/* Wishlist Heart Icon */}
            <button
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-110"
                aria-label="Add to wishlist"
            >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            {/* Image */}
            <div className="absolute inset-0 overflow-hidden">
                {product.featuredImage && (
                    <>
                        <div className={`w-full h-full relative ${!isMobile && 'transition-transform duration-700 group-hover:scale-110'}`}>
                            {/* Main Image - Color/Grayscale handled via filters */}
                            <div className={`absolute inset-0 w-full h-full transition-all duration-500 ${!isMobile && 'grayscale group-hover:grayscale-0'}`}>
                                <NextImage
                                    src={product.featuredImage.url}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                    sizes={isMobile ? "90vw" : "(max-width: 1200px) 50vw, 33vw"}
                                />
                            </div>
                        </div>

                        {/* Rating Pill on Image */}
                        <div className="absolute bottom-4 left-4 z-10 bewakoof-rating-pill">
                            <svg className="w-3 h-3 fill-current bewakoof-rating-star" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span>{rating.toFixed(1)}</span>
                        </div>
                    </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8">
                <div className={`space-y-2 ${!isMobile && 'transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500'}`}>
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase leading-none line-clamp-2">
                        {product.title}
                    </h3>
                    <div className={`flex items-center justify-between border-t border-white/20 pt-4 ${!isMobile && 'opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100'}`}>
                        <span className="text-xl md:text-2xl font-bold text-white">
                            {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                        </span>
                        <Link href={`/shop/${product.handle}`}>
                            <button className="bg-white text-black p-3 rounded-full hover:bg-primary transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Neon Border Effect on Hover (Desktop only) */}
            {!isMobile && (
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary transition-colors duration-300 pointer-events-none" />
            )}
        </div>
    );
}
