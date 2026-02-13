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
        <main className="bg-[#050505] min-h-screen flex items-center justify-center p-4 pt-32 pb-20 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start relative z-10">

                {/* Left Column: Form Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                    className="w-full bg-[#0A0A0A] border border-white/10 p-8 shadow-2xl overflow-hidden relative group"
                >
                    {/* Corner Markers */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#B4F000]" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#B4F000]" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#B4F000]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#B4F000]" />

                    <div className="relative z-10 flex flex-col items-start space-y-8">
                        {/* Header Group */}
                        <div className="space-y-4 w-full border-b border-white/10 pb-6">
                            {/* Icon */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#B4F000] flex items-center justify-center">
                                    <RotateCcw className="w-4 h-4 text-black" strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-[#B4F000] font-bold font-mono">
                                    Protocol: Refund_Init
                                </span>
                            </div>

                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase font-oswald">
                                Start a Return
                            </h1>
                        </div>

                        {/* Form Group */}
                        <div className="w-full space-y-6">
                            {/* Order ID */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-[#B4F000]/70 font-bold ml-1 font-mono">Order ID</label>
                                <input
                                    type="text"
                                    value={formData.orderId}
                                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value.toUpperCase() })}
                                    className="w-full bg-[#050505] border border-white/10 px-5 py-4 text-white text-sm font-mono focus:outline-none focus:border-[#B4F000] transition-all placeholder:text-white/20 uppercase"
                                    placeholder="ORD-XXXX"
                                />
                            </div>

                            {/* Email / Phone */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-[#B4F000]/70 font-bold ml-1 font-mono">Email / Signal</label>
                                <input
                                    type="text"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#050505] border border-white/10 px-5 py-4 text-white text-sm font-mono focus:outline-none focus:border-[#B4F000] transition-all placeholder:text-white/20"
                                    placeholder="Registered Contact"
                                />
                            </div>

                            {/* Spacer */}
                            <div className="h-2" />

                            {/* Action Button */}
                            <button className="w-full bg-white text-black font-black uppercase tracking-widest py-4 text-xs hover:bg-[#B4F000] transition-colors duration-300 flex items-center justify-center gap-2 clip-path-slant-right">
                                <span>Proceed to Verification</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Policy Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4 pt-4"
                >
                    {/* Header Text */}
                    <motion.div variants={itemVariants} className="mb-6 px-2 border-l-2 border-[#B4F000] pl-4">
                        <p className="text-xl font-bold uppercase font-oswald text-white leading-none">
                            Initiate return protocol <br /> for your gear.
                        </p>
                    </motion.div>

                    {/* Card 1: 15-Day Policy */}
                    <motion.div variants={itemVariants} className="bg-[#0A0A0A] border border-white/10 p-6 hover:border-[#B4F000]/50 transition-colors group relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 pointer-events-none" />
                        <div className="flex gap-4 items-start relative z-10">
                            <CheckCircle2 className="w-5 h-5 text-[#B4F000] mt-1" strokeWidth={2.5} />
                            <div>
                                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1 font-oswald">15-Day Policy</h3>
                                <p className="text-white/40 text-xs font-mono leading-relaxed">
                                    Return unwashed, unworn items with tags within 15 days of delivery.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Instant Refund */}
                    <motion.div variants={itemVariants} className="bg-[#0A0A0A] border border-white/10 p-6 hover:border-[#B4F000]/50 transition-colors group relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 pointer-events-none" />
                        <div className="flex gap-4 items-start relative z-10">
                            <CheckCircle2 className="w-5 h-5 text-[#B4F000] mt-1" strokeWidth={2.5} />
                            <div>
                                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1 font-oswald">Instant Refund</h3>
                                <p className="text-white/40 text-xs font-mono leading-relaxed">
                                    Refunds are initiated instantly to your source account after quality check.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Non-Returnable */}
                    <motion.div variants={itemVariants} className="bg-[#0A0A0A] border border-red-500/20 p-6 hover:bg-red-950/20 transition-colors group relative overflow-hidden">
                        <div className="flex gap-4 items-start relative z-10">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-1" strokeWidth={2.5} />
                            <div>
                                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1 font-oswald group-hover:text-red-400 transition-colors">Non-Returnable</h3>
                                <p className="text-white/40 text-xs font-mono leading-relaxed group-hover:text-red-200/50">
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
