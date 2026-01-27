"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface QuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
    const { title, descriptionHtml, priceRange, images, variants, description, availableForSale } = product;
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const { addItem } = useCartStore();

    const price = priceRange.minVariantPrice;

    // Extract options
    const sizeOption = product.options?.find(opt => opt.name.toLowerCase() === 'size');
    const sizes = sizeOption?.values || [];

    const colorOption = product.options?.find(opt => opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour');
    const colors = colorOption?.values || [];

    // Get selected variant
    const selectedVariant = (product.variants?.edges || []).find(edge => {
        const options = edge.node.selectedOptions;
        const sizeMatch = !sizes.length || (selectedSize && options.some(o => o.name.toLowerCase() === 'size' && o.value === selectedSize));
        const colorMatch = !colors.length || (selectedColor && options.some(o => (o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour') && o.value === selectedColor));
        return sizeMatch && colorMatch;
    })?.node;

    const handleAddToCart = () => {
        if (sizes.length > 0 && !selectedSize) {
            toast.error("Please select a size");
            return;
        }

        if (!selectedVariant) {
            toast.error("Please select options");
            return;
        }

        addItem({
            id: product.id,
            variantId: selectedVariant.id,
            title: product.title,
            price: parseFloat(selectedVariant.price.amount),
            image: selectedVariant.image?.url || product.featuredImage?.url || "",
            quantity: 1,
            size: selectedSize || undefined,
            color: selectedColor || undefined
        });
        toast.success("Added to cart");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0B0B0B] border border-white/10 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Left: Image */}
                            <div className="w-full md:w-1/2 bg-[#050505] relative aspect-square md:aspect-auto">
                                {(images?.edges?.[0]?.node?.url || product.featuredImage?.url) ? (
                                    <Image
                                        src={images?.edges?.[0]?.node?.url || product.featuredImage?.url || ""}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                                        <ShoppingBag className="w-16 h-16 opacity-20" />
                                    </div>
                                )}
                            </div>

                            {/* Right: Details */}
                            <div className="w-full md:w-1/2 p-8 overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-black uppercase tracking-tighter text-white font-display mb-2">{title}</h2>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl font-bold text-white/90">{formatPrice(price.amount, price.currencyCode)}</span>
                                            <div className="flex items-center gap-1 text-accent text-xs">
                                                <Star className="w-3 h-3 fill-accent" />
                                                <span>4.8</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="prose prose-invert prose-sm text-white/60 line-clamp-3">
                                        <div dangerouslySetInnerHTML={{ __html: descriptionHtml || description }} />
                                    </div>

                                    {/* Color Selector */}
                                    {colors.length > 0 && (
                                        <div className="space-y-3">
                                            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Color: {selectedColor}</span>
                                            <div className="flex flex-wrap gap-2">
                                                {colors.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={cn(
                                                            "px-4 py-2 border text-xs font-bold uppercase transition-all rounded-lg",
                                                            selectedColor === color
                                                                ? "bg-white text-black border-white"
                                                                : "bg-transparent text-white border-white/20 hover:border-white"
                                                        )}
                                                    >
                                                        {color}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Size Selector */}
                                    {sizes.length > 0 && (
                                        <div className="space-y-3">
                                            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Size: {selectedSize}</span>
                                            <div className="flex flex-wrap gap-2">
                                                {sizes.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={cn(
                                                            "w-10 h-10 flex items-center justify-center border text-xs font-bold uppercase transition-all rounded-lg",
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

                                    <div className="pt-6 space-y-3">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={!availableForSale || (sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor) || !selectedVariant}
                                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-xl"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            {!availableForSale
                                                ? "Sold Out"
                                                : (!selectedVariant && (sizes.length > 0 || colors.length > 0))
                                                    ? "Select Options"
                                                    : "Add to Bag"}
                                        </button>

                                        <Link href={`/product/${product.handle}`} className="block w-full text-center py-3 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors text-xs">
                                            View Full Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
