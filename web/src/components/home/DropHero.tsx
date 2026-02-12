"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Drop {
    id: string;
    name: string;
    description: string;
    release_date: string;
    status: "upcoming" | "live" | "archived";
    hero_image: string;
    accent_color: string;
}

function getTimeLeft(targetDate: number) {
    const diff = Math.max(0, targetDate - Date.now());
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

export default function DropHero({ drop }: { drop: Drop | null }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!drop || drop.status !== "upcoming") return;

        const target = new Date(drop.release_date).getTime();
        setTimeLeft(getTimeLeft(target));

        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(target));
        }, 1000);

        return () => clearInterval(interval);
    }, [drop]);

    if (!drop) return null;

    return (
        <section className="relative h-screen bg-black text-white flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            {drop.hero_image && (
                <div className="absolute inset-0">
                    <Image
                        src={drop.hero_image}
                        alt={drop.name}
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 text-center space-y-8 px-6">
                {/* Status Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <span
                        className="inline-block px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.4em] border"
                        style={{
                            borderColor: drop.accent_color,
                            color: drop.accent_color,
                        }}
                    >
                        {drop.status === "upcoming" ? "Coming Soon" : drop.status === "live" ? "Live Now" : "Archived"}
                    </span>
                </motion.div>

                {/* Drop Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-5xl md:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-oswald)] leading-[0.9]"
                >
                    {drop.name}
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed"
                >
                    {drop.description}
                </motion.p>

                {/* Countdown — only for upcoming */}
                {drop.status === "upcoming" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex justify-center gap-8 md:gap-12 pt-4"
                    >
                        {[
                            { label: "Days", value: timeLeft.days },
                            { label: "Hrs", value: timeLeft.hours },
                            { label: "Min", value: timeLeft.minutes },
                            { label: "Sec", value: timeLeft.seconds },
                        ].map((unit) => (
                            <div key={unit.label} className="text-center">
                                <div className="text-3xl md:text-5xl font-bold font-mono tabular-nums">
                                    {String(unit.value).padStart(2, "0")}
                                </div>
                                <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mt-2">
                                    {unit.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* CTA — only for live */}
                {drop.status === "live" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link
                            href="/collections/drop"
                            className="inline-block border border-white px-12 py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300"
                        >
                            Shop Drop
                        </Link>
                    </motion.div>
                )}

                {/* Archive notice */}
                {drop.status === "archived" && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-gray-600 text-sm uppercase tracking-wider"
                    >
                        This drop has ended. No restocks.
                    </motion.p>
                )}
            </div>

            {/* Bottom accent line */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: drop.accent_color }}
            />
        </section>
    );
}
