"use client";

import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type NeonButtonProps = React.ComponentProps<typeof motion.button> & {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    glow?: boolean;
};

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
    ({ className, variant = "primary", glow = true, children, ...props }, ref) => {
        const variants = {
            primary: "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
            outline: "border-primary text-primary hover:bg-primary/10 bg-transparent",
            ghost: "hover:bg-primary/10 text-primary-foreground border-transparent",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                    "border rounded-lg",
                    variants[variant],
                    glow && variant === "primary" && "shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.8)]",
                    glow && variant === "secondary" && "shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]",
                    className
                )}
                {...props}
            >
                <span className="relative z-10 flex items-center gap-2">{children}</span>
            </motion.button>
        );
    }
);
NeonButton.displayName = "NeonButton";
