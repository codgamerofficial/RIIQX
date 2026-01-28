"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Collection } from "@/lib/shopify/types";
import { Filter, X, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSidebarProps {
    collections: Collection[];
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

const SORT_OPTIONS = [
    { label: "Newest Arrivals", value: "newest" },
    { label: "Best Selling", value: "best_selling" },
    { label: "Price: Low to High", value: "price_low" },
    { label: "Price: High to Low", value: "price_high" },
];

const GENDER_OPTIONS = ["Men", "Women", "Unisex"];
const TYPE_OPTIONS = ["T-Shirts", "Hoodies", "Sweatshirts", "Jackets", "Pants", "Accessories"];
const COLOR_OPTIONS = ["Black", "White", "Navy", "Red", "Green", "Beige"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export function FilterSidebar({ collections, className = "", isOpen, onClose }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Accordion State
    const [openSections, setOpenSections] = useState<string[]>(["sort", "gender", "type"]);

    const toggleSection = (section: string) => {
        setOpenSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    // Filter Logic
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const current = params.get(key);

        if (current === value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        // Reset cursor on filter change
        params.delete("cursor");

        router.push(`?${params.toString()}`);
    };

    const isActive = (key: string, value: string) => searchParams.get(key) === value;

    return (
        <>
            <div className={`
                fixed inset-y-0 right-0 z-[60] w-full md:w-[400px] bg-[#0B0B0B] border-l border-white/10 p-0 transform transition-transform duration-500 ease-[0.16,1,0.3,1] flex flex-col
                ${isOpen ? "translate-x-0" : "translate-x-full"}
                ${className}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/5">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-display">Filter & Sort</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                    {/* Sort Section */}
                    <div className="border-b border-white/5 pb-8">
                        <button onClick={() => toggleSection('sort')} className="flex items-center justify-between w-full mb-6 group">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Sort By</h3>
                            <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${openSections.includes('sort') ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openSections.includes('sort') && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-3 overflow-hidden"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => updateFilter("sort", option.value)}
                                            className={`flex items-center justify-between w-full text-left text-sm uppercase tracking-wider transition-all py-2 ${isActive("sort", option.value) ? 'text-accent font-bold pl-2 border-l-2 border-accent' : 'text-white/60 hover:text-white'}`}
                                        >
                                            {option.label}
                                            {isActive("sort", option.value) && <Check className="w-3 h-3 text-accent" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Gender Section */}
                    <div className="border-b border-white/5 pb-8">
                        <button onClick={() => toggleSection('gender')} className="flex items-center justify-between w-full mb-6 group">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Gender</h3>
                            <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${openSections.includes('gender') ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openSections.includes('gender') && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="grid grid-cols-2 gap-3 overflow-hidden"
                                >
                                    {GENDER_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => updateFilter("gender", option.toLowerCase())}
                                            className={`px-4 py-3 text-xs font-bold uppercase tracking-widest border transition-all ${isActive("gender", option.toLowerCase()) ? 'bg-white text-black border-white' : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Category/Type Section */}
                    <div className="border-b border-white/5 pb-8">
                        <button onClick={() => toggleSection('type')} className="flex items-center justify-between w-full mb-6 group">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Category</h3>
                            <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${openSections.includes('type') ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openSections.includes('type') && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-3 overflow-hidden"
                                >
                                    {TYPE_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => updateFilter("category", option.toLowerCase())}
                                            className={`block w-full text-left text-sm uppercase tracking-wider transition-all py-1 ${isActive("category", option.toLowerCase()) ? 'text-white font-bold' : 'text-white/60 hover:text-white'}`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className={`w-1.5 h-1.5 rounded-full ${isActive("category", option.toLowerCase()) ? 'bg-accent' : 'bg-white/20'}`} />
                                                {option}
                                            </span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Color Section */}
                    <div className="border-b border-white/5 pb-8">
                        <button onClick={() => toggleSection('color')} className="flex items-center justify-between w-full mb-6 group">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Color</h3>
                            <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${openSections.includes('color') ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openSections.includes('color') && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="flex flex-wrap gap-3 overflow-hidden"
                                >
                                    {COLOR_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => updateFilter("color", option.toLowerCase())}
                                            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isActive("color", option.toLowerCase()) ? 'border-accent scale-110' : 'border-transparent hover:scale-105'}`}
                                            title={option}
                                            style={{ backgroundColor: option.toLowerCase() }}
                                        >
                                            {isActive("color", option.toLowerCase()) && <Check className={`w-4 h-4 ${option.toLowerCase() === 'white' || option.toLowerCase() === 'beige' ? 'text-black' : 'text-white'}`} />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Size Section */}
                    <div className="border-b border-white/5 pb-8">
                        <button onClick={() => toggleSection('size')} className="flex items-center justify-between w-full mb-6 group">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Size</h3>
                            <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${openSections.includes('size') ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {openSections.includes('size') && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="grid grid-cols-4 gap-2 overflow-hidden"
                                >
                                    {SIZE_OPTIONS.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => updateFilter("size", option)}
                                            className={`py-3 text-xs font-bold uppercase tracking-wider border transition-all ${isActive("size", option) ? 'bg-white text-black border-white' : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'}`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-8 border-t border-white/10 bg-[#0B0B0B]">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => router.push('/shop')}
                            className="px-6 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                            Reset
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-4 bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-accent transition-colors"
                        >
                            View Results
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm transition-opacity duration-500"
                    onClick={onClose}
                />
            )}
        </>
    );
}
