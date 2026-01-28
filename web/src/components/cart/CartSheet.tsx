"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Truck, Info } from "lucide-react";
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
            <div className="bg-accent/10 border-l-2 border-accent p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-accent rotate-45" />
                    <div>
                        <p className="text-accent text-sm font-bold uppercase tracking-wider font-display">{discount.code}</p>
                        <p className="text-accent/60 text-[10px] uppercase tracking-wider">Discount Applied</p>
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
            <div className="flex gap-0">
                <input
                    type="text"
                    placeholder="ENTER PROMO CODE"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-black/50 border border-white/10 border-r-0 px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-accent transition-colors placeholder:text-white/20 uppercase tracking-wider font-mono"
                />
                <button
                    onClick={handleApply}
                    className="bg-white/10 hover:bg-accent hover:text-black border border-white/10 text-white px-4 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    Apply
                </button>
            </div>
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1"><Info className="w-3 h-3" /> {error}</p>}
            {success && <p className="text-accent text-[10px] font-bold uppercase tracking-wide">{success}</p>}
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
    const shippingCost = isFreeShipping ? 0 : 500; // Flat rate fallback, typical integration updates this at checkout

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-[#050505] border-l border-white/10 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)]"
                    >
                        {/* Header - Aggressive */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0A0A0A]">
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3 font-display">
                                Your Bag
                                <span className="bg-accent text-black text-xs not-italic font-bold px-1.5 py-0.5 clip-path-slant">
                                    {items.length}
                                </span>
                            </h2>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="group p-2 hover:bg-white/10 transition-colors"
                            >
                                <X className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Free Shipping Progress - Neon */}
                        <div className="px-6 py-5 border-b border-white/10 bg-black relative overflow-hidden">
                            {(() => {
                                const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
                                const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

                                return (
                                    <div className="space-y-3 relative z-10">
                                        <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest text-white/60 font-mono">
                                            <span className={remaining <= 0 ? "text-accent" : ""}>
                                                {remaining > 0 ? (
                                                    <>Add <span className="text-white">{formatPrice(remaining.toString(), 'INR')}</span> for <span className="text-accent">Free Shipping</span></>
                                                ) : (
                                                    "Free Shipping Unlocked"
                                                )}
                                            </span>
                                            <span className="text-white">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 overflow-hidden relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className={`h-full ${remaining <= 0 ? "bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" : "bg-white"}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })()}
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
                        </div>

                        {/* Items - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-track-black scrollbar-thumb-white/20 hover:scrollbar-thumb-accent/50">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                                    <div className="w-20 h-20 border border-white/20 rotate-45 flex items-center justify-center">
                                        <ShoppingBag className="w-8 h-8 -rotate-45 text-white" />
                                    </div>
                                    <p className="text-base font-black uppercase tracking-widest font-display">Your bag is empty</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        {items.map((item, idx) => (
                                            <CartItem key={`${item.id}-${item.variantId || idx}`} item={item} />
                                        ))}
                                    </div>
                                    <div className="pt-8 border-t border-white/10 space-y-4">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Have a promo code?</p>
                                        <PromoCodeSection />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer - Detailed Pricing */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-[#0A0A0A] space-y-4">
                                {/* Price Breakdown */}
                                <div className="space-y-2 text-xs font-mono uppercase tracking-wide">
                                    <div className="flex justify-between text-white/60">
                                        <span>Subtotal</span>
                                        <span className="text-white">{formatPrice(subtotal.toString(), 'INR')}</span>
                                    </div>

                                    <div className="flex justify-between text-white/60">
                                        <span>Shipping</span>
                                        {isFreeShipping ? (
                                            <span className="text-accent">FREE</span>
                                        ) : (
                                            <div className="text-right">
                                                <span className="text-white line-through opacity-50 block text-[10px]">₹500</span>
                                                <span className="text-white/60 text-[10px] lowercase normal-case tracking-normal">(Calculated at checkout)</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between text-white/60">
                                        <span>Tax (15.25% Included)</span>
                                        <span className="text-white">
                                            {formatPrice((subtotal * (0.1525 / 1.1525)).toString(), 'INR')}
                                        </span>
                                    </div>

                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-accent font-bold">
                                            <span>Discount</span>
                                            <span>-{formatPrice(discountAmount.toString(), 'INR')}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="flex items-center justify-between text-2xl font-black text-white uppercase italic tracking-tighter border-t border-white/10 pt-4 font-display">
                                    <span>Total</span>
                                    <span>{formatPrice((getFinalTotal()).toString(), 'INR')}</span>
                                </div>
                                <div className="text-[10px] text-white/30 text-center uppercase tracking-widest pb-2">
                                    Tax included • Shipping calculated at checkout
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
