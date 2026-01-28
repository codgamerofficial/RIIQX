"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface NavDropdownProps {
    label: string;
    items: { name: string; href: string }[];
}

export function NavDropdown({ label, items }: NavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative group h-full flex items-center"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="flex items-center space-x-1 text-sm font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors py-4 group-hover:text-accent font-display italic">
                <span>{label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180 text-accent" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, skewX: -5 }}
                        animate={{ opacity: 1, y: 0, skewX: 0 }}
                        exit={{ opacity: 0, y: 10, skewX: -5 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 pt-4 z-50 min-w-[240px]"
                    >
                        <div className="bg-[#050505]/95 border border-white/10 p-1 backdrop-blur-xl clip-path-slant-right shadow-2xl">
                            <div className="absolute top-0 left-0 w-1 h-full bg-accent/50" />
                            <div className="flex flex-col py-2">
                                {items.map((item, idx) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block px-6 py-3 text-xs font-bold text-white/60 hover:text-black hover:bg-white transition-all uppercase tracking-widest font-mono group flex items-center justify-between"
                                    >
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
