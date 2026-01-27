"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Minus, Plus, Shield, RotateCcw, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ReviewSection } from "./ReviewSection";
import { RelatedProducts } from "./RelatedProducts";

interface ProductDetailClientProps {
    product: Product;
    relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    // Accordion states
    const [openSection, setOpenSection] = useState<string | null>("description");

    const images = product.images?.edges?.map(edge => edge.node) || [];
    const price = product.priceRange.minVariantPrice;

    // Extract options
    const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size');
    const sizes = sizeOption?.values || [];
    const colorOption = product.options?.find(opt => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour');
    const colors = colorOption?.values || [];

    // Get selected variant
    const selectedVariant = product.variants.edges.find(edge => {
        const options = edge.node.selectedOptions;
        const sizeMatch = !sizes.length || (selectedSize && options.some(o => o.name.toLowerCase() === 'size' && o.value === selectedSize));
        const colorMatch = !colors.length || (selectedColor && options.some(o => (o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour') && o.value === selectedColor));
        return sizeMatch && colorMatch;
    })?.node;

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white pt-24 pb-32">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* --- LEFT: GALLERY (Collage / Grid) --- */}
                    <div className="lg:col-span-7 space-y-4">
                        {images.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "relative bg-white/5 overflow-hidden",
                                            idx === 0 ? "aspect-[3/4] md:col-span-2" : "aspect-[3/4]"
                                        )}
                                    >
                                        <Image
                                            src={img.url}
                                            alt={img.altText || product.title}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform duration-700"
                                            sizes="(min-width: 1024px) 50vw, 100vw"
                                            priority={idx === 0}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="aspect-[3/4] bg-white/5 flex items-center justify-center">
                                <span className="text-white/20">No Image</span>
                            </div>
                        )}
                    </div>

                    {/* --- RIGHT: DETAILS (Sticky) --- */}
                    <div className="lg:col-span-5 relative">
                        <div className="lg:sticky lg:top-32 space-y-10">

                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-accent text-xs font-bold uppercase tracking-widest">
                                        RIIQX Official
                                    </span>
                                    {/* Mock Rating */}
                                    <div className="flex items-center gap-1 text-white/50 text-xs">
                                        <Star className="w-3 h-3 text-accent fill-accent" /> 4.9
                                    </div>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-display leading-[0.9] mb-6">
                                    {product.title}
                                </h1>
                                <p className="text-2xl font-mono text-white/90">
                                    {formatPrice(price.amount, price.currencyCode)}
                                </p>
                            </div>

                            {/* Separator */}
                            <div className="h-px bg-white/10" />

                            {/* Options */}
                            <div className="space-y-8">
                                {/* Colors */}
                                {colors.length > 0 && (
                                    <div className="space-y-4">
                                        <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Color</span>
                                        <div className="flex flex-wrap gap-3">
                                            {colors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={cn(
                                                        "h-10 px-6 flex items-center justify-center transition-all text-xs font-bold uppercase tracking-widest",
                                                        selectedColor === color
                                                            ? "bg-white text-black"
                                                            : "bg-white/5 text-white hover:bg-white/10"
                                                    )}
                                                >
                                                    {color}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sizes */}
                                {sizes.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Size</span>
                                            <button className="text-xs uppercase tracking-widest text-white/60 hover:text-white underline decoration-white/30 hover:decoration-white">Size Guide</button>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={cn(
                                                        "h-12 flex items-center justify-center transition-all text-sm font-bold",
                                                        selectedSize === size
                                                            ? "bg-white text-black"
                                                            : "bg-white/5 text-white hover:bg-white/10"
                                                    )}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-4">
                                <AddToCartButton
                                    product={product}
                                    variant={selectedVariant}
                                    className="w-full py-5 text-sm uppercase tracking-widest font-black bg-accent text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all clip-path-slant"
                                />
                                <div className="grid grid-cols-3 gap-4 text-[9px] uppercase tracking-widest text-center text-white/40 pt-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <Truck className="w-4 h-4" /> Free Shipping
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <Shield className="w-4 h-4" /> Authenticity
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <RotateCcw className="w-4 h-4" /> Easy Returns
                                    </div>
                                </div>
                            </div>

                            {/* Product Info Accordions */}
                            <div className="border-t border-white/10 pt-4 space-y-2">
                                <div className="border-b border-white/10 pb-2">
                                    <button
                                        onClick={() => toggleSection('description')}
                                        className="w-full flex justify-between items-center py-4 text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors"
                                    >
                                        Description
                                        {openSection === 'description' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                    <AnimatePresence>
                                        {openSection === 'description' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div
                                                    className="pb-4 prose prose-invert prose-sm text-white/60 font-mono text-xs leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="border-b border-white/10 pb-2">
                                    <button className="w-full flex justify-between items-center py-4 text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors opacity-50 cursor-not-allowed">
                                        Materials & Care <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* --- RELATED & REVIEWS --- */}
                <div className="mt-32 space-y-24">
                    <RelatedProducts products={relatedProducts} />
                    <ReviewSection productId={product.id} />
                </div>
            </div>

            {/* --- MOBILE STICKY BAR --- */}
            <div className="fixed bottom-0 left-0 w-full bg-[#0B0B0B] border-t border-white/10 p-4 z-50 md:hidden flex items-center gap-4">
                <div className="flex-1">
                    <p className="text-white text-xs font-bold truncate">{product.title}</p>
                    <p className="text-white/50 text-xs">{formatPrice(price.amount, price.currencyCode)}</p>
                </div>
                <AddToCartButton
                    product={product}
                    variant={selectedVariant}
                    className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest"
                />
            </div>
        </div>
    );
}
