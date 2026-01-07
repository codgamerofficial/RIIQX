"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "./CartItem";
import { NeonButton } from "@/components/ui/neon-button";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { formatPrice } from "@/lib/shopify";

export function CartSheet() {
    const { isOpen, toggleCart, items, getCartTotal, setCartOpen } = useCartStore();
    const pathname = usePathname();

    // Close cart when navigating
    useEffect(() => {
        setCartOpen(false);
    }, [pathname, setCartOpen]);

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
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-card border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-primary" />
                                Your Cart
                            </h2>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="p-2 text-muted-foreground hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-2">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-12 text-muted-foreground">
                                    <ShoppingBag className="w-12 h-12 opacity-20" />
                                    <p>Your cart is empty.</p>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="text-primary hover:underline text-sm"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item, idx) => (
                                    <CartItem key={`${item.id}-${item.variantId || idx}`} item={item} />
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/5 bg-background/50 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-white font-medium">Subtotal</span>
                                    <span className="text-xl font-bold text-white">
                                        {formatPrice(getCartTotal().toString(), 'INR')}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-6">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <Link href="/checkout">
                                    <NeonButton className="w-full py-4 text-base" glow>
                                        <span className="mr-2">Checkout</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </NeonButton>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
