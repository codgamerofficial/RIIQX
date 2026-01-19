"use client";

import { CinematicHero } from "@/components/ui/CinematicHero";
import { motion } from "framer-motion";
import { Package, Search, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");

    return (
        <main className="bg-black min-h-screen pb-20">
            <CinematicHero
                title="TRACK ORDER"
                subtitle="Status Uplink"
                description="Enter your Order ID to retrieve real-time telemetry on your package shipment."
            />

            <section className="max-w-2xl mx-auto px-4 -mt-20 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-8"
                >
                    <div className="text-center space-y-2">
                        <Package className="w-12 h-12 text-primary mx-auto opacity-80" />
                        <h2 className="text-2xl font-bold text-white">Locate Shipment</h2>
                        <p className="text-gray-400 text-sm">Input your Order ID found in your confirmation signal.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Order ID / Tracking Number</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-hidden transition-all placeholder:text-white/20 font-mono"
                                    placeholder="ORD-2026-XXXX"
                                />
                            </div>
                        </div>

                        <button className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-bewakoof-yellow hover:text-black transition-all group">
                            <span>Track Status</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
