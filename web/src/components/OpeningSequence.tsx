"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function OpeningSequence({ onComplete, products = [] }: { onComplete: () => void; products?: any[] }) {
    const [isVisible, setIsVisible] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [isLooping, setIsLooping] = useState(true);

    // Filter valid images (ensure accessible URLs)
    const validProducts = products.filter(p => p?.featuredImage?.url || p?.images?.[0]?.url);
    const images = validProducts.map(p => p.featuredImage?.url || p.images[0].url);

    useEffect(() => {
        // Preload images
        images.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        // Fast Loop Animation (Hype Cycle)
        const loopInterval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % (images.length || 1));
        }, 350); // Fast pacing for hype

        // End loop and enter after 3.5s
        const timer = setTimeout(() => {
            clearInterval(loopInterval);
            setIsLooping(false);
            // Auto enter or show "Enter" button? User likely wants auto-reveal or button.
            // Keeping existing logic: Show Enter button or Auto if desired.
            // Let's make it auto-transition to a "Logo Reveal" then allow enter
        }, 3500);

        return () => {
            clearInterval(loopInterval);
            clearTimeout(timer);
        };
    }, [images.length]);

    const handleEnter = () => {
        setIsVisible(false);
        setTimeout(onComplete, 1000);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden cursor-pointer"
                    initial={{ opacity: 1 }}
                    exit={{
                        y: "-100%",
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                    onClick={handleEnter}
                >
                    {/* Background Product Loop */}
                    <div className="absolute inset-0 z-0 opacity-40 mix-blend-color-dodge">
                        <AnimatePresence mode="popLayout">
                            {images.length > 0 && isLooping && (
                                <motion.img
                                    key={currentImage}
                                    src={images[currentImage]}
                                    alt="Sequence"
                                    initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                        {/* Glitch RIIQX Text */}
                        <div className="relative">
                            <motion.h1
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.5, opacity: 0 }}
                                className="text-[15vw] font-black text-white italic tracking-tighter mix-blend-difference"
                            >
                                RIIQX
                            </motion.h1>
                            {/* Glitch Layers */}
                            <motion.h1
                                animate={{
                                    x: [-2, 2, -2],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{ repeat: Infinity, duration: 0.1 }}
                                className="absolute top-0 left-0 text-[15vw] font-black text-[#B4F000] italic tracking-tighter mix-blend-screen opacity-50 z-[-1] ml-[2px]"
                            >
                                RIIQX
                            </motion.h1>
                            <motion.h1
                                animate={{
                                    x: [2, -2, 2],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{ repeat: Infinity, duration: 0.1 }}
                                className="absolute top-0 left-0 text-[15vw] font-black text-red-600 italic tracking-tighter mix-blend-screen opacity-50 z-[-1] -ml-[2px]"
                            >
                                RIIQX
                            </motion.h1>
                        </div>

                        {/* Status/Call to Action */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="mt-8"
                        >
                            {!isLooping ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEnter(); }}
                                    className="px-8 py-3 bg-[#B4F000] text-black font-black uppercase tracking-[0.2em] transform hover:scale-105 transition-transform"
                                >
                                    Enter System
                                </button>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-1 bg-white/20 overflow-hidden rounded-full">
                                        <motion.div
                                            className="h-full bg-[#B4F000]"
                                            animate={{ width: ["0%", "100%"] }}
                                            transition={{ duration: 3.5, ease: "linear" }}
                                        />
                                    </div>
                                    <span className="text-[9px] font-mono text-[#B4F000] uppercase tracking-widest animate-pulse">
                                        Loading Assets...
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Scanlines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[50] bg-[length:100%_2px,3px_100%] pointer-events-none" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
