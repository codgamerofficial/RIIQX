"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Render a placeholder with same dimensions to prevent layout shift
        return <div className="w-10 h-10" />;
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative w-14 h-8 rounded-full bg-white/10 border border-white/20 p-1 cursor-pointer overflow-hidden group shadow-[0_0_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {/* Background Gradient Animation */}
            <div
                className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-0' : 'opacity-100'}`}
                style={{ background: 'linear-gradient(to right, #60a5fa, #3bf6ff)' }} // Sky blue for day
            />
            <div
                className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}
                style={{ background: 'linear-gradient(to right, #0f172a, #312e81)' }} // Deep space for night
            />

            {/* Sliding Knob */}
            <motion.div
                layout
                className="relative z-10 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                animate={{ x: isDark ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
                    className="absolute"
                >
                    <Moon className="w-4 h-4 text-purple-600 fill-purple-600" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1 }}
                    className="absolute"
                >
                    <Sun className="w-4 h-4 text-orange-500 fill-orange-500" />
                </motion.div>
            </motion.div>
        </button>
    );
}
