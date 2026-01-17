"use client";

import { useRealityStore } from "@/store/reality-store";
import { HeroElectronics } from "./HeroElectronics";
import { HeroFashion } from "./HeroFashion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export function AdaptiveHero() {
    const mode = useRealityStore((state) => state.mode);

    // Sync body data-attribute for global theme
    useEffect(() => {
        document.body.setAttribute("data-mode", mode === 'mixed' ? 'electronics' : mode);
    }, [mode]);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-background transition-colors duration-1000">
            <AnimatePresence mode="wait">
                {mode === 'fashion' ? (
                    <motion.div
                        key="fashion"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <HeroFashion />
                    </motion.div>
                ) : (
                    <motion.div
                        key="electronics"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <HeroElectronics />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reality Switcher (Debug/User Control) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex gap-4 backdrop-blur-md bg-black/50 p-2 rounded-full border border-white/10">
                <button
                    onClick={() => useRealityStore.getState().setMode('fashion')}
                    className={`px-4 py-1 rounded-full text-xs uppercase tracking-widest transition-all ${mode === 'fashion' ? 'bg-primary text-black' : 'text-white/50 hover:text-white'}`}
                >
                    Fashion
                </button>
                <button
                    onClick={() => useRealityStore.getState().setMode('electronics')}
                    className={`px-4 py-1 rounded-full text-xs uppercase tracking-widest transition-all ${mode === 'electronics' ? 'bg-secondary text-black' : 'text-white/50 hover:text-white'}`}
                >
                    Electronics
                </button>
            </div>
        </div>
    );
}
