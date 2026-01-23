"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Tag, Check, X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "./CartItem";
import { NeonButton } from "@/components/ui/neon-button";
import Link from "next/link";
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

    const handleRemove = () => {
        removeDiscount();
        setSuccess("");
        setCode("");
    };

    if (discount) {
        return (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <div>
                        <p className="text-green-400 text-sm font-bold uppercase tracking-wider">{discount.code}</p>
                        <p className="text-green-400/60 text-[10px]">Discount Applied</p>
                    </div>
                </div>
                <button onClick={handleRemove} className="text-white/40 hover:text-white transition-colors">
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
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cherry-red transition-colors placeholder:text-white/20 uppercase"
                    />
                </div>
                <button
                    onClick={handleApply}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                    Apply
                </button>
            </div>
            {error && <p className="text-neon-red text-[10px] pl-1 animate-pulse">{error}</p>}
            {success && <p className="text-green-400 text-[10px] pl-1">{success}</p>}
        </div>
    );
}

export function CartSheet() {
    const { isOpen, toggleCart, items, getCartTotal, setCartOpen, getDiscountAmount, getFinalTotal } = useCartStore();
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
                // Upsert cart
                await supabase.from('carts').upsert({
                    user_id: session.user.id,
                    items: items,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
            }
        };

        // Debounce sync
        const timeoutId = setTimeout(() => {
            if (items.length > 0) {
                syncCart();
            }
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [items]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-rich-black border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-rich-black">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                <span className="text-cherry-red">///</span> Your Cart
                                <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                                    {items.length}
                                </span>
                            </h2>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="p-2 text-white/50 hover:text-cherry-red transition-colors hover:rotate-90 duration-300"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Free Shipping Progress */}
                        <div className="px-6 pb-2 pt-6 bg-rich-black">
                            <div className="bg-neutral-900 rounded-none border border-white/10 p-5 relative overflow-hidden group">
                                {(() => {
                                    const total = getCartTotal();
                                    const threshold = 5000;
                                    const progress = Math.min((total / threshold) * 100, 100);
                                    const remaining = threshold - total;

                                    return (
                                        <div className="space-y-3 relative z-10">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                                <span className="text-white/70">
                                                    {remaining > 0 ? `Add ${formatPrice(remaining.toString(), 'INR')} for Free Shipping` : "Free Shipping Unlocked!"}
                                                </span>
                                                <span className="text-cherry-red">{Math.round(progress)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/10 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`h-full ${remaining <= 0 ? 'bg-gold shadow-[0_0_10px_#F5C518]' : 'bg-cherry-red'}`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Promo Code & Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-rich-black custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-12 text-muted-foreground">
                                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center animate-pulse">
                                        <ShoppingBag className="w-10 h-10 opacity-30" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-white uppercase tracking-tight mb-2">Cart is Empty</p>
                                        <p className="text-sm text-white/50 max-w-[200px] mx-auto">
                                            Your bag is looking a little light. Check out the latest drops to fix that.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="mt-4 px-8 py-3 bg-white text-black font-black uppercase tracking-widest hover:bg-gold transition-colors text-xs"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        {items.map((item, idx) => (
                                            <CartItem key={`${item.id}-${item.variantId || idx}`} item={item} />
                                        ))}
                                    </div>

                                    {/* Promo Code Input */}
                                    <div className="pt-4 border-t border-white/10">
                                        <PromoCodeSection />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-rich-black">
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center justify-between text-sm text-white/60">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(getCartTotal().toString(), 'INR')}</span>
                                    </div>

                                    {getDiscountAmount() > 0 && (
                                        <div className="flex items-center justify-between text-sm text-green-400 font-bold">
                                            <span>Discount</span>
                                            <span>-{formatPrice(getDiscountAmount().toString(), 'INR')}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-2xl font-black text-white uppercase">
                                        <span>Total</span>
                                        <span className="text-cherry-red">{formatPrice(getFinalTotal().toString(), 'INR')}</span>
                                    </div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest text-right">
                                        Shipping & Taxes Calculated at Checkout
                                    </p>
                                </div>
                                <Link href="/checkout" className="block">
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="w-full py-4 bg-gradient-to-r from-cherry-red to-red-700 text-white font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(227,28,121,0.5)] transition-all flex items-center justify-center space-x-2 group rounded-lg"
                                    >
                                        <span>Secure Checkout</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
