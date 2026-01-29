"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroSlideData } from "@/lib/hero-config";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useMouseParallax } from "@/hooks/useParallax";
import { MagneticButton } from "@/components/ui/MagneticButton";

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

    // Parallax Hooks - Different strengths for depth perception
    const { ref: containerRef, x: textX, y: textY } = useMouseParallax({ strength: 20 });
    const { x: imageX, y: imageY } = useMouseParallax({ strength: -15 }); // Opposite direction for depth

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#0A0A0A]">

            {/* --- DESKTOP LAYOUT --- */}
            <div className="hidden md:flex w-full h-full">

                {/* 1. Left Content (40%) - Only if Split */}
                {isSplit && (
                    <div className="w-[40%] h-full flex flex-col justify-center px-16 z-20 relative clip-path-slant-right bg-[#0A0A0A]">
                        <motion.div
                            style={{ x: textX, y: textY }}
                            variants={textContainerVariants}
                            initial="hidden"
                            animate={isActive ? "visible" : "hidden"}
                            className="space-y-6"
                        >
                            {slide.badge && (
                                <motion.span variants={textItemVariants} className="text-accent font-black tracking-widest uppercase text-xs border border-accent/20 px-3 py-1 inline-block">
                                    {slide.badge}
                                </motion.span>
                            )}

                            <motion.h2 variants={textItemVariants} className="text-8xl font-black uppercase leading-[0.8] tracking-tighter text-white font-display italic">
                                {slide.title.split(" ").map((word, i) => (
                                    <span key={i} className="block transform -skew-x-6">{word}</span>
                                ))}
                            </motion.h2>

                            <motion.p variants={textItemVariants} className="text-white/60 text-lg max-w-sm font-mono uppercase tracking-wide border-l-2 border-accent pl-4">
                                {slide.subtitle}
                            </motion.p>

                            <motion.div variants={textItemVariants} className="pt-8 flex gap-4">
                                <Link href={slide.ctaLink}>
                                    <MagneticButton className="px-8 py-5 bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-all text-sm flex items-center gap-2 group clip-path-slant-right hover:bg-accent hover:text-white">
                                        {slide.ctaText} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </MagneticButton>
                                </Link>
                                <MagneticButton strength={0.2} className="px-8 py-5 border border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-colors text-sm clip-path-slant-left">
                                    View Lookbook
                                </MagneticButton>
                            </motion.div>
                        </motion.div>
                    </div>
                )}

                {/* 2. Right Image (60%) or Full */}
                <div className={cn(
                    "h-full relative overflow-hidden",
                    isSplit ? "w-[60%] absolute right-0 top-0 bottom-0" : "w-full"
                )}>
                    <motion.div
                        variants={imageVariants}
                        initial="hidden"
                        animate={isActive ? "visible" : "hidden"}
                        className="w-full h-full relative"
                        style={!isSplit ? { x: imageX, y: imageY } : undefined}
                    >
                        <div className="absolute inset-0 bg-black/20 z-10" />

                        {/* Text Overlay for Full Layout */}
                        {!isSplit && (
                            <div className="absolute inset-0 bg-black/20 z-20 flex flex-col items-center justify-center text-center pointer-events-none">
                                <motion.div
                                    style={{ x: textX, y: textY }}
                                    variants={textContainerVariants}
                                    initial="hidden"
                                    animate={isActive ? "visible" : "hidden"}
                                    className="px-4"
                                >
                                    {/* Ghost Text */}
                                    <motion.h2 variants={textItemVariants} className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white/30 to-white/0 font-display italic mb-4 leading-none select-none">
                                        {slide.title}
                                    </motion.h2>

                                    {/* Main Text */}
                                    <motion.h2 variants={textItemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white font-display italic mb-8 -mt-16 md:-mt-24 transform -skew-x-6 drop-shadow-2xl">
                                        {slide.title}
                                    </motion.h2>

                                    <motion.div variants={textItemVariants} className="pointer-events-auto">
                                        <Link href={slide.ctaLink}>
                                            <MagneticButton className="px-10 py-5 bg-accent text-white font-black uppercase tracking-widest hover:scale-110 transition-transform clip-path-slant text-xs md:text-sm hover:bg-white hover:text-black shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                                                {slide.ctaText}
                                            </MagneticButton>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>
                        )}

                        <motion.div
                            style={isSplit ? { x: imageX, y: imageY, scale: 1.1 } : { scale: 1.1 }}
                            className="w-full h-full"
                        >
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                style={{ objectPosition: slide.objectPosition || 'center' }}
                                priority={isActive}
                            />
                        </motion.div>
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
                        style={{ objectPosition: slide.objectPosition || 'top' }} // Default to top for mobile
                        priority={isActive}
                    />
                </motion.div>

                <div className="absolute bottom-0 left-0 w-full p-6 z-20 pb-24 sm:pb-32">
                    <motion.div
                        variants={textContainerVariants}
                        initial="hidden"
                        animate={isActive ? "visible" : "hidden"}
                        className="space-y-3"
                    >
                        {slide.badge && (
                            <motion.span variants={textItemVariants} className="text-accent text-[10px] font-black tracking-widest uppercase border border-accent/30 px-2 py-1 bg-black/50 backdrop-blur-md">
                                {slide.badge}
                            </motion.span>
                        )}
                        <motion.h2 variants={textItemVariants} className="text-4xl sm:text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white font-display italic transform -skew-x-6 drop-shadow-lg">
                            {slide.title}
                        </motion.h2>
                        <motion.div variants={textItemVariants} className="pt-4">
                            <Link href={slide.ctaLink}>
                                <button className="w-full py-3.5 bg-white text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 clip-path-slant-right active:scale-95 transition-transform text-xs sm:text-sm hover:bg-accent hover:text-white">
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
