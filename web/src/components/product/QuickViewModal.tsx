"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { useState, useEffect } from "react";
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
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

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
            handle: product.handle,
            size: selectedSize || undefined,
            color: selectedColor || undefined
        });
        toast.success("Added to cart");
        onClose();
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Use createPortal to break out of parent stacking contexts (especially transforms)
    const { createPortal } = require('react-dom');

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#050505] border border-white/10 w-full max-w-5xl rounded-3xl shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] overflow-hidden group"
                        >
                            {/* Decorative Neon Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#D9F99D]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl pointer-events-none" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/10 border border-white/5 rounded-full transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Left: Image */}
                            <div className="w-full md:w-1/2 bg-[#0a0a0a] relative aspect-square md:aspect-auto border-b md:border-b-0 md:border-r border-white/5">
                                {(images?.edges?.[0]?.node?.url || product.featuredImage?.url) ? (
                                    <Image
                                        src={images?.edges?.[0]?.node?.url || product.featuredImage?.url || ""}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                        sizes="(min-width: 1024px) 50vw, 100vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                                        <ShoppingBag className="w-16 h-16 opacity-20" />
                                    </div>
                                )}
                            </div>

                            {/* Right: Details */}
                            <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto custom-scrollbar flex flex-col justify-between bg-gradient-to-b from-[#0B0B0B] to-black">
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white leading-none">{title}</h2>
                                            {/* Price Tag */}
                                            <div className="bg-[#D9F99D] text-black px-3 py-1 text-xs font-black uppercase tracking-widest">
                                                {formatPrice(price.amount, price.currencyCode)}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/40">
                                            <span>Premium Collection</span>
                                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                                            <div className="flex items-center gap-1 text-[#D9F99D]">
                                                <Star className="w-3 h-3 fill-[#D9F99D]" />
                                                <span>4.9 (128)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Color Selector */}
                                    {colors.length > 0 && (
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Select Color</span>
                                            <div className="flex flex-wrap gap-3">
                                                {colors.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={cn(
                                                            "h-10 px-4 border text-[10px] font-bold uppercase transition-all flex items-center gap-2 group/btn relative overflow-hidden",
                                                            selectedColor === color
                                                                ? "bg-white text-black border-white"
                                                                : "bg-transparent text-white/60 border-white/10 hover:border-white/40 hover:text-white"
                                                        )}
                                                    >
                                                        {selectedColor === color && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                                                        {color}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Size Selector */}
                                    {sizes.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Select Size</span>
                                                <button
                                                    onClick={() => setIsSizeGuideOpen(true)}
                                                    className="text-[10px] underline text-white/40 hover:text-white transition-colors"
                                                >
                                                    Size Guide
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2">
                                                {sizes.map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setSelectedSize(size)}
                                                        className={cn(
                                                            "h-12 flex items-center justify-center border text-[10px] font-bold uppercase transition-all",
                                                            selectedSize === size
                                                                ? "bg-[#D9F99D] text-black border-[#D9F99D] shadow-[0_0_15px_rgba(217,249,157,0.4)]"
                                                                : "bg-white/5 text-white/60 border-transparent hover:bg-white/10 hover:text-white"
                                                        )}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-8 space-y-3 mt-auto">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!availableForSale || (sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor) || !selectedVariant}
                                        className="w-full h-14 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-[#D9F99D] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm relative overflow-hidden group/add"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {!availableForSale ? "Sold Out" : "Add to Cart"} <ShoppingBag className="w-4 h-4" />
                                        </span>
                                    </button>

                                    <Link href={`/product/${product.handle}`} className="block w-full text-center py-3 text-[10px] text-white/40 font-bold uppercase tracking-widest hover:text-white transition-colors">
                                        View Full Product Details
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Size Guide Modal - Nested Portal */}
                    <AnimatePresence>
                        {isSizeGuideOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSizeGuideOpen(false)}
                                className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-[#111] border border-white/10 p-8 max-w-lg w-full rounded-2xl relative"
                                >
                                    <button
                                        onClick={() => setIsSizeGuideOpen(false)}
                                        className="absolute top-4 right-4 text-white/40 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-white mb-6">Size Guide</h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-white/60">
                                            <thead className="text-[10px] uppercase text-white/40 font-bold border-b border-white/10">
                                                <tr>
                                                    <th className="py-2">Size</th>
                                                    <th className="py-2">Chest (in)</th>
                                                    <th className="py-2">Length (in)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 font-mono">
                                                <tr>
                                                    <td className="py-3 text-white font-bold">XS</td>
                                                    <td className="py-3">34-36</td>
                                                    <td className="py-3">27.0</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-3 text-white font-bold">S</td>
                                                    <td className="py-3">36-38</td>
                                                    <td className="py-3">27.5</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-3 text-white font-bold">M</td>
                                                    <td className="py-3">38-40</td>
                                                    <td className="py-3">28.5</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-3 text-white font-bold">L</td>
                                                    <td className="py-3">40-42</td>
                                                    <td className="py-3">29.5</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-3 text-white font-bold">XL</td>
                                                    <td className="py-3">42-44</td>
                                                    <td className="py-3">30.5</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="mt-4 text-[10px] text-white/30 uppercase tracking-widest text-center">Measurements are in inches</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
