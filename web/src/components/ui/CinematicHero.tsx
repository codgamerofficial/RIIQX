"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

interface CinematicHeroProps {
    title: string;
    subtitle?: string;
    description?: string;
}

export function CinematicHero({ title, subtitle, description }: CinematicHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={containerRef} className="h-[70vh] min-h-[500px] flex items-center justify-center relative overflow-hidden bg-black text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-black to-black opacity-50" />

            <motion.div
                style={{ y }}
                className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6"
            >
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-primary font-mono tracking-widest uppercase text-sm"
                    >
                        {subtitle}
                    </motion.p>
                )}

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-5xl md:text-8xl font-black tracking-tighter mix-blend-difference"
                >
                    {title}
                </motion.h1>

                {description && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
                    >
                        {description}
                    </motion.p>
                )}
            </motion.div>

            <motion.div
                style={{ opacity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="w-px h-12 bg-linear-to-b from-transparent via-white/50 to-transparent" />
                <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
            </motion.div>
        </section>
    );
}
