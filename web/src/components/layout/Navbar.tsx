"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, Search, Zap, ChevronDown, Heart } from "lucide-react";

import { useCartStore } from "@/store/useCartStore";
import { ModeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { toggleCart, getItemCount } = useCartStore();
    const itemCount = getItemCount();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navGroups = [
        {
            name: "Shop",
            type: "mega",
            items: [
                {
                    label: "Categories",
                    links: [
                        { name: "All Products", href: "/shop" },
                        { name: "New Arrivals", href: "/new-arrivals" },
                        { name: "Best Sellers", href: "/best-sellers" },
                        { name: "Accessories", href: "/accessories" },
                        { name: "Streetwear", href: "/streetwear" },
                    ]
                },
                {
                    label: "Featured",
                    links: [
                        { name: "Summer Collection", href: "/collections/summer-collection" },
                        { name: "Limited Edition", href: "/collections/limited-edition" },
                        { name: "Collaborations", href: "/collections/collaboration" },
                    ]
                }
            ],
            promo: {
                image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop",
                title: "New Season",
                subtitle: "Discover the Future of Fashion",
                href: "/collections/new-season"
            }
        },
        {
            name: "Company",
            type: "simple",
            items: [
                { name: "About Developer", href: "/about" },
                { name: "Our Story", href: "/story" },
                { name: "Careers", href: "/careers" },
                { name: "Blog", href: "/blog" },
                { name: "Refer & Earn", href: "/refer-earn" },
            ]
        },
        {
            name: "Support",
            type: "simple",
            items: [
                { name: "FAQ", href: "/faq" },
                { name: "Shipping & Returns", href: "/shipping-returns" },
                { name: "Contact Us", href: "/contact" },
                { name: "Terms of Service", href: "/terms-of-service" },
            ]
        }
    ];

    return (
        // @ts-ignore
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen
                ? "bg-background/80 backdrop-blur-md border-b border-border/10 shadow-lg py-2"
                : "bg-transparent py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between transition-all duration-300">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center space-x-2 group z-50">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full border-2 border-transparent group-hover:border-primary transition-all">
                            <img
                                src="/riiqx-logo.png"
                                alt="RIIQX Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-2xl md:text-3xl font-black tracking-tighter text-white group-hover:text-primary transition-colors font-sans">
                            RIIQX
                        </span>
                    </Link>

                    {/* Desktop Categories Trigger */}
                    <div className="hidden md:flex items-center ml-6 mr-4">
                        <div
                            className="relative group/menu"
                            onMouseEnter={() => setActiveDropdown("Shop")}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="flex items-center space-x-1 text-sm font-bold text-white uppercase tracking-wider hover:text-primary transition-colors py-8">
                                <Menu className="w-4 h-4 mr-2" />
                                <span>Categories</span>
                            </button>

                            <AnimatePresence>
                                {activeDropdown === "Shop" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 w-[600px] bg-card border border-white/10 shadow-2xl overflow-hidden rounded-xl z-50 -translate-x-1/4"
                                    >
                                        <div className="flex p-6 gap-6">
                                            {/* Links Section */}
                                            <div className="flex-1 grid grid-cols-2 gap-6">
                                                {navGroups[0].items.map((section: any, idx) => (
                                                    <div key={idx}>
                                                        <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-widest opacity-50">
                                                            {section.label}
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {section.links.map((link: any) => (
                                                                <li key={link.name}>
                                                                    <Link
                                                                        href={link.href}
                                                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-200 font-medium"
                                                                    >
                                                                        {link.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Promo Section */}
                                            <div className="w-48 group/card relative overflow-hidden rounded-lg bg-black">
                                                <img
                                                    src={navGroups[0].promo?.image}
                                                    alt="Promo"
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 opacity-70"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-4">
                                                    <span className="text-primary text-xs font-black uppercase mb-1">{navGroups[0].promo?.title}</span>
                                                    <Link href={navGroups[0].promo?.href || '#'} className="mt-2 inline-flex items-center justify-center bg-white text-black text-[10px] uppercase font-bold px-3 py-2 rounded-sm transition-colors w-full hover:bg-primary">
                                                        Shop Now
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Desktop Search (Center) */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                        <div className="w-full relative group">
                            <input
                                type="text"
                                placeholder="Search for oversized tees, joggers..."
                                onClick={() => setIsSearchOpen(true)} // Open full overlay on click for now, or keep inline
                                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                                readOnly // Prevent typing here if we use overlay, or remove readOnly if inline
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Navigation Links (Moved to right or integrated? Plan said Clean row... maybe kept simple) */}
                        {/* We can keep navGroups as dropdowns next to actions or separate. Let's keep distinct Actions first */}

                        <Link href="/wishlist" className="text-muted-foreground hover:text-accent transition-colors relative group">
                            <Heart className="w-6 h-6 group-hover:fill-accent transition-all" />
                        </Link>

                        <button
                            onClick={toggleCart}
                            className="text-muted-foreground hover:text-primary transition-colors relative group"
                        >
                            <ShoppingBag className="w-6 h-6 group-hover:fill-primary/20" />
                            {mounted && itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-black text-[10px] flex items-center justify-center rounded-full font-bold animate-in zoom-in border border-black">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        <Link href="/account" className="text-muted-foreground hover:text-primary transition-colors relative group">
                            <User className="w-6 h-6 group-hover:fill-primary/20" />
                        </Link>
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
                    // @ts-ignore
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
                                        {group.type === "mega" ? (
                                            // Handle Mega Menu Items (Sections -> Links)
                                            group.items.map((section: any) => (
                                                <div key={section.label || section.name} className="space-y-2">
                                                    {section.label && (
                                                        <h4 className="text-sm font-semibold text-white/60 uppercase">{section.label}</h4>
                                                    )}
                                                    {(section.links || []).map((link: any) => (
                                                        <Link
                                                            key={link.name}
                                                            href={link.href}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className="block text-lg text-muted-foreground hover:text-primary transition-colors pl-2"
                                                        >
                                                            {link.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            ))
                                        ) : (
                                            // Handle Simple Menu Items
                                            group.items.map((item: any) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="text-lg text-muted-foreground hover:text-primary transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))
                                        )}
                                        {/* Mobile Promo Link if exists */}
                                        {group.promo && (
                                            <Link
                                                href={group.promo.href || '#'}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block mt-4 text-primary font-bold"
                                            >
                                                {group.promo.title} &rarr;
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="w-full h-px bg-white/10" />

                            <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 text-lg text-white font-bold">
                                <ShoppingBag className="w-5 h-5" />
                                <span>Cart ({itemCount})</span>
                            </Link>

                            <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="px-6 py-3 rounded-xl bg-white text-black text-center font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                Account
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    // @ts-ignore
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
                                    className="w-full bg-transparent border-b-2 border-white/10 text-4xl md:text-6xl font-black text-white placeholder-white/10 py-8 pr-20 focus:outline-none focus:border-primary transition-colors uppercase tracking-tight"
                                />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center space-x-4">
                                    <button type="button" className="p-2 text-white/30 hover:text-primary transition-colors" title="Voice Search">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                                    </button>
                                    <button type="submit" className="p-2 text-white/30 hover:text-primary transition-colors">
                                        <Search className="w-10 h-10" />
                                    </button>
                                </div>
                            </form>

                            {/* Trending Searches */}
                            <div className="mt-12">
                                <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-6">Trending Now</h4>
                                <div className="flex flex-wrap gap-4">
                                    {["Cyberpunk Jacket", "Neon Accessories", "Holo-Visor", "Techwear Pants"].map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => {
                                                router.push(`/shop?q=${encodeURIComponent(term)}`);
                                                setIsSearchOpen(false);
                                            }}
                                            className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary transition-all text-sm font-medium"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
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
