"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface NavDropdownProps {
    label: string;
    items: { name: string; href: string }[];
}

export function NavDropdown({ label, items }: NavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    const containerVariants = {
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

    const itemVariants = {
        hidden: {
            opacity: 0,
            x: -10
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <div
            className="relative group h-full flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.button
                className="flex items-center space-x-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300 py-4 font-display"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            >
                <span>{label}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <ChevronDown className={`w-3 h-3 transition-colors duration-300 ${isOpen ? "text-accent" : ""}`} />
                </motion.span>
            </motion.button>

            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={containerVariants}
                        className="absolute top-full left-0 pt-4 z-50 min-w-[220px]"
                    >
                        <div className="relative bg-[#080808]/98 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50">
                            {/* Accent line */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent via-accent/50 to-transparent"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            />

                            {/* Side accent */}
                            <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-accent via-accent/50 to-transparent" />

                            <div className="flex flex-col py-2">
                                {items.map((item, idx) => (
                                    <motion.div
                                        key={item.href}
                                        variants={itemVariants}
                                        custom={idx}
                                    >
                                        <Link
                                            href={item.href}
                                            className="group/item flex items-center justify-between px-5 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300 uppercase tracking-widest font-mono"
                                        >
                                            <span className="relative">
                                                {item.name}
                                                <motion.span
                                                    className="absolute -bottom-0.5 left-0 h-[1px] bg-accent"
                                                    initial={{ width: 0 }}
                                                    whileHover={{ width: "100%" }}
                                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                />
                                            </span>
                                            <motion.span
                                                className="text-accent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                                                initial={{ x: -5 }}
                                                whileHover={{ x: 0 }}
                                            >
                                                →
                                            </motion.span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
