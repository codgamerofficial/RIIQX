"use client";

import { useWishlistStore } from "@/store/useWishlistStore";
import { ProductCardFuture } from "@/components/ProductCardFuture";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WishlistPage() {
    const { items } = useWishlistStore();

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-6">
            <div className="max-w-[1600px] mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <Link href="/account" className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors text-sm font-bold uppercase tracking-widest">
                            <ArrowLeft className="w-4 h-4" /> Back to Hub
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Wishlist</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-white/5">
                        <Heart className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-xs font-bold uppercase tracking-widest">{items.length} Items</span>
                    </div>
                </div>

                {/* Grid */}
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
                        {items.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <ProductCardFuture product={product} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="min-h-[40vh] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl">
                        <Heart className="w-12 h-12 text-white/20 mb-4" />
                        <p className="text-white/40 font-mono text-sm uppercase tracking-widest mb-6">Your wishlist is empty</p>
                        <Link href="/shop" className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-white/90 rounded-sm transition-all">
                            Explore Collection
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
