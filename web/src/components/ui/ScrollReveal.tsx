"use client";

import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    threshold?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: number;
    duration?: number;
    delay?: number;
    once?: boolean;
    scale?: number;
    rotate?: number;
    blur?: boolean;
}

export function ScrollReveal({
    children,
    className,
    threshold = 0.1,
    direction = "up",
    distance = 30,
    duration = 0.6,
    delay = 0,
    once = true,
    scale = 1,
    rotate = 0,
    blur = false,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, {
        once,
        margin: "-50px"
    });
    const shouldReduceMotion = useReducedMotion();

    const getInitialTransform = () => {
        switch (direction) {
            case "up":
                return { y: distance };
            case "down":
                return { y: -distance };
            case "left":
                return { x: distance };
            case "right":
                return { x: -distance };
            case "none":
            default:
                return {};
        }
    };

    const variants: Variants = {
        hidden: {
            opacity: 0,
            ...getInitialTransform(),
            scale: scale < 1 ? scale : 1,
            rotate: rotate,
            filter: blur ? "blur(10px)" : "blur(0px)",
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
            transition: {
                duration: shouldReduceMotion ? 0 : duration,
                delay: shouldReduceMotion ? 0 : delay,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className={cn("will-change-transform", className)}
        >
            {children}
        </motion.div>
    );
}

// Staggered children reveal component
interface StaggerRevealProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    threshold?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    once?: boolean;
}

export function StaggerReveal({
    children,
    className,
    staggerDelay = 0.1,
    threshold = 0.1,
    direction = "up",
    once = true,
}: StaggerRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, {
        once,
        margin: "-50px"
    });
    const shouldReduceMotion = useReducedMotion();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
                delayChildren: shouldReduceMotion ? 0 : 0.1,
            },
        },
    };

    const getChildVariants = (): Variants => {
        const distance = 20;
        const initialTransform = (() => {
            switch (direction) {
                case "up":
                    return { y: distance };
                case "down":
                    return { y: -distance };
                case "left":
                    return { x: distance };
                case "right":
                    return { x: -distance };
                case "none":
                default:
                    return {};
            }
        })();

        return {
            hidden: {
                opacity: 0,
                ...initialTransform,
            },
            visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                },
            },
        };
    };

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className={className}
        >
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <motion.div key={index} variants={getChildVariants()}>
                        {child}
                    </motion.div>
                ))
            ) : (
                <motion.div variants={getChildVariants()}>{children}</motion.div>
            )}
        </motion.div>
    );
}

// Text reveal animation component
interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    staggerDelay?: number;
}

export function TextReveal({
    text,
    className,
    delay = 0,
    staggerDelay = 0.03,
}: TextRevealProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const shouldReduceMotion = useReducedMotion();

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
                delayChildren: shouldReduceMotion ? 0 : delay,
            },
        },
    };

    const charVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    if (shouldReduceMotion) {
        return <span className={className}>{text}</span>;
    }

    return (
        <motion.span
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className={cn("inline-flex flex-wrap", className)}
            aria-label={text}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    variants={charVariants}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
}

// Parallax scroll component
interface ParallaxProps {
    children: ReactNode;
    className?: string;
    speed?: number;
    direction?: "up" | "down";
}

import { useScroll, useTransform } from "framer-motion";

export function Parallax({
    children,
    className,
    speed = 0.5,
    direction = "up",
}: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(
        scrollYProgress,
        [0, 1],
        direction === "up" ? [100 * speed, -100 * speed] : [-100 * speed, 100 * speed]
    );

    return (
        <div ref={ref} className={cn("overflow-hidden", className)}>
            <motion.div style={{ y }}>{children}</motion.div>
        </div>
    );
}

// Fade in on scroll with scale
interface FadeInScaleProps {
    children: ReactNode;
    className?: string;
    threshold?: number;
    duration?: number;
    delay?: number;
}

export function FadeInScale({
    children,
    className,
    threshold = 0.1,
    duration = 0.6,
    delay = 0,
}: FadeInScaleProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-50px"
    });
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{
                duration: shouldReduceMotion ? 0 : duration,
                delay: shouldReduceMotion ? 0 : delay,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
