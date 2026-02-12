"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserMenu } from "@/components/auth/UserMenu";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { usePathname } from "next/navigation";
import { PredictiveSearch } from "@/components/search/PredictiveSearch";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";
import { LevelIndicator } from "@/components/gamification/LevelIndicator";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { items } = useCartStore();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 50);

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{
                    y: isVisible ? 0 : -100,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-area-inset-top",
                    scrolled
                        ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-3"
                        : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    {/* LEFT: Menu */}
                    <motion.button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 text-white/60 hover:text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Menu className="w-5 h-5" strokeWidth={1.5} />
                    </motion.button>

                    {/* CENTER: Logo */}
                    <Link
                        href="/"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <img
                            src="/logo.png"
                            alt="RIIQX"
                            className="h-8 md:h-10 w-auto object-contain"
                        />
                    </Link>

                    {/* RIGHT: Icons */}
                    <div className="flex items-center gap-1 md:gap-3">
                        {/* Search */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-white/60 hover:text-white transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Search className="w-5 h-5" strokeWidth={1.5} />
                        </motion.button>

                        {/* Level Indicator */}
                        <div className="hidden md:block">
                            <LevelIndicator />
                        </div>

                        {/* User */}
                        <div className="hidden md:block">
                            <UserMenu isIPLTheme={true} />
                        </div>

                        {/* Cart */}
                        <motion.button
                            onClick={() => useCartStore.getState().setCartOpen(true)}
                            className="p-2 text-white/60 hover:text-white transition-colors relative"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                            <AnimatePresence>
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-0.5 -right-0.5 bg-[#B4F000] text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

                {/* Subtle bottom accent */}
                {scrolled && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5"
                    />
                )}
            </motion.nav>

            <PredictiveSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}
