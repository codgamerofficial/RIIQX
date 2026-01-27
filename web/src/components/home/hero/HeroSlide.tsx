"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroSlideData } from "@/lib/hero-config";
import { cn } from "@/lib/utils";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface HeroSlideProps {
    slide: HeroSlideData;
    isActive: boolean;
}

// Animation Variants
const textContainerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const textItemVariants = {
    hidden: { y: 100, opacity: 0, filter: "blur(10px)" }, // Slide up + blur -> sharp
    visible: {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    }
};

const imageVariants = {
    hidden: { scale: 1.08, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1] // Custom ease 
        }
    }
};

export function HeroSlide({ slide, isActive }: HeroSlideProps) {
    const isSplit = slide.layout === 'split';

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#0A0A0A]">

            {/* --- DESKTOP LAYOUT --- */}
            <div className="hidden md:flex w-full h-full">

                {/* 1. Left Content (40%) - Only if Split */}
                {isSplit && (
                    <div className="w-[40%] h-full flex flex-col justify-center px-16 z-20 relative">
                        <motion.div
                            variants={textContainerVariants}
                            initial="hidden"
                            animate={isActive ? "visible" : "hidden"}
                            className="space-y-6"
                        >
                            {slide.badge && (
                                <motion.span variants={textItemVariants} className="text-accent font-bold tracking-widest uppercase text-sm">
                                    {slide.badge}
                                </motion.span>
                            )}

                            <motion.h2 variants={textItemVariants} className="text-7xl font-black uppercase leading-[0.9] tracking-tighter text-white font-display">
                                {slide.title.split(" ").map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </motion.h2>

                            <motion.p variants={textItemVariants} className="text-white/60 text-lg max-w-sm font-medium">
                                {slide.subtitle}
                            </motion.p>

                            <motion.div variants={textItemVariants} className="pt-8 flex gap-4">
                                <Link href={slide.ctaLink}>
                                    <button className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:scale-105 transition-transform rounded-full flex items-center gap-2 group">
                                        {slide.ctaText} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <button className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-colors rounded-full backdrop-blur-md">
                                    View Lookbook
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                )}

                {/* 2. Right Image (60%) or Full */}
                <div className={cn(
                    "h-full relative overflow-hidden",
                    isSplit ? "w-[60%]" : "w-full"
                )}>
                    <motion.div
                        variants={imageVariants}
                        initial="hidden"
                        animate={isActive ? "visible" : "hidden"}
                        className="w-full h-full relative"
                    >
                        {/* Split Overlay Gradient */}
                        {isSplit && (
                            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10" />
                        )}
                        {/* Text Overlay for Full Layout */}
                        {!isSplit && (
                            <div className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center text-center">
                                <motion.div
                                    variants={textContainerVariants}
                                    initial="hidden"
                                    animate={isActive ? "visible" : "hidden"}
                                    className="px-4"
                                >
                                    <motion.h2 variants={textItemVariants} className="text-8xl font-black uppercase tracking-tighter text-white font-display mb-4">
                                        {slide.title}
                                    </motion.h2>
                                    <motion.div variants={textItemVariants}>
                                        <Link href={slide.ctaLink}>
                                            <button className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest hover:scale-105 transition-transform rounded-full">
                                                {slide.ctaText}
                                            </button>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>
                        )}

                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={isActive}
                        />
                    </motion.div>
                </div>
            </div>


            {/* --- MOBILE LAYOUT (Immersive) --- */}
            <div className="md:hidden w-full h-full relative">
                <motion.div
                    variants={imageVariants}
                    initial="hidden"
                    animate={isActive ? "visible" : "hidden"}
                    className="w-full h-full"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={isActive}
                    />
                </motion.div>

                <div className="absolute bottom-0 left-0 w-full p-8 z-20 pb-32">
                    <motion.div
                        variants={textContainerVariants}
                        initial="hidden"
                        animate={isActive ? "visible" : "hidden"}
                        className="space-y-4"
                    >
                        {slide.badge && (
                            <motion.span variants={textItemVariants} className="text-accent text-xs font-bold tracking-widest uppercase">
                                {slide.badge}
                            </motion.span>
                        )}
                        <motion.h2 variants={textItemVariants} className="text-5xl font-black uppercase leading-tight tracking-tighter text-white font-display">
                            {slide.title}
                        </motion.h2>
                        <motion.div variants={textItemVariants}>
                            <Link href={slide.ctaLink}>
                                <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2">
                                    {slide.ctaText} <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

        </div>
    );
}
