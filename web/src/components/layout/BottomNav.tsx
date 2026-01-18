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
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
            <div className="bg-[#121212]/90 backdrop-blur-xl border-t border-white/10 px-6 pb-2 pt-3">
                <div className="flex items-center justify-between">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative flex flex-col items-center gap-1 group"
                            >
                                <div className={cn(
                                    "p-2 rounded-xl transition-all duration-300",
                                    isActive ? "bg-white/10" : "bg-transparent"
                                )}>
                                    <Icon className={cn(
                                        "w-5 h-5 transition-colors",
                                        isActive ? "text-primary" : "text-white/40 group-hover:text-white"
                                    )} />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wide transition-colors",
                                    isActive ? "text-white" : "text-white/40"
                                )}>
                                    {item.label}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute -top-3 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_10px_#D9F99D]"
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
