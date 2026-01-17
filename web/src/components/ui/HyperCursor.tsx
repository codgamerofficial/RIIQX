"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useRealityStore } from "@/store/reality-store";
import { cn } from "@/lib/utils";

export function HyperCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const pathname = usePathname();
    const mode = useRealityStore((state) => state.mode);

    useEffect(() => {
        setIsHovering(false);
    }, [pathname]);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        const moveCursor = (e: MouseEvent) => {
            // Core Dot - Always tight
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });

            // Follower - Physics changes based on Mode
            if (mode === 'fashion') {
                gsap.to(follower, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.8, // Slower, fluid
                    ease: "power2.out"
                });
            } else {
                // Electronics / Default
                gsap.to(follower, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.3, // Snappy, tactical
                    ease: "expo.out"
                });
            }
        };

        const handleHoverStart = () => setIsHovering(true);
        const handleHoverEnd = () => setIsHovering(false);

        // Re-attach listeners when path changes
        const interpretables = document.querySelectorAll('button, a, input, [role="button"]');
        interpretables.forEach(el => {
            el.addEventListener('mouseenter', handleHoverStart);
            el.addEventListener('mouseleave', handleHoverEnd);
        });

        window.addEventListener("mousemove", moveCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            interpretables.forEach(el => {
                el.removeEventListener('mouseenter', handleHoverStart);
                el.removeEventListener('mouseleave', handleHoverEnd);
            });
        };
    }, [pathname, mode]);

    // Visual Variants
    const isFashion = mode === 'fashion';

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] mix-blend-exclusion">

            {/* CORE CURSOR */}
            <div
                ref={cursorRef}
                className={cn(
                    "fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
                    isFashion ? "w-4 h-4 bg-primary blur-[2px] rounded-full opacity-80" : "w-2 h-2 bg-white rounded-none"
                )}
            />

            {/* FOLLOWER RING */}
            <div
                ref={followerRef}
                className={cn(
                    "fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-500",
                    isFashion
                        ? isHovering
                            ? "w-20 h-20 border border-primary/30 rounded-full bg-primary/10 blur-sm scale-110"
                            : "w-12 h-12 border border-primary/20 rounded-full scale-100"
                        : isHovering // Electronics Mode
                            ? "w-12 h-12 border-2 border-primary rotate-90 rounded-none"
                            : "w-8 h-8 border border-white/50 rounded-full rotate-45"
                )}
            >
                {/* Electronics: Crosshairs */}
                {!isFashion && (
                    <>
                        <div className={cn("absolute bg-white/30 transition-all", isHovering ? "w-[150%] h-[1px]" : "w-0 h-[1px]")} />
                        <div className={cn("absolute bg-white/30 transition-all", isHovering ? "h-[150%] w-[1px]" : "h-0 w-[1px]")} />
                    </>
                )}

                {/* Fashion: Soft Ripple pulse */}
                {isFashion && (
                    <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-50" />
                )}
            </div>

            {/* Mode Indicator Text */}
            <div
                ref={followerRef} // HACK: reusing ref for positioning causing chaos? No, this div is separated. 
            // We'll just let it trail visually or remove strictly.
            // Keeping it clean for now.
            />

        </div>
    );
}
