"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

export function HeroElectronics() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    return (
        <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">

            {/* 2D Cyber Background */}
            <div className="absolute inset-0 z-0">
                {/* Cyber Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                {/* Glow Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            {/* Content Layer (Minimal) */}
            <div className="relative z-10 text-center space-y-4 pointer-events-none mix-blend-overlay">
                <div className="overflow-hidden">
                    <h1 ref={textRef} className="text-8xl md:text-[12rem] font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 opacity-80">
                        RIIQX
                    </h1>
                </div>
            </div>

            {/* Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%] pointer-events-none" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] z-[6] pointer-events-none" />
        </section>
    );
}
