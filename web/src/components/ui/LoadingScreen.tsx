/**
 * Loading Screen Component
 * Premium loading experience with logo animation and progress counter
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
    isLoading: boolean;
    onComplete?: () => void;
}

export function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isLoading) return;

        const duration = 2000; // 2 seconds
        const interval = 20; // Update every 20ms
        const steps = duration / interval;
        const increment = 100 / steps;

        let currentProgress = 0;
        const timer = setInterval(() => {
            currentProgress += increment;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(timer);
                setTimeout(() => {
                    onComplete?.();
                }, 300);
            }
            setProgress(Math.min(currentProgress, 100));
        }, interval);

        return () => clearInterval(timer);
    }, [isLoading, onComplete]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B0B0B]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Logo Animation */}
                    <div className="relative flex flex-col items-center gap-8">
                        <motion.div
                            className="text-6xl font-black text-white font-display"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            RIIQX
                        </motion.div>

                        {/* Progress Bar */}
                        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-accent via-accent-purple to-accent-lime"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>

                        {/* Progress Counter */}
                        <motion.div
                            className="text-sm text-white/50 font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {Math.round(progress)}%
                        </motion.div>
                    </div>

                    {/* Particle Burst on Complete */}
                    {progress === 100 && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.6 }}
                        >
                            {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-accent rounded-full"
                                    style={{
                                        left: "50%",
                                        top: "50%",
                                    }}
                                    initial={{ scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        x: Math.cos((i / 20) * Math.PI * 2) * 200,
                                        y: Math.sin((i / 20) * Math.PI * 2) * 200,
                                    }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
