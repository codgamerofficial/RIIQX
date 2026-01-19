"use client";

import { CinematicHero } from "@/components/ui/CinematicHero";
import { motion } from "framer-motion";
import { RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ReturnOrderPage() {
    return (
        <main className="bg-black min-h-screen pb-20">
            <CinematicHero
                title="RETURN ORDER"
                subtitle="Reverse Logistics"
                description="Hassle-free returns within 15 days. Initiate a return protocol for your gear."
            />

            <section className="max-w-4xl mx-auto px-4 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Action Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
                    >
                        <RotateCcw className="w-10 h-10 text-bewakoof-yellow mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-4">Start a Return</h2>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Order ID</label>
                                <input type="text" placeholder="ORD-XXXX" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-bewakoof-yellow outline-hidden" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Email / Phone</label>
                                <input type="text" placeholder="Registered Contact" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-bewakoof-yellow outline-hidden" />
                            </div>
                            <button className="w-full bg-bewakoof-yellow text-black font-bold py-3 rounded-xl hover:brightness-110 transition-all">
                                Proceed
                            </button>
                        </form>
                    </motion.div>

                    {/* Policy Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <div className="flex gap-4">
                                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                <div>
                                    <h3 className="text-white font-bold mb-1">15-Day Policy</h3>
                                    <p className="text-gray-400 text-sm">Return unwashed, unworn items with tags within 15 days of delivery.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <div className="flex gap-4">
                                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                <div>
                                    <h3 className="text-white font-bold mb-1">Instant Refund</h3>
                                    <p className="text-gray-400 text-sm">Refunds are initiated instantly to your source account after quality check.</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-2xl">
                            <div className="flex gap-4">
                                <AlertCircle className="w-6 h-6 text-purple-400 shrink-0" />
                                <div>
                                    <h3 className="text-white font-bold mb-1">Non-Returnable</h3>
                                    <p className="text-gray-400 text-sm">Boxers, innerwear, and free gifts are not eligible for returns.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
