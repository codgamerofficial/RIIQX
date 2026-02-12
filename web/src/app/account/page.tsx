"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Package, MapPin, ChevronRight, Settings,
    LogOut, Truck, RefreshCw, Info, ShieldCheck, Heart, Sparkles, Trophy, Target
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGamification } from "@/hooks/useGamification";
import { RankBadge } from "@/components/account/RankBadge";
import { BentoGrid, BentoGridItem } from "@/components/shop/BentoGrid";

export default function AccountDashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const { profile, progress, nextLevelXp } = useGamification();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/20 border-t-[#B4F000] rounded-full animate-spin" />
            </div>
        );
    }

    const menuGroups = [
        {
            title: "Mission Logs",
            items: [
                { label: "Order History", href: "/account/orders", icon: Package },
                { label: "Wishlist Protocol", href: "/account/wishlist", icon: Heart },
                { label: "Drop Zones (Addresses)", href: "/account/addresses", icon: MapPin },
            ]
        },
        {
            title: "Support Uplink",
            items: [
                { label: "Track Shipment", href: "/track-order", icon: Truck },
                { label: "Returns", href: "/returns", icon: RefreshCw },
                { label: "Help Center", href: "/contact", icon: Info },
            ]
        },
        {
            title: "System Config",
            items: [
                { label: "Profile Settings", href: "/account/profile", icon: Settings },
                { label: "Security", href: "/account/settings", icon: ShieldCheck },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header / ID Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-32 bg-[#B4F000]/5 blur-3xl rounded-full pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/10 to-black border border-white/20 flex items-center justify-center text-3xl font-black text-white/50 backdrop-blur-sm">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter font-[family-name:var(--font-oswald)]">
                                    {user?.user_metadata?.full_name || "Operative"}
                                </h1>
                                <p className="text-[#B4F000] font-mono text-xs tracking-widest uppercase">
                                    ID: {user?.id?.substring(0, 8)} // STATUS: ACTIVE
                                </p>
                            </div>

                            <RankBadge level={profile.level ?? 1} title={profile.title ?? "Initiate"} />
                        </div>

                        {/* XP Bar */}
                        <div className="w-full md:w-64 space-y-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/50">
                                <span>XP Progress</span>
                                <span>{Math.floor(profile.xp)} / {profile.level * 1000} XP</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-[#B4F000]"
                                />
                            </div>
                            <p className="text-[10px] text-right text-white/30">
                                Next Reward: Early Access (Lvl {profile.level + 1})
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Command Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {menuGroups.map((group, i) => (
                        <motion.div
                            key={group.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                        >
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B4F000] mb-6">
                                <Target className="w-3 h-3" /> {group.title}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <Link key={item.label} href={item.href} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-white/5 rounded-md group-hover:bg-[#B4F000]/20 group-hover:text-[#B4F000] transition-colors text-white/50">
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold uppercase tracking-wide text-white/70 group-hover:text-white">{item.label}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#B4F000] transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {/* Stats / Achievements Placeholder */}
                    <div className="bg-gradient-to-br from-[#B4F000]/10 to-transparent border border-[#B4F000]/20 rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B4F000] mb-2">
                                <Trophy className="w-3 h-3" /> Recent Achievements
                            </h3>
                            <div className="space-y-3 mt-4">
                                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-white/5">
                                    <div className="p-1.5 bg-[#B4F000] rounded-full text-black">
                                        <Sparkles className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">First Drop Copied</p>
                                        <p className="text-[10px] text-white/50">Earned 500 XP</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="mt-6 w-full py-3 border border-[#B4F000]/30 text-[#B4F000] text-xs font-bold uppercase tracking-widest hover:bg-[#B4F000] hover:text-black transition-all rounded-lg">
                            View All Trophies
                        </button>
                    </div>
                </div>

                {/* Sign Out */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                    >
                        <LogOut className="w-4 h-4" /> Disconnect System
                    </button>
                </div>

            </div>
        </div>
    );
}
