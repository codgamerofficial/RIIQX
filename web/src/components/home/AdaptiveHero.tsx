"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const HERO_SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
        title: "BUILT FOR",
        highlight: "THE BOLD",
        subtitle: "Limited drops. Premium fabric. Engineered for the streets of tomorrow.",
        cta: "SHOP DROP",
        color: "var(--color-luxury-gold)"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1550935114-99de2f488f40?q=80&w=2600&auto=format&fit=crop",
        title: "FUTURE",
        highlight: "READY",
        subtitle: "Advanced tech-integrated streetwear for the connected generation.",
        cta: "EXPLORE COLLECTION",
        color: "var(--color-luxury-chrome)"
    }
];

export function AdaptiveHero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const slide = HERO_SLIDES[currentSlide];

    return (
        <div className="relative w-full h-screen bg-luxury-black overflow-hidden font-sans">
            {/* Background Image Slider with Parallax Feel */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // Luxury ease
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                    <div className="absolute inset-0 bg-black/20 z-10" /> {/* General dim */}
                    <img
                        src={slide.image}
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pb-12 md:pb-0">
                <motion.div
                    key={`content-${slide.id}`}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="max-w-5xl"
                >
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="h-px w-12 bg-luxury-gold" />
                        <span className="text-luxury-gold text-sm font-bold uppercase tracking-[0.2em]">
                            Season 2026 / Vol. 1
                        </span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-display font-medium text-white leading-[0.85] tracking-tight mb-8">
                        {slide.title}
                        <br />
                        <span style={{ color: slide.color }}>
                            {slide.highlight}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-lg mb-12 font-light tracking-wide">
                        {slide.subtitle}
                    </p>

                    <div className="flex items-center space-x-6">
                        <Link href="/shop">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-10 py-5 bg-white text-black font-display font-bold text-xl uppercase tracking-wider hover:bg-luxury-gold transition-colors duration-300"
                            >
                                {slide.cta}
                            </motion.button>
                        </Link>

                        <button className="px-8 py-5 border border-white/20 text-white font-display font-bold text-xl uppercase tracking-wider hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                            View Lookbook
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Slide Indicators - Minimal */}
            <div className="absolute bottom-12 right-12 z-20 flex flex-col space-y-4">
                {HERO_SLIDES.map((s, idx) => (
                    <button
                        key={s.id}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-1 h-12 transition-all duration-500 rounded-full ${currentSlide === idx
                            ? "bg-luxury-gold h-20"
                            : "bg-white/20 hover:bg-white/40"
                            }`}
                    />
                ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 p-8 z-20 hidden md:block">
                <div className="text-right">
                    <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Est. 2026</p>
                    <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Tokyo / NY / London</p>
                </div>
            </div>
        </div>
    );
}
