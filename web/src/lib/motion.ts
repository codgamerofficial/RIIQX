export const MotionConfig = {
    transition: {
        duration: 0.28,
        ease: [0.2, 0, 0, 1] // OxygenOS Standard Easing
    },
    transitionFast: {
        duration: 0.12,
        ease: [0.2, 0, 0, 1]
    },
    activeSpring: {
        type: "spring",
        stiffness: 400,
        damping: 30
    }
};

export const PageTransition = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 0.28, ease: [0.2, 0, 0, 1] }
};

export const ButtonTap = {
    scale: 0.96,
    transition: { duration: 0.12, ease: [0.2, 0, 0, 1] }
};
