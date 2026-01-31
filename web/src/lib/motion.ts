// Motion configuration constants for consistent animations across the app

export const MotionConfig = {
    // Standard transition for most animations
    transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for smooth, premium feel
    },
    // Fast transition for quick interactions
    transitionFast: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1]
    },
    // Spring configuration for bouncy, natural feel
    spring: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
        mass: 0.8
    },
    // Gentle spring for softer animations
    springGentle: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        mass: 0.5
    },
    // Bouncy spring for playful interactions
    springBouncy: {
        type: "spring" as const,
        stiffness: 500,
        damping: 15,
        mass: 0.8
    }
};

// Page transition variants
export const PageTransition = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
        filter: "blur(10px)"
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.99,
        filter: "blur(5px)",
        transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
        }
    },
    transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
    }
};

// Button tap animation
export const ButtonTap = {
    scale: 0.96,
    transition: {
        duration: 0.12,
        ease: [0.2, 0, 0, 1]
    }
};

// Fade in animation variants
export const FadeIn = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
    }
};

// Slide up animation variants
export const SlideUp = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    }
};

// Slide in from left
export const SlideInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
        opacity: 0,
        x: 30,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    }
};

// Scale animation variants
export const Scale = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
    }
};

// Stagger container variants
export const StaggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    },
    exit: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

// Stagger item variants
export const StaggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
    }
};

// Menu animation variants
export const MenuVariants = {
    closed: {
        x: "-100%",
        transition: {
            type: "tween" as const,
            ease: [0.4, 0, 0.2, 1],
            duration: 0.3
        }
    },
    open: {
        x: "0%",
        transition: {
            type: "tween" as const,
            ease: [0.4, 0, 0.2, 1],
            duration: 0.4,
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

// Dropdown animation variants
export const DropdownVariants = {
    hidden: {
        opacity: 0,
        y: 10,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        }
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.05,
            delayChildren: 0.05
        }
    }
};

// Navbar scroll behavior
export const NavbarScroll = {
    visible: {
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1]
        }
    },
    hidden: {
        y: -100,
        transition: {
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

// Card hover animation
export const CardHover = {
    rest: {
        scale: 1,
        y: 0,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    },
    hover: {
        scale: 1.02,
        y: -4,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    }
};

// Image zoom on hover
export const ImageZoom = {
    rest: {
        scale: 1,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    hover: {
        scale: 1.08,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
};

// Text reveal animation
export const TextReveal = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

// Progress bar animation
export const ProgressBar = {
    initial: { scaleX: 0 },
    animate: {
        scaleX: 1,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};
