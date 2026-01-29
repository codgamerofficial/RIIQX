"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Package, MapPin, Clock, ChevronRight, Settings,
    LogOut, Truck, RefreshCw, FileText,
    Info, Instagram, Twitter, Facebook, ShieldCheck, Mail,
    Bell, Lock, UserCog
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AccountDashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

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
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    const cards = [
        {
            title: "Total Orders",
            value: "0",
            icon: Package,
            href: "/orders",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            title: "Addresses",
            value: "0",
            icon: MapPin,
            href: "/addresses",
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
        {
            title: "Member Since",
            value: user?.created_at ? new Date(user.created_at).getFullYear().toString() : "-",
            icon: Clock,
            href: "#",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
        },
    ];

    const menuGroups = [
        {
            title: "Support Squad",
            items: [
                { label: "Contact HQ", href: "/contact", icon: Mail },
                { label: "Track Shipment", href: "/track-order", icon: Package },
                { label: "Logistics Info", href: "/shipping", icon: Truck },
                { label: "Returns & Exchange", href: "/returns", icon: RefreshCw },
            ]
        },
        {
            title: "The Franchise",
            items: [
                { label: "About RIIQX", href: "/about", icon: Info },
                { label: "Highlight Reel", href: "/lookbook", icon: Instagram },
                { label: "Join Roster", href: "/careers", icon: UserCog },
                { label: "Rulebook (Terms)", href: "/terms", icon: FileText },
            ]
        },
        {
            title: "Settings",
            items: [
                { label: "Account Security", href: "/settings/security", icon: ShieldCheck },
                { label: "Notifications", href: "/settings/notifications", icon: Bell },
                { label: "Privacy Details", href: "/privacy", icon: Lock },
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const MemberIcon = cards[2].icon;

    return (
        <div className="min-h-screen bg-[#050505] pb-24 font-sans selection:bg-accent/30">
            {/* Header / Profile Info */}
            <div className="pt-32 pb-8 px-6 bg-[#0a0a0a] border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter font-display italic mb-2">
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Hub</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                                {user?.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">
                                {user?.user_metadata?.full_name || "RIIQX Elite Member"}
                            </p>
                            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-4 -mt-6 space-y-8 relative z-20"
            >
                {/* 1. Dashboard Widgets */}
                <div className="grid grid-cols-2 gap-3">
                    {cards.slice(0, 2).map((card, idx) => (
                        <Link href={card.href} key={idx}>
                            <motion.div
                                variants={itemVariants}
                                whileTap={{ scale: 0.98 }}
                                className="bg-[#121212] border border-white/5 p-5 rounded-[24px] backdrop-blur-md hover:border-white/10 transition-colors h-full flex flex-col justify-between group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-xl ${card.bg}`}>
                                        <card.icon className={`w-5 h-5 ${card.color}`} />
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black font-display text-white mb-1">{card.value}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">{card.title}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Member Status Widget */}
                <motion.div variants={itemVariants}>
                    <div className="bg-[#121212] border border-white/5 p-5 rounded-[24px] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl ${cards[2].bg}`}>
                                <MemberIcon className={`w-5 h-5 ${cards[2].color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">{cards[2].title}</p>
                                <h3 className="text-lg font-bold text-white">{cards[2].value}</h3>
                            </div>
                        </div>
                        <div className="px-4 py-1.5 bg-accent/10 rounded-full border border-accent/20 text-[10px] uppercase font-black tracking-wider text-accent">
                            Verified Status
                        </div>
                    </div>
                </motion.div>

                {/* 2. Menu Groups */}
                {menuGroups.map((group, groupIdx) => (
                    <motion.div variants={itemVariants} key={groupIdx}>
                        <h3 className="px-4 text-[12px] font-black font-display uppercase tracking-widest text-white/30 mb-3">
                            {group.title}
                        </h3>
                        <div className="bg-[#121212] rounded-[24px] overflow-hidden border border-white/5">
                            {group.items.map((item, idx) => (
                                <Link href={item.href} key={idx}>
                                    <div className={`
                                        flex items-center justify-between p-5 active:bg-white/5 transition-colors group
                                        ${idx !== group.items.length - 1 ? 'border-b border-white/5' : ''}
                                    `}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                                <item.icon className="w-4 h-4 text-white/60 group-hover:text-accent transition-colors" />
                                            </div>
                                            <span className="text-sm font-bold text-white/90">{item.label}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {/* 3. Socials Group */}
                <motion.div variants={itemVariants}>
                    <h3 className="px-4 text-[12px] font-black font-display uppercase tracking-widest text-white/30 mb-3">
                        Connect
                    </h3>
                    <div className="bg-[#121212] rounded-[24px] overflow-hidden border border-white/5 flex divide-x divide-white/5">
                        <a href="#" className="flex-1 py-5 flex justify-center items-center hover:bg-white/5 active:bg-white/10 transition-colors text-white/60 hover:text-white group">
                            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="flex-1 py-5 flex justify-center items-center hover:bg-white/5 active:bg-white/10 transition-colors text-white/60 hover:text-white group">
                            <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="#" className="flex-1 py-5 flex justify-center items-center hover:bg-white/5 active:bg-white/10 transition-colors text-white/60 hover:text-white group">
                            <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </motion.div>

                {/* 4. Sign Out */}
                <motion.div variants={itemVariants} className="pt-4">
                    <button
                        onClick={handleSignOut}
                        className="w-full bg-[#1e0a0a] border border-red-500/20 rounded-[24px] p-5 flex items-center justify-center gap-3 text-red-500 font-bold uppercase tracking-widest text-sm hover:bg-red-500/10 active:scale-[0.98] transition-all group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                    <p className="text-center text-[10px] text-white/20 font-mono uppercase tracking-widest mt-6">
                        RIIQX Terminal v2.1.0 • Secure
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
