"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, Search, Zap, ChevronDown, Heart } from "lucide-react";

import { useCartStore } from "@/store/useCartStore";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { PredictiveSearch } from "@/components/search/PredictiveSearch";
import { UserMenu } from "@/components/auth/UserMenu";
import { MobileMenu } from "./MobileMenu";
import { ScaleButton } from "../ui/ScaleButton";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { toggleCart, getItemCount } = useCartStore();
    const itemCount = getItemCount();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Minimal Navigation
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "New Drops", href: "/new-arrivals" },
        { name: "Collections", href: "/collections" },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                {/* 1. Left: Mobile Menu Trigger (Visible on Mobile) */}
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* 2. Left: Navigation (Desktop) */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors hover-scale"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* 3. Center: Brand Logo */}
                <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group">
                    <span className="font-display text-3xl font-black tracking-tighter text-white group-hover:text-gradient transition-all cursor-pointer">
                        RIIQX
                    </span>
                </Link>

                {/* 4. Right: Actions */}
                <div className="flex items-center space-x-6">
                    <ScaleButton onClick={() => setIsSearchOpen(true)} className="group">
                        <Search className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                    </ScaleButton>

                    <Link href="/account" className="hidden md:block group">
                        <User className="w-5 h-5 text-white/70 group-hover:text-white transition-colors hover:scale-110 transition-transform duration-200" />
                    </Link>

                    <ScaleButton onClick={toggleCart} className="relative group">
                        <ShoppingBag className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                        {mounted && itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                                {itemCount}
                            </span>
                        )}
                    </ScaleButton>
                </div>
            </div>

            <PredictiveSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </motion.nav>
    );
}
