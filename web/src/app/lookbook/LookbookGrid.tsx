"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Play } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";

interface LookbookGridProps {
    products: Product[];
}

export default function LookbookGrid({ products }: LookbookGridProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    return (
        <>
            {/* Masonry Grid */}
            <div className="max-w-[1920px] mx-auto px-4 md:px-8">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            layoutId={`product-container-${product.id}`}
                            className="break-inside-avoid relative group cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="relative overflow-hidden rounded-[32px] bg-[#121212] border border-white/5">
                                {/* Use featured image or first available image */}
                                {product.featuredImage ? (
                                    <Image
                                        src={product.featuredImage.url}
                                        alt={product.featuredImage.altText || product.title}
                                        width={800}
                                        height={1000}
                                        className="object-cover w-full h-auto transition-transform duration-700 ease-[0.25,0.1,0.25,1] group-hover:scale-105"
                                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                    />
                                ) : (
                                    <div className="aspect-[3/4] flex items-center justify-center bg-white/5">
                                        <span className="text-white/20">No Visual</span>
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10">
                                            <Play className="w-5 h-5 text-white fill-white" />
                                        </div>
                                        <h3 className="text-2xl font-black font-display text-white uppercase tracking-tighter">
                                            {product.title}
                                        </h3>
                                        <p className="text-white/60 font-mono text-xs mt-2 uppercase tracking-widest">
                                            View Replay
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Look Details Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        />
                        <motion.div
                            layoutId={`product-container-${selectedProduct.id}`}
                            className="relative w-full max-w-6xl bg-[#050505] rounded-[48px] overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[90vh] md:h-[80vh]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 z-20 p-3 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-colors backdrop-blur-md border border-white/10"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Image Section */}
                            <div className="w-full md:w-3/5 relative h-[40vh] md:h-full bg-[#121212]">
                                {selectedProduct.featuredImage && (
                                    <Image
                                        src={selectedProduct.featuredImage.url}
                                        alt={selectedProduct.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]/50 md:to-[#050505]" />
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col h-full bg-[#050505] overflow-y-auto relative z-10">
                                <div className="mb-auto">
                                    <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-white/50 mb-6">
                                        Featured Item
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black font-display text-white uppercase tracking-tighter mb-4 leading-[0.9]">
                                        {selectedProduct.title}
                                    </h2>

                                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
                                        <span className="text-3xl font-mono text-accent">
                                            {formatPrice(
                                                selectedProduct.priceRange.minVariantPrice.amount,
                                                selectedProduct.priceRange.minVariantPrice.currencyCode
                                            )}
                                        </span>
                                    </div>

                                    <div className="prose prose-invert text-white/60 mb-12 line-clamp-6 font-light leading-relaxed">
                                        <div dangerouslySetInnerHTML={{ __html: selectedProduct.descriptionHtml || selectedProduct.description }} />
                                    </div>

                                    <Link href={`/product/${selectedProduct.handle}`} className="w-full">
                                        <button className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                                            Get The Look <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
