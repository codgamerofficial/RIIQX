"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/shopify";
import { cn } from "@/lib/utils";

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
            <div className="min-h-screen bg-background pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-24">
                        <div className="w-32 h-32 mx-auto rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-8">
                            <ShoppingBag className="w-16 h-16 text-white/30" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4 font-montserrat">
                            Your Cart is Empty
                        </h1>
                        <p className="text-muted-foreground text-lg mb-8">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link href="/shop">
                            <button className="bewakoof-btn bewakoof-btn-primary px-8 py-4 text-base">
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-2 font-montserrat">
                        Shopping Cart
                    </h1>
                    <p className="text-muted-foreground">
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
                                className="bg-neutral-900 border border-white/10 rounded-xl p-6 flex gap-6"
                            >
                                {/* Product Image */}
                                <div className="relative w-32 h-32 flex-shrink-0 bg-neutral-800 rounded-lg overflow-hidden">
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
                                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                        {item.size && (
                                            <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                        )}
                                        <p className="text-xl font-black text-white mt-2">
                                            {formatPrice((item.price * item.quantity).toString(), "INR")}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="w-8 h-8 border border-white/20 rounded-lg flex items-center justify-center hover:border-white transition-colors"
                                            >
                                                <Minus className="w-4 h-4 text-white" />
                                            </button>
                                            <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 border border-white/20 rounded-lg flex items-center justify-center hover:border-white transition-colors"
                                            >
                                                <Plus className="w-4 h-4 text-white" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-neon-red hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-bold"
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
                        <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 sticky top-24">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">
                                Order Summary
                            </h2>

                            {/* Coupon Code */}
                            <div className="mb-6">
                                <label className="text-sm font-bold text-white uppercase tracking-wider mb-2 block">
                                    Coupon Code
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Enter code"
                                        className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-bewakoof-yellow focus:outline-none transition-colors"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="px-6 py-3 bg-white text-black font-bold uppercase text-xs rounded-lg hover:bg-bewakoof-yellow transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {appliedCoupon && (
                                    <div className="mt-2 flex items-center gap-2 text-bewakoof-green text-sm font-bold">
                                        <Tag className="w-4 h-4" />
                                        {appliedCoupon.code} applied ({appliedCoupon.discount}% off)
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                                <div className="flex justify-between text-white">
                                    <span>Subtotal</span>
                                    <span className="font-bold">{formatPrice(subtotal.toString(), "INR")}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-bewakoof-green">
                                        <span>Discount ({appliedCoupon.discount}%)</span>
                                        <span className="font-bold">-{formatPrice(discount.toString(), "INR")}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-white">
                                    <span>Shipping</span>
                                    <span className="font-bold">
                                        {shipping === 0 ? "FREE" : formatPrice(shipping.toString(), "INR")}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        Add {formatPrice((5000 - subtotal).toString(), "INR")} more for free shipping
                                    </p>
                                )}
                            </div>

                            {/* Total */}
                            <div className="flex justify-between text-2xl font-black text-white uppercase mb-6">
                                <span>Total</span>
                                <span>{formatPrice(total.toString(), "INR")}</span>
                            </div>

                            {/* Checkout Button */}
                            <Link href="/checkout">
                                <button className="w-full bewakoof-btn bewakoof-btn-primary py-4 text-base flex items-center justify-center gap-2">
                                    <span>Proceed to Checkout</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>

                            {/* Continue Shopping */}
                            <Link href="/shop">
                                <button className="w-full mt-3 bewakoof-btn bewakoof-btn-secondary py-3 text-sm">
                                    Continue Shopping
                                </button>
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-1 h-1 bg-bewakoof-green rounded-full"></div>
                                    <span>Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-1 h-1 bg-bewakoof-green rounded-full"></div>
                                    <span>Easy Returns & Exchange</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-1 h-1 bg-bewakoof-green rounded-full"></div>
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
