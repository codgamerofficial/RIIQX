"use client";

import { motion } from "framer-motion";
import { useRealityStore } from "@/store/reality-store";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface Product {
    id: string;
    title: string;
    price: string;
    image: string;
    category: 'fashion' | 'electronics';
}

interface ProductOverlayProps {
    product: Product;
    onClose: () => void;
}

export function ProductOverlay({ product, onClose }: ProductOverlayProps) {
    const mode = useRealityStore((state) => state.mode);
    const isFashion = mode === 'fashion';

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 pointer-events-none">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto cursor-pointer"
            />

            {/* The Morphing Card */}
            <motion.div
                layoutId={`card-${product.id}`}
                className={cn(
                    "relative w-full max-w-5xl h-[80vh] pointer-events-auto overflow-hidden flex flex-col md:flex-row",
                    isFashion
                        ? "bg-[#1a1a1a] rounded-[3rem]"
                        : "bg-black border border-primary"
                )}
            >
                {/* Close Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Left: Image / Visual */}
                <div className={cn(
                    "w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden",
                    isFashion ? "bg-neutral-800" : "bg-neutral-900 grid-bg"
                )}>
                    {/* Placeholder for Big Image */}
                    <motion.div
                        layoutId={`image-${product.id}`}
                        className="w-full h-full bg-neutral-700"
                    />

                    {/* Electronics Overlay */}
                    {!isFashion && (
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                    )}
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full p-6 md:p-16 flex flex-col justify-center space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar">
                    <div>
                        <motion.h2
                            layoutId={`title-${product.id}`}
                            className={cn(
                                "text-4xl md:text-6xl mb-2",
                                isFashion ? "font-serif italic text-white" : "font-mono uppercase text-primary tracking-tighter"
                            )}
                        >
                            {product.title}
                        </motion.h2>
                        <motion.p
                            layoutId={`price-${product.id}`}
                            className={cn(
                                "text-2xl",
                                isFashion ? "text-white/60" : "text-secondary font-mono"
                            )}
                        >
                            {product.price}
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <p className={cn(
                            "text-lg leading-relaxed max-w-md",
                            isFashion ? "text-white/80 font-serif" : "text-white/60 font-mono text-sm"
                        )}>
                            Start walking in the future. This item features adaptive material technology that responds to your environment.
                            {isFashion ? " Fluid drape, organic texture." : " High-tensile strength, data-integrated weave."}
                        </p>

                        <div className="flex gap-4">
                            {['S', 'M', 'L', 'XL'].map(size => (
                                <button key={size} className={cn(
                                    "w-12 h-12 flex items-center justify-center transition-all",
                                    isFashion
                                        ? "rounded-full border border-white/20 hover:bg-white hover:text-black"
                                        : "border border-primary/50 hover:bg-primary hover:text-black font-mono"
                                )}>
                                    {size}
                                </button>
                            ))}
                        </div>

                        <button className={cn(
                            "w-full py-4 text-xl transition-all",
                            isFashion
                                ? "rounded-full bg-white text-black font-serif hover:scale-105"
                                : "bg-primary text-black font-mono uppercase tracking-widest hover:bg-secondary"
                        )}>
                            {isFashion ? "Add to Wardrobe" : "CONFIRM_ACQUISITION"}
                        </button>
                    </motion.div>
                </div>

            </motion.div>
        </div>
    );
}
