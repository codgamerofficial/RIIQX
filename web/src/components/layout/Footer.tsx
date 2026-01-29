"use client";

import Link from "next/link";
import { Twitter, Instagram, Facebook, ArrowUp, RotateCcw, Truck, ShieldCheck, Loader2 } from "lucide-react";
import { RuPayIcon, VisaIcon, MastercardIcon, AmexIcon } from "@/components/ui/PaymentIcons";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TextReveal } from "@/components/ui/AnimatedText";

export function Footer() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const supabase = createClient();

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('newsletter')
                .insert({ email });

            if (error) {
                if (error.code === '23505') { // Unique violation
                    setMessage({ text: "YOU'RE ALREADY IN THE CULT.", type: 'error' });
                } else {
                    throw error;
                }
            } else {
                setMessage({ text: "WELCOME TO THE CULT.", type: 'success' });
                setEmail("");
            }
        } catch (error) {
            console.error('Newsletter error:', error);
            setMessage({ text: "FAILED TO JOIN. TRY AGAIN.", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

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
                        <Link href="/" className="inline-block mb-10 group">
                            {/* RIIQX Logo SVG */}
                            <svg
                                className="w-24 h-24 md:w-32 md:h-32 fill-white group-hover:fill-accent transition-colors duration-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M18.8236 7.60833L16.2764 4.04169H5.17645L7.72363 7.60833H18.8236ZM18.8236 7.60833L21.3708 11.175H10.2708L7.72363 7.60833M21.3708 11.175L18.8236 14.7417H7.72363L10.2708 11.175M18.8236 14.7417L16.2764 18.3083H5.17645L7.72363 14.7417" stroke="none" />
                            </svg>
                        </Link>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display leading-[0.9] text-white mb-6">
                            Bold Streetwear<br /> <span className="text-accent">For The Fearless.</span>
                        </h2>
                        <div className="text-white/40 text-sm font-mono uppercase tracking-widest bg-white/5 inline-block px-4 py-2 border-l-2 border-accent">
                            <TextReveal delay={0.3}>Built Different. Est 2026.</TextReveal>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="w-full lg:w-96">
                        <h3 className="text-xs font-black font-mono text-accent uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 fill-current text-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.8236 7.60833L16.2764 4.04169H5.17645L7.72363 7.60833H18.8236ZM18.8236 7.60833L21.3708 11.175H10.2708L7.72363 7.60833M21.3708 11.175L18.8236 14.7417H7.72363L10.2708 11.175M18.8236 14.7417L16.2764 18.3083H5.17645L7.72363 14.7417" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg> Join The Cult
                        </h3>
                        <form onSubmit={handleSubscribe} className="relative">
                            <div className="flex bg-white/5 border border-white/10 p-2 clip-path-slant-right focus-within:border-accent transition-colors group">
                                <input
                                    type="email"
                                    placeholder="ENTER YOUR EMAIL"
                                    className="bg-transparent text-white px-4 py-3 w-full focus:outline-none placeholder:text-white/20 text-sm uppercase font-bold tracking-wider font-mono"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-white text-black font-black text-xs uppercase px-6 py-3 hover:bg-accent hover:text-white transition-all clip-path-slant-left hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "JOIN"}
                                </button>
                            </div>
                            {message && (
                                <p className={`absolute -bottom-8 left-0 text-[10px] uppercase font-bold tracking-widest ${message.type === 'error' ? 'text-red-500' : 'text-accent'}`}>
                                    {message.text}
                                </p>
                            )}
                        </form>
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
                            <MagneticButton className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all clip-path-slant">
                                <a href="#"><Instagram className="w-5 h-5" /></a>
                            </MagneticButton>
                            <MagneticButton className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all clip-path-slant">
                                <a href="#"><Twitter className="w-5 h-5" /></a>
                            </MagneticButton>
                            <MagneticButton className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all clip-path-slant">
                                <a href="#"><Facebook className="w-5 h-5" /></a>
                            </MagneticButton>
                            <MagneticButton className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all clip-path-slant">
                                <a href="#">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.8236 7.60833L16.2764 4.04169H5.17645L7.72363 7.60833H18.8236ZM18.8236 7.60833L21.3708 11.175H10.2708L7.72363 7.60833M21.3708 11.175L18.8236 14.7417H7.72363L10.2708 11.175M18.8236 14.7417L16.2764 18.3083H5.17645L7.72363 14.7417" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </MagneticButton>
                        </div>
                    </motion.div>
                </div>

                {/* --- Bottom Section: Copyright & Payment --- */}
                {/* --- Bottom Section: Copyright & Payment --- */}
                <motion.div
                    variants={itemVariants}
                    className="border-t border-white/5 pt-8 mt-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-0"
                >
                    <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-auto">
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold text-center md:text-left">
                            © {new Date().getFullYear()} RIIQX Labs. All Rights Reserved. Not for Everyone.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[9px] text-white/30 uppercase font-mono font-medium tracking-wider">
                            <Link href="/privacy" className="hover:text-white transition-colors hover:underline decoration-accent/50 underline-offset-4">Privacy Protocol</Link>
                            <Link href="/terms" className="hover:text-white transition-colors hover:underline decoration-accent/50 underline-offset-4">Terms of Use</Link>
                            <Link href="/accessibility" className="hover:text-white transition-colors hover:underline decoration-accent/50 underline-offset-4">Accessibility</Link>
                        </div>
                    </div>

                    <div className="flex gap-3 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="h-9 w-14 bg-white/5 border border-white/10 flex items-center justify-center rounded-md hover:border-accent/30 hover:bg-white/10 transition-all group overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <RuPayIcon className="w-8 h-auto text-white group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="h-9 w-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-md hover:border-accent/30 hover:bg-white/10 transition-all group overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <VisaIcon className="w-8 h-auto text-white group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="h-9 w-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-md hover:border-accent/30 hover:bg-white/10 transition-all group overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <MastercardIcon className="w-8 h-auto group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="h-9 w-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-md hover:border-accent/30 hover:bg-white/10 transition-all group overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <AmexIcon className="w-6 h-auto text-white group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                </motion.div>

                {/* Back to Top */}
                <MagneticButton
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-accent text-black flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)] z-50 group clip-path-slant"
                >
                    <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                </MagneticButton>

            </motion.div>
        </footer>
    );
}
