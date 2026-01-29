"use client";

import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone, Ticket, Shield } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="bg-black min-h-screen pt-32 pb-20 px-4 md:px-8">
            {/* Header / Scoreboard */}
            <div className="max-w-6xl mx-auto mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-3 bg-[#121212] border border-white/10 px-6 py-2 rounded-full mb-6"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-widest text-white/60">Signals Open • Live Support</span>
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-black font-display text-white uppercase tracking-tighter leading-none mb-6">
                    Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">HQ</span>
                </h1>
                <p className="text-white/40 max-w-2xl mx-auto text-lg font-mono uppercase tracking-wide">
                    Connect with the RIIQX dugout. We are ready for your transmission.
                </p>
            </div>

            <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left: Stadium Control Room (Info) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* HQ Card */}
                    <div className="bg-[#121212] border border-white/10 p-10 rounded-[32px] hover:border-accent/30 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MapPin className="w-24 h-24 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white uppercase mb-8 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-accent" /> Headquarters
                        </h3>
                        <div className="space-y-6 text-gray-400 font-mono text-sm leading-relaxed">
                            <p className="border-l-2 border-white/10 pl-4 py-1">
                                <span className="block text-white/20 text-xs uppercase tracking-widest mb-1">Location</span>
                                Monoharchak Road, Near Sani Temple<br />
                                Contai, East Medinipur<br />
                                West Bengal, 721401, INDIA
                            </p>
                            <p className="border-l-2 border-white/10 pl-4 py-1">
                                <span className="block text-white/20 text-xs uppercase tracking-widest mb-1">Comms</span>
                                thelegacyroars@gmail.com<br />
                                +91 8145172429
                            </p>
                        </div>
                    </div>

                    {/* Hours Card */}
                    <div className="bg-[#0f0a15] border border-purple-500/20 p-10 rounded-[32px] text-center lg:text-left">
                        <h3 className="text-xl font-bold text-white uppercase mb-4 flex items-center justify-center lg:justify-start gap-3">
                            <Ticket className="w-5 h-5 text-purple-400" /> Match Hours
                        </h3>
                        <div className="inline-block bg-purple-900/20 px-4 py-2 rounded-lg border border-purple-500/20">
                            <p className="text-purple-200 font-mono text-sm">
                                Mon - Fri: 09:00 - 18:00 (IST)
                            </p>
                        </div>
                        <p className="text-white/20 text-xs uppercase tracking-widest mt-4">Weekend: Closed for Training</p>
                    </div>
                </motion.div>

                {/* Right: Transmission Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#121212] border border-white/10 p-8 md:p-10 rounded-[32px] shadow-2xl relative"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-accent/50 blur-[20px]" />

                    <h3 className="text-2xl font-bold text-white uppercase mb-8">Send Transmission</h3>

                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">First Name</label>
                                <input type="text" placeholder="ROHIT" className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-accent outline-hidden transition-all placeholder:text-white/20 font-mono" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Last Name</label>
                                <input type="text" placeholder="SHARMA" className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-accent outline-hidden transition-all placeholder:text-white/20 font-mono" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Email Coordinates</label>
                            <input type="email" placeholder="captain@india.com" className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-accent outline-hidden transition-all placeholder:text-white/20 font-mono" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Message</label>
                            <textarea
                                className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-accent outline-hidden transition-all h-32 resize-none placeholder:text-white/20 font-mono"
                                placeholder="Transmission content..."
                            />
                        </div>

                        <button className="w-full bg-white text-black font-black uppercase text-sm py-4 rounded-2xl hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2 group shadow-lg shadow-white/5">
                            <span>Send Signal</span>
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </motion.div>
            </section>
        </main>
    );
}
