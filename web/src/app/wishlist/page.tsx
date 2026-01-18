"use client";

import Link from "next/link";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ArrowRight, Heart } from "lucide-react";
import { formatPrice } from "@/lib/shopify";
import { NeonButton } from "@/components/ui/neon-button";

export default function WishlistPage() {
    const { items, removeItem } = useWishlistStore();
    const { addItem } = useCartStore();

    const handleMoveToCart = (item: any) => {
        addItem({
            id: item.id,
            variantId: item.variantId,
            title: item.title,
            price: parseFloat(item.price),
            image: item.image,
            quantity: 1,
        });
        removeItem(item.id);
    };

    return (
        <div className="min-h-screen bg-[#121212] pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                        wishlist <span className="text-[#D9F99D]">({items.length})</span>
                    </h1>
                    <p className="text-white/50 text-lg">
                        Save it now. Drip later.
                    </p>
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="group relative bg-[#1A1A1A] rounded-xl overflow-hidden border border-white/5 hover:border-[#D9F99D]/30 transition-all"
                                >
                                    {/* Image */}
                                    <div className="aspect-[4/5] bg-black relative overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-red-500 hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <Link href={`/shop/${item.handle}`}>
                                            <h3 className="text-white font-bold text-sm uppercase tracking-wide truncate mb-1 hover:text-[#D9F99D] transition-colors">
                                                {item.title}
                                            </h3>
                                        </Link>
                                        <p className="text-white/70 text-sm font-medium mb-4">
                                            {formatPrice(item.price, item.currencyCode)}
                                        </p>

                                        <button
                                            onClick={() => handleMoveToCart(item)}
                                            className="w-full flex items-center justify-center space-x-2 bg-white text-black font-bold py-3 rounded-lg text-xs uppercase tracking-widest hover:bg-[#D9F99D] transition-colors"
                                        >
                                            <ShoppingBag className="w-3 h-3" />
                                            <span>Move to Cart</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-8 h-8 text-white/20" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
                        <p className="text-white/50 mb-8 max-w-sm text-center">
                            Don't let your drip slip away. Save items here and cop them when you're ready.
                        </p>
                        <Link href="/shop">
                            <NeonButton>
                                Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
                            </NeonButton>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
