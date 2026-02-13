"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Bot, Loader2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function StylistSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "I am RIIQX AI. Ready to upgrade your aesthetic. What are we looking for?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: "user" as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/stylist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!res.ok) throw new Error("Failed");

            const data = await res.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "System glitch. Try again." }]);
        } finally {
            setLoading(false);
        }
    };

    // Helper to render markdown-like links as buttons (simple parser)
    const renderContent = (text: string) => {
        // Regex to find [Title](handle) patterns
        const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

        return parts.map((part, i) => {
            const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
            if (match) {
                const [_, title, handle] = match;
                return (
                    <a
                        key={i}
                        href={`/product/${handle}`}
                        className="inline-flex items-center gap-1 text-[#B4F000] hover:underline font-bold"
                    >
                        <ShoppingBag className="w-3 h-3" />
                        {title}
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <>
            {/* Toggle Button */}
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 bg-[#B4F000] text-black w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(180,240,0,0.6)] hover:scale-110 transition-transform hover:shadow-[0_0_50px_rgba(180,240,0,0.8)] border border-black/10",
                    isOpen && "hidden"
                )}
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
            >
                <Sparkles className="w-7 h-7 stroke-[2.5px]" />
            </motion.button>

            {/* Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[60] w-full md:w-[400px] bg-[#050505] border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#B4F000] animate-pulse" />
                                <span className="font-['Teko'] text-xl uppercase tracking-wide text-white">RIIQX AI</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm" ref={scrollRef}>
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex gap-3 max-w-[90%]",
                                        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                        msg.role === "user" ? "bg-white text-black" : "bg-[#B4F000] text-black"
                                    )}>
                                        {msg.role === "user" ? "YOU" : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-lg text-xs md:text-sm leading-relaxed",
                                        msg.role === "user"
                                            ? "bg-white text-black rounded-tr-none"
                                            : "bg-white/5 text-white/80 border border-white/10 rounded-tl-none"
                                    )}>
                                        {renderContent(msg.content)}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#B4F000] text-black flex items-center justify-center">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg rounded-tl-none flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin text-[#B4F000]" />
                                        <span className="text-white/40 text-xs">Analyzing catalog...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for style advice..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[#B4F000]/50 transition-colors font-mono placeholder:text-white/20"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#B4F000] text-black rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
