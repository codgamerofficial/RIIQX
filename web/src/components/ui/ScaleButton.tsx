"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ScaleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    scale?: number;
}

export function ScaleButton({ children, className, scale = 0.96, ...props }: ScaleButtonProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.button
            whileTap={shouldReduceMotion ? {} : { scale }}
            transition={{
                duration: 0.12,
                ease: [0.2, 0, 0, 1]
            }}
            className={cn(
                "transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                className
            )}
            {...props as any}
        >
            {children}
        </motion.button>
    );
}

// Hover scale button with smooth transitions
interface HoverScaleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    hoverScale?: number;
    tapScale?: number;
}

export function HoverScaleButton({
    children,
    className,
    hoverScale = 1.05,
    tapScale = 0.98,
    ...props
}: HoverScaleButtonProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: hoverScale }}
            whileTap={shouldReduceMotion ? {} : { scale: tapScale }}
            transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
            }}
            className={cn(
                "transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                className
            )}
            {...props as any}
        >
            {children}
        </motion.button>
    );
}

// Magnetic button effect
interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    magneticStrength?: number;
}

export function MagneticButton({
    children,
    className,
    magneticStrength = 0.3,
    ...props
}: MagneticButtonProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.button
            whileHover={shouldReduceMotion ? {} : {
                x: [0, -2, 2, -2, 0],
                y: [0, -2, 2, -2, 0],
            }}
            transition={{
                duration: 0.5,
                ease: "easeInOut"
            }}
            className={cn(
                "transition-colors duration-200 focus:outline-none",
                className
            )}
            {...props as any}
        >
            {children}
        </motion.button>
    );
}
