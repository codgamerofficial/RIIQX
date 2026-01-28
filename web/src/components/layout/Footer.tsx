"use client";

import Link from "next/link";
import { Twitter, Instagram, Facebook, ArrowUp, RotateCcw, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function Footer() {
    const [email, setEmail] = useState("");

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    return (
        <footer className="w-full bg-[#050505] text-white pt-32 pb-12 font-sans relative overflow-hidden clip-path-slant-top">

            {/* 1. Muted Background Layer (Brand Recall) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Image Layer */}
                <div className="absolute top-0 right-0 w-[80%] h-full opacity-[0.08] mix-blend-overlay grayscale blur-[30px] contrast-[0.9] animate-brand-breathe origin-center">
                    <Image
                        src="/assets/brand-texture.png"
                        alt="RIIQX Brand Texture"
                        fill
                        className="object-cover object-center"
                        quality={80}
                        priority={false}
                    />
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent" />
                <div className="absolute inset-0 bg-[#050505]/20 backdrop-blur-[2px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-[1400px] mx-auto px-6 relative z-10"
            >
                {/* --- Top Section: Brand & Newsletter --- */}
                <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
                    <motion.div variants={itemVariants} className="max-w-xl">
                        <Link href="/" className="inline-block mb-8 group">
                            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20 uppercase tracking-tighter font-display italic transform skew-x-[-10deg]">
                                RIIQX
                            </h1>
                        </Link>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display leading-[0.9] text-white mb-6">
                            Bold Streetwear<br /> <span className="text-accent">For The Fearless.</span>
                        </h2>
                        <p className="text-white/40 text-sm font-mono uppercase tracking-widest bg-white/5 inline-block px-4 py-2 border-l-2 border-accent">
                            Built Different. Est 2026.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="w-full lg:w-96">
                        <h3 className="text-xs font-black font-mono text-accent uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-accent inline-block" /> Join The Cult
                        </h3>
                        <div className="flex bg-white/5 border border-white/10 p-2 clip-path-slant-right focus-within:border-accent transition-colors group">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                className="bg-transparent text-white px-4 py-3 w-full focus:outline-none placeholder:text-white/20 text-sm uppercase font-bold tracking-wider font-mono"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="bg-white text-black font-black text-xs uppercase px-6 py-3 hover:bg-accent transition-colors clip-path-slant-left hover:scale-105 active:scale-95">
                                Join
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* --- Middle Section: Links --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 mb-24 pt-12 border-t border-white/5">

                    {/* Column 1 */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-[10px] font-black font-mono text-white/30 uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-2">Support</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60">
                            <li><Link href="/contact" className="hover:text-accent hover:pl-2 transition-all">Contact Us</Link></li>
                            <li><Link href="/track-order" className="hover:text-accent hover:pl-2 transition-all">Track Order</Link></li>
                            <li><Link href="/shipping" className="hover:text-accent hover:pl-2 transition-all">Shipping Info</Link></li>
                            <li><Link href="/returns" className="hover:text-accent hover:pl-2 transition-all">Returns & Exchange</Link></li>
                        </ul>
                    </motion.div>

                    {/* Column 2 */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-[10px] font-black font-mono text-white/30 uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-2">Company</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60">
                            <li><Link href="/about" className="hover:text-accent hover:pl-2 transition-all">About RIIQX</Link></li>
                            <li><Link href="/lookbook" className="hover:text-accent hover:pl-2 transition-all">Lookbook</Link></li>
                            <li><Link href="/careers" className="hover:text-accent hover:pl-2 transition-all">Careers</Link></li>
                            <li><Link href="/terms" className="hover:text-accent hover:pl-2 transition-all">Terms of Service</Link></li>
                        </ul>
                    </motion.div>

                    {/* Column 3: Trust */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-[10px] font-black font-mono text-white/30 uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-2">Trust</h3>
                        <div className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/40">
                            <div className="flex items-center gap-3 group">
                                <RotateCcw className="w-4 h-4 text-accent group-hover:rotate-180 transition-transform" /> <span className="group-hover:text-white transition-colors">14-Day Returns</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <Truck className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" /> <span className="group-hover:text-white transition-colors">Worldwide Shipping</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <ShieldCheck className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" /> <span className="group-hover:text-white transition-colors">Secure Checkout</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Column 4: Social */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-[10px] font-black font-mono text-white/30 uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-2">Follow</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all hover:-translate-y-1 clip-path-slant">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all hover:-translate-y-1 clip-path-slant">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all hover:-translate-y-1 clip-path-slant">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* --- Bottom Section: Copyright & Payment --- */}
                <motion.div variants={itemVariants} className="border-t border-white/5 pt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                            © {new Date().getFullYear()} RIIQX Labs. All Rights Reserved. Not for Everyone.
                        </p>
                        <div className="flex gap-4 text-[8px] text-white/20 uppercase font-mono">
                            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                            <a href="#" className="hover:text-white transition-colors">Accesibility</a>
                        </div>
                    </div>

                    <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Styled Payment Icons */}
                        <div className="h-8 px-3 bg-white/5 border border-white/10 flex items-center justify-center clip-path-slant group hover:border-accent/50 transition-colors">
                            <CreditCard className="w-5 h-5 text-white group-hover:text-accent transition-colors" />
                        </div>
                        <div className="h-8 px-3 bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] text-white clip-path-slant group hover:border-accent/50 transition-colors">VISA</div>
                        <div className="h-8 px-3 bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] text-white clip-path-slant group hover:border-accent/50 transition-colors">AMEX</div>
                        <div className="h-8 px-3 bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] text-white clip-path-slant group hover:border-accent/50 transition-colors">MC</div>
                    </div>
                </motion.div>

                {/* Back to Top */}
                <motion.button
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-accent text-black flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)] z-50 group clip-path-slant"
                >
                    <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                </motion.button>

            </motion.div>
        </footer>
    );
}
