"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, ShieldCheck, Zap } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { loadRazorpayScript } from "@/lib/razorpay";
import Image from "next/image";
import Link from "next/link";

// Gen Z Color Palette
const COLORS = {
    neonGreen: "#CCFF00",
    brightRed: "#FF0033",
    electricYellow: "#FFFF00",
    black: "#050505",
    darkGray: "#111111",
};

export default function CheckoutPage() {
    const { items, getCartTotal, clearCart } = useCartStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");

    const totalAmount = getCartTotal();

    const handlePayment = async () => {
        setIsProcessing(true);
        const res = await loadRazorpayScript();

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            setIsProcessing(false);
            return;
        }

        // @ts-ignore
        const rzp = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            amount: totalAmount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "RIIQX",
            description: "Gen Z Streetwear Transaction",
            image: "/riiqx-logo-new.png", // Use the logo from Navbar
            handler: function (response: any) {
                // Validate payment at server - using CLIENT SIDE validation logic for demo
                // In production, verify signature on backend
                if (response.razorpay_payment_id) {
                    setPaymentStatus("success");
                    clearCart();
                } else {
                    setPaymentStatus("failed");
                }
            },
            prefill: {
                name: "RIIQX Fam",
                email: "genz@riiqx.com",
                contact: "9999999999",
            },
            theme: {
                color: COLORS.neonGreen,
            },
            modal: {
                ondismiss: function () {
                    setIsProcessing(false);
                }
            }
        });

        rzp.on("payment.failed", function (response: any) {
            setPaymentStatus("failed");
            console.error(response.error);
        });

        rzp.open();
    };

    if (items.length === 0 && paymentStatus !== "success") {
        return (
            <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center text-white font-['Oswald']">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#CCFF00] mb-6"
                >
                    Cart is Empty
                </motion.h1>
                <Link href="/shop" className="px-8 py-3 bg-[#CCFF00] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    if (paymentStatus === "success") {
        return (
            <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none"></div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 rounded-full bg-[#CCFF00] flex items-center justify-center mb-8"
                >
                    <Zap className="w-12 h-12 text-black fill-current" />
                </motion.div>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4 text-center"
                >
                    Order <span className="text-[#CCFF00]">Secured</span>
                </motion.h1>
                <p className="text-gray-400 font-mono mb-8 text-center max-w-md">Your fit is locked in. Order confirmation has been sent to your email.</p>
                <Link href="/" className="px-8 py-4 border border-[#333] hover:border-[#CCFF00] text-white hover:text-[#CCFF00] uppercase tracking-[0.2em] transition-all duration-300">
                    Back to Base
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Oswald'] selection:bg-[#CCFF00] selection:text-black overflow-x-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#CCFF00]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF0033]/5 blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-24 h-full">
                {/* Left Column: Order Details */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-12">
                        <Link href="/">
                            <img src="/riiqx-logo-new.png" alt="RIIQX" className="w-12 h-auto hover:brightness-125 transition-all" />
                        </Link>
                        <div className="h-8 w-[1px] bg-white/20"></div>
                        <span className="text-sm font-mono text-white/50 tracking-widest uppercase">Secure Checkout</span>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
                            Secure <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-[#FFFF00]">The Drip</span>
                        </h2>
                    </div>

                    {/* Cart Items Preview */}
                    <div className="bg-[#111] border border-white/5 p-6 md:p-8 backdrop-blur-sm">
                        <h3 className="text-xl font-bold uppercase tracking-wider mb-6 flex items-center justify-between">
                            Your Bag <span className="text-[#CCFF00] font-mono">({items.length})</span>
                        </h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-start group">
                                    <div className="w-20 h-24 bg-[#0a0a0a] relative overflow-hidden">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold uppercase tracking-tight text-white/90 line-clamp-1">{item.title}</h4>
                                        <div className="text-xs text-white/50 mb-2 font-mono">QTY: {item.quantity}</div>
                                        <div className="text-[#CCFF00] font-bold">
                                            ₹{item.price.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Payment Action */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
                    className="flex flex-col justify-center"
                >
                    <div className="bg-[#0A0A0A] border border-white/10 p-8 md:p-12 relative overflow-hidden group">
                        {/* Interactive Border Effect */}
                        <div className="absolute inset-0 border border-[#CCFF00]/0 group-hover:border-[#CCFF00]/50 transition-colors duration-500 pointer-events-none z-20"></div>

                        {/* Glitch Overlay */}
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                                <span className="text-white/60 font-mono uppercase tracking-widest text-sm">Total Due</span>
                                <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                    ₹{totalAmount.toLocaleString()}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-white/40 font-mono">
                                    <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                                    <span>Encrypted 256-bit SSL Payment</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-white/40 font-mono">
                                    <Lock className="w-4 h-4 text-[#FFFF00]" />
                                    <span>Guaranteed Safe Checkout</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full relative group overflow-hidden bg-[#CCFF00] h-16 md:h-20 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-[#FFFF00] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                                <span className="relative z-10 text-black font-black text-xl md:text-2xl uppercase tracking-[0.2em] flex items-center gap-3">
                                    {isProcessing ? "INITIALIZING..." : "PAY NOW"}
                                    {!isProcessing && <ArrowRight className="w-6 h-6" />}
                                </span>
                            </button>

                            {paymentStatus === "failed" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-[#FF0033]/10 border border-[#FF0033]/50 text-[#FF0033] text-center font-bold uppercase tracking-wide text-sm"
                                >
                                    Payment Failed. Try Again.
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-white/20 text-xs font-mono uppercase tracking-widest">
                            Powered by Razorpay • RIIQX Secure
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
