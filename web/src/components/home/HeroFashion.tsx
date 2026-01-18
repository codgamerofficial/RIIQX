"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * HeroFashion
 * The "Light/Organic" reality mode.
 * Features: Parallax Lifestyle Imagery, Mouse-reactive layers, Clean typography.
 */
export function HeroFashion() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Mouse Parallax Logic
    const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const x = e.clientX / innerWidth - 0.5;
            const y = e.clientY / innerHeight - 0.5;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Parallax transforms
    const imageX = useTransform(mouseX, [-0.5, 0.5], [20, -20]);
    const imageY = useTransform(mouseY, [-0.5, 0.5], [20, -20]);
    const textX = useTransform(mouseX, [-0.5, 0.5], [-40, 40]);
    const textY = useTransform(mouseY, [-0.5, 0.5], [-40, 40]);

    // Scroll Parallax
    const y1 = useTransform(scrollY, [0, 1000], [0, 400]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

    return (
        <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#ffffff]">

            {/* Parallax Background Layers */}
            <motion.div
                style={{ x: imageX, y: imageY }}
                className="absolute inset-0 z-0 opacity-80"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                {/* Placeholder for High-Res Lifestyle Image */}
                <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop"
                    alt="Fashion Background"
                    className="w-full h-full object-cover scale-110"
                />
            </motion.div>

            {/* Floating Elements (Organic Shapes) */}
            <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
                <motion.div
                    style={{ y: y1, x: textX }}
                    className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"
                />
                <motion.div
                    style={{ y: y2, x: textX }}
                    className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"
                />
            </div>

            {/* Content */}
            <motion.div
                style={{ x: textX, y: textY }}
                className="relative z-10 text-center space-y-8 max-w-full px-4 mix-blend-darken"
            >
                <h1 className="text-6xl sm:text-8xl md:text-[8rem] lg:text-[10rem] font-serif italic text-black leading-none tracking-tighter">
                    <span className="block overflow-hidden">
                        <motion.span
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="block"
                        >
                            Astral
                        </motion.span>
                    </span>
                    <span className="block overflow-hidden">
                        <motion.span
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="block font-light not-italic text-black/80"
                        >
                            Collection
                        </motion.span>
                    </span>
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="font-sans text-black/60 tracking-[0.3em] uppercase text-sm"
                >
                    Fluidity • Elegance • Emotion
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <button className="group relative px-10 py-4 overflow-hidden rounded-full bg-black text-white hover:bg-black/90 transition-all shadow-xl">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        <span className="relative font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                            Explore Collection
                        </span>
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
}

