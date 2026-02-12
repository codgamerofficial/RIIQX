"use client";

import { NeonButton } from "@/components/ui/neon-button";
import { useCartStore } from "@/store/useCartStore";
import { Database } from "@/types/database.types";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type Product = Database["public"]["Tables"]["products"]["Row"];

export function AddToCartButton({ product }: { product: Product }) {
    const { addItem } = useCartStore();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addItem({
            id: product.id,
            title: product.title,
            price: product.selling_price,
            image: product.images?.[0] || "",
            quantity: 1,
            handle: product.title.toLowerCase().replace(/\s+/g, '-'),
            // color/size would come from selected state if implemented
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
