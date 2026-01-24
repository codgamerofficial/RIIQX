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
        <div className="flex items-center space-x-4 py-4 border-b border-white/10 last:border-0">
            {/* Image */}
            <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-white/5">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20 text-[10px] uppercase">
                        No Image
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white line-clamp-1">{item.title}</h4>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                    {item.color && <span>{item.color}</span>}
                    {item.color && item.size && <span>•</span>}
                    {item.size && <span>{item.size}</span>}
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-white">
                        {formatPrice((item.price * item.quantity).toString(), 'INR')}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 bg-white/5 rounded-md p-1">
                        <button
                            onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                            className="p-1 hover:text-white transition-colors"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs w-4 text-center">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                            className="p-1 hover:text-white transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Remove */}
            <button
                onClick={() => removeItem(item.id, item.variantId)}
                className="text-muted-foreground hover:text-destructive transition-colors p-2"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
