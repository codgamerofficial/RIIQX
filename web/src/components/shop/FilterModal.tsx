"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

const SORT_OPTIONS = [
    { id: "best-selling", label: "Best Selling" },
    { id: "date-desc", label: "Newest Arrivals" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
];

const COLORS = [
    { id: "black", label: "Black", code: "#000000" },
    { id: "white", label: "White", code: "#ffffff" },
    { id: "red", label: "Red", code: "#e31c79" },
    { id: "blue", label: "Blue", code: "#3b82f6" },
    { id: "green", label: "Green", code: "#22c55e" },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];

export function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [selectedSort, setSelectedSort] = useState("best-selling");
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    const handleApply = () => {
        onApply({
            priceRange,
            sort: selectedSort,
            colors: selectedColors,
            sizes: selectedSizes
        });
        onClose();
    };

    const toggleColor = (id: string) => {
        setSelectedColors(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const toggleSize = (id: string) => {
        setSelectedSizes(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-md bg-rich-black border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5 text-gold" /> Filters
                            </h2>
                            <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Sort Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest">Sort By</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {SORT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setSelectedSort(opt.id)}
                                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-left flex justify-between items-center ${selectedSort === opt.id
                                                    ? "bg-white text-rich-black"
                                                    : "bg-white/5 text-white/70 hover:bg-white/10"
                                                }`}
                                        >
                                            {opt.label}
                                            {selectedSort === opt.id && <Check className="w-4 h-4 text-cherry-red" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-white/10" />

                            {/* Price Range */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest">Price Range</h3>
                                    <span className="text-gold font-mono text-sm">₹{priceRange[0]} - ₹{priceRange[1]}</span>
                                </div>
                                <Slider
                                    defaultValue={[0, 5000]}
                                    max={10000}
                                    step={100}
                                    value={priceRange}
                                    onValueChange={setPriceRange}
                                    className="py-4"
                                />
                            </div>

                            <div className="h-px bg-white/10" />

                            {/* Colors */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest">Colors</h3>
                                <div className="flex flex-wrap gap-3">
                                    {COLORS.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() => toggleColor(color.id)}
                                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColors.includes(color.id)
                                                    ? "border-white scale-110"
                                                    : "border-transparent opacity-80 hover:opacity-100 ring-1 ring-white/10"
                                                }`}
                                            style={{ backgroundColor: color.code }}
                                            title={color.label}
                                        >
                                            {selectedColors.includes(color.id) && (
                                                <Check className={`w-4 h-4 ${color.code === '#ffffff' ? 'text-black' : 'text-white'}`} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-white/10" />

                            {/* Sizes */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest">Size</h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {SIZES.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all ${selectedSizes.includes(size)
                                                    ? "bg-cherry-red text-white"
                                                    : "bg-white/5 text-white/70 hover:bg-white/10"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 bg-rich-black">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setPriceRange([0, 5000]);
                                        setSelectedSort("best-selling");
                                        setSelectedColors([]);
                                        setSelectedSizes([]);
                                    }}
                                    className="flex-1 py-4 rounded-full border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="flex-[2] py-4 rounded-full bg-cherry-red text-white font-bold uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-cherry-red/25"
                                >
                                    Show Results
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
