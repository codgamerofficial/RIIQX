"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useRealityStore } from "@/store/reality-store";
import { cn } from "@/lib/utils";

export function HyperCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const pathname = usePathname();
    const mode = useRealityStore((state) => state.mode);

    // Reset interactions on route change
    useEffect(() => {
        setIsHovering(false);
        setIsClicking(false);
    }, [pathname]);

    useEffect(() => {
        const cursor = cursorRef.current;

        const moveCursor = (e: MouseEvent) => {
            // Instant tracking for Arrow
            // Using slightly smoothed but very fast duration for premium feel
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.05,
                ease: "none"
            });
        };

        const handleHoverStart = () => setIsHovering(true);
        const handleHoverEnd = () => setIsHovering(false);
        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        // Re-attach listeners when path changes
        const interpretables = document.querySelectorAll('button, a, input, [role="button"], .clickable');
        interpretables.forEach(el => {
            el.addEventListener('mouseenter', handleHoverStart);
            el.addEventListener('mouseleave', handleHoverEnd);
        });

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);

            interpretables.forEach(el => {
                el.removeEventListener('mouseenter', handleHoverStart);
                el.removeEventListener('mouseleave', handleHoverEnd);
            });
        };
    }, [pathname, mode]);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] mix-blend-exclusion">
            <div
                ref={cursorRef}
                className={cn(
                    "fixed top-0 left-0 transition-transform duration-200 ease-out origin-top-left",
                    isClicking ? "scale-90" : "scale-100",
                    isHovering ? "scale-110" : "scale-100"
                )}
                style={{ willChange: "transform" }}
            >
                {/* Custom Arrow SVG */}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                >
                    <path
                        d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                        fill={mode === 'fashion' ? 'currentColor' : '#D9F99D'} // Primary color or custom
                        className={cn(
                            "transition-colors duration-300",
                            mode === 'fashion' ? "text-primary" : "text-primary"
                        )}
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}
