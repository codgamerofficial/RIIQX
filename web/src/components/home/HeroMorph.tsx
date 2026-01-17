"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function HeroMorph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // 1. Text Morphing (Scale + Blur + Split)
            gsap.fromTo(textRef.current,
                { scale: 0.8, filter: "blur(10px)", opacity: 0 },
                {
                    scale: 1, filter: "blur(0px)", opacity: 1,
                    duration: 1.5, ease: "power3.out"
                }
            );

            const tl = gsap.timeline({
                scrollTrigger: {
                    target: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                    pin: true,
                }
            });

            // 2. Timeline Scan Effect
            // A scanning laser moves down the screen
            tl.to(".laser-scan", { top: "100%", opacity: 0, duration: 1 });

            // 3. Central Panel Expansion (Infinite Morph)
            // The central card expands to fill the screen, then fades out to reveal next content
            tl.to(panelRef.current, {
                width: "100vw",
                height: "100vh",
                borderRadius: "0px",
                borderWidth: "0px",
                backgroundColor: "#000",
                duration: 1
            }, 0); // At same time

            // 4. Content inside panel glitch-switches
            tl.to(".morph-content", {
                opacity: 0,
                duration: 0.1,
                onComplete: () => {
                    // Could swap content here logically if needed
                }
            }, 0.5);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">

            {/* Background Data Streams */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 font-mono text-xs text-primary animate-pulse">
                    initiating_morph_sequence... <br />
                    target_lock: active
                </div>
                {/* Matrix-like rain or grid lines could go here */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* Laser Scan Line */}
            <div className="laser-scan absolute top-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_20px_#ff003c] z-50"></div>

            {/* Main Holographic Panel */}
            <div
                ref={panelRef}
                className="relative z-10 w-[80vw] h-[60vh] border border-primary/50 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center overflow-hidden holo-glass"
            >
                <div className="morph-content text-center">
                    <h1 ref={textRef} className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 hover-glitch cursor-none">
                        RIIQX<span className="text-primary text-4xl align-top">2050</span>
                    </h1>
                    <p className="mt-4 font-mono text-secondary tracking-[0.5em] text-sm animate-pulse">
                        &lt; SYSTEM_EVOLVED /&gt;
                    </p>
                </div>

                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent"></div>
            </div>

        </section>
    );
}
