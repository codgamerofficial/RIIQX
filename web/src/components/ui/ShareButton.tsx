"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string;
    className?: string;
}

export function ShareButton({ title, text, url, className }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const shareUrl = url || window.location.href;
        const shareData = {
            title: title,
            text: text || `Check out ${title} on RIIQX`,
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    return (
        <motion.button
            onClick={handleShare}
            className={cn(
                "relative flex items-center justify-center p-2 rounded-full transition-all duration-300 group overflow-hidden",
                copied ? "bg-[#B4F000] text-black" : "bg-white/5 text-white/60 hover:text-[#B4F000] hover:bg-white/10",
                className
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Share Product"
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <Check className="w-4 h-4" strokeWidth={3} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="share"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <Share2 className="w-4 h-4" strokeWidth={2} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tooltip for Copy Feedback */}
            <AnimatePresence>
                {copied && (
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#B4F000] text-black text-[9px] font-black uppercase px-2 py-1 rounded-sm whitespace-nowrap pointer-events-none"
                    >
                        Copied!
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
