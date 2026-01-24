"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={PageTransition.initial}
            animate={PageTransition.animate}
            exit={PageTransition.exit}
            transition={PageTransition.transition}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}
