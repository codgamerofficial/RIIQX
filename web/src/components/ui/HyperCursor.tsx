"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export function HyperCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Reset on page change
        setIsHovering(false);
    }, [pathname]);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        const moveCursor = (e: MouseEvent) => {
            // Direct follow for the center dot
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
            // Lazy follow for the outer ring
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: "expo.out"
            });
        };

        const handleHoverStart = () => setIsHovering(true);
        const handleHoverEnd = () => setIsHovering(false);

        // Attach listeners to all interactive elements
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
    }, [pathname]); // Re-run when route changes to attach to new elements

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] mix-blend-exclusion">
            {/* Center Dot (Sniper Core) */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
            />
            {/* Outer Ring (Target Lock) */}
            <div
                ref={followerRef}
                className={`fixed top-0 left-0 border border-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center
                    ${isHovering ? "w-12 h-12 border-primary border-2 rotate-90" : "w-8 h-8 rotate-0"}`}
            >
                {/* Crosshair details inside ring */}
                <div className={`w-full h-[1px] bg-white/30 absolute ${isHovering ? "w-[120%]" : "w-0"} transition-all`} />
                <div className={`h-full w-[1px] bg-white/30 absolute ${isHovering ? "h-[120%]" : "h-0"} transition-all`} />
            </div>

            {/* Data Text next to cursor */}
            <div
                ref={followerRef} // Attach to follower movement but offset? transform via css? 
            // Using a separate ref tracking for text if needed, for now attaching visually via simple absolute 
            />
        </div>
    );
}
