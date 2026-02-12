"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronRight, Instagram, Twitter, Facebook } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const navLinks = [
    { name: "Home", href: "/", id: "01", sub: "Main Base" },
    { name: "Shop All", href: "/shop", id: "02", sub: "Full Catalog" },
    { name: "New Arrivals", href: "/new-arrivals", id: "03", sub: "Fresh Drops" },
    { name: "Collections", href: "/collections", id: "04", sub: "Season 2026" },
    { name: "Lookbook", href: "/lookbook", id: "05", sub: "Visuals" },
    { name: "About", href: "/about", id: "06", sub: "The Mission" },
];

const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        onClose();
        setUser(null);
    };

    const handleLinkClick = () => {
        onClose();
    };

    const backdropVariants = {
        closed: { opacity: 0 },
        open: {
            opacity: 1,
            transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
        }
    };

    const menuVariants = {
        closed: {
            x: "-100%",
            transition: {
                type: "tween",
                ease: [0.4, 0, 0.2, 1],
                duration: 0.3
            }
        },
        open: {
            x: "0%",
            transition: {
                type: "tween",
                ease: [0.4, 0, 0.2, 1],
                duration: 0.4,
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        },
        exit: {
            x: "-100%",
            transition: {
                type: "tween",
                ease: [0.4, 0, 0.2, 1],
                duration: 0.3
            }
        }
    };

    const itemVariants = {
        closed: {
            x: -30,
            opacity: 0
        },
        open: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const headerVariants = {
        closed: { opacity: 0, y: -20 },
        open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="closed"
                        animate="open"
                        exit="exit"
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden"
                    />

                    {/* Menu Drawer */}
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="exit"
                        className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#050505] border-r border-white/10 z-[70] md:hidden flex flex-col"
                    >
                        {/* Noise Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/assets/noise.png")' }} />

                        {/* Header */}
                        <motion.div
                            variants={headerVariants}
                            className="p-6 flex items-center justify-between border-b border-white/10 relative z-10 bg-gradient-to-b from-[#080808] to-[#050505] safe-area-inset-top"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative h-8 w-24">
                                    <Image
                                        src="/logo.png"
                                        alt="RIIQX Logo"
                                        fill
                                        className="object-contain object-left"
                                    />
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                                whileTap={{ scale: 0.95 }}
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                        </motion.div>

                        {/* User Bar */}
                        <motion.div
                            variants={itemVariants}
                            className="px-6 py-4 border-b border-white/5 bg-white/[0.02]"
                        >
                            {loading ? (
                                <div className="h-12 w-full bg-white/5 animate-pulse rounded" />
                            ) : user ? (
                                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded">
                                    <div className="w-10 h-10 bg-accent flex items-center justify-center font-bold text-black text-sm uppercase rounded">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-accent uppercase tracking-widest font-bold">Logged In</p>
                                        <p className="text-white text-xs truncate font-mono">{user.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        Guest Access
                                    </div>
                                    <Link
                                        href="/login"
                                        onClick={handleLinkClick}
                                        className="text-xs text-accent hover:text-white transition-colors duration-300 font-bold uppercase tracking-wider"
                                    >
                                        Sign In →
                                    </Link>
                                </div>
                            )}
                        </motion.div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto relative z-10 py-4">
                            <nav className="px-4">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        variants={itemVariants}
                                        custom={index}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={handleLinkClick}
                                            className="group flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-all duration-300 rounded-lg"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-mono text-accent/60 font-bold">
                                                    {link.id}
                                                </span>
                                                <div>
                                                    <span className="block text-sm font-bold text-white uppercase tracking-wider group-hover:text-accent transition-colors duration-300">
                                                        {link.name}
                                                    </span>
                                                    <span className="text-[10px] text-white/30 font-mono">
                                                        {link.sub}
                                                    </span>
                                                </div>
                                            </div>
                                            <motion.span
                                                className="text-white/20 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </motion.span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                        </div>

                        {/* Footer */}
                        <motion.div
                            variants={itemVariants}
                            className="p-6 border-t border-white/10 relative z-10 bg-gradient-to-t from-[#080808] to-[#050505] safe-area-inset-bottom"
                        >
                            {/* Social Links */}
                            <div className="flex items-center justify-center gap-4 mb-6">
                                {socialLinks.map((social) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-white/50 hover:text-accent hover:border-accent/50 hover:bg-accent/10 transition-all duration-300 rounded-full"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </motion.a>
                                ))}
                            </div>

                            {/* Auth Actions */}
                            {user ? (
                                <motion.button
                                    onClick={handleSignOut}
                                    className="w-full py-3 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 text-xs font-bold uppercase tracking-widest rounded"
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Sign Out
                                </motion.button>
                            ) : (
                                <div className="flex gap-3">
                                    <Link
                                        href="/login"
                                        onClick={handleLinkClick}
                                        className="flex-1 py-3 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 text-xs font-bold uppercase tracking-widest text-center rounded"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={handleLinkClick}
                                        className="flex-1 py-3 bg-accent text-black hover:bg-accent/90 transition-all duration-300 text-xs font-bold uppercase tracking-widest text-center rounded"
                                    >
                                        Join
                                    </Link>
                                </div>
                            )}

                            {/* Copyright */}
                            <p className="text-[9px] text-white/20 text-center mt-4 font-mono uppercase tracking-widest">
                                © 2026 RIIQX Labs
                            </p>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
