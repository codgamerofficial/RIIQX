"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Check, Lock } from "lucide-react";
import { CartItem } from "@/store/useCartStore";
import { redirectToCheckout } from "@/app/actions/checkout";

interface CheckoutButtonProps {
    items: CartItem[];
}

export function CheckoutButton({ items }: CheckoutButtonProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleCheckout = async () => {
        if (status === "loading" || items.length === 0) return;

        setStatus("loading");

        try {
            const result = await redirectToCheckout(items);

            if (result.url) {
                setStatus("success");
                // Small delay to show success state before redirecting
                setTimeout(() => {
                    window.location.href = result.url;
                }, 1000);
            } else {
                throw new Error("No URL returned");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <div className="w-full">
            <motion.button
                onClick={handleCheckout}
                disabled={status === "loading" || status === "success"}
                layout // Enables automatic layout animations
                className={`relative w-full h-14 flex items-center justify-center rounded-sm font-black uppercase tracking-widest overflow-hidden transition-all duration-300
                    ${status === "error" ? "bg-red-500" : "bg-white hover:bg-white/90"}
                    text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]
                `}
            >
                <AnimatePresence mode="wait">
                    {status === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center space-x-2 group w-full justify-center"
                        >
                            <Lock className="w-4 h-4 text-black/70" />
                            <span>Secure Checkout</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                    )}

                    {status === "loading" && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="flex items-center justify-center"
                        >
                            <Loader2 className="w-6 h-6 animate-spin" />
                        </motion.div>
                    )}

                    {status === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center space-x-2"
                        >
                            <Check className="w-6 h-6" />
                            <span>Redirecting...</span>
                        </motion.div>
                    )}

                    {status === "error" && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                        >
                            <span>Error - Try Again</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
