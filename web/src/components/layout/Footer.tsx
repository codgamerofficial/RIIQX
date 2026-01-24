"use client";

import Link from "next/link";
import { Twitter, Instagram, Facebook, ArrowUp, Mail, Package, RotateCcw, Truck, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ThankYouSection } from "@/components/shared/ThankYouSection";

export function Footer() {
    const [email, setEmail] = useState("");

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="w-full bg-[#050505] text-white pt-20 pb-8 border-t border-white/5 font-sans relative z-10">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* --- Top Section: Brand & Newsletter --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-12">
                    <div className="max-w-sm">
                        <Link href="/" className="inline-block mb-6 group">
                            <span className="text-4xl font-black text-white tracking-tighter uppercase font-display group-hover:text-accent transition-colors">RIIQX</span>
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed">
                            Engineered for the future. Premium streetwear designed for those who dare to lead.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto min-w-[300px]">
                        <h3 className="text-xs font-bold font-mono text-white/50 uppercase tracking-[0.2em] mb-4">Join the Movement</h3>
                        <div className="flex border-b border-white/20 focus-within:border-white transition-colors">
                            <input
                                type="email"
                                placeholder="ENTER EMAIL"
                                className="bg-transparent text-white py-3 w-full focus:outline-none placeholder:text-white/20 text-sm uppercase font-bold tracking-wider"
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 border-t border-white/5 pt-12">

                    {/* Column 1 */}
                    <div>
                        <h3 className="text-xs font-bold font-mono text-white/50 uppercase tracking-[0.2em] mb-6">Support</h3>
                        <ul className="space-y-3 text-sm text-white/70 font-medium">
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchange</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="text-xs font-bold font-mono text-white/50 uppercase tracking-[0.2em] mb-6">Company</h3>
                        <ul className="space-y-3 text-sm text-white/70 font-medium">
                            <li><Link href="/about" className="hover:text-white transition-colors">About RIIQX</Link></li>
                            <li><Link href="/lookbook" className="hover:text-white transition-colors">Lookbook</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Trust */}
                    <div>
                        <h3 className="text-xs font-bold font-mono text-white/50 uppercase tracking-[0.2em] mb-6">Trust</h3>
                        <div className="space-y-4 text-sm text-white/60">
                            <div className="flex items-center gap-3">
                                <RotateCcw className="w-4 h-4 text-accent" /> <span>14-Day Returns</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Truck className="w-4 h-4 text-accent" /> <span>Worldwide Shipping</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-4 h-4 text-accent" /> <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Social */}
                    <div>
                        <h3 className="text-xs font-bold font-mono text-white/50 uppercase tracking-[0.2em] mb-6">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all group">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all group">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all group">
                                <Facebook className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* --- Bottom Section: Copyright & Payment --- */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-white/30 uppercase tracking-widest">
                        © {new Date().getFullYear()} RIIQX. All Rights Reserved.
                    </p>

                    <div className="flex gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple Payment Icons */}
                        <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center"><CreditCard className="w-4 h-4" /></div>
                        <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center font-bold text-[8px]">VISA</div>
                        <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center font-bold text-[8px]">AMEX</div>
                    </div>
                </div>

                {/* Back to Top */}
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-24 md:bottom-8 right-8 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all z-50 group"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>

            </div>
        </footer>
    );
}
