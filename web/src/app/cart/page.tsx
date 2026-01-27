"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/shopify";
import { cn } from "@/lib/utils";
import { CheckoutButton } from "@/components/cart/CheckoutButton";

export default function CartPage() {
    const { items, updateQuantity, removeItem, getCartTotal, getItemCount } = useCartStore();
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

    const subtotal = getCartTotal();
    const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
    const shipping = subtotal > 5000 ? 0 : 200;
    const total = subtotal - discount + shipping;

    const handleApplyCoupon = () => {
        // Mock coupon validation
        if (couponCode.toUpperCase() === "RIIQX10") {
            setAppliedCoupon({ code: couponCode, discount: 10 });
        } else if (couponCode.toUpperCase() === "SAVE20") {
            setAppliedCoupon({ code: couponCode, discount: 20 });
        } else {
            alert("Invalid coupon code");
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-24">
                        <div className="w-32 h-32 mx-auto rounded-full border-2 border-dashed border-neutral-gray flex items-center justify-center mb-8">
                            <ShoppingBag className="w-16 h-16 text-neutral-gray" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-serif text-rich-black uppercase tracking-tight mb-4">
                            Your Cart is Empty
                        </h1>
                        <p className="text-neutral-gray text-lg mb-8">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link href="/shop">
                            <button className="bg-cherry-red text-white px-8 py-4 rounded-lg font-semibold hover:bg-cherry-red/90 transition-colors">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black font-serif text-rich-black uppercase tracking-tight mb-2">
                        Shopping Cart
                    </h1>
                    <p className="text-neutral-gray">
                        {getItemCount()} {getItemCount() === 1 ? "item" : "items"} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, idx) => (
                            <motion.div
                                key={`${item.id}-${item.variantId || idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-neutral-light border border-neutral-gray rounded-xl p-6 flex gap-6"
                            >
                                {/* Product Image */}
                                <div className="relative w-32 h-32 flex-shrink-0 bg-neutral-light rounded-lg overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-rich-black mb-1">{item.title}</h3>
                                        {item.size && (
                                            <p className="text-sm text-neutral-gray">Size: {item.size}</p>
                                        )}
                                        <p className="text-xl font-black text-cherry-red mt-2">
                                            {formatPrice((item.price * item.quantity).toString(), "INR")}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.variantId, Math.max(1, item.quantity - 1))}
                                                className="w-8 h-8 border border-neutral-gray rounded-lg flex items-center justify-center hover:border-cherry-red transition-colors"
                                            >
                                                <Minus className="w-4 h-4 text-rich-black" />
                                            </button>
                                            <span className="text-rich-black font-bold w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                                                className="w-8 h-8 border border-neutral-gray rounded-lg flex items-center justify-center hover:border-cherry-red transition-colors"
                                            >
                                                <Plus className="w-4 h-4 text-rich-black" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id, item.variantId)}
                                            className="text-cherry-red hover:text-cherry-red/80 transition-colors flex items-center gap-2 text-sm font-bold"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-neutral-light border border-neutral-gray rounded-xl p-6 sticky top-24">
                            <h2 className="text-2xl font-black font-serif text-rich-black uppercase tracking-tight mb-6">
                                Order Summary
                            </h2>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <label className="text-sm font-bold text-rich-black uppercase tracking-wider mb-2 block">
                                    Coupon Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Enter code"
                                        className="flex-1 bg-white border border-neutral-gray rounded-lg px-4 py-3 text-rich-black text-sm focus:border-cherry-red focus:outline-none transition-colors"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="px-6 py-3 bg-cherry-red text-white font-bold uppercase text-xs rounded-lg hover:bg-cherry-red/90 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {appliedCoupon && (
                                    <div className="mt-2 flex items-center gap-2 text-gold text-sm font-bold">
                                        <Tag className="w-4 h-4" />
                                        {appliedCoupon.code} applied ({appliedCoupon.discount}% off)
                                    </div>
                                )}
                            </div>

                            {/* Free Shipping Progress */}
                            <div className="mb-6 pb-6 border-b border-neutral-gray space-y-3">
                                <div className="flex justify-between text-xs font-bold text-rich-black uppercase">
                                    <span>{shipping === 0 ? "Free Shipping Unlocked" : `Add ${formatPrice((5000 - subtotal).toString(), 'INR')} for free shipping`}</span>
                                    <span>{Math.min(100, Math.round((subtotal / 5000) * 100))}%</span>
                                </div>
                                <div className="h-2 w-full bg-neutral-light border border-neutral-gray rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-cherry-red transition-all duration-500"
                                        style={{ width: `${Math.min(100, (subtotal / 5000) * 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-neutral-gray">
                                <div className="flex justify-between text-rich-black">
                                    <span>Subtotal</span>
                                    <span className="font-bold">{formatPrice(subtotal.toString(), "INR")}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-gold">
                                        <span>Discount ({appliedCoupon.discount}%)</span>
                                        <span className="font-bold">-{formatPrice(discount.toString(), "INR")}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-rich-black">
                                    <span>Delivery</span>
                                    <span className="font-bold">
                                        {shipping === 0 ? "FREE" : formatPrice(shipping.toString(), "INR")}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between text-2xl font-black text-cherry-red uppercase mb-6">
                                <span>Total</span>
                                <span>{formatPrice(total.toString(), "INR")}</span>
                            </div>

                            {/* Checkout Button */}
                            <CheckoutButton items={items} />

                            {/* Continue Shopping */}
                            <Link href="/shop">
                                <button className="w-full mt-3 bg-neutral-light text-rich-black py-3 rounded-lg font-semibold hover:bg-neutral-gray transition-colors text-sm">
                                    Continue Shopping
                                </button>
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-neutral-gray space-y-2">
                                <div className="flex items-center gap-2 text-xs text-neutral-gray">
                                    <div className="w-1 h-1 bg-gold rounded-full"></div>
                                    <span>Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-gray">
                                    <div className="w-1 h-1 bg-gold rounded-full"></div>
                                    <span>Easy Returns & Exchange</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-gray">
                                    <div className="w-1 h-1 bg-gold rounded-full"></div>
                                    <span>100% Authentic Products</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
