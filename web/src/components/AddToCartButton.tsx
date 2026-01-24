"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { Product, ProductVariant } from "@/lib/shopify/types";

interface AddToCartButtonProps {
    product: Product;
    variant?: ProductVariant;
    className?: string;
}

export function AddToCartButton({ product, variant, className = "" }: AddToCartButtonProps) {
    const { addItem } = useCartStore();
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleAdd = async () => {
        if (status !== "idle") return;

        setStatus("loading");

        // Simulating network delay for feel (or real async if we wait for cart sync)
        await new Promise(resolve => setTimeout(resolve, 600));

        const selectedVariant = variant || product.variants.edges[0]?.node;
        const price = parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount);
        const image = selectedVariant?.image?.url || product.featuredImage?.url || product.images.edges[0]?.node.url || "";

        addItem({
            id: product.id,
            variantId: selectedVariant?.id,
            title: product.title,
            price: price,
            image: image,
            quantity: 1,
            size: selectedVariant?.selectedOptions.find(o => o.name.toLowerCase() === 'size')?.value,
            color: selectedVariant?.selectedOptions.find(o => ['color', 'colour'].includes(o.name.toLowerCase()))?.value,
        });

        setStatus("success");
        setTimeout(() => setStatus("idle"), 2000);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className={`relative w-full overflow-hidden bg-white text-black font-black uppercase tracking-widest py-4 px-8 text-sm transition-all hover:bg-white/90 ${className}`}
        >
            <AnimatePresence mode="wait">
                {status === "idle" && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-3"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                    </motion.div>
                )}

                {status === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-white"
                    >
                        <Loader2 className="w-5 h-5 animate-spin text-black" />
                    </motion.div>
                )}

                {status === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-3 text-accent"
                    >
                        <Check className="w-5 h-5" />
                        <span>Added</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
