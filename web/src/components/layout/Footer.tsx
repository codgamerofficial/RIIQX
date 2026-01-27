"use client";

import Link from "next/link";
import { Twitter, Instagram, Facebook, ArrowUp, Mail, Package, RotateCcw, Truck, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

export function Footer() {
    const [email, setEmail] = useState("");

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="w-full bg-[#050505] text-white pt-32 pb-12 font-sans relative overflow-hidden">

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
                {/* Gradient Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent" />
                <div className="absolute inset-0 bg-[#050505]/20 backdrop-blur-[2px]" />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                {/* --- Top Section: Brand & Newsletter --- */}
                <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
                    <div className="max-w-md">
                        <Link href="/" className="inline-block mb-8 group">
                            <div className="relative w-48 h-14">
                                <Image
                                    src="/riiqx-logo-new.png"
                                    alt="RIIQX"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter font-display leading-[0.9] text-white mb-6">
                            Bold Streetwear<br /> For The Fearless.
                        </h2>
                        <p className="text-white/40 text-sm font-mono uppercase tracking-widest">
                            RIIQX — Built Different.
                        </p>
                    </div>

                    <div className="w-full lg:w-96">
                        <h3 className="text-xs font-bold font-mono text-white/50 uppercase tracking-[0.2em] mb-6">Join The Cult</h3>
                        <div className="flex border-b border-white/20 focus-within:border-white transition-colors">
                            <input
                                type="email"
                                placeholder="ENTER EMAIL"
                                className="bg-transparent text-white py-4 w-full focus:outline-none placeholder:text-white/20 text-sm uppercase font-bold tracking-wider"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="text-white/50 hover:text-accent font-bold text-xs uppercase shrink-0 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Middle Section: Links --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 mb-24 pt-12 border-t border-white/5">

                    {/* Column 1 */}
                    <div>
                        <h3 className="text-[10px] font-bold font-mono text-accent uppercase tracking-[0.2em] mb-8">Support</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60">
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchange</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="text-[10px] font-bold font-mono text-accent uppercase tracking-[0.2em] mb-8">Company</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/60">
                            <li><Link href="/about" className="hover:text-white transition-colors">About RIIQX</Link></li>
                            <li><Link href="/lookbook" className="hover:text-white transition-colors">Lookbook</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Trust */}
                    <div>
                        <h3 className="text-[10px] font-bold font-mono text-accent uppercase tracking-[0.2em] mb-8">Trust</h3>
                        <div className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/40">
                            <div className="flex items-center gap-3">
                                <RotateCcw className="w-4 h-4 text-white" /> <span>14-Day Returns</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Truck className="w-4 h-4 text-white" /> <span>Worldwide Shipping</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-4 h-4 text-white" /> <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Social */}
                    <div>
                        <h3 className="text-[10px] font-bold font-mono text-accent uppercase tracking-[0.2em] mb-8">Follow</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all hover:scale-110">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all hover:scale-110">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all hover:scale-110">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* --- Bottom Section: Copyright & Payment --- */}
                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                        © {new Date().getFullYear()} RIIQX. All Rights Reserved. Not for Everyone.
                    </p>

                    <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple Payment Icons */}
                        <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center"><CreditCard className="w-5 h-5 text-white" /></div>
                        <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center font-bold text-[8px] text-white">VISA</div>
                        <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center font-bold text-[8px] text-white">AMEX</div>
                    </div>
                </div>

                {/* Back to Top */}
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-accent text-black flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-110 active:scale-95 transition-all z-50 group clip-path-slant"
                >
                    <ArrowUp className="w-6 h-6" />
                </button>

            </div>
        </footer>
    );
}
