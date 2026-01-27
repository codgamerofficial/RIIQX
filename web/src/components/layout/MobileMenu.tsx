"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ChevronRight, Twitter, Instagram, Facebook, LogIn, UserPlus } from "lucide-react";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/shop" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Collections", href: "/collections" },
    { name: "Lookbook", href: "/lookbook" },
    { name: "About", href: "/about" },
    { name: "Support", href: "/contact" },
    { name: "Wishlist", href: "/wishlist" },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden"
                    />

                    {/* Menu Drawer */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#050505] border-r border-white/10 z-[70] md:hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-white/5">
                            <span className="font-display text-3xl font-black tracking-tighter text-white">
                                RIIQX
                            </span>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={onClose}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                                >
                                    <span className="text-lg font-bold uppercase tracking-wide text-white/70 group-hover:text-white transition-colors">
                                        {link.name}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-accent transition-colors" />
                                </Link>
                            ))}
                        </div>

                        {/* Footer / Account */}
                        <div className="p-6 border-t border-white/5 bg-[#050505] space-y-6">

                            <div className="grid grid-cols-2 gap-4">
                                <Link href="/login" onClick={onClose}>
                                    <button className="w-full py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex justify-center items-center gap-2">
                                        <LogIn className="w-4 h-4" /> Sign In
                                    </button>
                                </Link>
                                <Link href="/register" onClick={onClose}>
                                    <button className="w-full py-3 bg-accent text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex justify-center items-center gap-2">
                                        <UserPlus className="w-4 h-4" /> Join
                                    </button>
                                </Link>
                            </div>

                            <div className="flex justify-center space-x-6">
                                <a href="#" className="text-white/30 hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
                                <a href="#" className="text-white/30 hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="text-white/30 hover:text-accent transition-colors"><Facebook className="w-5 h-5" /></a>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
