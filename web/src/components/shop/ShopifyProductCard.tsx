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
            viewport={{ once: true, margin: "-50px" }}
            className="group block h-full select-none relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Card Container - Edge to Edge */}
            <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden w-full">
                {/* Link to PDP */}
                <Link href={`/shop/${product.handle}`} className="absolute inset-0 z-10" />

                {/* Images with Morph/Scale Effect */}
                <div className="relative w-full h-full overflow-hidden">
                    <AnimatePresence>
                        <motion.div
                            className="absolute inset-0 w-full h-full"
                            animate={{ scale: isHovered ? 1.05 : 1 }}
                            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }} // smooth ease
                        >
                            <Image
                                src={mainImage}
                                alt={product.featuredImage?.altText || product.title}
                                fill
                                className={`object-cover transition-opacity duration-500 ${isHovered && secondImage !== mainImage ? "opacity-0" : "opacity-100"}`}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />

                            {secondImage !== mainImage && (
                                <Image
                                    src={secondImage}
                                    alt={product.title}
                                    fill
                                    className={`object-cover absolute inset-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Floating Price Badge (Glassmorphism) */}
                <div className="absolute top-4 left-4 z-20">
                    <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-white font-mono text-xs font-bold tracking-wider uppercase">
                        {formatPrice(price.amount, price.currencyCode)}
                    </div>
                </div>

                {/* Rating Pill (Bottom Left) - Bewakoof Style */}
                <div className="absolute bottom-4 left-4 z-20 bewakoof-rating-pill">
                    <svg className="w-3 h-3 fill-current bewakoof-rating-star" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{(4.2 + (Math.abs(product.id.charCodeAt(0)) % 8) / 10).toFixed(1)}</span>
                </div>

                {/* Wishlist Button (Top Right) */}
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
                    className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-300"
                    title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <Heart
                        className={`w-6 h-6 transition-all duration-300 ${isInWishlist(product.id) ? "fill-neon-red text-neon-red drop-shadow-[0_0_8px_rgba(255,31,31,0.5)]" : "text-white"}`}
                    />
                </button>

                {/* Quick Add Button (Bottom Right) */}
                <button
                    onClick={handleQuickAdd}
                    className={`absolute bottom-4 right-4 z-20 w-12 h-12 flex items-center justify-center bg-white text-black transition-all duration-300 ${added ? "bg-luxury-gold scale-110" : "hover:scale-105"
                        } ${isHovered ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                >
                    {added ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>

                {/* Minimal Info Overlay (Bottom Left) */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20">
                    <h3 className="font-display font-bold text-white text-2xl uppercase tracking-tighter leading-none mb-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                        {product.title}
                    </h3>
                    {/* Optional: Add simplified vendor or tag here */}
                </div>
            </div>
        </motion.div>
    );
}
