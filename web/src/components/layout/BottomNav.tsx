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
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pointer-events-none">
            {/* Gradient Fade from bottom */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

            <div className="pointer-events-auto px-6 pb-8 pt-4 flex justify-center">
                <div className="bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-4 flex items-center gap-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Glass Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={vibrate}
                                className="relative flex items-center justify-center"
                            >
                                <div className="relative z-10 p-1">
                                    <Icon
                                        className={cn(
                                            "w-6 h-6 transition-all duration-500",
                                            isActive
                                                ? "text-white fill-white"
                                                : "text-white/40 hover:text-white/80"
                                        )}
                                        strokeWidth={isActive ? 2.5 : 1.5}
                                    />
                                </div>

                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavPill"
                                        className="absolute inset-0 bg-white/10 rounded-full blur-[2px] -z-0 scale-150"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavGlow"
                                        className="absolute top-full mt-2 w-1 h-1 bg-accent rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
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
