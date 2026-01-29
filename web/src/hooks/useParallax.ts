/**
 * Custom hook for parallax effects
 * Supports both scroll-based and mouse-based parallax
 */

import { useEffect, useRef, useState, MutableRefObject } from "react";
import { useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

export interface ParallaxConfig {
    /**
     * Parallax speed multiplier (higher = more movement)
     * @default 0.5
     */
    speed?: number;

    /**
     * Direction of parallax
     * @default "vertical"
     */
    direction?: "vertical" | "horizontal" | "both";

    /**
     * Enable smooth spring animation
     * @default true
     */
    smooth?: boolean;

    /**
     * Spring configuration
     */
    springConfig?: {
        stiffness?: number;
        damping?: number;
    };
}

/**
 * Hook for scroll-based parallax effect
 * 
 * @example
 * const { ref, y } = useParallax({ speed: 0.5 });
 * 
 * return (
 *   <motion.div ref={ref} style={{ y }}>
 *     Parallax content
 *   </motion.div>
 * );
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
    config: ParallaxConfig = {}
): {
    ref: MutableRefObject<T | null>;
    x: MotionValue<number>;
    y: MotionValue<number>;
} {
    const ref = useRef<T>(null);
    const { speed = 0.5, direction = "vertical", smooth = true, springConfig } = config;

    const scrollY = useMotionValue(0);
    const scrollX = useMotionValue(0);

    // Transform scroll values with parallax speed
    const rawY = useTransform(scrollY, (value) => value * speed);
    const rawX = useTransform(scrollX, (value) => value * speed);

    // Apply spring if smooth is enabled
    const y = smooth
        ? useSpring(rawY, springConfig || { stiffness: 100, damping: 30 })
        : rawY;
    const x = smooth
        ? useSpring(rawX, springConfig || { stiffness: 100, damping: 30 })
        : rawX;

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;
        const updateParallax = () => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;

            // Calculate scroll progress relative to element
            const scrollProgress = (window.scrollY - elementTop + windowHeight) / (windowHeight + elementHeight);
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

            if (direction === "vertical" || direction === "both") {
                scrollY.set((clampedProgress - 0.5) * 100);
            }
            if (direction === "horizontal" || direction === "both") {
                scrollX.set((clampedProgress - 0.5) * 100);
            }
        };

        updateParallax();
        window.addEventListener("scroll", updateParallax, { passive: true });
        window.addEventListener("resize", updateParallax);

        return () => {
            window.removeEventListener("scroll", updateParallax);
            window.removeEventListener("resize", updateParallax);
        };
    }, [speed, direction, scrollY, scrollX]);

    return { ref, x, y };
}

/**
 * Hook for mouse-based parallax effect
 * 
 * @example
 * const { ref, x, y } = useMouseParallax({ strength: 20 });
 * 
 * return (
 *   <motion.div ref={ref} style={{ x, y }}>
 *     Mouse parallax content
 *   </motion.div>
 * );
 */
export function useMouseParallax<T extends HTMLElement = HTMLDivElement>(config: {
    strength?: number;
    smooth?: boolean;
    springConfig?: { stiffness?: number; damping?: number };
} = {}): {
    ref: MutableRefObject<T | null>;
    x: MotionValue<number>;
    y: MotionValue<number>;
} {
    const ref = useRef<T>(null);
    const { strength = 20, smooth = true, springConfig } = config;

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rawX = useTransform(mouseX, (value) => value * strength);
    const rawY = useTransform(mouseY, (value) => value * strength);

    const x = smooth
        ? useSpring(rawX, springConfig || { stiffness: 150, damping: 30 })
        : rawX;
    const y = smooth
        ? useSpring(rawY, springConfig || { stiffness: 150, damping: 30 })
        : rawY;

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate mouse position relative to element center (-1 to 1)
            const relativeX = (e.clientX - centerX) / (rect.width / 2);
            const relativeY = (e.clientY - centerY) / (rect.height / 2);

            mouseX.set(relativeX);
            mouseY.set(relativeY);
        };

        const handleMouseLeave = () => {
            mouseX.set(0);
            mouseY.set(0);
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [mouseX, mouseY, strength]);

    return { ref, x, y };
}

/**
 * Hook for 3D tilt effect on mouse move
 * 
 * @example
 * const { ref, rotateX, rotateY } = useTiltEffect({ maxTilt: 15 });
 * 
 * return (
 *   <motion.div 
 *     ref={ref} 
 *     style={{ 
 *       rotateX, 
 *       rotateY,
 *       transformStyle: "preserve-3d"
 *     }}
 *   >
 *     3D tilt content
 *   </motion.div>
 * );
 */
export function useTiltEffect<T extends HTMLElement = HTMLDivElement>(config: {
    maxTilt?: number;
    smooth?: boolean;
    springConfig?: { stiffness?: number; damping?: number };
} = {}): {
    ref: MutableRefObject<T | null>;
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    scale: MotionValue<number>;
} {
    const ref = useRef<T>(null);
    const { maxTilt = 10, smooth = true, springConfig } = config;

    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    const rawRotateX = useTransform(mouseY, [0, 1], [maxTilt, -maxTilt]);
    const rawRotateY = useTransform(mouseX, [0, 1], [-maxTilt, maxTilt]);
    const rawScale = useTransform(mouseX, [0, 0.5, 1], [1, 1.05, 1]);

    const rotateX = smooth
        ? useSpring(rawRotateX, springConfig || { stiffness: 200, damping: 30 })
        : rawRotateX;
    const rotateY = smooth
        ? useSpring(rawRotateY, springConfig || { stiffness: 200, damping: 30 })
        : rawRotateY;
    const scale = smooth
        ? useSpring(rawScale, springConfig || { stiffness: 200, damping: 30 })
        : rawScale;

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            mouseX.set(x);
            mouseY.set(y);
        };

        const handleMouseLeave = () => {
            mouseX.set(0.5);
            mouseY.set(0.5);
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [mouseX, mouseY]);

    return { ref, rotateX, rotateY, scale };
}

/**
 * Hook for multi-layer parallax (depth effect)
 * 
 * @example
 * const layers = useMultiLayerParallax(3, { baseSpeed: 0.3 });
 * 
 * return (
 *   <div>
 *     <motion.div style={{ y: layers[0].y }}>Background</motion.div>
 *     <motion.div style={{ y: layers[1].y }}>Midground</motion.div>
 *     <motion.div style={{ y: layers[2].y }}>Foreground</motion.div>
 *   </div>
 * );
 */
export function useMultiLayerParallax(
    layerCount: number,
    config: { baseSpeed?: number; speedMultiplier?: number } = {}
): Array<{ y: MotionValue<number>; x: MotionValue<number> }> {
    const { baseSpeed = 0.3, speedMultiplier = 1.5 } = config;
    const [layers] = useState(() =>
        Array.from({ length: layerCount }, (_, i) => ({
            speed: baseSpeed * Math.pow(speedMultiplier, i),
        }))
    );

    const scrollY = useMotionValue(0);

    useEffect(() => {
        const updateScroll = () => {
            scrollY.set(window.scrollY);
        };

        updateScroll();
        window.addEventListener("scroll", updateScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", updateScroll);
        };
    }, [scrollY]);

    return layers.map((layer) => {
        const y = useTransform(scrollY, (value) => -value * layer.speed);
        const x = useMotionValue(0);
        return { y, x };
    });
}
