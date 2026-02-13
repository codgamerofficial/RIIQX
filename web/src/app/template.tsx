"use client";

import React from "react";

import { motion } from "framer-motion";
import { PageTransition } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="w-full">{children}</div>;
    }

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
