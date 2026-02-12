"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export function HeroStrangerVerse() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const yImage = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Generate random particles for "The Upside Down" effect
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5
    }));

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#050505] flex items-center justify-center">
            {/* Background Layers */}
            <div className="absolute inset-0 z-0">
                {/* Red Fog */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#FF0033]/10 to-transparent blur-[100px]" />
                {/* Cyan Fog */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[#00F0FF]/10 to-transparent blur-[100px]" />

                {/* Halftone Pattern */}
                <div className="absolute inset-0 halftone-bg" />

                {/* Noise */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 animate-pulse" />
            </div>

            {/* Upside Down Particles */}
            {particles.map((p, i) => (
                <div
                    key={i}
                    className="particle absolute bg-white/50 blur-[1px]"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        // @ts-ignore
                        "--duration": `${p.duration}s`,
                        "--delay": `${p.delay}s`
                    }}
                />
            ))}

            <div className="container relative z-10 px-4 md:px-0 grid md:grid-cols-12 gap-8 items-center h-full pt-20">

                {/* Text Content */}
                <motion.div
                    className="md:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8"
                    style={{ y: yText, opacity }}
                >
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-[#FF0033]/20 border border-[#FF0033] text-[#FF0033] text-xs font-mono uppercase tracking-widest">
                            Limited Drop
                        </span>
                        <span className="w-12 h-[1px] bg-[#FF0033]"></span>
                        <span className="text-[#00F0FF] text-xs font-mono uppercase tracking-widest animate-pulse">
                            Vol. 04
                        </span>
                    </div>

                    <h1 className="font-['Oswald'] text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] text-white mix-blend-difference">
                        <span className="block glitch-text" data-text="STRANGER">STRANGER</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-[#00F0FF]">WORLDS</span>
                        <span className="block text-2xl md:text-4xl font-mono tracking-[0.5em] mt-2 text-white/50">COLLECTION</span>
                    </h1>

                    <p className="max-w-md text-white/60 font-mono text-sm md:text-base border-l-2 border-[#CCFF00] pl-4">
                        Unlock the multiverse of style. High-grade fabrics fused with retro-futuristic aesthetic.
                        Warning: Contains extreme drip.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <Link href="/shop" className="group relative px-8 py-4 bg-[#CCFF00] text-black font-black uppercase tracking-widest overflow-hidden hover:scale-105 transition-transform">
                            <span className="relative z-10 flex items-center gap-2">
                                Shop Drop <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                            <div className="absolute inset-0 bg-[#00F0FF] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>

                        <Link href="/collections" className="group px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                            View Lookbook
                        </Link>
                    </div>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    className="md:col-span-5 relative h-[50vh] md:h-full flex items-center justify-center"
                    style={{ y: yImage, opacity }}
                >
                    <div className="relative w-full aspect-[3/4] md:aspect-square group">
                        {/* Glitch Frames behind image */}
                        <div className="absolute inset-0 border-2 border-[#FF0033] translate-x-2 translate-y-2 opacity-50 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500" />
                        <div className="absolute inset-0 border-2 border-[#00F0FF] -translate-x-2 -translate-y-2 opacity-50 group-hover:-translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />

                        {/* Floating Badge (Trigger for Telekinesis) */}
                        <motion.div
                            className="absolute -bottom-6 -left-6 bg-black border border-[#CCFF00] p-4 z-20 cursor-crosshair"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            whileHover="telekinetic"
                        >
                            <div className="text-[#CCFF00] font-black text-2xl">₹4,999</div>
                            <div className="text-white/50 text-xs font-mono">Premium Tech Fleece</div>
                            <div className="text-[10px] text-[#FF0033] mt-1 font-mono uppercase blink">⚠ Levitation Hazard</div>
                        </motion.div>

                        {/* Telekinetic Image Container */}
                        <motion.div
                            className="relative w-full h-full bg-[#111] overflow-hidden"
                            variants={{
                                telekinetic: {
                                    x: [0, -5, 5, -5, 5, 0],
                                    y: [0, -20, -15, -25, -20],
                                    rotate: [0, -2, 2, -1, 1, 0],
                                    filter: "hue-rotate(90deg) contrast(1.5)",
                                    transition: { duration: 0.5, repeat: Infinity }
                                }
                            }}
                        >
                            <Image
                                src="/featured-jacket.png"
                                alt="Stranger Verse Jacket"
                                fill
                                className="object-cover object-center transition-transform duration-700"
                                priority
                            />
                            {/* Flash overlay */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-100 mix-blend-overlay" />
                        </motion.div>
                    </div>
                </motion.div>

            </div>

            {/* CRT Scanline Overlay for Hero only */}
            <div className="absolute inset-0 scanlines" />
        </div>
    );
}
