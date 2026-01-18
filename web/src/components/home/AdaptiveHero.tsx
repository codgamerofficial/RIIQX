"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const HERO_SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop", // Bold Fashion Model
        title: "WEAR YOUR",
        highlight: "REALITY",
        subtitle: "Streetwear Re-imagined for the Digital Age.",
        cta: "SHOP THE DROP",
        color: "#D9F99D" // Neon Yellow
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1550935114-99de2f488f40?q=80&w=2600&auto=format&fit=crop", // Cyberpunk / Tech
        title: "FUTURE IS",
        highlight: "NOW",
        subtitle: "Premium Tech-Integrated Apparel.",
        cta: "EXPLORE COLLECTION",
        color: "#00F0FF" // Cyan
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2400&auto=format&fit=crop", // High contrast portrait
        title: "BOLD IS",
        highlight: "BETTER",
        subtitle: "Stand Out. Never Blend In.",
        cta: "VIEW LOOKBOOK",
        color: "#FF003C" // Red
    }
];

export function AdaptiveHero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = HERO_SLIDES[currentSlide];

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* Background Image Slider */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    <img
                        src={slide.image}
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-32 md:pb-48">
                <motion.div
                    key={`content-${slide.id}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-4xl"
                >
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-white">
                            New Season 2026
                        </span>
                        <div className="h-px w-12 bg-white/50" />
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-6">
                        {slide.title}
                        <br />
                        <span
                            style={{ color: slide.color }}
                            className="text-transparent bg-clip-text bg-gradient-to-r from-current to-white/50"
                        >
                            {slide.highlight}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/80 max-w-lg mb-10 font-medium">
                        {slide.subtitle}
                    </p>

                    <div className="flex items-center space-x-6">
                        <Link href="/shop">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-black font-black text-lg uppercase tracking-wider flex items-center space-x-3 hover:bg-neutral-200 transition-colors"
                            >
                                <span>{slide.cta}</span>
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>

                        <button className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                            <Sparkles className="w-6 h-6" />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-12 right-12 z-20 flex space-x-4">
                {HERO_SLIDES.map((s, idx) => (
                    <button
                        key={s.id}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === idx
                                ? "bg-white w-8 scale-110"
                                : "bg-white/30 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
