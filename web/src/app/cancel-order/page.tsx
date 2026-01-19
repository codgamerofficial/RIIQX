"use client";

import { CinematicHero } from "@/components/ui/CinematicHero";
import { motion } from "framer-motion";
import { XCircle, HelpCircle } from "lucide-react";

export default function CancelOrderPage() {
    return (
        <main className="bg-black min-h-screen pb-20">
            <CinematicHero
                title="CANCEL ORDER"
                subtitle="Abort Sequence"
                description="Need to change your mind? You can cancel your order before it ships."
            />

            <section className="max-w-xl mx-auto px-4 -mt-20 relative z-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
                >
                    <div className="text-center mb-8">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white">Cancellation Request</h2>
                        <p className="text-gray-400 text-sm mt-2">Enter details to cancel an active order.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Order ID</label>
                            <input type="text" placeholder="ORD-XXXX" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-hidden transition-colors" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/50 font-bold ml-1">Reason for Cancellation</label>
                            <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-hidden">
                                <option>Changed my mind</option>
                                <option>Ordered by mistake</option>
                                <option>Found a better price</option>
                                <option>Optimized shipping time needed</option>
                            </select>
                        </div>

                        <button className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors">
                            Request Cancellation
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/10 flex gap-4 items-start">
                        <HelpCircle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Orders can only be cancelled before they are marked as 'Shipped'. Once shipped, please use the Return Order process instead. Refunds for prepaid orders will be processed within 5-7 business days.
                        </p>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
