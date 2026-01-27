"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function BrandStory() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="py-48 bg-black overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-20 pointer-events-none" />

            <motion.div style={{ opacity }} className="relative z-10 text-center">
                <span className="inline-block text-accent text-xs font-bold uppercase tracking-[0.3em] mb-8 border border-accent/20 px-4 py-2 rounded-full">
                    Established 2026
                </span>

                <div className="max-w-4xl mx-auto px-6">
                    <p className="text-3xl md:text-5xl font-medium text-white leading-tight font-display tracking-tight">
                        <span className="text-white/30">We don't follow trends. </span>
                        We engineer the future of fashion.
                        <span className="text-white/30"> Every stitch is a statement. </span>
                        Every piece is a revolution.
                        <span className="text-accent"> This is RIIQX.</span>
                    </p>
                </div>
            </motion.div>

            {/* Background Marquee Effect */}
            <motion.div
                style={{ x }}
                className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap opacity-[0.03] pointer-events-none select-none"
            >
                <span className="text-[20vw] font-black uppercase font-display leading-none">
                    Future Wear Premium Architecture
                </span>
            </motion.div>
        </section>
    );
}
