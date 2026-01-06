"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export function AboutHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const yImage = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-black to-black opacity-50" />

            <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
                {/* Text Content */}
                <motion.div
                    style={{ y: yText }}
                    className="flex-1 text-center md:text-left space-y-6"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-primary font-mono text-sm tracking-widest uppercase mb-2">The Architect</h2>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mix-blend-difference">
                            SASWATA<br />DEY
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-xl md:text-2xl text-muted-foreground font-light max-w-lg"
                    >
                        Full Stack Developer & QA Engineer.<br />
                        <span className="text-white font-medium">Building the impossible, one pixel at a time.</span>
                    </motion.p>
                </motion.div>

                {/* Profile Image with Parallax */}
                <motion.div
                    style={{ y: yImage }}
                    className="flex-1 w-full max-w-md relative aspect-[3/4] group"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-800 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <Image
                            src="/developer.jpg"
                            alt="Saswata Dey"
                            fill
                            className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700 ease-out"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white flex flex-col items-center gap-2"
            >
                <span className="text-[10px] tracking-widest uppercase opacity-70">Scroll to Explore</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-6 h-6 text-primary" />
                </motion.div>
            </motion.div>
        </div>
    );
}
