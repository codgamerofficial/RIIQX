"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

export function HeroIPL() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Random Jersey Showcase Logic
    const [activeTeam, setActiveTeam] = useState<"mi" | "rcb" | "csk">("mi");

    useEffect(() => {
        const teams: ("mi" | "rcb" | "csk")[] = ["mi", "rcb", "csk"];
        const interval = setInterval(() => {
            const randomTeam = teams[Math.floor(Math.random() * teams.length)];
            setActiveTeam(randomTeam);
        }, 4000); // Rotate every 4 seconds
        return () => clearInterval(interval);
    }, []);

    const teamColors = {
        mi: "from-[#0057E7] to-[#003899]",
        rcb: "from-[#D71920] to-[#8C0B10]",
        csk: "from-[#F2CB05] to-[#B39500]"
    };

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#0A0A0A] flex items-center justify-center">

            {/* STADIUM ATMOSPHERE LAYERS */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* 1. Floodlights (Top Corners) */}
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-white opacity-20 blur-[150px] animate-flicker" />
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white opacity-20 blur-[150px] animate-flicker" style={{ animationDelay: "2s" }} />

                {/* 2. Team Color Fog (Bottom) */}
                <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t ${teamColors[activeTeam]} opacity-20 blur-[100px] transition-colors duration-1000`}
                />

                {/* 3. Pitch Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <div className="container relative z-10 px-4 md:px-8 grid md:grid-cols-12 gap-12 items-center h-full pt-20">

                {/* LEFT: MATCH STATS (TEXT) */}
                <motion.div
                    className="md:col-span-7 flex flex-col justify-center space-y-2"
                    style={{ y: yText, opacity }}
                >
                    {/* Live Badge */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-red-600/20 border border-red-600 text-red-500 text-xs font-['Rajdhani'] font-bold uppercase tracking-widest animate-pulse">
                            ● LIVE MATCH
                        </span>
                        <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
                            FINAL OVER
                        </span>
                    </div>

                    <h1 className="font-['Teko'] text-7xl md:text-[10rem] font-bold uppercase tracking-tighter leading-[0.8] text-white">
                        <span className="block cast-light">STADIUM</span>
                        <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${teamColors[activeTeam]} transition-colors duration-1000`}>
                            DROP
                        </span>
                    </h1>

                    <div className="flex items-center gap-6 mt-8 border-l-4 border-[var(--csk-yellow)] pl-6">
                        <div>
                            <div className="text-white/40 text-xs font-mono uppercase">BATTER</div>
                            <div className="text-2xl font-['Teko'] uppercase text-white">RIIQX CORE</div>
                        </div>
                        <div>
                            <div className="text-white/40 text-xs font-mono uppercase">RUNS</div>
                            <div className="text-2xl font-['Teko'] text-[var(--pitch-green)]">4,999</div>
                        </div>
                        <div>
                            <div className="text-white/40 text-xs font-mono uppercase">S/R</div>
                            <div className="text-2xl font-['Teko'] text-[var(--csk-yellow)]">350.0</div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-10">
                        <Link href="/shop" className="group relative px-10 py-4 bg-white text-black font-['Rajdhani'] font-bold uppercase tracking-widest hover:scale-105 transition-transform clip-path-slant">
                            Shop The Kit
                        </Link>
                    </div>
                </motion.div>

                {/* RIGHT: PLAYER CARD STYLE IMAGE */}
                <motion.div
                    className="md:col-span-5 relative flex items-center justify-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Floating Jersey Card */}
                    <div className="relative w-[300px] md:w-[400px] aspect-[3/4] bg-[#121212] border border-white/10 p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-blue-900/20">
                        {/* Card Header (Team Batting) */}
                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                            <span className="text-xs font-mono text-white/50">IPL // 2026</span>
                            <span className="text-xs font-bold text-[var(--mi-blue)]">MI EDITON</span>
                        </div>

                        {/* Jersey Image */}
                        <div className="relative w-full h-[300px] bg-gradient-to-b from-gray-900 to-black overflow-hidden group">
                            <Image
                                src="/featured-jacket.png"
                                alt="IPL Jersey"
                                fill
                                className="object-contain transform group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Glitch Overlay on Hover */}
                            <div className="absolute inset-0 bg-red-500/10 mix-blend-color-dodge opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                        </div>

                        {/* Card Stats Footer */}
                        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                            <div className="bg-[#1A1A1A] py-2">
                                <div className="text-[10px] text-white/40">SIZE</div>
                                <div className="text-sm font-bold text-white">L / XL</div>
                            </div>
                            <div className="bg-[#1A1A1A] py-2">
                                <div className="text-[10px] text-white/40">STOCK</div>
                                <div className="text-sm font-bold text-[var(--pitch-green)]">IN PLAY</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
