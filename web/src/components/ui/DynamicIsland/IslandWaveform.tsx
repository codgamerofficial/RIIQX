"use client";

import { useMusicStore } from "@/store/music-store";
import { motion } from "framer-motion";

export function IslandWaveform() {
    const isPlaying = useMusicStore((state) => state.isPlaying);

    // 3 bars imitating the iOS waveform
    return (
        <div className="flex items-center gap-[2px] h-full justify-center">
            {[1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    className="w-[3px] bg-primary rounded-full"
                    animate={isPlaying ? {
                        height: [4, 12 + Math.random() * 8, 4],
                    } : {
                        height: 4
                    }}
                    transition={{
                        duration: 0.4 + Math.random() * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.1
                    }}
                />
            ))}
        </div>
    );
}
