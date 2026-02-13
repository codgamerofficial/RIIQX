"use client";

import { motion } from "framer-motion";
import { Package, Search, ArrowRight, CornerDownRight, MapPin } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");

    return (
        <main className="bg-[#050505] min-h-screen flex items-center justify-center p-4 pt-32 pb-20 relative overflow-hidden">

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                className="w-full max-w-[500px] relative z-10"
            >
                {/* ID Header */}
                <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[10px] font-mono text-[#B4F000] uppercase tracking-widest">
                        // System: Sat_Link_01
                    </span>
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                        Status: Active
                    </span>
                </div>

                {/* Main Card */}
                <div className="bg-[#0A0A0A] border border-white/10 p-8 md:p-12 relative overflow-hidden group">
                    {/* Corner Markers */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#B4F000]" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#B4F000]" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#B4F000]" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#B4F000]" />

                    {/* Scan Line Animation */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#B4F000]/5 to-transparent h-[20%] w-full animate-scan pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-8">

                        {/* Icon */}
                        <div className="w-20 h-20 bg-[#121212] border border-white/10 flex items-center justify-center relative">
                            <Package className="w-10 h-10 text-white" strokeWidth={1} />
                            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#B4F000]" />
                        </div>

                        {/* Title */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-oswald leading-none">
                                Track <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4F000] to-white/50">Order</span>
                            </h1>
                            <p className="text-white/40 text-xs font-mono uppercase tracking-widest max-w-xs mx-auto">
                                Enter your unique consignment identifier to access real-time telemetry.
                            </p>
                        </div>

                        {/* Input Group */}
                        <div className="w-full space-y-4">
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <Search className="w-5 h-5 text-white/30 group-focus-within:text-[#B4F000] transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                                    className="w-full bg-[#050505] border border-white/20 p-4 pl-12 text-white text-base font-mono focus:outline-none focus:border-[#B4F000] transition-all placeholder:text-white/10 uppercase tracking-widest"
                                    placeholder="ORD-2026-XXXX"
                                />
                            </div>

                            <button className="w-full bg-[#B4F000] text-black font-black uppercase tracking-widest py-4 text-xs hover:bg-white transition-colors flex items-center justify-center gap-2 group/btn clip-path-slant-right">
                                <span>Initiate Trace</span>
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-8 text-center flex justify-center">
                    <Link href="/contact" className="flex items-center gap-2 text-[10px] text-white/30 hover:text-[#B4F000] transition-colors uppercase tracking-widest font-mono group">
                        <CornerDownRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        <span>Lost Verification Signal? Contact Support</span>
                    </Link>
                </div>

            </motion.div>
        </main>
    );
}
