"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function OpeningSequence({ onComplete }: { onComplete: () => void }) {
    const [isVisible, setIsVisible] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simulate asset loading
        const timer = setTimeout(() => setIsLoaded(true), 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleEnter = () => {
        setIsVisible(false);
        setTimeout(onComplete, 1200); // Wait for exit animation
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden cursor-pointer"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.1,
                        filter: "blur(20px)",
                        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                    }}
                    onClick={isLoaded ? handleEnter : undefined}
                >
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                        {/* Glitch/Distortion Layers */}
                        <motion.div
                            initial={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                            animate={{ opacity: 0.5, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 2, filter: "blur(50px)" }}
                            transition={{ duration: 2, ease: "circOut" }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <h1 className="text-[12vw] md:text-[15vw] font-black text-red-600/20 mix-blend-color-dodge ml-2 mt-2">RIIQX</h1>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                            animate={{ opacity: 0.5, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 2, filter: "blur(50px)" }}
                            transition={{ duration: 2, ease: "circOut", delay: 0.1 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <h1 className="text-[12vw] md:text-[15vw] font-black text-blue-600/20 mix-blend-color-dodge -ml-2 -mt-2">RIIQX</h1>
                        </motion.div>

                        {/* Main Title */}
                        <div className="overflow-hidden relative z-10">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-150%", opacity: 0 }}
                                transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                                className="text-[12vw] md:text-[15vw] font-black text-white leading-none tracking-tighter mix-blend-difference"
                            >
                                RIIQX
                            </motion.h1>
                        </div>

                        {/* Interactive Enter Button / Loading State */}
                        <div className="absolute bottom-12 md:bottom-24 z-20">
                            <AnimatePresence mode="wait">
                                {!isLoaded ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        <div className="w-48 h-[2px] bg-white/10 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-white"
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 2.5, ease: "easeInOut" }}
                                            />
                                        </div>
                                        <div className="font-mono text-xs text-white/50 uppercase tracking-widest animate-pulse">
                                            Initializing System...
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="enter"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.05, letterSpacing: "0.5em" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => { e.stopPropagation(); handleEnter(); }}
                                        className="group relative px-8 py-4 bg-transparent overflow-hidden"
                                    >
                                        <span className="relative z-10 font-black text-xl md:text-2xl text-white uppercase tracking-[0.3em] transition-all duration-500 group-hover:text-black mix-blend-difference">
                                            [ Enter ]
                                        </span>
                                        <motion.div
                                            className="absolute inset-0 bg-white"
                                            initial={{ scaleX: 0 }}
                                            whileHover={{ scaleX: 1 }}
                                            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                                            style={{ originX: 0.5 }}
                                        />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
