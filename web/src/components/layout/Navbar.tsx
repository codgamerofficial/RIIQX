"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ShoppingBag, Menu, Search } from "lucide-react";

import { useCartStore } from "@/store/useCartStore";
import { PredictiveSearch } from "@/components/search/PredictiveSearch";
import { UserMenu } from "@/components/auth/UserMenu";
import { MobileMenu } from "./MobileMenu";
import { ScaleButton } from "../ui/ScaleButton";
import { NavDropdown } from "./NavDropdown";

const navLinks = [
    { name: "Home", href: "/" },
    {
        name: "Shop",
        href: "/shop",
        dropdown: [
            { name: "All Products", href: "/shop" },
            { name: "New Arrivals", href: "/new-arrivals" },
            { name: "Best Sellers", href: "/best-sellers" },
            { name: "Accessories", href: "/shop?category=accessories" },
        ]
    },
    {
        name: "Collections",
        href: "/collections",
        dropdown: [
            { name: "Future Wear", href: "/collections/future-wear" },
            { name: "Tech Pack", href: "/collections/tech-pack" },
            { name: "Essentials", href: "/collections/essentials" },
        ]
    },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { toggleCart, getItemCount } = useCartStore();
    const itemCount = getItemCount();
    const pathname = usePathname();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Smart scroll behavior - hide on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Always show at top
            if (currentScrollY < 20) {
                setScrolled(false);
                setIsVisible(true);
            } else {
                setScrolled(true);
                // Hide when scrolling down, show when scrolling up
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const navVariants = {
        visible: {
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
            }
        },
        hidden: {
            y: -100,
            transition: {
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={isVisible ? "visible" : "hidden"}
                variants={navVariants}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled
                    ? "bg-[#050505]/95 backdrop-blur-xl border-white/10 py-3 shadow-lg shadow-black/20"
                    : "bg-transparent border-transparent py-5"
                    }`}
            >
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">

                    {/* Mobile Menu Trigger */}
                    <motion.div
                        className="md:hidden"
                        whileTap={{ scale: 0.95 }}
                    >
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-white/80 hover:text-white transition-colors duration-300"
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                            >
                                {link.dropdown ? (
                                    <NavDropdown
                                        label={link.name}
                                        items={link.dropdown}
                                    />
                                ) : (
                                    <Link
                                        href={link.href}
                                        className={`relative text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 font-display group ${pathname === link.href
                                                ? "text-white"
                                                : "text-white/60 hover:text-white"
                                            }`}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        <motion.span
                                            className="absolute -bottom-1 left-0 h-[1px] bg-accent"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: pathname === link.href ? "100%" : "0%"
                                            }}
                                            whileHover={{ width: "100%" }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        />
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Center: Brand Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <Link href="/" className="group block">
                            <motion.div
                                className={`relative transition-all duration-500 ${scrolled ? "w-12 lg:w-14" : "w-14 lg:w-16"}`}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src="/riiqx-logo-new.png"
                                    alt="RIIQX"
                                    className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(124,58,237,0.5)]"
                                />
                            </motion.div>
                        </Link>
                    </motion.div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-2 md:space-x-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <ScaleButton
                                onClick={() => setIsSearchOpen(true)}
                                className="group p-2"
                                aria-label="Search"
                            >
                                <Search className="w-[18px] h-[18px] text-white/70 group-hover:text-accent transition-colors duration-300" />
                            </ScaleButton>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <UserMenu />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <ScaleButton
                                onClick={toggleCart}
                                className="relative group p-2"
                                aria-label="Shopping cart"
                            >
                                <div className="relative">
                                    <ShoppingBag className="w-[18px] h-[18px] text-white/70 group-hover:text-accent transition-colors duration-300" />
                                    <AnimatePresence>
                                        {mounted && itemCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                                className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center bg-accent text-[8px] font-black text-black clip-path-slant"
                                            >
                                                {itemCount > 9 ? '9+' : itemCount}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </ScaleButton>
                        </motion.div>
                    </div>
                </div>

                {/* Progress Bar */}
                <motion.div
                    className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-accent/50 via-accent to-accent/50"
                    style={{
                        scaleX: useScroll().scrollYProgress,
                        transformOrigin: "left"
                    }}
                />
            </motion.nav>

            <PredictiveSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}
