"use client";

import { motion } from "framer-motion";
import { Package, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");

    return (
        <main className="bg-black min-h-screen flex items-center justify-center p-4 pt-32 pb-20">
            {/* iOS Style Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                className="w-full max-w-[400px] bg-[#121212] border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden relative"
            >
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/5 blur-[50px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
                        <Package className="w-8 h-8 text-white opacity-80" strokeWidth={1.5} />
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold text-white tracking-tight">Locate Shipment</h1>
                        <p className="text-white/40 text-sm font-medium leading-relaxed px-4">
                            Input your Order ID found in your confirmation signal.
                        </p>
                    </div>

                    {/* Input Group */}
                    <div className="w-full space-y-6 pt-4">
                        <div className="space-y-2 text-left">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Order ID / Tracking Number</label>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-white transition-colors" />
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                                    className="w-full bg-[#1c1c1e] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white text-sm font-medium focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20 uppercase tracking-widest font-mono"
                                    placeholder="ORD-2026-XXXX"
                                />
                            </div>
                        </div>

                        {/* Action Button */}
                        <button className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <span>Track Status</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <Link href="/help" className="text-xs text-white/30 hover:text-white transition-colors">
                        Need help finding your Order ID?
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
