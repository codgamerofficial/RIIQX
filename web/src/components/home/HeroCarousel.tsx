"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "../ui/ScrollReveal";

const HERO_SLIDES = [
    {
        id: 1,
        image: "/assets/carousel/slide-1-streetwear.png",
        title: "FUTURE WEAR",
        subtitle: "The New Standard",
        link: "/shop",
        cta: "Shop Now"
    },
    {
        id: 2,
        image: "/assets/carousel/slide-2-product.png",
        title: "TECH PACK",
        subtitle: "Engineered for Life",
        link: "/collections/tech-pack",
        cta: "Explore"
    },
    {
        id: 3,
        image: "/assets/carousel/slide-3-vision.png",
        title: "ESSENTIALS",
        subtitle: "Elevated Basics",
        link: "/collections/essentials",
        cta: "Discover"
    }
];

export function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    setCurrentSlide((c) => (c + 1) % HERO_SLIDES.length);
                    return 0;
                }
                return prev + 0.4;
            });
        }, 30);
        return () => clearInterval(timer);
    }, []);

    const slide = HERO_SLIDES[currentSlide];

    const handleMouseMove = (e: React.MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
    };

    return (
        <div
            className="relative h-screen w-full overflow-hidden bg-black"
            onMouseMove={handleMouseMove}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="relative w-full h-full">
                        {/* Fallback image or ensure asset exists */}
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover opacity-60"
                            priority
                            sizes="100vw"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
                <ScrollReveal direction="down" distance={20} className="w-full flex flex-col items-center">
                    <motion.div
                        key={slide.id + "content"}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-sm md:text-base font-bold text-accent uppercase tracking-[0.3em] mb-6">
                            {slide.subtitle}
                        </h2>
                        <h1 className="text-[12vw] leading-[0.85] font-black uppercase tracking-tighter text-white mix-blend-screen font-display mb-12">
                            {slide.title}
                        </h1>

                        <Link href={slide.link}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-sm overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-3 group-hover:gap-6 transition-all duration-300">
                                    {slide.cta} <ArrowRight className="w-4 h-4" />
                                </span>
                            </motion.button>
                        </Link>
                    </motion.div>
                </ScrollReveal>
            </div>

            <div className="absolute bottom-12 left-12 right-12 z-20 flex items-end justify-between">
                <div className="flex gap-4">
                    {HERO_SLIDES.map((s, idx) => (
                        <button
                            key={s.id}
                            onClick={() => { setCurrentSlide(idx); setProgress(0); }}
                            className={`h-1 transition-all duration-300 ${currentSlide === idx ? 'w-16 bg-white' : 'w-8 bg-white/20'}`}
                        />
                    ))}
                </div>
                <div className="hidden md:block text-white/40 font-mono text-xs">
                    SCROLL TO EXPLORE
                </div>
            </div>
        </div>
    );
}
