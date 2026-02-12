"use client";

import { motion } from "framer-motion";
import { Shield, Star, Crown, Zap } from "lucide-react";

interface RankBadgeProps {
    level: number;
    title: string;
    className?: string;
}

export function RankBadge({ level, title, className }: RankBadgeProps) {
    // Determine icon and color based on level
    const getRankStyles = (lvl: number) => {
        if (lvl >= 50) return { icon: Crown, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" };
        if (lvl >= 20) return { icon: Star, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" };
        if (lvl >= 10) return { icon: Zap, color: "text-[#B4F000]", bg: "bg-[#B4F000]/10", border: "border-[#B4F000]/30" };
        return { icon: Shield, color: "text-white/60", bg: "bg-white/5", border: "border-white/10" };
    };

    const { icon: Icon, color, bg, border } = getRankStyles(level);

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center gap-3 px-4 py-2 rounded-full border ${bg} ${border} ${className}`}
        >
            <div className={`p-1.5 rounded-full bg-black/40 ${color}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>
                    Level {level}
                </div>
                <div className="text-xs font-black uppercase text-white tracking-wider">
                    {title}
                </div>
            </div>
        </motion.div>
    );
}
