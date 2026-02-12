"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [bootText, setBootText] = useState<string[]>([]);

    const bootSequence = [
        "INITIALIZING RIIQX KERNEL...",
        "LOADING ASSETS... [OK]",
        "ESTABLISHING SECURE CONNECTION...",
        "SYNCING QUANTUM DATA...",
        "OPTIMIZING NEURAL NETWORKS...",
        "SYSTEM READY."
    ];

    useEffect(() => {
        // Check session storage
        const hasLoaded = sessionStorage.getItem("riiqx_loaded");
        if (hasLoaded) {
            setIsLoading(false);
            return;
        }

        // Simulate boot sequence text
        let textIndex = 0;
        const textInterval = setInterval(() => {
            if (textIndex < bootSequence.length) {
                setBootText(prev => [...prev, bootSequence[textIndex]]);
                textIndex++;
            } else {
                clearInterval(textInterval);
            }
        }, 400);

        // Simulate progress bar
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 10;
                if (next > 100) {
                    clearInterval(interval);
                    return 100;
                }
                return next;
            });
        }, 150);

        const timer = setTimeout(() => {
            setIsLoading(false);
            sessionStorage.setItem("riiqx_loaded", "true");
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
            clearInterval(textInterval);
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-mono"
                    exit={{
                        y: "-100%",
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                >
                    {/* Scanlines Overlay */}
                    <div className="absolute inset-0 scanlines opacity-50 pointer-events-none z-10" />

                    <div className="relative z-20 flex flex-col items-center w-full max-w-md px-4">
                        {/* Glitch Logo */}
                        <div className="relative mb-12">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative w-48 h-12 md:w-64 md:h-16"
                            >
                                <Image
                                    src="/riiqx-logo-animated.png"
                                    alt="RIIQX"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                        </div>

                        {/* Boot Sequence Text */}
                        <div className="w-full h-32 mb-8 flex flex-col justify-end items-start text-xs text-[#B4F000]/70 space-y-1 pl-4 border-l-2 border-[#B4F000]/20">
                            {bootText.map((text, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-[#B4F000]">{">"}</span>
                                    {text}
                                </motion.div>
                            ))}
                        </div>

                        {/* Loading Bar */}
                        <div className="w-full h-1 bg-white/10 relative overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-[#B4F000]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${Math.min(100, progress)}%` }}
                            />
                        </div>
                        <div className="mt-2 flex justify-between w-full text-[10px] text-[#B4F000]">
                            <span>LOADING_RESOURCES</span>
                            <span>{Math.floor(progress)}%</span>
                        </div>
                    </div>

                    {/* Footer Text */}
                    <div className="absolute bottom-12 text-white/20 text-[10px] tracking-[0.2em] uppercase">
                        RIIQX_SYSTEM_V2.0 // ONLINE
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
