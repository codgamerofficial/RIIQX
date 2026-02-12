"use client";

import { NeonButton } from "@/components/ui/neon-button";
import { useCartStore } from "@/store/useCartStore";
import { Product, ProductVariant } from "@/lib/shopify/types";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface ShopifyAddToCartButtonProps {
    product: Product;
    selectedVariant?: ProductVariant; // For future when variant selection is implemented
}

export function ShopifyAddToCartButton({ product, selectedVariant }: ShopifyAddToCartButtonProps) {
    const { addItem } = useCartStore();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        // Default to first variant if none selected or if logic is simple
        const variant = selectedVariant || product.variants.edges[0]?.node;
        const price = parseFloat(variant?.price.amount || product.priceRange.minVariantPrice.amount);
        const image = variant?.image?.url || product.featuredImage?.url || product.images.edges[0]?.node.url || "";

        addItem({
            id: product.id,
            variantId: variant?.id,
            title: product.title,
            price: price,
            image: image,
            quantity: 1,
            handle: product.handle,
            // Add color/size if we track them from selectedVariant parameters
            size: variant?.selectedOptions.find(o => o.name === 'Size')?.value,
            color: variant?.selectedOptions.find(o => o.name === 'Color')?.value,
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="pt-4">
            <NeonButton
                onClick={handleAdd}
                className="w-full py-6 text-lg"
                glow={!added}
                variant={added ? "secondary" : "primary"}
            >
                {added ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center"
                    >
                        <Check className="w-5 h-5 mr-3" />
                        Added to Cart
                    </motion.div>
                ) : (
                    <div className="flex items-center">
                        <ShoppingBag className="w-5 h-5 mr-3" />
                        Add to Cart
                    </div>
                )}
            </NeonButton>
        </div>
    );
}
