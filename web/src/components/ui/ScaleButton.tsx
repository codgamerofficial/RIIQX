"use client";

import { motion } from "framer-motion";
import { ButtonTap } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ScaleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function ScaleButton({ children, className, ...props }: ScaleButtonProps) {
    return (
        <motion.button
            whileTap={ButtonTap}
            className={cn("transition-colors duration-200", className)}
            {...props as any}
        >
            {children}
        </motion.button>
    );
}
