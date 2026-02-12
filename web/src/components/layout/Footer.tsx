"use client";

import Link from "next/link";
import { Twitter, Instagram, Facebook, ArrowUp, RotateCcw, Truck, ShieldCheck, Loader2 } from "lucide-react";
import { RuPayIcon, VisaIcon, MastercardIcon, AmexIcon } from "@/components/ui/PaymentIcons";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Footer() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const supabase = createClient();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

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
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24,
                duration: 0.6
            }
        }
    };

    const linkColumnVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const linkItemVariants = {
        hidden: { x: -10, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const trustItems = [
        { icon: RotateCcw, text: "14-Day Returns", hoverAnim: "rotate" },
        { icon: Truck, text: "Worldwide Shipping", hoverAnim: "translate" },
        { icon: ShieldCheck, text: "Secure Checkout", hoverAnim: "scale" },
    ];

    const footerLinks = {
        support: [
            { name: "Contact Us", href: "/contact" },
            { name: "Track Order", href: "/track-order" },
            { name: "Shipping Info", href: "/shipping" },
            { name: "Returns & Exchange", href: "/returns" },
        ],
        company: [
            { name: "About RIIQX", href: "/about" },
            { name: "Lookbook", href: "/lookbook" },
            { name: "Careers", href: "/careers" },
            { name: "Terms of Service", href: "/terms" },
        ],
    };

    const socialLinks = [
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Facebook, href: "#", label: "Facebook" },
    ];

    return (
        <footer
            ref={ref}
            className="w-full bg-[#050505] text-white pt-24 md:pt-32 pb-8 font-sans relative overflow-hidden clip-path-slant-top safe-area-inset-bottom"
        >
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[80%] h-full opacity-[0.06] mix-blend-overlay grayscale blur-[40px] contrast-[0.9] animate-brand-breathe origin-center">
                    <Image
                        src="/assets/brand-texture.png"
                        alt="RIIQX Brand Texture"
                        fill
                        className="object-cover object-center"
                        quality={80}
                        priority={false}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent" />
                <div className="absolute inset-0 bg-[#050505]/20 backdrop-blur-[2px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
            >
                {/* Top Section: Brand & Newsletter */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-24 gap-8 lg:gap-12">
                    <motion.div variants={itemVariants} className="max-w-xl">
                        <Link href="/" className="inline-block mb-6 md:mb-10 group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <svg
                                    className="w-16 h-16 md:w-24 md:h-24 fill-white group-hover:fill-accent transition-colors duration-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M18.8236 7.60833L16.2764 4.04169H5.17645L7.72363 7.60833H18.8236ZM18.8236 7.60833L21.3708 11.175H10.2708L7.72363 7.60833M21.3708 11.175L18.8236 14.7417H7.72363L10.2708 11.175M18.8236 14.7417L16.2764 18.3083H5.17645L7.72363 14.7417" stroke="none" />
                                </svg>
                            </motion.div>
                        </Link>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter font-display leading-[0.9] text-white mb-4 md:mb-6">
                            Bold Streetwear<br /> <span className="text-accent">For The Fearless.</span>
                        </h2>
                        <motion.div
                            className="text-white/40 text-xs md:text-sm font-mono uppercase tracking-widest bg-white/5 inline-block px-3 md:px-4 py-2 border-l-2 border-accent"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            Built Different. Est 2026.
                        </motion.div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="w-full lg:w-96">
                        <h3 className="text-[10px] md:text-xs font-black font-mono text-accent uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2">
                            <svg className="w-4 h-4 md:w-5 md:h-5 fill-current text-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.8236 7.60833L16.2764 4.04169H5.17645L7.72363 7.60833H18.8236ZM18.8236 7.60833L21.3708 11.175H10.2708L7.72363 7.60833M21.3708 11.175L18.8236 14.7417H7.72363L10.2708 11.175M18.8236 14.7417L16.2764 18.3083H5.17645L7.72363 14.7417" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                            Join The Cult
                        </h3>
                        <form onSubmit={handleSubscribe} className="relative">
                            <motion.div
                                className="flex bg-white/5 border border-white/10 p-1.5 md:p-2 focus-within:border-accent/50 transition-all duration-300 rounded-sm"
                                whileFocus={{ scale: 1.01 }}
                            >
                                <input
                                    type="email"
                                    placeholder="ENTER YOUR EMAIL"
                                    className="bg-transparent text-white px-3 md:px-4 py-2.5 md:py-3 w-full focus:outline-none placeholder:text-white/20 text-xs md:text-sm uppercase font-bold tracking-wider font-mono"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-white text-black font-black text-[10px] md:text-xs uppercase px-4 md:px-6 py-2.5 md:py-3 hover:bg-accent hover:text-white transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px] md:min-w-[100px]"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "JOIN"}
                                </motion.button>
                            </motion.div>
                            {message && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`absolute -bottom-6 md:-bottom-8 left-0 text-[9px] md:text-[10px] uppercase font-bold tracking-widest ${message.type === 'error' ? 'text-red-500' : 'text-accent'}`}
                                >
                                    {message.text}
                                </motion.p>
                            )}
                        </form>
                    </motion.div>
                </div>

                {/* Middle Section: Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-x-8 gap-y-10 md:gap-y-16 mb-16 md:mb-24 pt-8 md:pt-12 border-t border-white/5">
                    {/* Support Column */}
                    <motion.div variants={linkColumnVariants}>
                        <h3 className="text-[10px] font-black font-mono text-white/30 uppercase tracking-[0.2em] mb-4 md:mb-8 border-b border-white/10 pb-2">
                            Support
                        </h3>
                        <ul className="space-y-2 md:space-y-4">
                            {footerLinks.support.map((link) => (
                                <motion.li key={link.href} variants={linkItemVariants}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/60 hover:text-accent transition-all duration-300"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                                            {link.name}
                                        </span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company Column */}
                    <motion.div variants={linkColumnVariants}>
                        <h3 className="text-[10px] font-black font-mono text-white/30 uppercase tracking-[0.2em] mb-4 md:mb-8 border-b border-white/10 pb-2">
                            Company
                        </h3>
                        <ul className="space-y-2 md:space-y-4">
                            {footerLinks.company.map((link) => (
                                <motion.li key={link.href} variants={linkItemVariants}>
                                    <Link
                                        href={link.href}
                                        className="group flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/60 hover:text-accent transition-all duration-300"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                                            {link.name}
                                        </span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Trust Column */}
                    <motion.div variants={linkColumnVariants}>
                        <h3 className="text-[10px] font-black font-mono text-white/30 uppercase tracking-[0.2em] mb-4 md:mb-8 border-b border-white/10 pb-2">
                            Trust
                        </h3>
                        <div className="space-y-3 md:space-y-4">
                            {trustItems.map((item) => (
                                <motion.div
                                    key={item.text}
                                    variants={linkItemVariants}
                                    className="flex items-center gap-2 md:gap-3 group cursor-default"
                                >
                                    <motion.div
                                        whileHover={{
                                            rotate: item.hoverAnim === 'rotate' ? 180 : 0,
                                            x: item.hoverAnim === 'translate' ? 4 : 0,
                                            scale: item.hoverAnim === 'scale' ? 1.1 : 1
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                                    </motion.div>
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors duration-300">
                                        {item.text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Social Column */}
                    <motion.div variants={linkColumnVariants}>
                        <h3 className="text-[10px] font-black font-mono text-white/30 uppercase tracking-[0.2em] mb-4 md:mb-8 border-b border-white/10 pb-2">
                            Follow
                        </h3>
                        <div className="flex gap-2 md:gap-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-black hover:bg-accent hover:border-accent transition-all duration-300 rounded-sm"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <motion.div
                    variants={itemVariants}
                    className="border-t border-white/5 pt-6 md:pt-8 flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-0"
                >
                    <div className="flex flex-col items-center md:items-start gap-2 md:gap-3 w-full md:w-auto">
                        <p className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold text-center md:text-left">
                            © {new Date().getFullYear()} RIIQX Labs. All Rights Reserved.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-[8px] md:text-[9px] text-white/30 uppercase font-mono font-medium tracking-wider">
                            <Link href="/privacy" className="hover:text-white transition-colors duration-300 hover:underline decoration-accent/50 underline-offset-4">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors duration-300 hover:underline decoration-accent/50 underline-offset-4">
                                Terms
                            </Link>
                            <Link href="/accessibility" className="hover:text-white transition-colors duration-300 hover:underline decoration-accent/50 underline-offset-4">
                                Accessibility
                            </Link>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="flex gap-2 md:gap-3 opacity-70 hover:opacity-100 transition-opacity duration-300">
                        {[RuPayIcon, VisaIcon, MastercardIcon, AmexIcon].map((Icon, idx) => (
                            <motion.div
                                key={idx}
                                className="h-7 md:h-9 w-10 md:w-14 bg-white/5 border border-white/10 flex items-center justify-center rounded hover:border-accent/30 hover:bg-white/10 transition-all duration-300 group overflow-hidden relative"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <Icon className="w-6 md:w-8 h-auto text-white group-hover:scale-110 transition-transform duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll to Top Button */}
            <motion.button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-10 h-10 md:w-12 md:h-12 bg-accent text-black flex items-center justify-center rounded-full shadow-lg shadow-accent/20 z-40 hover:bg-white transition-colors duration-300"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
        </footer>
    );
}
