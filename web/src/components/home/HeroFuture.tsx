"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, ChevronLeft, ChevronRight } from "lucide-react";

// Carousel Assets
const CAROUSEL_IMAGES = [
    "/hero/slide-1.png",
    "/hero/slide-2.png",
    "/hero/slide-3.png",
    "/hero/slide-4.png",
    "/hero/slide-5.png",
];

const CAROUSEL_DATA = [
    {
        id: 1,
        title: 'STREETWEAR',
        subtitle: 'DROP 01 // 2026',
        description: 'Urban apocalypse ready. Technical fabrics meet street culture.',
        cta: 'SHOP NOW',
        ctaLink: '/shop',
        color: '#E31C79',
        neonColor: '#FF69B4',
        imageIndex: 0,
    },
    {
        id: 2,
        title: 'NEW ARRIVALS',
        subtitle: 'LIMITED EDITION',
        description: 'Fresh drops you can\'t miss. Be first in line.',
        cta: 'EXPLORE',
        ctaLink: '/shop',
        color: '#CCFF00',
        neonColor: '#DDFF44',
        imageIndex: 1,
    },
    {
        id: 3,
        title: 'OUR VISION',
        subtitle: 'THE FUTURE',
        description: 'Redefining fashion for the next generation.',
        cta: 'LEARN MORE',
        ctaLink: '/about',
        color: '#00F0FF',
        neonColor: '#44FFFF',
        imageIndex: 2,
    },
    {
        id: 4,
        title: 'OUR STORY',
        subtitle: 'SINCE 2024',
        description: 'Built by Gen Z, for Gen Z. This is our journey.',
        cta: 'DISCOVER',
        ctaLink: '/about',
        color: '#FF00FF',
        neonColor: '#FF44FF',
        imageIndex: 3,
    },
    {
        id: 5,
        title: 'PREMIUM SERVICE',
        subtitle: 'VIP ACCESS',
        description: 'Exclusive perks for our elite members.',
        cta: 'JOIN NOW',
        ctaLink: '/account',
        color: '#FFD700',
        neonColor: '#FFEC44',
        imageIndex: 4,
    },
];

