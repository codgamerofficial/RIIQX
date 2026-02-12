"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { unlockAchievement } from "@/app/actions/gamification";

export function KonamiCode() {
    const [active, setActive] = useState(false);
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    const [input, setInput] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const nextInput = [...input, e.key];

            // Keep only the last N keys
            if (nextInput.length > konamiCode.length) {
                nextInput.shift();
            }

            setInput(nextInput);

            // Check signature
            if (nextInput.join("") === konamiCode.join("")) {
                setActive(prev => !prev); // Toggle

                // Unlock Achievement
                unlockAchievement("Konami Code").catch(console.error);

                // Sound Effect
                const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3");
                audio.volume = 0.5;
                audio.play().catch(() => { });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [input]);

    useEffect(() => {
        if (active) {
            document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
            document.documentElement.style.transform = "rotate(180deg)";
            document.body.style.overflowX = "hidden";
        } else {
            document.documentElement.style.filter = "";
            document.documentElement.style.transform = "";
        }
    }, [active]);

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-[99999]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Floating Particles for Upside Down Vibe */}
                    <div className="absolute inset-0 bg-[#FF0033]/10 mix-blend-overlay pointer-events-none" />
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[#FF0033] font-black text-4xl uppercase tracking-[0.5em] animate-pulse">
                        THE UPSIDE DOWN
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
