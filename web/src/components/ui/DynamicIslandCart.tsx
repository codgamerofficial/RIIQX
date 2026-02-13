"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export function DynamicIslandCart() {
    const { items, isOpen } = useCartStore();
    const [lastAdded, setLastAdded] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Watch for cart changes to trigger animation
    useEffect(() => {
        if (items.length > 0) {
            const latest = items[items.length - 1];
            // Simple check to see if it's a "new" add event (could be improved with a timestamp in store)
            // For now, we just show it whenever items change and length increases
            setIsVisible(true);
            setLastAdded(latest);

            const timer = setTimeout(() => setIsVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [items.length]);

    return (
        <AnimatePresence>
            {isVisible && lastAdded && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                    <motion.div
                        initial={{ width: 0, opacity: 0, height: 0 }}
                        animate={{ width: "auto", opacity: 1, height: "auto" }}
                        exit={{ width: 0, opacity: 0, height: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-4 px-2 py-2 overflow-hidden shadow-2xl"
                    >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/5">
                            {lastAdded.image && (
                                <Image
                                    src={lastAdded.image}
                                    alt={lastAdded.title}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>

                        <div className="flex flex-col min-w-[100px] pr-2">
                            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Added to Bag</span>
                            <span className="text-xs text-white font-bold truncate max-w-[150px]">{lastAdded.title}</span>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-black" />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
