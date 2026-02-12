"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, ChevronDown, Check, X, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeonButton } from "@/components/ui/neon-button";

interface FilterOption {
    label: string;
    value: string;
}

interface FilterGroup {
    id: string;
    label: string;
    options: FilterOption[];
}

interface FloatingFilterBarProps {
    filters: FilterGroup[];
    activeFilters: Record<string, string[]>;
    onFilterChange: (groupId: string, value: string) => void;
    onClearFilters: () => void;
    currentSort: string;
    onSortChange: (sort: string) => void;
}

export function FloatingFilterBar({
    filters,
    activeFilters,
    onFilterChange,
    onClearFilters,
    currentSort,
    onSortChange
}: FloatingFilterBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const totalActive = Object.values(activeFilters).flat().length;

    return (
        <>
            {/* Desktop & Mobile Floating Bar */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl"
            >
                <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center justify-between shadow-2xl shadow-black/50">

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                            isOpen || totalActive > 0 ? "bg-white text-black" : "bg-white/5 text-white hover:bg-white/10"
                        )}
                    >
                        <Filter className="w-3 h-3" />
                        Filters
                        {totalActive > 0 && (
                            <span className="ml-1 w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[9px]">
                                {totalActive}
                            </span>
                        )}
                    </button>

                    {/* Quick Sort Options (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-2 px-4 border-l border-white/10">
                        {['featured', 'price-asc', 'price-desc'].map(sort => (
                            <button
                                key={sort}
                                onClick={() => onSortChange(sort)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors",
                                    currentSort === sort ? "bg-white/10 text-[#B4F000]" : "text-white/40 hover:text-white"
                                )}
                            >
                                {sort.replace('-', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Sort Toggle */}
                    <button
                        className="md:hidden px-4 py-2 text-white/50"
                        onClick={() => onSortChange(currentSort === 'price-asc' ? 'price-desc' : 'price-asc')}
                    >
                        <ArrowUpDown className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            {/* Expanded Filter Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white font-black uppercase tracking-tighter text-xl">Refine</h3>
                            {totalActive > 0 && (
                                <button
                                    onClick={onClearFilters}
                                    className="text-xs text-red-500 font-bold uppercase tracking-widest hover:underline"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {filters.map(group => (
                                <div key={group.id}>
                                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{group.label}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {group.options.map(option => {
                                            const isActive = activeFilters[group.id]?.includes(option.value);
                                            return (
                                                <button
                                                    key={option.value}
                                                    onClick={() => onFilterChange(group.id, option.value)}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase transition-all",
                                                        isActive
                                                            ? "bg-white text-black border-white"
                                                            : "bg-transparent text-white/60 border-white/10 hover:border-white/40"
                                                    )}
                                                >
                                                    {option.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
