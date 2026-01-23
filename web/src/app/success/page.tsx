"use client";

import { motion } from "framer-motion";
import { Check, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";

export default function SuccessPage() {
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-rich-black flex items-center justify-center relative overflow-hidden">
            {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} gravity={0.1} />}

            <div className="relative z-10 max-w-md w-full px-6 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 relative"
                >
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping duration-[2000ms]" />
                    <Check className="w-10 h-10 text-green-500" />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-black text-white uppercase tracking-tighter mb-4 font-display"
                >
                    Order Placed!
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/60 mb-8 leading-relaxed"
                >
                    Thank you for your purchase. Your order has been securely processed by Shopify. Check your email for confirmation details.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <Link href="/shop" className="block">
                        <button className="w-full bg-white text-black py-4 rounded-lg font-black uppercase tracking-widest hover:bg-gold transition-colors flex items-center justify-center gap-2 group">
                            <span>Continue Shopping</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>

                    <Link href="/account/orders" className="block">
                        <button className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-lg font-black uppercase tracking-widest transition-colors">
                            View Order History
                        </button>
                    </Link>
                </motion.div>

                <div className="mt-12 opacity-30 invert">
                    {/* Optional: Add Brand Logo or subtle footer element */}
                </div>
            </div>
        </div>
    );
}
