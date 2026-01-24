"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Tag, Check, X, ShoppingBag } from "lucide-react";
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
            <div className="bg-accent/10 border border-accent/20 rounded-none p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent" />
                    <div>
                        <p className="text-accent text-sm font-bold uppercase tracking-wider">{discount.code}</p>
                        <p className="text-accent/60 text-[10px]">Discount Applied</p>
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
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Promo Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className="w-full bg-white/5 border border-white/10 rounded-none pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/20 uppercase"
                    />
                </div>
                <button
                    onClick={handleApply}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-none text-xs font-bold uppercase tracking-wider transition-colors"
                >
                    Apply
                </button>
            </div>
            {error && <p className="text-red-500 text-[10px] pl-1 animate-pulse uppercase tracking-wide">{error}</p>}
            {success && <p className="text-accent text-[10px] pl-1 uppercase tracking-wide">{success}</p>}
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

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-black/90 backdrop-blur-3xl border-l border-white/5 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2 font-display">
                                Your Bag
                                <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-sm ml-2">
                                    {items.length}
                                </span>
                            </h2>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="p-2 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Free Shipping Progress */}
                        <div className="px-6 py-4 border-b border-white/5 bg-white/5">
                            {(() => {
                                const total = getCartTotal();
                                const threshold = 5000;
                                const progress = Math.min((total / threshold) * 100, 100);
                                const remaining = threshold - total;

                                return (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/60">
                                            <span>{remaining > 0 ? `Add ${formatPrice(remaining.toString(), 'INR')} for free shipping` : "Free Shipping Unlocked"}</span>
                                            <span>{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/10 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full bg-white"
                                            />
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground opacity-50">
                                    <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
                                    <p className="text-sm font-bold uppercase tracking-widest">Your bag is empty</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        {items.map((item, idx) => (
                                            <CartItem key={`${item.id}-${item.variantId || idx}`} item={item} />
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t border-white/5">
                                        <PromoCodeSection />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/5 bg-black/40">
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-sm text-white/60">
                                        <span>Subtotal</span>
                                        <span className="text-white">{formatPrice(getCartTotal().toString(), 'INR')}</span>
                                    </div>
                                    {getDiscountAmount() > 0 && (
                                        <div className="flex items-center justify-between text-sm text-accent font-bold">
                                            <span>Discount</span>
                                            <span>-{formatPrice(getDiscountAmount().toString(), 'INR')}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-xl font-black text-white uppercase font-display border-t border-white/5 pt-3">
                                        <span>Total</span>
                                        <span>{formatPrice(getFinalTotal().toString(), 'INR')}</span>
                                    </div>
                                </div>
                                <CheckoutButton items={items} />
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
