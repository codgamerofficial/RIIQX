"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType, useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/shopify";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCartStore();

    return (
        <div className="group relative flex gap-4 py-4 border-b border-white/5 last:border-0 hover:border-white/10 transition-colors">
            {/* Image - Aggressive Square */}
            <div className="relative w-24 h-28 flex-shrink-0 bg-[#111] border border-white/10 overflow-hidden group-hover:border-white/30 transition-colors">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20 text-[10px] uppercase font-bold tracking-widest -rotate-45">
                        No Image
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-white uppercase tracking-tighter font-display leading-tight pr-6">
                            {item.title}
                        </h4>
                        <button
                            onClick={() => removeItem(item.id, item.variantId)}
                            className="text-white/20 hover:text-red-500 transition-colors -mt-1 -mr-1 p-2"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[10px] font-mono text-white/40 mt-2 uppercase tracking-wide">
                        {item.color && (
                            <span className="border border-white/10 px-1.5 py-0.5">{item.color}</span>
                        )}
                        {item.size && (
                            <span className="border border-white/10 px-1.5 py-0.5">{item.size}</span>
                        )}
                    </div>
                </div>

                <div className="flex items-end justify-between mt-3">
                    {/* Quantity Controls - Sharp */}
                    <div className="flex items-center border border-white/10 h-7">
                        <button
                            onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                            className="w-7 h-full flex items-center justify-center hover:bg-white text-white hover:text-black transition-colors"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-white">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                            className="w-7 h-full flex items-center justify-center hover:bg-white text-white hover:text-black transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-black text-white font-mono tracking-tighter">
                        {formatPrice((item.price * item.quantity).toString(), 'INR')}
                    </span>
                </div>
            </div>
        </div>
    );
}
