'use client';

import { useWishlistStore } from "@/store/useWishlistStore";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function WishlistPage() {
    const { items, removeItem } = useWishlistStore();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#D9F99D] selection:text-black">
            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">Wishlist</h1>
                        <p className="text-white/50 font-medium uppercase tracking-widest text-sm">Saved Items</p>
                    </div>
                    <div className="text-[#D9F99D] font-bold text-xl">{items.length} ITEMS</div>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <h2 className="text-2xl font-bold uppercase mb-4">Your Loadout is Empty</h2>
                        <p className="text-white/50 mb-8 max-w-md">Items you mark for later acquisition will appear here.</p>
                        <Link
                            href="/shop"
                            className="bg-[#D9F99D] text-black px-8 py-4 rounded-full font-black uppercase tracking-wider hover:bg-white transition-colors"
                        >
                            Browse Equipment
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((product) => (
                            <div key={product.id} className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-[#D9F99D]/50 transition-colors">
                                <Link href={`/product/${product.handle}`} className="block relative aspect-[4/5] bg-neutral-900">
                                    {product.featuredImage && (
                                        <Image
                                            src={product.featuredImage.url}
                                            alt={product.featuredImage.altText || product.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </Link>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <Link href={`/product/${product.handle}`} className="flex-1">
                                            <h3 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#D9F99D] transition-colors line-clamp-1">
                                                {product.title}
                                            </h3>
                                        </Link>
                                        <button
                                            onClick={() => removeItem(product.id)}
                                            className="ml-4 text-white/30 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-xl font-bold text-white">
                                            {formatPrice(parseFloat(product.priceRange.minVariantPrice.amount))}
                                        </div>
                                        <Link
                                            href={`/product/${product.handle}`}
                                            className="p-3 bg-white text-black rounded-full hover:bg-[#D9F99D] transition-colors"
                                        >
                                            <ShoppingBag size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
