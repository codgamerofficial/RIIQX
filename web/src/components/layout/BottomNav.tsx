"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            label: "Home",
            href: "/",
            icon: Home
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

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#050505]">
            <div className="border-t border-white/10 px-6 pb-6 pt-4 clip-path-slant-top relative">
                {/* Neon Line Top */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

                <div className="flex items-center justify-between">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative flex flex-col items-center gap-1 group w-12"
                            >
                                <div className={cn(
                                    "p-1 transition-all duration-300 relative",
                                    isActive ? "-translate-y-2" : ""
                                )}>
                                    <Icon className={cn(
                                        "w-5 h-5 transition-all duration-300",
                                        isActive ? "text-accent scale-110 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]" : "text-white/40 group-hover:text-white"
                                    )} />

                                    {/* Active Glow Backdrop */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="bottomNavGlow"
                                            className="absolute inset-0 bg-accent/20 blur-xl rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </div>

                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest font-display italic transition-colors absolute -bottom-2",
                                    isActive ? "text-white opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
