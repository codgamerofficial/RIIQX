"use client";

import { ReactLenis } from "@studio-freight/react-lenis";

export function LivingScrollProvider({ children }: { children: any }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.07, // Heavier, more cinematic feel
                duration: 1.2,
                smoothWheel: true,
                wheelMultiplier: 1.1, // slightly faster response 
                touchMultiplier: 2,
            }}
        >
            {children}
        </ReactLenis>
    );
}