export function HeroFuture() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Parallax effects
    const y = useTransform(scrollY, [0, 1000], [0, 300]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    // Mouse parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
        const x = (clientX - left - width / 2) / (width / 2);
        const y = (clientY - top - height / 2) / (height / 2);
        mouseX.set(x);
        mouseY.set(y);
    }, [mouseX, mouseY]);

    // Auto-advance slides
    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentSlide((prev) => (prev + 1) % CAROUSEL_DATA.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                setDirection(1);
                setCurrentSlide((prev) => (prev + 1) % CAROUSEL_DATA.length);
            } else if (e.key === 'ArrowLeft') {
                setDirection(-1);
                setCurrentSlide((prev) => (prev - 1 + CAROUSEL_DATA.length) % CAROUSEL_DATA.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const currentData = CAROUSEL_DATA[currentSlide];

    return (
        <div
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-black cursor-none"
            onMouseMove={handleMouseMove}
        >
            {/* Custom Cursor */}
            <CustomCursor mouseX={mouseX} mouseY={mouseY} color={currentData.color} />

            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: 0,
                    }}
                    exit={{
                        opacity: 0,
                        x: direction > 0 ? '-100%' : '100%',
                    }}
                    transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    {/* Background Image with Parallax */}
                    <motion.div
                        style={{ y, opacity }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={CAROUSEL_IMAGES[currentData.imageIndex]}
                            alt={currentData.title}
                            fill
                            className="object-cover object-center"
                            priority
                        />
                    </motion.div>

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />

                    {/* Neon Glow Effect */}
                    <motion.div
                        className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-[120px] opacity-50 z-10"
                        style={{ backgroundColor: currentData.neonColor }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Content Layer */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 lg:px-24">
                <div className="max-w-5xl">
                    {/* Subtitle with Glow */}
                    <motion.div
                        key={`subtitle-${currentSlide}`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <span
                            className="px-4 py-2 text-xs font-bold tracking-[0.3em] uppercase border rounded-full backdrop-blur-md"
                            style={{
                                borderColor: `${currentData.color}50`,
                                color: currentData.color,
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                textShadow: `0 0 20px ${currentData.neonColor}`,
                            }}
                        >
                            {currentData.subtitle}
                        </span>
                        <span className="flex items-center gap-2 text-xs font-mono text-white/60">
                            <motion.span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: currentData.color }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    boxShadow: [`0 0 0 0 ${currentData.neonColor}66`, `0 0 0 8px ${currentData.neonColor}00`, `0 0 0 0 ${currentData.neonColor}66`]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            LIVE NOW
                        </span>
                    </motion.div>

                    {/* Main Title - Huge & Bold */}
                    <motion.h1
                        key={`title-${currentSlide}`}
                        initial={{ opacity: 0, y: 100, filter: "blur(20px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -100, filter: "blur(20px)" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-8"
                        style={{
                            color: '#FFFFFF',
                            textShadow: `0 0 40px ${currentData.neonColor}80`,
                        }}
                    >
                        {currentData.title.split(' ').map((word, i) => (
                            <motion.span
                                key={i}
                                className="block"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 * i }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        key={`desc-${currentSlide}`}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="max-w-xl text-lg md:text-xl text-white/70 mb-12 font-light leading-relaxed border-l-2 pl-6"
                        style={{ borderColor: currentData.color }}
                    >
                        {currentData.description}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        key={`cta-${currentSlide}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap gap-6"
                    >
                        <Link
                            href={currentData.ctaLink || '/shop'}
                            className="group relative px-8 py-4 font-bold tracking-[0.2em] uppercase overflow-hidden"
                            style={{ backgroundColor: currentData.color }}
                        >
                            <span className="relative z-10 flex items-center gap-3 text-black">
                                {currentData.cta}
                                <motion.span
                                    className="w-5 h-5"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </motion.span>
                            </span>
                            {/* Hover Glow Effect */}
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                                style={{
                                    background: `linear-gradient(90deg, transparent, ${currentData.neonColor}66, transparent)`,
                                }}
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        </Link>

                        <button className="group flex items-center gap-4 px-8 py-4 border-2 text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                            style={{ borderColor: `${currentData.color}50` }}
                        >
                            <motion.span
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${currentData.color}30` }}
                            >
                                <Play className="w-4 h-4 ml-0.5" style={{ color: currentData.color }} />
                            </motion.span>
                            <span className="tracking-[0.2em] text-sm uppercase">Watch Film</span>
                            <motion.span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: currentData.color }}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Slide Number Indicator */}
            <motion.div
                className="absolute top-1/2 left-6 lg:left-12 z-30 transform -translate-y-1/2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                key={currentSlide}
            >
                <div className="flex flex-col items-center gap-2">
                    <motion.span
                        className="text-6xl md:text-8xl font-black tracking-tighter"
                        style={{
                            color: 'rgba(255,255,255,0.1)',
                            WebkitTextStroke: `2px ${currentData.color}40`,
                        }}
                    >
                        {String(currentSlide + 1).padStart(2, '0')}
                    </motion.span>
                    <div className="w-12 h-0.5 bg-white/20" />
                    <span className="text-xs font-mono text-white/40 tracking-widest">
                        {String(CAROUSEL_DATA.length).padStart(2, '0')}
                    </span>
                </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-30">
                <motion.div
                    key={`progress-${currentSlide}`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="h-full"
                    style={{ backgroundColor: currentData.color }}
                />
            </div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-12 right-12 z-30 flex gap-4">
                <motion.button
                    className="w-14 h-14 rounded-full border-2 flex items-center justify-center backdrop-blur-md bg-black/50"
                    style={{ borderColor: `${currentData.color}50` }}
                    whileHover={{ scale: 1.1, backgroundColor: `${currentData.color}20` }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setDirection(-1);
                        setCurrentSlide((prev) => (prev - 1 + CAROUSEL_DATA.length) % CAROUSEL_DATA.length);
                    }}
                >
                    <ChevronLeft className="w-6 h-6 text-white" style={{ color: currentData.color }} />
                </motion.button>

                <motion.button
                    className="w-14 h-14 rounded-full border-2 flex items-center justify-center backdrop-blur-md bg-black/50"
                    style={{ borderColor: `${currentData.color}50` }}
                    whileHover={{ scale: 1.1, backgroundColor: `${currentData.color}20` }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setDirection(1);
                        setCurrentSlide((prev) => (prev + 1) % CAROUSEL_DATA.length);
                    }}
                >
                    <ChevronRight className="w-6 h-6 text-white" style={{ color: currentData.color }} />
                </motion.button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-12 right-40 z-30 flex gap-3">
                {CAROUSEL_DATA.map((slide, index) => (
                    <motion.button
                        key={slide.id}
                        className="relative w-12 h-1 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                        whileHover={{ scaleY: 2 }}
                        onClick={() => {
                            setDirection(index > currentSlide ? 1 : -1);
                            setCurrentSlide(index);
                        }}
                    >
                        {index === currentSlide && (
                            <motion.div
                                className="absolute inset-0"
                                style={{ backgroundColor: slide.color }}
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

// Custom Cursor Component
function CustomCursor({ mouseX, mouseY, color }: {
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    color: string;
}) {
    return (
        <motion.div
            className="fixed w-8 h-8 rounded-full border-2 pointer-events-none z-50 mix-blend-difference"
            style={{
                borderColor: color,
                left: 0,
                top: 0,
                translateX: mouseX,
                translateY: mouseY,
            }}
            animate={{
                scale: [1, 1.5, 1],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
            }}
        >
            <div
                className="absolute inset-0 rounded-full opacity-50"
                style={{
                    backgroundColor: color,
                    boxShadow: `0 0 20px ${color}`,
                }}
            />
        </motion.div>
    );
}
