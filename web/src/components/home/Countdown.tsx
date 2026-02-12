"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Drop } from "@/lib/supabase/drops";

function getTimeLeft(targetDate: number) {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

export default function Countdown({ drop }: { drop: Drop | null }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!drop) return;

        const targetDate = new Date(drop.release_date).getTime();
        setTimeLeft(getTimeLeft(targetDate));

        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [drop]);

    if (!drop || drop.status === "archived") return null;

    const units = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
    ];

    return (
        <section className="bg-[#0a0a0a] text-white py-20 px-6 border-y border-white/5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center"
            >
                <span
                    className="text-xs font-bold uppercase tracking-[0.3em] block mb-6"
                    style={{ color: drop.accent_color || "#B4F000" }}
                >
                    {drop.status === "live" ? "Live Now" : "Upcoming Drop"}
                </span>
                <h2 className="text-2xl md:text-3xl uppercase tracking-wide mb-12 font-[family-name:var(--font-oswald)]">
                    {drop.name}
                </h2>

                {/* Countdown Grid */}
                <div className="flex justify-center gap-6 md:gap-12">
                    {units.map((unit) => (
                        <div key={unit.label} className="text-center">
                            <div className="text-4xl md:text-6xl font-bold font-mono tabular-nums">
                                {String(unit.value).padStart(2, "0")}
                            </div>
                            <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-500 mt-2">
                                {unit.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Subtle divider */}
                <div className="w-12 h-[1px] bg-white/10 mx-auto mt-12" />

                <p className="text-gray-600 text-xs uppercase tracking-[0.2em] mt-6 font-mono">
                    {drop.description || "Limited Release. No Restocks."}
                </p>
            </motion.div>
        </section>
    );
}
