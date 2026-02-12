"use client";

import { useGamification } from "@/hooks/useGamification";
import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";

export function LevelIndicator() {
    const { profile, progress, loading } = useGamification();

    if (loading) return null;

    return (
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm group hover:border-[#B4F000]/50 transition-colors cursor-default">
            {/* Level Badge */}
            <div className="relative w-8 h-8 flex items-center justify-center bg-black rounded-full border border-white/10 text-[#B4F000] font-black text-xs font-[family-name:var(--font-oswald)]">
                {profile.level}

                {/* Ping animation for active status */}
                <span className="absolute inset-0 rounded-full border border-[#B4F000] animate-ping opacity-20"></span>
            </div>

            {/* Info & Progress */}
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                        {profile.title}
                    </span>
                    <Zap className="w-3 h-3 text-[#B4F000] fill-[#B4F000]" />
                </div>

                {/* Progress Bar Container */}
                <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[#B4F000]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
            </div>
        </div>
    );
}
