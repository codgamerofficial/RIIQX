"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
    const pathname = usePathname();
    const shouldReduceMotion = useReducedMotion();
    // Removed artificial delay which might cause stuck states
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(false);
    }, [pathname]);

    const variants = {
        initial: {
            opacity: 1, // Changed from 0 to 1 to prevent black screen stuck state
            y: shouldReduceMotion ? 0 : 20,
            scale: shouldReduceMotion ? 1 : 0.98,
            filter: shouldReduceMotion ? "blur(0px)" : "blur(10px)",
        },
        enter: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: shouldReduceMotion ? 0 : 0.5,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.05,
            },
        },
        exit: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : -10,
            scale: shouldReduceMotion ? 1 : 0.99,
            filter: shouldReduceMotion ? "blur(0px)" : "blur(5px)",
            transition: {
                duration: shouldReduceMotion ? 0 : 0.3,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const progressVariants = {
        initial: { scaleX: 0, opacity: 1 },
        enter: {
            scaleX: 1,
            opacity: 0,
            transition: {
                scaleX: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3, delay: 0.5 }
            }
        },
        exit: {
            scaleX: 0,
            opacity: 1,
            transition: { duration: 0.2 }
        },
    };

    return (
        <div className={cn("w-full min-h-screen", className)}>
            {/* Page Content - simplified to ensure visibility */}
            <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
        </div>
    );
}

// Section transition for within-page animations
interface SectionTransitionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function SectionTransition({ children, className, delay = 0 }: SectionTransitionProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                delay: shouldReduceMotion ? 0 : delay,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Content fade in for lists/grids
interface ContentFadeInProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function ContentFadeIn({ children, className, staggerDelay = 0.1 }: ContentFadeInProps) {
    const shouldReduceMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        {child}
                    </motion.div>
                ))
            ) : (
                <motion.div variants={itemVariants}>{children}</motion.div>
            )}
        </motion.div>
    );
}
