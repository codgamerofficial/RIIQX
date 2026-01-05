"use client";

import { cn } from "@/components/ui/neon-button"; // Re-using cn
import { motion } from "framer-motion";
import React from "react";

type HoloCardProps = React.ComponentProps<typeof motion.div> & {
    children: React.ReactNode;
    glowColor?: string;
};

export function HoloCard({ className, children, glowColor = "rgba(124, 58, 237, 0.2)", style, ...props }: HoloCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "glass-panel rounded-xl p-6 relative overflow-hidden group",
                className
            )}
            style={{
                borderColor: glowColor,
                ...style
            }}
            {...props}
        >
            <div
                className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            />
            {children}
        </motion.div>
    );
}
