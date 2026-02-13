"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, User, Search, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BottomNav() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const vibrate = () => {
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(15);
        }
    };

    const navItems = [
        {
            label: "Home",
            href: "/",
            icon: HomeCustomIcon
        },
        {
            label: "Shop",
            href: "/shop",
            icon: Compass
        },
        {
            label: "Search",
            href: "/search",
            icon: Search
        },
        {
            label: "Wishlist",
            href: "/wishlist",
            icon: Heart
        },
        {
            label: "Profile",
            href: "/account",
            icon: User
        }
    ];

    // Hide on product pages to prevent overlap with Sticky Add To Cart
    if (!mounted || pathname?.startsWith("/product/")) return null;

    return (
        <div className="fixed bottom-8 left-0 right-0 z-50 md:hidden pointer-events-none flex justify-center">
            <div className="pointer-events-auto">
                <div className="bg-[#050505] border border-white/10 rounded-full px-2 py-2 flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative backdrop-blur-3xl">
                    {/* Glass Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-full" />

                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={vibrate}
                                className="relative flex items-center justify-center w-12 h-12"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavPill"
                                        className="absolute inset-0 bg-[#B4F000] rounded-full shadow-[0_0_20px_rgba(180,240,0,0.3)]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                <div className="relative z-10 transition-transform duration-300">
                                    <Icon
                                        className={cn(
                                            "w-5 h-5 transition-colors duration-300",
                                            isActive
                                                ? "text-black fill-black"
                                                : "text-white/40 hover:text-white"
                                        )}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Custom "N" Home Icon for brand alignment
function HomeCustomIcon({ className, strokeWidth }: { className?: string, strokeWidth?: number }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth || 1.5}
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M9 16V8l6 8V8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
