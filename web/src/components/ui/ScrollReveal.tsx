"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    threshold?: number; // 0 to 1
    direction?: "up" | "down" | "none";
    distance?: number;
}

export function ScrollReveal({
    children,
    className,
    threshold = 0.1,
    direction = "up",
    distance = 12
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["0 1", `0 ${1 - threshold}`]
    });

    // GPU-accelerated opacity transition based on scroll position
    const opacity = useSpring(scrollYProgress, {
        stiffness: 400,
        damping: 30,
        restDelta: 0.001
    });

    // Optional directional movement
    const yRange = direction === "up" ? [distance, 0] : direction === "down" ? [-distance, 0] : [0, 0];
    const y = useTransform(scrollYProgress, [0, 1], yRange);

    // If reduced motion is preferred, just show content instantly
    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            ref={ref}
            style={{ opacity, y }}
            className={cn("will-change-transform", className)}
        >
            {children}
        </motion.div>
    );
}
