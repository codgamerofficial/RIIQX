"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { HypeButton } from "@/components/ui/HypeButton";
import { ArrowRight, ChevronDown } from "lucide-react";

/* ═══════════════════════════════════════════════════════
   SLIDE CONFIG — Optimized assets
   ═══════════════════════════════════════════════════════ */
const slides = [
    {
        id: 1,
        src: "/hero/slide-1.png",
        label: "THE CULT",
        accent: "#B4F000",
        tagline: "WEAR YOUR ALLEGIANCE",
        desc: "Join the movement. Exclusive drops for the elite.",
    },
    {
        id: 2,
        src: "/hero/slide-2.png",
        label: "FUTURE READY",
        accent: "#00F0FF",
        tagline: "NEXT GEN STREETWEAR",
        desc: "Cyberpunk aesthetics meeting tactical functionality.",
    },
    {
        id: 3,
        src: "/hero/slide-3.png",
        label: "NIGHT CITY",
        accent: "#7C3AED",
        tagline: "OWN THE NIGHT",
        desc: "Reflective materials for the urban explorer.",
    },
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);
    const heroRef = useRef<HTMLElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive check
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    /* ── Parallax ── */
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const slide = slides[current];

    return (
        <section
            ref={heroRef}
            className="relative w-full h-[100dvh] overflow-hidden bg-[#050505] select-none"
        >
            {/* ═══ WEBGL LIQUID BACKGROUND ═══ */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="w-full h-full"
                    >
                        {/* Only render WebGL on desktop for performance, fallback image on mobile */}
                        <img
                            src={slide.src}
                            alt="Hero"
                            className="w-full h-full object-cover opacity-80"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ═══ OVERLAYS ═══ */}
            {/* Vignette & Grain */}
            <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)] pointer-events-none" />
            <div className="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none bg-[url('/noise.png')] mix-blend-overlay" />

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 z-[1] opacity-[0.1] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
            />

            {/* ═══ HERO CONTENT ═══ */}
            <div className="absolute inset-0 z-[10] flex flex-col justify-center px-6 md:px-20 safe-area-inset-x">
                <motion.div
                    style={{ y: yText, opacity: opacityText }}
                    className="max-w-5xl"
                >
                    {/* Tagline with Glitch Effect */}
                    <div className="overflow-hidden mb-2">
                        <motion.p
                            key={`tag-${current}`}
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[#B4F000] font-mono text-xs md:text-base tracking-[0.2em] uppercase mb-4"
                        >
                            /// {slide.tagline}
                        </motion.p>
                    </div>

                    {/* Main Headline */}
                    <div className="relative">
                        <motion.h1
                            key={`head-${current}`}
                            initial={{ x: -50, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl sm:text-6xl md:text-9xl font-black font-[family-name:var(--font-oswald)] text-white uppercase leading-[0.9] tracking-tighter"
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                                {slide.label}
                            </span>
                        </motion.h1>

                        {/* Ghost Text Effect */}
                        <motion.h1
                            key={`ghost-${current}`}
                            className="absolute top-0 left-1 text-5xl sm:text-6xl md:text-9xl font-black font-[family-name:var(--font-oswald)] text-transparent uppercase leading-[0.9] tracking-tighter opacity-30 select-none pointer-events-none"
                            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 0.3 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            {slide.label}
                        </motion.h1>
                    </div>

                    {/* Description */}
                    <motion.p
                        key={`desc-${current}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="mt-6 text-white/70 max-w-md text-sm md:text-lg font-light leading-relaxed glass-panel p-4 rounded-none border-l-2"
                        style={{ borderLeftColor: slide.accent }}
                    >
                        {slide.desc}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="mt-10 flex flex-wrap gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <HypeButton size="lg" onClick={() => window.location.href = '/shop'}>
                            EXPLORE DROPS <ArrowRight className="w-4 h-4" />
                        </HypeButton>
                        <HypeButton variant="outline" size="lg" onClick={nextSlide}>
                            NEXT VIBE
                        </HypeButton>
                    </motion.div>
                </motion.div>
            </div>

            {/* ═══ BOTTOM PROGRESS BAR ═══ */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                <motion.div
                    key={current}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }} // Simple infinite load for demo
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full"
                    style={{ backgroundColor: slide.accent }}
                    onAnimationComplete={nextSlide}
                />
            </div>

            {/* ═══ SCROLL INDICATOR ═══ */}
            <motion.div
                className="absolute bottom-10 right-10 flex flex-col items-center gap-2 z-[20] hidden md:flex"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 [writing-mode:vertical-lr]">Scroll</span>
                <ChevronDown className="text-[#B4F000]" />
            </motion.div>
        </section>
    );
}
