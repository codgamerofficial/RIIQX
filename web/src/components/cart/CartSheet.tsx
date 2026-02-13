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
                        className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-md"
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
                        className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:left-auto md:right-0 md:w-[500px] z-[100] bg-[#050505] border-l border-white/10 shadow-2xl flex flex-col max-h-[90vh] md:max-h-screen"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B4F000] to-transparent opacity-50" />
                        <div className="absolute bottom-0 right-0 p-32 bg-[#B4F000]/5 blur-3xl rounded-full pointer-events-none" />

                        {/* Mobile Drag Handle */}
                        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-4 mb-2 md:hidden" />

                        {/* Header */}
                        <div className="flex flex-col border-b border-white/10 bg-[#0A0A0A] relative z-10">
                            <div className="flex items-center justify-between px-6 py-5">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tighter font-[family-name:var(--font-oswald)] flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-[#B4F000]" />
                                        Supply Crate
                                    </h2>
                                    <span className="text-[10px] text-[#B4F000] uppercase tracking-widest font-mono">
                                        // CAPACITY: {itemCount} UNITS
                                    </span>
                                </div>
                                <button
                                    onClick={() => setCartOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-[#B4F000] hover:text-[#B4F000] hover:bg-white/5 transition-all text-white/50"
                                >
                                    <X className="w-5 h-5" strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* XP Progress Banner */}
                            <div className="px-6 pb-4">
                                <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest text-white/40 mb-1">
                                    <span>XP Progress</span>
                                    <span>Next Level: {1000 - (subtotal % 1000)} XP needed</span>
                                </div>
                                <div className="h-1.5 bg-white/10 w-full overflow-hidden relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(subtotal % 1000) / 10}%` }}
                                        className="h-full bg-[#B4F000] shadow-[0_0_10px_#B4F000]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-0">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-6">
                                    <div className="w-24 h-24 border border-dashed border-white/10 flex items-center justify-center rounded-full bg-white/5">
                                        <ShoppingBag className="w-10 h-10 stroke-[1]" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B4F000]">Crate Empty</p>
                                        <p className="text-xs text-white/40 font-mono">Initiate supply run to acquire gear.</p>
                                    </div>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="border border-[#B4F000]/30 text-[#B4F000] px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#B4F000] hover:text-black transition-all clip-path-slant-sm"
                                    >
                                        Deploy to Shop
                                    </button>
                                </div>
                            ) : (
                                items.map((item, i) => (
                                    <motion.div
                                        key={item.id + (item.variantId || '')}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex gap-4 p-4 border border-white/5 bg-[#0A0A0A] hover:border-[#B4F000]/30 transition-colors group relative"
                                    >
                                        {/* Image */}
                                        <div className="relative w-20 h-24 bg-white/5 overflow-hidden flex-shrink-0 border border-white/10">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <Link
                                                        href={`/product/${item.handle}`}
                                                        onClick={() => setCartOpen(false)}
                                                        className="text-sm font-bold text-white line-clamp-1 hover:text-[#B4F000] transition-colors font-[family-name:var(--font-oswald)] uppercase tracking-tight"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <button
                                                        onClick={() => removeItem(item.id, item.variantId)}
                                                        className="text-white/20 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-[#B4F000] font-mono mt-1 uppercase tracking-wider">
                                                    {[item.size, item.color].filter(Boolean).join(" // ")}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <p className="text-sm font-mono text-white font-bold">
                                                    {formatPrice((Number(item.price) * item.quantity).toString(), 'INR')}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center bg-white/5 border border-white/10">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.variantId, Math.max(0, item.quantity - 1))}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-[#B4F000] hover:text-black transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 h-7 flex items-center justify-center text-[10px] font-bold font-mono text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-[#B4F000] hover:text-black transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
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
                            <div className="p-6 bg-[#0A0A0A] border-t border-white/10 safe-area-pb space-y-5 relative z-10">
                                {/* XP Gain Summary */}
                                <div className="flex items-center justify-between px-3 py-2 bg-[#B4F000]/10 border border-[#B4F000]/20 rounded-sm">
                                    <span className="text-[9px] uppercase font-bold text-[#B4F000] tracking-widest">XP Acquired</span>
                                    <span className="text-xs font-black font-mono text-[#B4F000]">+{Math.floor(subtotal / 10)} XP</span>
                                </div>

                                {/* Subtotal */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Total Value</span>
                                        <span className="text-2xl font-black font-mono text-white tracking-tighter">
                                            {formatPrice(subtotal.toString(), 'INR')}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-white/30 text-right uppercase tracking-widest font-mono">
                                        Excludes Logistics & Tax
                                    </p>
                                </div>

                                {/* Checkout Button */}
                                <CheckoutButton items={items} />
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
