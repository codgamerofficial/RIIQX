"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Truck, Info, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "./CartItem";
import { CheckoutButton } from "./CheckoutButton";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { formatPrice } from "@/lib/shopify";
import { validatePromoCode } from "@/lib/promo";
import { createClient } from "@/lib/supabase/client";

function PromoCodeSection() {
    const { getCartTotal, applyDiscount, removeDiscount, discount } = useCartStore();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleApply = () => {
        setError("");
        setSuccess("");
        if (!code) return;
        const result = validatePromoCode(code, getCartTotal());
        if (result.valid && result.discount) {
            applyDiscount(result.discount);
            setSuccess(`Code applied! ${result.discount.type === 'percentage' ? result.discount.value + '%' : '₹' + result.discount.value} OFF`);
        } else {
            setError(result.error || "Invalid code");
        }
    };

    if (discount) {
        return (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Tag className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-bold tracking-wide">{discount.code}</p>
                        <p className="text-emerald-400 text-[10px] font-medium">Coupon Active</p>
                    </div>
                </div>
                <button onClick={() => { removeDiscount(); setSuccess(""); setCode(""); }} className="text-white/40 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Promo Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20 uppercase tracking-wide"
                    />
                </div>
                <button
                    onClick={handleApply}
                    disabled={!code}
                    className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-5 text-sm font-bold transition-all"
                >
                    Apply
                </button>
            </div>
            {error && <p className="text-red-400 text-xs font-medium pl-1 flex items-center gap-1.5"><Info className="w-3 h-3" /> {error}</p>}
            {success && <p className="text-emerald-400 text-xs font-medium pl-1">{success}</p>}
        </div>
    );
}

export function CartSheet() {
    const { isOpen, items, getCartTotal, setCartOpen, getDiscountAmount, getFinalTotal } = useCartStore();
    const pathname = usePathname();
    const supabase = createClient();

    // Close cart when navigating
    useEffect(() => {
        setCartOpen(false);
    }, [pathname, setCartOpen]);

    // Sync Cart to Supabase (Persistence)
    useEffect(() => {
        const syncCart = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await supabase.from('carts').upsert({
                    user_id: session.user.id,
                    items: items,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
            }
        };

        const timeoutId = setTimeout(() => {
            if (items.length > 0) syncCart();
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [items]);

    const subtotal = getCartTotal();
    const discountAmount = getDiscountAmount();
    const FREE_SHIPPING_THRESHOLD = 5000;
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 z-[70] h-full w-full max-w-[420px] bg-[#09090b]/95 backdrop-blur-3xl border-l border-white/5 flex flex-col shadow-2xl"
                    >
                        {/* Clean Header */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-4">
                            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                Review Bag
                                <span className="text-xs font-medium text-white/40 bg-white/5 px-2 py-1 rounded-full">
                                    {items.length}
                                </span>
                            </h2>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="h-9 w-9 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all active:scale-95"
                            >
                                <X className="w-5 h-5 text-white/70" />
                            </button>
                        </div>

                        {/* Minimalist Progress Bar */}
                        <div className="px-6 pb-6">
                            {(() => {
                                const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
                                const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

                                return (
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-white/60">
                                                {remaining > 0 ? (
                                                    <span className="text-white">Add {formatPrice(remaining.toString(), 'INR')} for free shipping</span>
                                                ) : (
                                                    <span className="text-white flex items-center gap-1.5"><Truck className="w-3 h-3" /> You have free shipping</span>
                                                )}
                                            </span>
                                            <span className="text-white/40">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-white rounded-full"
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6 scrollbar-hide">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-sm font-medium text-white/60">Your bag is empty.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        {items.map((item, idx) => (
                                            <CartItem key={`${item.id}-${item.variantId || idx}`} item={item} />
                                        ))}
                                    </div>
                                    <div className="pt-8 border-t border-white/5 space-y-4">
                                        <PromoCodeSection />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer - Clean Apple Style */}
                        {items.length > 0 && (
                            <div className="p-6 bg-[#09090b]/80 backdrop-blur-xl border-t border-white/5 space-y-4 safe-area-pb">
                                <div className="space-y-3 text-sm font-medium">
                                    <div className="flex justify-between text-white/60">
                                        <span>Subtotal</span>
                                        <span className="text-white">{formatPrice(subtotal.toString(), 'INR')}</span>
                                    </div>

                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-emerald-400">
                                            <span>Savings</span>
                                            <span>-{formatPrice(discountAmount.toString(), 'INR')}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-base text-white font-bold">Total</span>
                                        <div className="text-right">
                                            <span className="text-xl font-bold text-white block leading-none">
                                                {formatPrice((getFinalTotal()).toString(), 'INR')}
                                            </span>
                                            <span className="text-[10px] text-white/40 font-medium">Including Taxes</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <CheckoutButton items={items} />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
