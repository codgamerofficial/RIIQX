"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { Zap, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

interface GamifiedAddToCartProps {
    product: Product;
    variant: any;
    quantity: number;
    className?: string;
}

export function GamifiedAddToCart({ product, variant, quantity, className }: GamifiedAddToCartProps) {
    const cart = useCartStore();
    const [xpAwarded, setXpAwarded] = useState(false);

    const handleAddToCart = async () => {
        if (!variant) {
            toast.error("Please select options first");
            return;
        }

        // Add to cart
        cart.addItem({
            id: variant.id,
            title: product.title,
            handle: product.handle,
            price: parseFloat(variant.price.amount),
            currencyCode: variant.price.currencyCode,
            image: variant.image?.url || product.featuredImage?.url,
            quantity: quantity,
            variantId: variant.id,
            selectedOptions: variant.selectedOptions, // Ensure this maps correctly
        });

        // Trigger XP Animation
        setXpAwarded(true);
        setTimeout(() => setXpAwarded(false), 2000);

        toast.success("Added to Cart", {
            description: `${product.title} - ${variant.title}`,
        });

        // Open cart sheet (optional)
        // cart.openCart(); 
    };

    return (
        <div className="relative w-full">
            <button
                onClick={handleAddToCart}
                disabled={!variant?.availableForSale}
                className={cn(
                    "relative overflow-hidden group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                    className || "w-full py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-white/90 transition-colors"
                )}
            >
                {variant?.availableForSale ? (
                    <>
                        <span className="relative z-10">ADD TO CART</span>
                        <ShoppingBag className="w-5 h-5 relative z-10" />
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    </>
                ) : (
                    "SOLD OUT"
                )}
            </button>

            {/* XP Flyout Animation */}
            <AnimatePresence>
                {xpAwarded && (
                    <motion.div
                        initial={{ y: 0, opacity: 1, scale: 0.5 }}
                        animate={{ y: -100, opacity: 0, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-50 flex items-center gap-1 text-[#B4F000] font-black text-2xl"
                        style={{ textShadow: "0 0 20px #B4F000" }}
                    >
                        +50 XP <Zap className="fill-[#B4F000]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
