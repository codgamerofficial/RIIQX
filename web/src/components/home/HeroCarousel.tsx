"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { HeroSlide } from "./hero/HeroSlide";
import { getFlattenedSlides, HERO_CHAPTERS } from "@/lib/hero-config";
import { cn } from "@/lib/utils";
import { DynamicIslandCart } from "@/components/ui/DynamicIslandCart";

export function HeroCarousel() {
    const [slides] = useState(getFlattenedSlides());
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [activeChapterId, setActiveChapterId] = useState(slides[0]?.chapterId);

    // Update active chapter when slide changes
    useEffect(() => {
        const slide = slides[currentSlideIndex];
        if (slide?.chapterId && slide.chapterId !== activeChapterId) {
            setActiveChapterId(slide.chapterId);
        }
    }, [currentSlideIndex, slides, activeChapterId]);

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    setCurrentSlideIndex((c) => (c + 1) % slides.length);
                    return 0;
                }
                return prev + 0.5; // Slightly faster 
            });
        }, 30);
        return () => clearInterval(timer);
    }, [slides.length]);

    const currentSlide = slides[currentSlideIndex];

    const handleChapterClick = (chapterId: string) => {
        const index = slides.findIndex(s => s.chapterId === chapterId);
        if (index !== -1) {
            setCurrentSlideIndex(index);
            setProgress(0);
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide.id}
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <HeroSlide slide={currentSlide} isActive={true} />
                </motion.div>
            </AnimatePresence>

            {/* --- CHAPTER INDICATORS (Bottom Left) --- */}
            <div className="absolute bottom-12 left-6 md:left-12 z-30 flex items-end gap-6 md:gap-8 hidden md:flex">
                {HERO_CHAPTERS.map((chapter, idx) => {
                    const isActive = chapter.id === activeChapterId;
                    return (
                        <div
                            key={chapter.id}
                            onClick={() => handleChapterClick(chapter.id)}
                            className={cn(
                                "group cursor-pointer flex flex-col gap-2 transition-all duration-300",
                                isActive ? "opacity-100" : "opacity-30 hover:opacity-60"
                            )}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                                0{idx + 1}
                            </span>
                            <span className={cn(
                                "text-sm font-black uppercase tracking-tight text-white font-display transition-all",
                                isActive ? "scale-100" : "scale-90"
                            )}>
                                {chapter.title}
                            </span>
                            {/* Progress Line */}
                            <div className="h-[2px] w-full bg-white/20 mt-1 relative overflow-hidden rounded-full">
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 bg-accent"
                                        style={{ width: `${progress}%` }}
                                        layoutId="activeChapterProgress"
                                    />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Mobile Progress Bar (Simple) */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 md:hidden z-30">
                <div
                    className="h-full bg-accent transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Dynamic Island Cart - Floating Interaction */}
            <DynamicIslandCart />
        </div>
    );
}
