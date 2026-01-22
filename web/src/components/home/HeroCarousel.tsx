"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const HERO_SLIDES = [
    {
        id: 1,
        image: "/assets/carousel/slide-1-streetwear.png",
        title: "FASHION STREETWEAR",
        subtitle: "WEAR YOUR STORY....",
        description: "Bold designs that speak your language",
        link: "/streetwear",
        cta: "SHOP STREETWEAR",
        theme: "neon-green",
        badge: "TRENDING NOW"
    },
    {
        id: 2,
        image: "/assets/carousel/slide-2-product.png",
        title: "OUR PRODUCT",
        subtitle: "Global Quality, Local Pride",
        description: "Discover our curated collection",
        link: "/shop",
        cta: "EXPLORE CATALOG",
        theme: "white",
        badge: "2M+ CUSTOMERS"
    },
    {
        id: 3,
        image: "/assets/carousel/slide-3-vision.png",
        title: "QUIT TALKING",
        subtitle: "AND START DOING",
        description: "Join the movement of action-takers",
        link: "/about",
        cta: "OUR VISION",
        theme: "orange-red",
        badge: "EST. 2024"
    },
    {
        id: 4,
        image: "/assets/carousel/slide-4-history.png",
        title: "OUR HISTORY",
        subtitle: "Loading...",
        description: "A journey of innovation and excellence",
        link: "/about",
        cta: "DISCOVER JOURNEY",
        theme: "grayscale",
        badge: "SINCE 2024"
    },
    {
        id: 5,
        image: "/assets/carousel/slide-5-service.png",
        title: "OUR BEST SERVICE",
        subtitle: "Experience Excellence",
        description: "Premium support, every step of the way",
        link: "/shop",
        cta: "GET STARTED",
        theme: "neon-vibrant",
        badge: "24/7 SUPPORT"
    }
];

export function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parallax transforms
    const parallaxX = useTransform(mouseX, [-500, 500], [-20, 20]);
    const parallaxY = useTransform(mouseY, [-500, 500], [-20, 20]);

    // Auto-advance with progress
    useEffect(() => {
        if (isPaused) return;

        const duration = 6000; // 6 seconds
        const interval = 50; // Update every 50ms
        const increment = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    setCurrentSlide((current) => (current + 1) % HERO_SLIDES.length);
                    return 0;
                }
                return prev + increment;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [currentSlide, isPaused]);

    // Mouse move handler for parallax
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
    };

    const slide = HERO_SLIDES[currentSlide];


    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative w-full h-[70vh] md:h-[90vh] bg-black overflow-hidden font-sans group"
        >


            {/* Background Image with Parallax */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
                    className="absolute inset-0 z-0"
                >
                    <motion.div
                        style={{
                            x: parallaxX,
                            y: parallaxY,
                        }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover object-center"
                            priority
                            quality={95}
                        />
                    </motion.div>

                    {/* Subtle Bottom Gradient for Button Visibility */}
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                </motion.div>
            </AnimatePresence>

            {/* Preload Next Slide Image (Hidden) */}
            <div className="hidden">
                <Image
                    src={HERO_SLIDES[(currentSlide + 1) % HERO_SLIDES.length].image}
                    alt="preload"
                    width={10}
                    height={10}
                    priority
                />
            </div>

            {/* Floating Badge */}
            <motion.div
                key={`badge-${slide.id}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                className="absolute top-8 right-8 z-20"
            >
                <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-gold/50 rounded-full">
                    <span className="text-gold text-xs font-bold tracking-[0.2em] uppercase">
                        {slide.badge}
                    </span>
                </div>
            </motion.div>

            {/* CTA Button - Bottom Center */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
                <motion.div
                    key={`cta-${slide.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Link href={slide.link}>
                        <motion.button
                            className="group/btn relative px-10 py-5 bg-white text-black font-bold text-lg uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-2xl"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Button Background Animation */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-cherry-red via-red-500 to-gold"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            />

                            <span className="relative z-10 flex items-center gap-3">
                                {slide.cta}
                                <motion.svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="group-hover/btn:translate-x-1 transition-transform"
                                >
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </motion.svg>
                            </span>
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/10">
                <motion.div
                    className="h-full bg-gradient-to-r from-cherry-red via-red-500 to-gold"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.05 }}
                />
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {HERO_SLIDES.map((s, idx) => (
                    <button
                        key={s.id}
                        onClick={() => {
                            setCurrentSlide(idx);
                            setProgress(0);
                        }}
                        className="group/indicator relative"
                        aria-label={`Go to slide ${idx + 1}`}
                    >
                        <motion.div
                            className={`transition-all duration-500 rounded-full ${currentSlide === idx
                                ? "w-12 h-2 bg-white"
                                : "w-2 h-2 bg-white/30 hover:bg-white/60"
                                }`}
                            whileHover={{ scale: 1.2 }}
                        />

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/indicator:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-black/90 backdrop-blur-sm px-3 py-1 rounded text-white text-xs whitespace-nowrap">
                                {s.title}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={() => {
                    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
                    setProgress(0);
                }}
                className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 text-white/30 hover:text-white transition-all hidden md:block group/arrow"
                aria-label="Previous slide"
            >
                <motion.div
                    whileHover={{ scale: 1.2, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.div>
            </button>

            <button
                onClick={() => {
                    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
                    setProgress(0);
                }}
                className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 text-white/30 hover:text-white transition-all hidden md:block group/arrow"
                aria-label="Next slide"
            >
                <motion.div
                    whileHover={{ scale: 1.2, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 5l7 7-7 7" />
                    </svg>
                </motion.div>
            </button>

            {/* Slide Counter */}
            <div className="absolute top-8 left-8 z-20 text-white/60 font-mono text-sm">
                <span className="text-white font-bold text-2xl">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="mx-2">/</span>
                <span>{String(HERO_SLIDES.length).padStart(2, '0')}</span>
            </div>
        </div>
    );
}
