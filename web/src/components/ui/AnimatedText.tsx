/**
 * Animated Text Components
 * Text reveal, split text, gradient text, glitch, and typewriter effects
 */

"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// SPLIT TEXT - Character/Word/Line Splitting
// ============================================================================

interface SplitTextProps {
    children: string;
    className?: string;
    splitBy?: "char" | "word" | "line";
    staggerDelay?: number;
    animationDelay?: number;
}

export function SplitText({
    children,
    className,
    splitBy = "char",
    staggerDelay = 0.03,
    animationDelay = 0,
}: SplitTextProps) {
    const elements = useMemo(() => {
        if (splitBy === "char") {
            return children.split("");
        } else if (splitBy === "word") {
            return children.split(" ");
        } else {
            return children.split("\n");
        }
    }, [children, splitBy]);

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: animationDelay,
            },
        },
    };

    const child: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
    };

    return (
        <motion.span
            className={cn("inline-block", className)}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    variants={child}
                    style={splitBy === "word" ? { marginRight: "0.25em" } : undefined}
                >
                    {element === " " ? "\u00A0" : element}
                </motion.span>
            ))}
        </motion.span>
    );
}

// ============================================================================
// TEXT REVEAL - Clip Path Reveal
// ============================================================================

interface TextRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

export function TextReveal({
    children,
    className,
    delay = 0,
    direction = "up",
}: TextRevealProps) {
    const getClipPath = () => {
        switch (direction) {
            case "up":
                return {
                    hidden: "inset(100% 0% 0% 0%)",
                    visible: "inset(0% 0% 0% 0%)",
                };
            case "down":
                return {
                    hidden: "inset(0% 0% 100% 0%)",
                    visible: "inset(0% 0% 0% 0%)",
                };
            case "left":
                return {
                    hidden: "inset(0% 100% 0% 0%)",
                    visible: "inset(0% 0% 0% 0%)",
                };
            case "right":
                return {
                    hidden: "inset(0% 0% 0% 100%)",
                    visible: "inset(0% 0% 0% 0%)",
                };
        }
    };

    const clipPath = getClipPath();

    return (
        <div className="relative overflow-hidden">
            <motion.div
                className={className}
                initial={{ clipPath: clipPath.hidden }}
                animate={{ clipPath: clipPath.visible }}
                transition={{
                    duration: 1,
                    delay,
                    ease: [0.65, 0, 0.35, 1],
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}

// ============================================================================
// GRADIENT TEXT - Animated Gradient
// ============================================================================

interface GradientTextProps {
    children: ReactNode;
    className?: string;
    colors?: string[];
    animate?: boolean;
}

export function GradientText({
    children,
    className,
    colors = ["#00F0FF", "#7C3AED", "#CCFF00"],
    animate = true,
}: GradientTextProps) {
    const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;

    return (
        <motion.span
            className={cn("bg-clip-text text-transparent", className)}
            style={{
                backgroundImage: gradient,
                backgroundSize: animate ? "200% 100%" : "100% 100%",
            }}
            animate={
                animate
                    ? {
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }
                    : undefined
            }
            transition={
                animate
                    ? {
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    }
                    : undefined
            }
        >
            {children}
        </motion.span>
    );
}

// ============================================================================
// GLITCH TEXT - Cyberpunk Glitch Effect
// ============================================================================

interface GlitchTextProps {
    children: string;
    className?: string;
    glitchIntensity?: number;
}

export function GlitchText({
    children,
    className,
    glitchIntensity = 2,
}: GlitchTextProps) {
    return (
        <div className={cn("relative inline-block", className)}>
            {/* Main text */}
            <span className="relative z-10">{children}</span>

            {/* Glitch layer 1 - Red */}
            <motion.span
                className="absolute top-0 left-0 text-red-500 opacity-70"
                aria-hidden="true"
                animate={{
                    x: [0, -glitchIntensity, glitchIntensity, 0],
                    y: [0, glitchIntensity, -glitchIntensity, 0],
                }}
                transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    repeatDelay: 2,
                }}
            >
                {children}
            </motion.span>

            {/* Glitch layer 2 - Cyan */}
            <motion.span
                className="absolute top-0 left-0 text-cyan-500 opacity-70"
                aria-hidden="true"
                animate={{
                    x: [0, glitchIntensity, -glitchIntensity, 0],
                    y: [0, -glitchIntensity, glitchIntensity, 0],
                }}
                transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: 0.1,
                }}
            >
                {children}
            </motion.span>
        </div>
    );
}

// ============================================================================
// TYPEWRITER - Typing Animation
// ============================================================================

interface TypeWriterProps {
    children: string;
    className?: string;
    speed?: number;
    delay?: number;
    cursor?: boolean;
}

export function TypeWriter({
    children,
    className,
    speed = 50,
    delay = 0,
    cursor = true,
}: TypeWriterProps) {
    const text = children;
    const duration = (text.length * speed) / 1000;

    return (
        <motion.span className={cn("inline-block", className)}>
            <motion.span
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                transition={{
                    duration,
                    delay,
                    ease: "linear",
                }}
                style={{ overflow: "hidden", whiteSpace: "nowrap", display: "inline-block" }}
            >
                {text}
            </motion.span>
            {cursor && (
                <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="inline-block ml-1"
                >
                    |
                </motion.span>
            )}
        </motion.span>
    );
}

// ============================================================================
// FADE IN TEXT - Simple Fade with Blur
// ============================================================================

interface FadeInTextProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    blur?: boolean;
}

export function FadeInText({
    children,
    className,
    delay = 0,
    blur = true,
}: FadeInTextProps) {
    return (
        <motion.div
            className={className}
            initial={{
                opacity: 0,
                filter: blur ? "blur(10px)" : "blur(0px)",
            }}
            animate={{
                opacity: 1,
                filter: "blur(0px)",
            }}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            {children}
        </motion.div>
    );
}
