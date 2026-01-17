"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRealityStore } from "@/store/reality-store";

gsap.registerPlugin(ScrollTrigger);

export function DualScrollLayout({ children }: { children: React.ReactNode }) {
    const container = useRef<HTMLDivElement>(null);
    const setMode = useRealityStore((state) => state.setMode);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Find sections marked with data-switch-mode
            const sections = document.querySelectorAll("[data-switch-mode]");

            sections.forEach((section) => {
                const mode = section.getAttribute("data-switch-mode") as 'fashion' | 'electronics';

                ScrollTrigger.create({
                    trigger: section,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => setMode(mode),
                    onEnterBack: () => setMode(mode),
                    // Optional: reverting to mixed when leaving both?
                    // For now, let's keep the mode sticky
                });
            });

        }, container);

        return () => ctx.revert();
    }, [setMode]);

    return (
        <div ref={container} className="relative w-full">
            {children}
        </div>
    );
}
