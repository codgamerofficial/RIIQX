"use client";

import { useEffect, useRef } from "react";
import ReactLenis, { useLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";

/**
 * LivingScrollProvider
 * Wraps the application in a smooth scroll context.
 * Calculates scroll velocity and skews the entire viewport slightly to create a "warp" effect.
 */
export function LivingScrollProvider({ children }: { children: React.ReactNode }) {
    const contentRef = useRef<HTMLDivElement>(null);

    // Use Lenis hook to access scroll data
    useLenis((lenis: any) => {
        const { velocity } = lenis;
        // Velocity comes in pixels per frame roughly.
        // We clamp it to avoid excessive distortion.
        const skewAmount = Math.max(Math.min(velocity * 0.05, 5), -5);
        const scaleAmount = 1 - Math.min(Math.abs(velocity * 0.0005), 0.05);

        // Apply strict hardware accelerated transforms
        if (contentRef.current) {
            // "Jelly" effect: Skew Y based on velocity
            gsap.set(contentRef.current, {
                skewY: skewAmount,
                scale: scaleAmount,
                transformOrigin: "center center",
                overwrite: true,
                force3D: true
            });
        }
    });

    return (
        <ReactLenis root>
            <div
                ref={contentRef}
                className="w-full min-h-screen will-change-transform"
                style={{ perspective: "1000px" }}
            >
                {children}
            </div>
        </ReactLenis>
    );
}
