'use client';

import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Tag } from 'lucide-react';

export function OrderSummary() {
    const { items, getCartTotal } = useCartStore();
    const subtotal = getCartTotal();

    // Mock calculations for now
    const shippingThreshold = 200;
    const isFreeShipping = subtotal >= shippingThreshold;
    const shippingCost = isFreeShipping ? 0 : 20;
    const total = subtotal + shippingCost;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold mb-6">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {items.map((item) => (
                    <div key={`${item.id}-${item.variantId || 'default'}`} className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                    No Img
                                </div>
                            )}
                            <span className="absolute top-0 right-0 bg-white/20 backdrop-blur-md text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-lg font-medium">
                                {item.quantity}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">
                                {item.selectedOptions?.map(opt => opt.value).join(' / ')}
                            </p>
                        </div>

                        <div className="text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Your cart is empty.</p>
                )}
            </div>

            {/* Discount Code */}
            <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Gift card or discount code"
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        disabled
                    />
                </div>
                <button
                    disabled
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                    Apply
                </button>
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-white/10 pt-6 text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{isFreeShipping ? 'Free' : formatPrice(shippingCost)}</span>
                </div>

                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10 mt-2">
                    <span>Total</span>
                    <span className="flex items-baseline gap-2">
                        <span className="text-xs text-muted-foreground font-normal uppercase">USD</span>
                        {formatPrice(total)}
                    </span>
                </div>
            </div>
        </div>
    );
}
