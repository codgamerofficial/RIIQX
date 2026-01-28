"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ChevronRight, Twitter, Instagram, Facebook, LogIn, UserPlus, Fingerprint, LogOut, Terminal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const navLinks = [
    { name: "Home", href: "/", id: "01" },
    { name: "Shop All", href: "/shop", id: "02" },
    { name: "New Arrivals", href: "/new-arrivals", id: "03" },
    { name: "Collections", href: "/collections", id: "04" },
    { name: "Lookbook", href: "/lookbook", id: "05" },
    { name: "About", href: "/about", id: "06" },
];

const sidebarVariants = {
    closed: {
        x: "-100%",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 40
        }
    },
    open: {
        x: "0%",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 40,
            staggerChildren: 0.1,
            delayChildren: 0.2
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

        // Listen for auth state changes
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
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] md:hidden"
                    />

                    {/* Menu Drawer */}
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={sidebarVariants}
                        className="fixed top-0 left-0 bottom-0 w-[90%] max-w-sm bg-[#0a0a0a] border-r-2 border-white/10 z-[70] md:hidden flex flex-col clip-path-slant-right-mobile"
                    >
                        {/* Header */}
                        <div className="p-8 flex items-center justify-between border-b border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 blur-3xl rounded-full" />

                            <span className="font-display text-4xl font-black tracking-tighter text-white uppercase italic transform -skew-x-6 z-10">
                                RIIQX<span className="text-accent">.</span>
                            </span>
                            <button
                                onClick={onClose}
                                className="p-3 bg-white/5 hover:bg-accent hover:text-black rounded-sm transition-all text-white transform hover:rotate-90 z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
                            {/* User Status Badge */}
                            <motion.div variants={itemVariants} className="mb-8">
                                {loading ? (
                                    <div className="h-10 w-full bg-white/5 animate-pulse rounded-sm" />
                                ) : user ? (
                                    <div className="border border-accent/20 bg-accent/5 p-4 relative group overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                                        <p className="text-[10px] text-accent uppercase tracking-widest font-bold mb-1 flex items-center gap-2">
                                            <Fingerprint className="w-3 h-3" /> Identity Verified
                                        </p>
                                        <p className="text-white font-mono text-xs truncate uppercase">
                                            {user.email}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="border border-white/10 bg-white/5 p-4">
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1 flex items-center gap-2">
                                            <Terminal className="w-3 h-3" /> No Active Session
                                        </p>
                                        <p className="text-white/60 font-mono text-xs uppercase">
                                            Guest User
                                        </p>
                                    </div>
                                )}
                            </motion.div>

                            <div className="space-y-1">
                                {navLinks.map((link) => (
                                    <motion.div key={link.name} variants={itemVariants}>
                                        <Link
                                            href={link.href}
                                            onClick={onClose}
                                            className="group flex items-center justify-between py-4 border-b border-white/5 hover:border-accent/50 transition-colors"
                                        >
                                            <div className="flex items-baseline gap-4">
                                                <span className="font-mono text-[10px] text-white/30 group-hover:text-accent transition-colors">
                                                    {link.id}
                                                </span>
                                                <span className="text-2xl font-black uppercase italic tracking-wider text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all transform group-hover:translate-x-2">
                                                    {link.name}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer / Account */}
                        <motion.div variants={itemVariants} className="p-6 border-t border-white/5 bg-[#0a0a0a] space-y-6 relative z-10">
                            {user ? (
                                <button
                                    onClick={handleSignOut}
                                    className="w-full py-4 bg-white/5 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex justify-center items-center gap-2 skew-x-[-6deg]"
                                >
                                    <div className="skew-x-[6deg] flex items-center gap-2">
                                        <LogOut className="w-4 h-4" /> Terminate Session
                                    </div>
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href="/login" onClick={onClose} className="w-full">
                                        <button className="w-full py-4 border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex justify-center items-center gap-2 skew-x-[-6deg]">
                                            <div className="skew-x-[6deg] flex items-center gap-2">
                                                <LogIn className="w-4 h-4" /> Sign In
                                            </div>
                                        </button>
                                    </Link>
                                    <Link href="/register" onClick={onClose} className="w-full">
                                        <button className="w-full py-4 bg-accent text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-white transition-all flex justify-center items-center gap-2 skew-x-[-6deg]">
                                            <div className="skew-x-[6deg] flex items-center gap-2">
                                                <UserPlus className="w-4 h-4" /> Join
                                            </div>
                                        </button>
                                    </Link>
                                </div>
                            )}

                            <div className="flex justify-center space-x-8 pt-4">
                                <a href="#" className="text-white/30 hover:text-accent hover:scale-110 transition-all"><Instagram className="w-5 h-5" /></a>
                                <a href="#" className="text-white/30 hover:text-accent hover:scale-110 transition-all"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="text-white/30 hover:text-accent hover:scale-110 transition-all"><Facebook className="w-5 h-5" /></a>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
