"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Minus, Plus, Shield, RotateCcw, Truck } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ReviewSection } from "./ReviewSection";
import { RelatedProducts } from "./RelatedProducts";

interface ProductDetailClientProps {
    product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const images = product.images?.edges?.map(edge => edge.node) || [];
    const mainImage = images[selectedImage] || product.featuredImage;
    const price = product.priceRange.minVariantPrice;

    // Extract sizes
    const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size');
    const sizes = sizeOption?.values || [];

    // Get selected variant based on size (simplified)
    const selectedVariant = product.variants.edges.find(edge =>
        edge.node.selectedOptions.some(opt => opt.name.toLowerCase() === 'size' && opt.value === selectedSize)
    )?.node;

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white pt-24 pb-24">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Images (Sticky) */}
                    <div className="lg:sticky lg:top-32 h-fit space-y-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative aspect-[3/4] w-full overflow-hidden bg-white/5"
                        >
                            <Image
                                src={mainImage?.url || ""}
                                alt={mainImage?.altText || product.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="(min-width: 1024px) 50vw, 100vw"
                            />
                        </motion.div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={cn(
                                            "relative w-20 h-20 flex-shrink-0 overflow-hidden transition-all grayscale hover:grayscale-0",
                                            selectedImage === idx ? "grayscale-0 ring-1 ring-white" : "opacity-50"
                                        )}
                                    >
                                        <Image
                                            src={img.url}
                                            alt={`Thumbnail ${idx}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-12 py-4">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display leading-none mb-4">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4 text-lg font-mono">
                                <span>{formatPrice(price.amount, price.currencyCode)}</span>
                                <div className="flex items-center gap-1 text-accent text-xs">
                                    <Star className="w-3 h-3 fill-accent" />
                                    <span>4.8 (120+ Reviews)</span>
                                </div>
                            </div>
                        </div>

                        {/* Size Selector */}
                        {sizes.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs uppercase tracking-widest text-white/40 font-bold">
                                    <span>Select Size</span>
                                    <button className="hover:text-white transition-colors">Size Guide</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "w-12 h-12 flex items-center justify-center border transition-all text-sm font-bold active:scale-95",
                                                selectedSize === size
                                                    ? "bg-white text-black border-white"
                                                    : "bg-transparent text-white border-white/20 hover:border-white"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add to Cart */}
                        <div className="space-y-4 pt-8 border-t border-white/10">
                            <AddToCartButton
                                product={product}
                                variant={selectedVariant}
                                className="w-full bg-white text-black hover:bg-white/90"
                            />

                            <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-white/40">
                                <span className="flex items-center gap-2"><Truck className="w-3 h-3" /> Free Shipping</span>
                                <span className="flex items-center gap-2"><RotateCcw className="w-3 h-3" /> 14-Day Returns</span>
                                <span className="flex items-center gap-2"><Shield className="w-3 h-3" /> Secure Checkout</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-invert prose-sm text-white/60 leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }} />
                        </div>
                    </div>
                </div>

                <div className="mt-32">
                    <RelatedProducts />
                    <div className="mt-16">
                        <ReviewSection productId={product.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
