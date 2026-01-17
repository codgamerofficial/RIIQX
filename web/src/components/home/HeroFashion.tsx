"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * HeroFashion
 * The "Organic" reality mode.
 * Features: Soft gradients, serif typography, floating cloth simulation (CSS/GSAP), warm lighting.
 */
export function HeroFashion() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Soft entry animation
            gsap.fromTo(titleRef.current,
                { y: 100, opacity: 0, filter: "blur(20px)" },
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 2, ease: "power4.out" }
            );

            // Floating background blobs
            gsap.to(".blob", {
                y: "random(-50, 50)",
                x: "random(-50, 50)",
                rotation: "random(-180, 180)",
                duration: "random(10, 20)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0505]">

            {/* Organic Background */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen">
                <div className="blob absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[100px] opacity-60" />
                <div className="blob absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary rounded-full blur-[120px] opacity-40 animate-pulse" />
                <div className="blob absolute top-1/2 left-1/2 w-64 h-64 bg-accent rounded-full blur-[80px] opacity-30" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-6 max-w-full px-4">
                <div className="overflow-hidden">
                    <h1 ref={titleRef} className="text-5xl sm:text-7xl md:text-[10rem] font-serif italic text-white/90 leading-none tracking-tighter mix-blend-overlay">
                        Astral <span className="font-light not-italic">Fit</span>
                    </h1>
                </div>

                <p className="font-sans text-white/50 tracking-[0.3em] uppercase text-sm animate-fade-in">
                    Fluidity • Elegance • Emotion
                </p>

                {/* Fashion CTA - Soft Pill */}
                <button className="mt-8 px-8 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-all text-white backdrop-blur-md hover:scale-105 active:scale-95 duration-500">
                    Explore Collection
                </button>
            </div>

            {/* Foregound Atmosphere (Dust motes) */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>
        </section>
    );
}
