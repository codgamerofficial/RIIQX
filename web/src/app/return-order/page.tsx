"use client";

import { motion } from "framer-motion";
import { RotateCcw, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ReturnOrderPage() {
    const [formData, setFormData] = useState({ orderId: '', email: '' });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <main className="bg-black min-h-screen flex items-center justify-center p-4 pt-32 pb-20">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* Left Column: Form Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                    className="w-full bg-[#121212] border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden relative"
                >
                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-[60px] rounded-full pointer-events-none opacity-50" />

                    <div className="relative z-10 flex flex-col items-start space-y-8">
                        {/* Header Group */}
                        <div className="space-y-6 w-full">
                            {/* Rotating Icon */}
                            <div className="w-12 h-12 rounded-full border-2 border-white text-white flex items-center justify-center">
                                <RotateCcw className="w-6 h-6" strokeWidth={2.5} />
                            </div>

                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                Start a Return
                            </h1>
                        </div>

                        {/* Form Group */}
                        <div className="w-full space-y-6">
                            {/* Order ID */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Order ID</label>
                                <input
                                    type="text"
                                    value={formData.orderId}
                                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value.toUpperCase() })}
                                    className="w-full bg-[#1c1c1e] border border-white/5 rounded-2xl px-5 py-4 text-white text-base font-medium focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20 font-mono uppercase"
                                    placeholder="ORD-XXXX"
                                />
                            </div>

                            {/* Email / Phone */}
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Email / Phone</label>
                                <input
                                    type="text"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#1c1c1e] border border-white/5 rounded-2xl px-5 py-4 text-white text-base font-medium focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                                    placeholder="Registered Contact"
                                />
                            </div>

                            {/* Spacer */}
                            <div className="h-4" />

                            {/* Action Button */}
                            <button className="w-full bg-[#1c1c1e] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all duration-300">
                                <span>Proceed</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Policy Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {/* Header Text */}
                    <motion.div variants={itemVariants} className="mb-6 px-2">
                        <p className="text-xl font-medium text-white leading-relaxed">
                            Initiate a return protocol for your gear.
                        </p>
                    </motion.div>

                    {/* Card 1: 15-Day Policy */}
                    <motion.div variants={itemVariants} className="bg-[#121212] border border-white/10 rounded-[24px] p-6 hover:bg-[#1a1a1a] transition-colors group">
                        <div className="flex gap-5">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base mb-2 group-hover:text-green-400 transition-colors">15-Day Policy</h3>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    Return unwashed, unworn items with tags within 15 days of delivery.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Instant Refund */}
                    <motion.div variants={itemVariants} className="bg-[#121212] border border-white/10 rounded-[24px] p-6 hover:bg-[#1a1a1a] transition-colors group">
                        <div className="flex gap-5">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base mb-2 group-hover:text-green-400 transition-colors">Instant Refund</h3>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    Refunds are initiated instantly to your source account after quality check.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Non-Returnable */}
                    <motion.div variants={itemVariants} className="bg-[#0f0a15] border border-purple-500/20 rounded-[24px] p-6 hover:bg-[#150d1e] transition-colors group">
                        <div className="flex gap-5">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base mb-2 group-hover:text-purple-400 transition-colors">Non-Returnable</h3>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    Boxers, innerwear, and free gifts are not eligible for returns.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </main>
    );
}
