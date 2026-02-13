"use client";

import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone, Ticket, Shield } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#B4F000] selection:text-black pt-32 pb-20 px-6">

            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            {/* Header / Scoreboard */}
            <div className="max-w-7xl mx-auto mb-16 relative z-10 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-3 bg-[#B4F000]/10 border border-[#B4F000]/20 px-6 py-2 rounded-sm mb-6"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#B4F000] animate-pulse" />
                            <span className="text-xs font-mono uppercase tracking-widest text-[#B4F000]">Signals Open • Live Support</span>
                        </motion.div>

                        <h1 className="text-6xl md:text-9xl font-black font-oswald text-white uppercase tracking-tighter leading-none mix-blend-difference">
                            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B4F000] to-white/20">HQ</span>
                        </h1>
                    </div>
                </div>
            </div>

            <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
                {/* Left: Stadium Control Room (Info) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* HQ Card */}
                    <div className="bg-[#121212] border border-white/10 p-10 rounded-[2px] hover:border-[#B4F000]/50 transition-colors group relative overflow-hidden">
                        {/* Scanline Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none" />

                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MapPin className="w-32 h-32 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-white uppercase mb-8 flex items-center gap-4 font-oswald">
                            <Shield className="w-8 h-8 text-[#B4F000]" /> Headquarters
                        </h3>
                        <div className="space-y-8 text-gray-400 font-mono text-sm leading-relaxed relative z-10">
                            <div className="border-l-2 border-[#B4F000] pl-6 py-2">
                                <span className="block text-[#B4F000] text-xs uppercase tracking-widest mb-2 font-bold opacity-70">Location Coordinates</span>
                                <span className="text-white block">Monoharchak Road, Near Sani Temple</span>
                                <span className="text-white block">Contai, East Medinipur</span>
                                <span className="text-white block">West Bengal, 721401, INDIA</span>
                            </div>
                            <div className="border-l-2 border-[#B4F000] pl-6 py-2">
                                <span className="block text-[#B4F000] text-xs uppercase tracking-widest mb-2 font-bold opacity-70">Secure Comms</span>
                                <span className="text-white block hover:text-[#B4F000] transition-colors cursor-pointer">thelegacyroars@gmail.com</span>
                                <span className="text-white block hover:text-[#B4F000] transition-colors cursor-pointer">+91 8145172429</span>
                            </div>
                        </div>
                    </div>

                    {/* Hours Card */}
                    <div className="bg-[#0f0a15] border border-white/5 p-10 rounded-[2px] text-center lg:text-left flex items-center justify-between group hover:border-[#B4F000]/30 transition-colors">
                        <div>
                            <h3 className="text-xl font-bold text-white uppercase mb-2 flex items-center gap-3 font-oswald">
                                <Ticket className="w-5 h-5 text-[#B4F000]" /> Match Hours
                            </h3>
                            <p className="text-white/40 text-xs uppercase tracking-widest font-mono">Mon - Fri: 09:00 - 18:00 (IST)</p>
                        </div>
                        <div className="text-right">
                            <div className="inline-block bg-red-500/10 px-3 py-1 rounded-[2px] border border-red-500/20">
                                <p className="text-red-400 font-mono text-[10px] uppercase font-bold tracking-widest">
                                    Weekend: Closed
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Transmission Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#121212] border border-white/10 p-8 md:p-10 rounded-[2px] shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#B4F000] blur-[100px] opacity-10" />

                    <h3 className="text-3xl font-bold text-white uppercase mb-8 font-oswald">Send Transmission</h3>

                    <form className="space-y-6 relative z-10">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#B4F000]/60 font-bold ml-1 font-mono">First Name</label>
                                <input type="text" placeholder="ROHIT" className="w-full bg-[#050505] border border-white/10 rounded-[2px] px-6 py-4 text-white focus:border-[#B4F000] outline-hidden transition-all placeholder:text-white/10 font-mono text-sm uppercase" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-[#B4F000]/60 font-bold ml-1 font-mono">Last Name</label>
                                <input type="text" placeholder="SHARMA" className="w-full bg-[#050505] border border-white/10 rounded-[2px] px-6 py-4 text-white focus:border-[#B4F000] outline-hidden transition-all placeholder:text-white/10 font-mono text-sm uppercase" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#B4F000]/60 font-bold ml-1 font-mono">Email Coordinates</label>
                            <input type="email" placeholder="captain@india.com" className="w-full bg-[#050505] border border-white/10 rounded-[2px] px-6 py-4 text-white focus:border-[#B4F000] outline-hidden transition-all placeholder:text-white/10 font-mono text-sm" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[#B4F000]/60 font-bold ml-1 font-mono">Message</label>
                            <textarea
                                className="w-full bg-[#050505] border border-white/10 rounded-[2px] px-6 py-4 text-white focus:border-[#B4F000] outline-hidden transition-all h-32 resize-none placeholder:text-white/10 font-mono text-sm"
                                placeholder="Transmission content..."
                            />
                        </div>

                        <button className="w-full bg-[#B4F000] text-black font-black uppercase text-sm py-4 rounded-[2px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group tracking-widest">
                            <span>Send Signal</span>
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </motion.div>
            </section>
        </main>
    );
}
