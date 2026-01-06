"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, X, Bot, Sparkles, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
    role: "user" | "bot";
    text: string;
}

export function RiiqxAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", text: "Greetings. I am RIIQX. How can I assist you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Speech Recognition
    const startListening = () => {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = "en-US";
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript);
            };

            recognition.start();
        } else {
            alert("Voice input not supported in this browser.");
        }
    };

    // Text to Speech
    const speak = (text: string) => {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            // Try to find a robotic/Google voice
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.pitch = 0.9; // Slightly lower for "cool" effect
            utterance.rate = 1.1;  // Slightly faster
            window.speechSynthesis.speak(utterance);
        }
    };

    // Command Processor
    const processCommand = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.includes("shop") || lower.includes("store") || lower.includes("buy")) {
            router.push("/shop");
            return "Navigating to the collection.";
        }
        if (lower.includes("home")) {
            router.push("/");
            return "Returning to headquarters.";
        }
        if (lower.includes("login") || lower.includes("sign in")) {
            router.push("/auth");
            return "Opening authentication portal.";
        }
        if (lower.includes("cart") || lower.includes("checkout")) {
            // Logic to open cart would be complex without trigger, just nav if page exists or say msg
            return "You can view your cart by clicking the icon in the top right.";
        }
        return null; // No local command found
    };

    const handleSend = async (textOverride?: string) => {
        const text = textOverride || input;
        if (!text.trim()) return;

        // Add User Message
        const newMessages = [...messages, { role: "user" as const, text }];
        setMessages(newMessages);
        setInput("");
        setIsProcessing(true);

        // 1. Check Local Commands
        const commandResponse = processCommand(text);
        if (commandResponse) {
            setTimeout(() => {
                setMessages(prev => [...prev, { role: "bot", text: commandResponse }]);
                speak(commandResponse);
                setIsProcessing(false);
            }, 500);
            return;
        }

        // 2. Call AI API
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();

            const botReply = data.reply || "I am unable to process that.";
            setMessages(prev => [...prev, { role: "bot", text: botReply }]);
            speak(botReply);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "bot", text: "Connection error. Please retry." }]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-80 sm:w-96 bg-black/80 backdrop-blur-xl border border-primary/40 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.2)] flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-primary/10 p-4 flex justify-between items-center border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Bot className="w-5 h-5 text-primary" />
                                <span className="font-bold text-white tracking-wider">RIIQX AI</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user"
                                            ? "bg-primary text-white rounded-tr-sm"
                                            : "bg-white/10 text-white/90 rounded-tl-sm border border-white/5"
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isProcessing && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100" />
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5 bg-black/40">
                            <div className="flex gap-2">
                                <button
                                    onClick={startListening}
                                    className={`p-2 rounded-full transition-colors ${isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-white/5 text-muted-foreground hover:text-white"}`}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask RIIQX..."
                                    className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/20"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim()}
                                    className="text-primary hover:text-primary/80 disabled:opacity-50 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Orb Trigger */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-full bg-black border border-primary/50 relative flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] group"
            >
                {/* Holographic Ring Animation */}
                <div className="absolute inset-0 rounded-full border border-primary/30 animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-1 rounded-full border border-primary/20 animate-[spin_3s_linear_infinite_reverse]" />

                {/* Center Core */}
                <div className="w-8 h-8 bg-primary/20 rounded-full backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
            </motion.button>
        </div>
    );
}
