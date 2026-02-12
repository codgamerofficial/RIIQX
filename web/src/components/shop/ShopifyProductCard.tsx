"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Plus, Check, Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useState, useEffect } from "react";

interface ShopifyProductCardProps {
    product: Product;
}

export function ShopifyProductCard({ product }: ShopifyProductCardProps) {
    const { addItem } = useCartStore();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
    const [isHovered, setIsHovered] = useState(false);
    const [added, setAdded] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const mainImage = product.featuredImage?.url || product.images?.edges?.[0]?.node.url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop";
    const secondImage = product.images?.edges?.[1]?.node.url || mainImage;
    const price = product.priceRange.minVariantPrice;

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();

        const variant = product.variants?.edges?.[0]?.node;
        addItem({
            id: product.id,
            variantId: variant?.id,
            title: product.title,
            price: parseFloat(price.amount),
            image: mainImage,
            quantity: 1,
            handle: product.handle,
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    // Hydration fix: Default to false (not in wishlist) during SSR
    const isWishlisted = hasMounted ? isInWishlist(product.id) : false;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="group block h-full select-none relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Container - Light Theme as per reference */}
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden w-full border border-white/5 group-hover:border-accent/50 transition-colors duration-300">
                {/* Link to PDP */}
                <Link href={`/product/${product.handle}`} className="absolute inset-0 z-10" />

                {/* "NEW" Badge (Top Left) */}
                <div className="absolute top-4 left-4 z-20">
                    <div className="px-3 py-1 bg-white text-black font-black text-[10px] uppercase tracking-widest border border-black/5 shadow-sm">
                        New
                    </div>
                </div>

                {/* Images with Morph/Scale Effect */}
                <div className="relative w-full h-full overflow-hidden p-4">
                    <AnimatePresence>
                        <motion.div
                            className="absolute inset-0 w-full h-full"
                            animate={{ scale: isHovered ? 1.05 : 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <Image
                                src={mainImage}
                                alt={product.featuredImage?.altText || product.title}
                                fill
                                className={`object-contain transition-opacity duration-500 ${isHovered && secondImage !== mainImage ? "opacity-0" : "opacity-100"}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />

                            {isHovered && secondImage !== mainImage && (
                                <Image
                                    src={secondImage}
                                    alt={product.title}
                                    fill
                                    className="object-contain absolute inset-0 transition-opacity duration-500 opacity-100"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Quick Add Button (Bottom Right - Minimal) */}
                <button
                    onClick={handleQuickAdd}
                    className={`absolute bottom-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black text-white transition-all duration-300 hover:bg-accent hover:text-black ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        }`}
                >
                    {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>

                {/* Info Overlay (Bottom Center - Minimal) */}
                <div className="absolute bottom-6 left-0 w-full text-center px-4 pointer-events-none z-20">
                    <h3 className="font-display font-black text-black text-xl uppercase tracking-tighter leading-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {product.title}
                    </h3>
                    <div className="text-xs font-bold font-mono text-black/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                        {formatPrice(price.amount, price.currencyCode)}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
