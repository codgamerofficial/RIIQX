"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, Search, Zap, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/useCartStore";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const { toggleCart, getItemCount } = useCartStore();
    const itemCount = getItemCount();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navGroups = [
        {
            name: "Shop",
            items: [
                { name: "All Products", href: "/shop" },
                { name: "New Arrivals", href: "/new-arrivals" },
                { name: "Best Sellers", href: "/best-sellers" },
                { name: "Accessories", href: "/accessories" },
            ]
        },
        {
            name: "Support",
            items: [
                { name: "FAQ", href: "/faq" },
                { name: "Shipping & Returns", href: "/shipping-returns" },
                { name: "Contact Us", href: "/contact" },
                { name: "Terms of Service", href: "/terms-of-service" },
            ]
        }
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen
                ? "bg-background/80 backdrop-blur-md border-b border-white/10 shadow-lg"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center space-x-2 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all duration-300">
                            R
                        </div>
                        <span className="text-2xl font-bold tracking-tighter text-white group-hover:text-glow transition-all">
                            RIIQX
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navGroups.map((group) => (
                            <div
                                key={group.name}
                                className="relative group/menu"
                                onMouseEnter={() => setActiveDropdown(group.name)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-white transition-colors py-8">
                                    <span>{group.name}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                <AnimatePresence>
                                    {activeDropdown === group.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 w-48 bg-background/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                                        >
                                            <div className="py-2">
                                                {group.items.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-muted-foreground hover:text-white transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <button
                            onClick={toggleCart}
                            className="text-muted-foreground hover:text-primary transition-colors relative"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {mounted && itemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-[10px] flex items-center justify-center rounded-full text-white font-bold animate-in zoom-in">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <Link href="/dashboard" className="w-9 h-9 rounded-full bg-secondary/10 border border-secondary/50 flex items-center justify-center text-secondary hover:bg-secondary/20 transition-all font-bold">
                                {user.email?.[0].toUpperCase()}
                            </Link>
                        ) : (
                            <Link href="/auth">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-5 py-2 rounded-full bg-white text-black font-semibold text-sm flex items-center space-x-2 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all"
                                >
                                    <span>Sign In</span>
                                    <Zap className="w-3 h-3 fill-black" />
                                </motion.div>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-muted-foreground hover:text-white transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <button
                            onClick={toggleCart}
                            className="text-muted-foreground hover:text-primary transition-colors relative"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {mounted && itemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-[10px] flex items-center justify-center rounded-full text-white font-bold animate-in zoom-in">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        <button
                            className="text-white p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background/95 backdrop-blur-xl border-t border-white/10 absolute top-20 left-0 w-full overflow-hidden"
                    >
                        <div className="px-6 pt-8 pb-24 space-y-8 flex flex-col h-full overflow-y-auto">
                            {navGroups.map((group) => (
                                <div key={group.name} className="space-y-4">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">{group.name}</h3>
                                    <div className="flex flex-col space-y-3 pl-4 border-l border-white/10">
                                        {group.items.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="text-lg text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="w-full h-px bg-white/10" />

                            <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 text-lg text-white font-bold">
                                <ShoppingBag className="w-5 h-5" />
                                <span>Cart ({itemCount})</span>
                            </Link>

                            {user ? (
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 text-center font-bold">
                                    My Dashboard
                                </Link>
                            ) : (
                                <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 rounded-xl bg-white text-black text-center font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    Sign In / Sign Up
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-3xl relative">
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="absolute -top-16 right-0 p-2 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const input = form.elements.namedItem('search') as HTMLInputElement;
                                    if (input.value.trim()) {
                                        router.push(`/shop?q=${encodeURIComponent(input.value.trim())}`);
                                        setIsSearchOpen(false);
                                    }
                                }}
                                className="relative group"
                            >
                                <input
                                    type="text"
                                    name="search"
                                    autoFocus
                                    placeholder="Search products..."
                                    className="w-full bg-transparent border-b-2 border-white/10 text-4xl md:text-6xl font-black text-white placeholder-white/10 py-8 focus:outline-none focus:border-primary transition-colors uppercase tracking-tight"
                                />
                                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-primary transition-colors">
                                    <Search className="w-10 h-10" />
                                </button>
                            </form>
                            <p className="mt-6 text-center text-white/30 text-sm tracking-widest uppercase">
                                Press Enter to search
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
