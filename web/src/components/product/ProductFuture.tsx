"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Minus, Plus, Ruler, Truck, ShieldCheck, RefreshCw, ChevronDown, Box, ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const ProductViewer3D = dynamic(() => import("./ProductViewer3D"), {
    ssr: false,
    loading: () => (
        <div className="h-screen w-full flex items-center justify-center bg-[#080808]">
            <span className="text-white/20 text-xs uppercase tracking-[0.3em] font-mono animate-pulse">Loading 3D</span>
        </div>
    ),
});

interface ProductFutureProps {
    product: Product;
    relatedProducts: Product[];
}

const accordionData = [
    {
        key: "description",
        title: "Description",
        icon: ShieldCheck,
    },
    {
        key: "fabric",
        title: "Fabric & Care",
        icon: RefreshCw,
    },
    {
        key: "shipping",
        title: "Shipping & Returns",
        icon: Truck,
    },
];

export function ProductFuture({ product }: ProductFutureProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [show3D, setShow3D] = useState(false);

    const images = product.images?.edges?.map(edge => edge.node) || [];
    const price = product.priceRange.minVariantPrice;

    const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size');
    const sizes = sizeOption?.values || [];

    const selectedVariant = product.variants.edges.find(edge => {
        const options = edge.node.selectedOptions;
        return !sizes.length || (selectedSize && options.some(o => o.name.toLowerCase() === 'size' && o.value === selectedSize));
    })?.node || product.variants.edges[0]?.node;

    const handleQuantityChange = (type: 'inc' | 'dec') => {
        if (type === 'inc') setQuantity(q => q + 1);
        if (type === 'dec') setQuantity(q => Math.max(1, q - 1));
    };

    const getAccordionContent = (key: string): string => {
        switch (key) {
            case "description":
                return product.description || "Premium quality apparel designed for those who demand excellence. Every stitch, every thread, every detail — intentional.";
            case "fabric":
                return "100% Premium Cotton, 380 GSM heavyweight construction. Machine wash cold, tumble dry low. Iron inside-out for best results.";
            case "shipping":
                return "Free shipping within India on orders above ₹1,999. Standard delivery: 5-7 business days. Easy 15-day returns — no questions asked.";
            default:
                return "";
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <div className="lg:grid lg:grid-cols-2">

                {/* LEFT: SCROLLABLE GALLERY */}
                <div className="relative bg-[#0a0a0a]">
                    {/* View Toggle */}
                    <div className="absolute top-6 left-6 z-20 flex gap-2">
                        <button
                            onClick={() => setShow3D(false)}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center border transition-all",
                                !show3D ? "border-white bg-white/10" : "border-white/10 hover:border-white/30"
                            )}
                        >
                            <ImageIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setShow3D(true)}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center border transition-all",
                                show3D ? "border-white bg-white/10" : "border-white/10 hover:border-white/30"
                            )}
                        >
                            <Box className="w-4 h-4" />
                        </button>
                    </div>

                    {show3D ? (
                        <ProductViewer3D className="h-screen w-full" />
                    ) : (
                        <div className="lg:sticky lg:top-0 lg:h-screen overflow-y-auto hide-scrollbar snap-y snap-mandatory">
                            {images.length > 0 ? (
                                images.map((image, i) => (
                                    <div key={i} className="h-screen w-full relative snap-start flex items-center justify-center bg-[#080808]">
                                        <Image
                                            src={image.url}
                                            alt={image.altText || product.title}
                                            fill
                                            className="object-cover"
                                            priority={i === 0}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="h-screen w-full flex items-center justify-center bg-[#080808]">
                                    <span className="text-white/10 text-6xl font-black uppercase">RIIQX</span>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Scroll indicator */}
                    {images.length > 1 && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2">
                            {images.map((_, i) => (
                                <div key={i} className="w-1 h-8 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-full bg-white/40 rounded-full" style={{ height: '100%' }} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT: STICKY DETAILS */}
                <div className="relative z-10 bg-[#050505]">
                    <div className="max-w-xl mx-auto px-6 py-16 lg:py-32 lg:min-h-screen flex flex-col justify-center">

                        {/* Tags */}
                        <div className="flex items-center gap-3 mb-8">
                            <span className="px-3 py-1 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em]">
                                {product.tags?.[0] || "New Arrival"}
                            </span>
                            {product.availableForSale && (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B4F000]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#B4F000] animate-pulse" />
                                    In Stock
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-[0.95] font-[family-name:var(--font-oswald)] uppercase">
                            {product.title}
                        </h1>

                        {/* Price */}
                        <div className="text-2xl font-mono text-gray-400 mb-12">
                            {formatPrice(price.amount, price.currencyCode)}
                        </div>

                        {/* Size Selector */}
                        {sizes.length > 0 && (
                            <div className="mb-10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Select Size</span>
                                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
                                        <Ruler className="w-3 h-3" /> Size Guide
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={cn(
                                                "h-12 border flex items-center justify-center text-sm font-bold transition-all duration-200",
                                                selectedSize === size
                                                    ? "border-white bg-white text-black scale-[1.03]"
                                                    : "border-white/10 hover:border-white/30"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="mb-8">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] block mb-4">Quantity</span>
                            <div className="flex items-center gap-0 border border-white/10 w-fit">
                                <button
                                    onClick={() => handleQuantityChange('dec')}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-14 h-12 flex items-center justify-center text-sm font-bold font-mono border-x border-white/10">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange('inc')}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="space-y-4 mb-12">
                            <AddToCartButton
                                product={product}
                                variant={selectedVariant}
                                quantity={quantity}
                                className="w-full h-14 bg-white text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-[#B4F000] hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                            />
                            <p className="text-center text-[10px] text-gray-600 uppercase tracking-wider">
                                Free shipping on orders over ₹1,999
                            </p>
                        </div>

                        {/* Accordions */}
                        <div className="border-t border-white/10">
                            {accordionData.map((section) => {
                                const isOpen = openAccordion === section.key;
                                const Icon = section.icon;
                                return (
                                    <div key={section.key} className="border-b border-white/10">
                                        <button
                                            onClick={() => setOpenAccordion(isOpen ? null : section.key)}
                                            className="w-full py-5 flex justify-between items-center text-sm font-bold uppercase tracking-[0.15em] hover:text-gray-400 transition-colors"
                                        >
                                            <span className="flex items-center gap-3">
                                                <Icon className="w-4 h-4 text-gray-500" />
                                                {section.title}
                                            </span>
                                            <motion.span
                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </motion.span>
                                        </button>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="pb-5 text-sm text-gray-500 leading-relaxed pl-7">
                                                        {getAccordionContent(section.key)}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Add to Cart */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-black/90 backdrop-blur-md border-t border-white/5 lg:hidden z-50 safe-area-bottom">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-gray-400 font-mono">{formatPrice(price.amount, price.currencyCode)}</p>
                    </div>
                    <AddToCartButton
                        product={product}
                        variant={selectedVariant}
                        quantity={quantity}
                        className="flex-[2] h-12 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs"
                    />
                </div>
            </div>
        </div>
    );
}
