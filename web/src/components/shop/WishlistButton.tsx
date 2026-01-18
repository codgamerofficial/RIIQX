'use client';

import { useWishlistStore } from "@/store/useWishlistStore";
import { Product } from "@/lib/shopify/types";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

export function WishlistButton({ product }: { product: Product }) {
    const { items, addItem, removeItem, isInWishlist } = useWishlistStore();
    const [inWishlist, setInWishlist] = useState(false);

    // Sync with store on mount/update (client-side only to avoid hydration mismatch potentially, 
    // although zustand persist usually handles this well, but useEffect ensures we are reading client state)
    useEffect(() => {
        setInWishlist(isInWishlist(product.id));
    }, [items, product.id, isInWishlist]);

    const toggleWishlist = () => {
        if (inWishlist) {
            removeItem(product.id);
        } else {
            addItem(product);
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            className={`w-14 h-14 flex items-center justify-center rounded-lg border transition-all ${inWishlist
                    ? "bg-white/10 border-[#D9F99D] text-[#D9F99D]"
                    : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30"
                }`}
            aria-label={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            <Heart
                size={24}
                fill={inWishlist ? "currentColor" : "none"}
            />
        </button>
    );
}
