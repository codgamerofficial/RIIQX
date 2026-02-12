"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { formatPrice } from "@/lib/shopify";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { CheckoutButton } from "./CheckoutButton";

export function CartSheet() {
    const { isOpen, items, getCartTotal, setCartOpen, updateQuantity, removeItem, getItemCount } = useCartStore();
    const pathname = usePathname();
    const supabase = createClient();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        setCartOpen(false);
    }, [pathname, setCartOpen]);

    // Cart Sync to Supabase
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
        const timeoutId = setTimeout(() => { if (items.length > 0) syncCart(); }, 2000);
        return () => clearTimeout(timeoutId);
    }, [items]);

    const subtotal = getCartTotal();
    const itemCount = getItemCount();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 z-[99] bg-black/70 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            x: isMobile ? 0 : "100%",
                            y: isMobile ? "100%" : 0
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                            transition: { type: "spring", damping: 30, stiffness: 300 }
                        }}
                        exit={{
                            opacity: 0,
                            x: isMobile ? 0 : "100%",
                            y: isMobile ? "100%" : 0,
                            transition: { duration: 0.3 }
                        }}
                        drag={isMobile ? "y" : false}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.5 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100) setCartOpen(false);
                        }}
                        className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:left-auto md:right-0 md:w-[460px] z-[100] bg-[#0B0B0B] md:border-l border-t md:border-t-0 border-white/5 rounded-t-3xl md:rounded-none shadow-2xl flex flex-col max-h-[90vh] md:max-h-screen"
                    >
                        {/* Mobile Drag Handle */}
                        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-4 mb-2 md:hidden" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-5 pb-5 border-b border-white/5">
                            <div>
                                <h2 className="text-lg font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-oswald)]">
                                    Your Bag
                                </h2>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                                    {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                                </span>
                            </div>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-white/30 transition-colors"
                            >
                                <X className="w-4 h-4 text-white/60" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-0">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-6 py-20">
                                    <ShoppingBag className="w-16 h-16 stroke-[0.5]" />
                                    <div className="text-center space-y-2">
                                        <p className="text-sm font-bold uppercase tracking-[0.2em]">Empty Bag</p>
                                        <p className="text-xs text-gray-600">Your bag is waiting to be filled.</p>
                                    </div>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="border border-white/10 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white hover:border-white/30 transition-all"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item, i) => (
                                    <motion.div
                                        key={item.id + (item.variantId || '')}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex gap-4 py-6 border-b border-white/5 last:border-b-0"
                                    >
                                        {/* Image */}
                                        <div className="relative w-20 h-28 bg-white/5 overflow-hidden flex-shrink-0">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <div>
                                                <Link
                                                    href={`/product/${item.handle}`}
                                                    onClick={() => setCartOpen(false)}
                                                    className="text-sm font-bold text-white line-clamp-1 hover:text-[#B4F000] transition-colors"
                                                >
                                                    {item.title}
                                                </Link>
                                                <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-wider">
                                                    {[item.size, item.color].filter(Boolean).join(" / ")}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <p className="text-sm font-mono text-white">
                                                    {formatPrice((Number(item.price) * item.quantity).toString(), 'INR')}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-white/10">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.variantId, Math.max(0, item.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white/5 transition-colors"
                                                    >
                                                        {item.quantity === 1
                                                            ? <Trash2 className="w-3 h-3 text-red-400" />
                                                            : <Minus className="w-3 h-3 text-white/50" />
                                                        }
                                                    </button>
                                                    <span className="w-8 h-8 flex items-center justify-center text-xs font-bold font-mono border-x border-white/10">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white/5 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3 text-white/50" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 bg-[#0B0B0B] border-t border-white/5 safe-area-pb space-y-6">
                                {/* Subtotal */}
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Subtotal</span>
                                    <span className="text-xl font-black font-mono text-white">
                                        {formatPrice(subtotal.toString(), 'INR')}
                                    </span>
                                </div>

                                <p className="text-[10px] text-gray-600 text-center uppercase tracking-wider">
                                    Taxes and shipping calculated at checkout
                                </p>

                                {/* Checkout Button */}
                                <CheckoutButton items={items} />

                                {/* Continue Shopping */}
                                <button
                                    onClick={() => setCartOpen(false)}
                                    className="w-full text-center text-xs text-gray-500 hover:text-white uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 py-2"
                                >
                                    Continue Shopping <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
