/**
 * Centralized Animation Configuration Library
 * Provides reusable Framer Motion variants, GSAP presets, and animation utilities
 */

import { Variants } from "framer-motion";

// ============================================================================
// EASING FUNCTIONS
// ============================================================================

export const easings = {
    // Standard Material Design easings
    standard: [0.4, 0.0, 0.2, 1],
    decelerate: [0.0, 0.0, 0.2, 1],
    accelerate: [0.4, 0.0, 1, 1],

    // Custom easings
    spring: [0.16, 1, 0.3, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    smooth: [0.25, 0.46, 0.45, 0.94],

    // Expo easings for dramatic effects
    expoOut: [0.19, 1, 0.22, 1],
    expoInOut: [0.87, 0, 0.13, 1],
} as const;

// ============================================================================
// DURATION CONSTANTS
// ============================================================================

export const durations = {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
    slowest: 1.2,
} as const;

// ============================================================================
// FRAMER MOTION VARIANTS
// ============================================================================

/**
 * Fade animations
 */
export const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: durations.normal, ease: easings.standard }
    },
    exit: {
        opacity: 0,
        transition: { duration: durations.fast, ease: easings.accelerate }
    }
};

/**
 * Fade up animation (common for reveals)
 */
export const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: durations.normal, ease: easings.spring }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: durations.fast, ease: easings.accelerate }
    }
};

/**
 * Fade down animation
 */
export const fadeDownVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: durations.normal, ease: easings.spring }
    }
};

/**
 * Scale animations
 */
export const scaleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: durations.normal, ease: easings.spring }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: durations.fast }
    }
};

/**
 * Slide from left
 */
export const slideLeftVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: durations.normal, ease: easings.spring }
    }
};

/**
 * Slide from right
 */
export const slideRightVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: durations.normal, ease: easings.spring }
    }
};

/**
 * Blur to focus animation
 */
export const blurVariants: Variants = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: durations.slow, ease: easings.smooth }
    }
};

/**
 * Stagger container for child animations
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        }
    }
};

/**
 * Fast stagger for grids
 */
export const staggerFastContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0,
        }
    }
};

/**
 * Stagger item (use with staggerContainer)
 */
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: durations.normal, ease: easings.spring }
    }
};

/**
 * 3D flip animation
 */
export const flipVariants: Variants = {
    hidden: { opacity: 0, rotateY: -90 },
    visible: {
        opacity: 1,
        rotateY: 0,
        transition: { duration: durations.slow, ease: easings.spring }
    }
};

/**
 * Rotate in animation
 */
export const rotateInVariants: Variants = {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: {
        opacity: 1,
        rotate: 0,
        scale: 1,
        transition: { duration: durations.normal, ease: easings.spring }
    }
};

// ============================================================================
// GSAP TIMELINE PRESETS
// ============================================================================

export const gsapPresets = {
    /**
     * Smooth scroll reveal
     */
    scrollReveal: {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
    },

    /**
     * Scale in on scroll
     */
    scaleIn: {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: "back.out(1.2)",
    },

    /**
     * Slide in from left
     */
    slideInLeft: {
        opacity: 0,
        x: -100,
        duration: 0.8,
        ease: "power3.out",
    },

    /**
     * Slide in from right
     */
    slideInRight: {
        opacity: 0,
        x: 100,
        duration: 0.8,
        ease: "power3.out",
    },

    /**
     * Fade in
     */
    fadeIn: {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
    },

    /**
     * Clip path reveal (from bottom)
     */
    clipReveal: {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1,
        ease: "power4.inOut",
    },
} as const;

// ============================================================================
// SCROLL ANIMATION UTILITIES
// ============================================================================

export const scrollTriggerDefaults = {
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
    markers: false, // Set to true for debugging
} as const;

/**
 * Create scroll trigger config with defaults
 */
export function createScrollTrigger(overrides: Record<string, any> = {}) {
    return {
        ...scrollTriggerDefaults,
        ...overrides,
    };
}

// ============================================================================
// SPRING PHYSICS CONFIGS
// ============================================================================

export const springConfigs = {
    // Gentle spring
    gentle: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
    },

    // Bouncy spring
    bouncy: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
    },

    // Stiff spring (quick response)
    stiff: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
    },

    // Slow spring
    slow: {
        type: "spring" as const,
        stiffness: 50,
        damping: 20,
    },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a stagger delay for index-based animations
 */
export function getStaggerDelay(index: number, baseDelay = 0.1): number {
    return index * baseDelay;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get animation duration based on reduced motion preference
 */
export function getAnimationDuration(duration: number): number {
    return prefersReducedMotion() ? 0 : duration;
}

/**
 * Create viewport animation config
 */
export function createViewportConfig(once = true, amount: number | "some" | "all" = 0.3) {
    return {
        once,
        amount,
    };
}
