"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CinematicHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#050505]">
            {/* Parallax Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                {/* 
                    Ideally a video, but using a high-quality gradient/image fallback.
                    Replace with <video /> tag for true cinematic feel.
                */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                <div
                    className="absolute inset-0 opacity-60 bg-[url('/assets/marketing/design-02.png')] bg-cover bg-center"
                />
                <div className="absolute inset-0 bg-black/40" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                    style={{ opacity }}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                >
                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[15vw] leading-[0.85] font-black uppercase tracking-tighter text-white font-display mix-blend-difference"
                        >
                            Future
                            <br />
                            Wear
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="text-lg md:text-xl text-white/70 max-w-lg mx-auto font-light tracking-wide"
                    >
                        Engineered for the bold. Designed for the future.
                        <br />
                        Experience the next evolution of streetwear.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        <Link href="/shop" className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full overflow-hidden transition-transform hover:scale-105 duration-300">
                            <span className="relative z-10 text-sm font-bold uppercase tracking-widest">Shop Collection</span>
                            <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll</span>
                <div className="w-[1px] h-12 bg-white/20 overflow-hidden">
                    <motion.div
                        initial={{ y: "-100%" }}
                        animate={{ y: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="w-full h-1/2 bg-white"
                    />
                </div>
            </motion.div>
        </div>
    );
}
