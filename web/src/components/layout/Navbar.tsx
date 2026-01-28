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
import { NavDropdown } from "./NavDropdown";

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

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled
                ? "bg-[#050505]/80 backdrop-blur-md border-white/5 py-3"
                : "bg-transparent border-transparent py-6"
                }`}
        >
            <div className="max-w-[1500px] mx-auto px-6 flex items-center justify-between">

                {/* 1. Left: Mobile Menu Trigger (Visible on Mobile) */}
                <div className="md:hidden">
                    <button onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* 2. Left: Navigation (Desktop) */}
                <div className="hidden md:flex items-center space-x-10">
                    <Link
                        href="/"
                        className="text-sm font-black uppercase tracking-widest text-white/70 hover:text-accent transition-colors font-display italic"
                    >
                        Home
                    </Link>

                    <NavDropdown
                        label="Shop"
                        items={[
                            { name: "All Products", href: "/shop" },
                            { name: "New Arrivals", href: "/new-arrivals" },
                            { name: "Best Sellers", href: "/best-sellers" },
                            { name: "Accessories", href: "/shop?category=accessories" },
                        ]}
                    />

                    <NavDropdown
                        label="Collections"
                        items={[
                            { name: "Future Wear", href: "/collections/future-wear" },
                            { name: "Tech Pack", href: "/collections/tech-pack" },
                            { name: "Essentials", href: "/collections/essentials" },
                        ]}
                    />
                </div>

                {/* 3. Center: Brand Logo */}
                <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group">
                    <div className={`relative transition-all duration-500 ${scrolled ? "w-16" : "w-20 md:w-24"} hover:scale-105`}>
                        <img
                            src="/riiqx-logo-new.png"
                            alt="RIIQX"
                            className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                        />
                    </div>
                </Link>

                {/* 4. Right: Actions */}
                <div className="flex items-center space-x-6">
                    <ScaleButton onClick={() => setIsSearchOpen(true)} className="group">
                        <Search className="w-5 h-5 text-white/70 group-hover:text-accent transition-colors" />
                    </ScaleButton>

                    {/* Auth Menu (Middle of Search and Cart) */}
                    <div className="block">
                        <UserMenu />
                    </div>

                    <ScaleButton onClick={toggleCart} className="relative group">
                        <div className="relative">
                            <ShoppingBag className="w-5 h-5 text-white/70 group-hover:text-accent transition-colors" />
                            {mounted && itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center bg-accent text-[9px] font-black text-black clip-path-slant">
                                    {itemCount}
                                </span>
                            )}
                        </div>
                    </ScaleButton>
                </div>
            </div>

            <PredictiveSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </motion.nav>
    );
}
