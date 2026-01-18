"use client";

import { useState } from "react";
import { Ruler, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function SizeGuide() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
            >
                <Ruler className="w-4 h-4" />
                <span>Size Guide</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-[#0a0505] border border-white/10 rounded-2xl overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Size Guide</h3>
                                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-sm text-muted-foreground mb-6">
                                    Our sizing is designed for a relaxed, futuristic fit. Measure around the fullest part of your chest and waist.
                                </p>

                                <div className="space-y-6">
                                    {/* Chart */}
                                    <div className="w-full overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs uppercase text-muted-foreground bg-white/5">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-tl-lg">Size</th>
                                                    <th className="px-4 py-3">Chest (in)</th>
                                                    <th className="px-4 py-3">Waist (in)</th>
                                                    <th className="px-4 py-3 rounded-tr-lg">Hips (in)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                <tr className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-white">XS</td>
                                                    <td className="px-4 py-3 text-gray-300">32-34</td>
                                                    <td className="px-4 py-3 text-gray-300">26-28</td>
                                                    <td className="px-4 py-3 text-gray-300">34-36</td>
                                                </tr>
                                                <tr className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-white">S</td>
                                                    <td className="px-4 py-3 text-gray-300">35-37</td>
                                                    <td className="px-4 py-3 text-gray-300">29-31</td>
                                                    <td className="px-4 py-3 text-gray-300">37-39</td>
                                                </tr>
                                                <tr className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-white">M</td>
                                                    <td className="px-4 py-3 text-gray-300">38-40</td>
                                                    <td className="px-4 py-3 text-gray-300">32-34</td>
                                                    <td className="px-4 py-3 text-gray-300">40-42</td>
                                                </tr>
                                                <tr className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-white">L</td>
                                                    <td className="px-4 py-3 text-gray-300">41-43</td>
                                                    <td className="px-4 py-3 text-gray-300">35-37</td>
                                                    <td className="px-4 py-3 text-gray-300">43-45</td>
                                                </tr>
                                                <tr className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-white">XL</td>
                                                    <td className="px-4 py-3 text-gray-300">44-46</td>
                                                    <td className="px-4 py-3 text-gray-300">38-40</td>
                                                    <td className="px-4 py-3 text-gray-300">46-48</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
