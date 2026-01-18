"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Plus, Check, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useState } from "react";

interface ShopifyProductCardProps {
    product: Product;
}

export function ShopifyProductCard({ product }: ShopifyProductCardProps) {
    const { addItem } = useCartStore();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
    const [isHovered, setIsHovered] = useState(false);
    const [added, setAdded] = useState(false);

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
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group block h-full select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-neutral-900 border border-white/5 rounded-none overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col relative group-hover:shadow-[0_0_30px_rgba(217,249,157,0.1)]">
                {/* Link to PDP */}
                <Link href={`/shop/${product.handle}`} className="absolute inset-0 z-10" />

                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-800">
                    <AnimatePresence>
                        {/* Primary Image */}
                        <motion.div
                            className="absolute inset-0"
                            animate={{ opacity: isHovered && secondImage !== mainImage ? 0 : 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src={mainImage}
                                alt={product.featuredImage?.altText || product.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>

                        {/* Secondary Image (Hover) */}
                        {isHovered && secondImage !== mainImage && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={secondImage}
                                    alt={product.title}
                                    fill
                                    className="object-cover scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Quick Add Button (Top Right) */}
                    <button
                        onClick={handleQuickAdd}
                        className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${added
                            ? "bg-primary text-black scale-110"
                            : "bg-white text-black hover:bg-primary"
                            } translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100`}
                        title="Quick Add to Cart"
                    >
                        {added ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>

                    {/* Wishlist Button (Top Left) */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isInWishlist(product.id)) {
                                removeFromWishlist(product.id);
                            } else {
                                addToWishlist(product);
                            }
                        }}
                        className={`absolute top-4 left-4 z-20 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 backdrop-blur-md border -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${isInWishlist(product.id)
                            ? "bg-red-500/20 border-red-500 text-red-500"
                            : "bg-black/40 border-white/10 text-white hover:bg-white hover:text-black"
                            }`}
                        title="Add to Wishlist"
                    >
                        <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                    </button>

                    {/* Sale Badge (if needed) - Hardcoded/Logic based could be added later */}
                    {/* <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 tracking-widest">Sale</div> */}
                </div>

                {/* Info Section */}
                <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider line-clamp-2 pr-4 leading-tight group-hover:text-primary transition-colors">
                            {product.title}
                        </h3>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-lg font-black text-white">
                            {formatPrice(price.amount, price.currencyCode)}
                        </span>

                        {/* Hidden "Shop" text appearing on hover could go here, or keep it clean */}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
