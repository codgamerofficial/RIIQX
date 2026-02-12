"use client";

import { useState } from "react";
import { useStylist } from "@/hooks/useStylist";
import { Sparkles, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/shopify/types";

interface StylistWidgetProps {
    product: Product;
}

export function StylistWidget({ product }: StylistWidgetProps) {
    const { sendMessage, isLoading } = useStylist();
    const [isOpen, setIsOpen] = useState(false);
    const [suggestion, setSuggestion] = useState<string | null>(null);

    const handleGetAdvice = async () => {
        if (!isOpen) {
            setIsOpen(true);
            if (!suggestion) {
                const prompt = `I'm looking at the ${product.title}. What other RIIQX items would complete this look? Keep it short and hype.`;
                const response = await sendMessage([{ role: 'user', content: prompt }]);
                setSuggestion(response);
            }
        } else {
            setIsOpen(false);
        }
    };

    return (
        <div className="mt-6 border-t border-white/10 pt-6">
            <button
                onClick={handleGetAdvice}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B4F000] hover:text-white transition-colors"
                disabled={isLoading}
            >
                <Sparkles className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Consulting AI..." : isOpen ? "Close Stylist" : "Ask RIIQX AI Stylist"}
            </button>

            <AnimatePresence>
                {isOpen && suggestion && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 p-4 bg-white/5 border border-[#B4F000]/30 rounded-lg backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B4F000] to-black flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 text-black" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">RIIQX Intelligence</h4>
                                    <p className="text-sm text-white/80 leading-relaxed font-light">
                                        {suggestion}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
