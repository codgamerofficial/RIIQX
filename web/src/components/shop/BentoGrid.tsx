"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
}

interface BentoGridItemProps {
    children: ReactNode;
    className?: string;
    i?: number;
}

export function BentoGridItem({ children, className, i = 0 }: BentoGridItemProps) {
    // Deterministic random span pattern based on index
    // Every 7th item takes 2x2
    // Every 3rd item (that isn't 7th) takes 2x1 (wide)

    let spanClass = "";

    if (i % 7 === 0 && i !== 0) {
        spanClass = "md:col-span-2 md:row-span-2";
    } else if (i % 3 === 0 && i !== 0) {
        spanClass = "md:col-span-2";
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.1 }}
            className={cn(
                "group relative rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/5 hover:border-white/20 transition-colors",
                spanClass,
                className
            )}
        >
            {children}
        </motion.div>
    );
}
