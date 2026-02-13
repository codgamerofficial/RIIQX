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
                        ? "bg-[#050505]/80 backdrop-blur-md border-b border-white/5 py-4 lg:py-3 supports-[backdrop-filter]:bg-[#050505]/60"
                        : "bg-transparent py-6 lg:py-5"
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
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src="/logo.png"
                                alt="RIIQX"
                                className="h-9 md:h-12 w-auto object-contain"
                            />
                        </motion.div>
                    </Link>

                    {/* RIGHT: Icons & Actions */}
                    <div className="flex items-center gap-3 md:gap-5">
                        {/* Search Pill - Desktop */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 hover:border-[#B4F000] hover:bg-white/10 transition-all group clip-path-slant-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-[#B4F000] transition-colors" />
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">
                                [ Search_ ]
                            </span>
                        </motion.button>

                        {/* Search Icon - Mobile */}
                        <motion.button
                            onClick={() => setIsSearchOpen(true)}
                            className="md:hidden p-2 text-white/60 hover:text-[#B4F000] transition-colors"
                            whileTap={{ scale: 0.95 }}
                        >
                            <Search className="w-5 h-5" strokeWidth={1.5} />
                        </motion.button>

                        {/* Level Indicator */}
                        <div className="hidden md:block scale-90 origin-right">
                            <LevelIndicator />
                        </div>

                        {/* User */}
                        <div className="hidden md:block">
                            <UserMenu isIPLTheme={true} />
                        </div>

                        {/* Cart */}
                        <motion.button
                            onClick={() => useCartStore.getState().setCartOpen(true)}
                            className="p-2 text-white/60 hover:text-[#B4F000] transition-colors duration-300 relative group"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ShoppingBag className="w-5 h-5 group-hover:stroke-[#B4F000] transition-colors" strokeWidth={1.5} />
                            <AnimatePresence>
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 bg-[#B4F000] text-black text-[9px] font-mono font-bold h-4 min-w-[16px] px-1 flex items-center justify-center border border-black clip-path-slant-sm shadow-[0_0_8px_rgba(180,240,0,0.6)]"
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
