"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
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
                        >
                            <div className="relative overflow-hidden rounded-lg bg-white/5">
                                {/* Use featured image or first available image */}
                                {product.featuredImage ? (
                                    <Image
                                        src={product.featuredImage.url}
                                        alt={product.featuredImage.altText || product.title}
                                        width={800}
                                        height={1000}
                                        className="object-cover w-full h-auto transition-transform duration-700 group-hover:scale-105"
                                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                    />
                                ) : (
                                    <div className="aspect-[3/4] flex items-center justify-center bg-white/5">
                                        <span className="text-white/20">No Image</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                    <h3 className="text-3xl font-black font-display text-white uppercase tracking-tighter translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {product.title}
                                    </h3>
                                    <p className="text-accent font-bold uppercase tracking-widest text-xs mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        View Details
                                    </p>
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
                            className="relative w-full max-w-5xl bg-[#0B0B0B] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row max-h-[90vh] md:h-[80vh]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Image Section */}
                            <div className="w-full md:w-3/5 relative h-[40vh] md:h-full bg-neutral-900">
                                {selectedProduct.featuredImage && (
                                    <Image
                                        src={selectedProduct.featuredImage.url}
                                        alt={selectedProduct.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>

                            {/* Details Section */}
                            <div className="w-full md:w-2/5 p-8 flex flex-col h-full bg-[#0B0B0B] overflow-y-auto">
                                <div className="mb-auto">
                                    <h2 className="text-4xl font-black font-display text-white uppercase tracking-tighter mb-2">
                                        {selectedProduct.title}
                                    </h2>
                                    <div className="h-1 w-20 bg-accent mb-8" />

                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-2xl font-mono text-white">
                                            {formatPrice(
                                                selectedProduct.priceRange.minVariantPrice.amount,
                                                selectedProduct.priceRange.minVariantPrice.currencyCode
                                            )}
                                        </span>
                                    </div>

                                    <div className="prose prose-invert text-white/60 mb-8 line-clamp-4">
                                        <div dangerouslySetInnerHTML={{ __html: selectedProduct.descriptionHtml || selectedProduct.description }} />
                                    </div>

                                    <Link href={`/product/${selectedProduct.handle}`} className="w-full">
                                        <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-3">
                                            Shop Now <ArrowRight className="w-5 h-5" />
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
