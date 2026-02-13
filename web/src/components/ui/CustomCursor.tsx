/**
 * Custom Cursor Component
 * Advanced cursor with smooth follow, context-aware states, and magnetic attraction
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { isTouchDevice } from "@/lib/performance";

type CursorState = "default" | "hover" | "click" | "text" | "hidden";

export function CustomCursor() {
    const [cursorState, setCursorState] = useState<CursorState>("default");
    const [isVisible, setIsVisible] = useState(false);
    const cursorRef = useRef<HTMLDivElement>(null);

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 200 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Hide cursor on touch devices
        if (isTouchDevice()) {
            return;
        }

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            if (!isVisible) {
                setIsVisible(true);
            }
        };

        const handleMouseDown = () => setCursorState("click");
        const handleMouseUp = () => setCursorState("default");

        // Detect hoverable elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.classList.contains("cursor-hover")
            ) {
                setCursorState("hover");
            } else if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                setCursorState("text");
            } else {
                setCursorState("default");
            }
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [cursorX, cursorY, isVisible]);

    const getCursorSize = () => {
        switch (cursorState) {
            case "hover":
                return 50;
            case "click":
                return 30;
            case "text":
                return 4;
            default:
                return 40;
        }
    };

    const getCursorOpacity = () => {
        return cursorState === "text" ? 0.5 : 1;
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={cursorRef}
                    className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: getCursorOpacity(), scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                >
                    <motion.div
                        className="relative"
                        animate={{
                            width: getCursorSize(),
                            height: getCursorSize(),
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Outer ring */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-white"
                            style={{
                                transform: "translate(-50%, -50%)",
                            }}
                            animate={{
                                scale: cursorState === "hover" ? 1.2 : 1,
                            }}
                        />

                        {/* Inner dot */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                            style={{
                                transform: "translate(-50%, -50%)",
                            }}
                            animate={{
                                scale: cursorState === "click" ? 0.5 : 1,
                            }}
                        />

                        {/* Text cursor line */}
                        {cursorState === "text" && (
                            <motion.div
                                className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-white"
                                style={{
                                    transform: "translate(-50%, -50%)",
                                }}
                                animate={{
                                    opacity: [1, 0, 1],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
