"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/shopify";

interface NewDropsProps {
    products: Product[];
}

export function NewDrops({ products = [] }: NewDropsProps) {
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
                <div className="absolute top-10 left-10 z-10">
                    <h2 className="text-8xl md:text-9xl font-black text-white/5 uppercase tracking-tighter">
                        New Drops
                    </h2>
                    <div className="absolute top-1/2 left-2 -translate-y-1/2">
                        <span className="bg-primary text-black font-bold uppercase px-4 py-1 text-sm tracking-widest">
                            Limited Edition
                        </span>
                    </div>
                </div>

                <motion.div style={{ x }} className="flex gap-8 pl-[10vw]">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group relative h-[600px] w-[400px] md:w-[500px] flex-shrink-0 bg-neutral-900 border border-white/10 overflow-hidden"
                        >
                            {/* Image */}
                            <div className="absolute inset-0 overflow-hidden">
                                {product.featuredImage && (
                                    <img
                                        src={product.featuredImage.url}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-8">
                                <div className="space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-3xl font-black text-white uppercase leading-none">
                                        {product.title}
                                    </h3>
                                    <div className="flex items-center justify-between border-t border-white/20 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <span className="text-2xl font-bold text-white">
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

                            {/* Neon Border Effect on Hover */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary transition-colors duration-300 pointer-events-none" />
                        </div>
                    ))}

                    {/* View All Card */}
                    <div className="h-[600px] w-[300px] flex-shrink-0 flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors group cursor-pointer">
                        <Link href="/collections/new-arrivals" className="text-center group-hover:scale-110 transition-transform">
                            <span className="block text-4xl font-black text-white mb-2">VIEW<br />ALL</span>
                            <div className="w-12 h-1 bg-primary mx-auto" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
