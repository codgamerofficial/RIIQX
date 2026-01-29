"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    const variants = {
        initial: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
        },
        enter: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for smooth effect
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            filter: "blur(10px)",
            transition: {
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={variants}
                className="w-full"
            >
                {/* 
                    Optional: Add a persistent loading bar or overlay here during transitions 
                    for a more cinematic feel 
                */}
                <motion.div
                    className="fixed top-0 left-0 h-1 bg-accent z-50 pointer-events-none"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    exit={{ width: "100%", opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {children}
            </motion.div>
        </AnimatePresence>
    );
}
