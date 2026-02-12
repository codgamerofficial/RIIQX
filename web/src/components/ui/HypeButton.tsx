"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HypeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "xl";
    children: React.ReactNode;
    magnetic?: boolean;
}

export function HypeButton({
    variant = "primary",
    size = "md",
    children,
    className,
    magnetic = true,
    ...props
}: HypeButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!magnetic || !ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        // Calculate center
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate distance from center
        const x = (clientX - centerX) * 0.3; // Strength of magnet
        const y = (clientY - centerY) * 0.3;

        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    // Variant Styles
    const variants = {
        primary: "bg-[#B4F000] text-black border-transparent hover:shadow-[0_0_30px_rgba(180,240,0,0.6)]",
        secondary: "bg-white text-black border-transparent hover:bg-zinc-200",
        outline: "bg-transparent border border-white/20 text-white hover:border-[#B4F000] hover:text-[#B4F000] hover:shadow-[0_0_20px_rgba(180,240,0,0.2)]",
        ghost: "bg-transparent text-white hover:bg-white/10",
    };

    // Size Styles
    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        xl: "px-12 py-6 text-lg tracking-widest",
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={cn(
                "relative inline-flex items-center justify-center font-[family-name:var(--font-oswald)] font-bold uppercase tracking-wider transition-colors duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                // Slanted Edges (CSS Clip Path or explicit shape)
                "clip-path-button", // We will add this utility if needed, or stick to boxy
                variants[variant],
                sizes[size],
                className
            )}
            {...props as any}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Hover Glint Effect (Optional) */}
            {variant === 'primary' && (
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
            )}
        </motion.button>
    );
}
