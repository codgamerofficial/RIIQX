"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHorizontalScroll } from "@/hooks/useScrollAnimation";
import { TextReveal } from "@/components/ui/AnimatedText";
import { MagneticButton } from "@/components/ui/MagneticButton";

const GALLERY_ITEMS = [
    {
        id: 1,
        src: "/assets/hero/slide-captains.jpg",
        title: "Captains Series",
        subtitle: "Lead The Pack"
    },
    {
        id: 2,
        src: "/assets/hero/slide-savage.jpg",
        title: "Savage Mode",
        subtitle: "Unleash Power"
    },
    {
        id: 3,
        src: "/assets/hero/slide-grunge-group.jpg",
        title: "Grunge Aesthetics",
        subtitle: "Raw & Real"
    },
    {
        id: 4,
        src: "/assets/hero/slide-run.jpg",
        title: "Active Performance",
        subtitle: "Push Limits"
    },
    {
        id: 5,
        src: "/assets/hero/slide-ipl-teams-1.jpg",
        title: "Team Spirit",
        subtitle: "United We Stand"
    }
];

export function HorizontalGallery() {
    const { containerRef, scrollRef } = useHorizontalScroll<HTMLDivElement, HTMLDivElement>();
    const galleryCallbackRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        // Optional: Add skew effect based on scroll velocity
        // This would require access to the variable controlling the scroll or a separate ScrollTrigger
        // For now, we rely on the smooth scrubbing of useHorizontalScroll

        // Parallax effect for images can be added here if we had access to individual image refs easily
        const ctx = gsap.context(() => {
            // Skew effect on scroll
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                onUpdate: (self) => {
                    const skew = self.getVelocity() / 300;
                    gsap.to(scrollRef.current, {
                        skewX: skew,
                        overwrite: 'auto',
                        duration: 0.1,
                        ease: "power3.out"
                    });
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [containerRef, scrollRef]);


    return (
        <section ref={containerRef} className="bg-[#0B0B0B] relative h-screen overflow-x-hidden">
            <div className="absolute top-12 left-6 md:left-12 z-20 pointer-events-none mix-blend-difference">
                <div className="flex items-center gap-4 mb-2">
                    <span className="h-px w-12 bg-white"></span>
                    <span className="text-white text-sm font-black uppercase tracking-[0.3em] font-mono">
                        Visual Journey
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tighter">
                    <TextReveal>The Experience</TextReveal>
                </h2>
            </div>

            <div
                ref={scrollRef}
                className="flex h-full w-fit items-center px-6 md:px-12 gap-6 md:gap-12 pt-0 md:pt-0 will-change-transform"
            >
                {GALLERY_ITEMS.map((item, index) => (
                    <div
                        key={item.id}
                        className="relative h-[60vh] md:h-[70vh] w-[85vw] md:w-[45vw] flex-shrink-0 group overflow-hidden border border-white/10 bg-neutral-900"
                    >
                        <div className="absolute inset-0 overflow-hidden transform scale-110 group-hover:scale-100 transition-transform duration-1000 ease-out">
                            <Image
                                src={item.src}
                                alt={item.title}
                                fill
                                className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                        <div className="absolute bottom-0 left-0 w-full p-8 z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="overflow-hidden mb-2">
                                <h3 className="text-3xl md:text-5xl font-black text-white uppercase font-display italic transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                    {item.title}
                                </h3>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-white/60 font-mono text-sm tracking-widest transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-200">
                                    {item.subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Number Indicator - Huge Background */}
                        <div className="absolute -top-10 -right-4 text-white/5 font-black text-[12rem] md:text-[15rem] font-display select-none leading-none group-hover:text-white/10 transition-colors duration-500">
                            0{index + 1}
                        </div>
                    </div>
                ))}

                {/* Premium End Card */}
                <div className="h-[60vh] md:h-[70vh] w-[85vw] md:w-[450px] flex-shrink-0 flex flex-col items-center justify-center bg-accent text-black relative group overflow-hidden border border-accent/20">

                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[url('/assets/noise.png')] mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="relative z-10 text-center px-8">
                        <h3 className="text-6xl md:text-7xl font-black uppercase font-display mb-2 leading-[0.9] tracking-tighter">
                            Your<br />Turn
                        </h3>
                        <p className="font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-10 border-t border-black/20 pt-4 mt-4">
                            Join the movement
                        </p>

                        <Link href="/collections/all">
                            <MagneticButton className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest hover:scale-105 transition-all text-sm shadow-2xl hover:shadow-white/20">
                                Shop Collection
                            </MagneticButton>
                        </Link>
                    </div>

                    {/* Skewed Reveal Element */}
                    <div className="absolute inset-0 bg-black/10 skew-x-12 translate-x-[150%] group-hover:translate-x-[50%] transition-transform duration-1000 ease-out pointer-events-none" />
                </div>
            </div>
        </section>
    );
}
