"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronRight, Twitter, Instagram, Facebook, LogIn, UserPlus, Fingerprint, LogOut, Terminal, ArrowRight } from "lucide-react";
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
    { name: "About Base", href: "/about", id: "06", sub: "The Mission" },
];

const sidebarVariants = {
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
            duration: 0.3,
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
};

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

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        onClose();
        setUser(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Darker Grid Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
                    />

                    {/* Menu Drawer - Sports/Streetwear Industrial Design */}
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={sidebarVariants}
                        className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#080808] border-r border-white/10 z-[70] md:hidden flex flex-col"
                    >
                        {/* Noise Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/assets/noise.png")' }} />

                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-white/10 relative z-10 bg-[#080808]">
                            <div className="flex items-center gap-3">
                                <div className="relative w-6 h-6">
                                    <Image
                                        src="/riiqx-logo-new.png"
                                        alt="RIIQX Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="font-display text-2xl font-black tracking-tighter text-white uppercase italic">
                                    RIIQX<span className="text-accent">.</span>LABS
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto relative z-10 hide-scrollbar">

                            {/* User Bar - Compact */}
                            <motion.div variants={itemVariants} className="px-6 py-6 border-b border-white/5">
                                {loading ? (
                                    <div className="h-10 w-full bg-white/5 animate-pulse" />
                                ) : user ? (
                                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10">
                                        <div className="w-8 h-8 bg-accent flex items-center justify-center font-bold text-black text-sm uppercase">
                                            {user.email?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] text-accent uppercase tracking-widest font-bold">Logged In</p>
                                            <p className="text-white text-xs truncate font-mono">{user.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        Guest Access // Read Only
                                    </div>
                                )}
                            </motion.div>

                            {/* Navigation Links */}
                            <div className="py-2">
                                {navLinks.map((link) => (
                                    <motion.div key={link.name} variants={itemVariants}>
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className="group flex items-center justify-between px-8 py-5 border-b border-white/5 hover:bg-white/5 transition-colors relative overflow-hidden"
                                        >
                                            {/* Hover Accent Bar */}
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

                                            <div className="flex flex-col">
                                                <div className="flex items-baseline gap-3">
                                                    <span className="font-mono text-[9px] text-accent/50 group-hover:text-accent font-bold">
                                                        {link.id}
                                                    </span>
                                                    <span className="text-xl font-black uppercase italic tracking-wider text-white group-hover:text-white transition-all font-display transform group-hover:translate-x-1 duration-300">
                                                        {link.name}
                                                    </span>
                                                </div>
                                                <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] ml-6 font-mono hidden group-hover:block animate-in fade-in slide-in-from-left-2">
                                                    {link.sub}
                                                </span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-accent -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Actions - Industrial Sports Style */}
                        <motion.div variants={itemVariants} className="p-6 border-t border-white/10 bg-[#080808] relative z-10 safe-area-pb">
                            {user ? (
                                <button
                                    onClick={handleSignOut}
                                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2 skew-x-[-12deg]"
                                >
                                    <div className="skew-x-[12deg] flex items-center gap-2">
                                        TERMINATE SESSION
                                    </div>
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href="/login" onClick={onClose} className="w-full">
                                        <button className="w-full py-3 border border-white/20 hover:border-white hover:bg-white hover:text-black text-white text-xs font-black uppercase tracking-[0.15em] transition-all flex justify-center items-center gap-2 skew-x-[-12deg] group">
                                            <div className="skew-x-[12deg] group-hover:translate-x-1 transition-transform">
                                                LOG IN
                                            </div>
                                        </button>
                                    </Link>
                                    <Link href="/register" onClick={onClose} className="w-full">
                                        <button className="w-full py-3 bg-accent text-black hover:bg-white text-xs font-black uppercase tracking-[0.15em] transition-all flex justify-center items-center gap-2 skew-x-[-12deg] shadow-[0_0_15px_rgba(124,58,237,0.3)] group">
                                            <div className="skew-x-[12deg] group-hover:translate-x-1 transition-transform">
                                                JOIN CLUB
                                            </div>
                                        </button>
                                    </Link>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-0 mt-8 border-t border-white/5 pt-4">
                                <Link href="#" className="flex justify-center text-white/30 hover:text-accent transition-colors py-2 border-r border-white/5"><Instagram className="w-4 h-4" /></Link>
                                <Link href="#" className="flex justify-center text-white/30 hover:text-accent transition-colors py-2 border-r border-white/5"><Twitter className="w-4 h-4" /></Link>
                                <Link href="#" className="flex justify-center text-white/30 hover:text-accent transition-colors py-2"><Facebook className="w-4 h-4" /></Link>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
