"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function EmailPopup() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Don't show if already dismissed or subscribed
        const dismissed = sessionStorage.getItem("riiqx_popup_dismissed");
        if (dismissed) return;

        const timer = setTimeout(() => setShow(true), 4000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setShow(false);
        sessionStorage.setItem("riiqx_popup_dismissed", "true");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        // TODO: Connect to Supabase / Resend
        console.log("Email captured:", email);
        setSubmitted(true);

        setTimeout(() => {
            handleClose();
        }, 2000);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9998] px-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="bg-[#111] p-10 md:p-14 max-w-md w-full text-white relative border border-white/5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                            aria-label="Close popup"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Header */}
                                <div className="space-y-3">
                                    <h2 className="text-2xl uppercase tracking-[0.15em] font-bold font-[family-name:var(--font-oswald)]">
                                        Join The Release List
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Be first to know about limited drops.
                                        No spam. Only releases.
                                    </p>
                                </div>

                                {/* Email Input */}
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full bg-black border border-white/20 p-4 text-white text-sm tracking-wider placeholder:text-gray-600 focus:outline-none focus:border-[#B4F000] transition-colors"
                                />

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full border border-white py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300"
                                >
                                    Subscribe
                                </button>

                                {/* Privacy note */}
                                <p className="text-gray-600 text-[10px] uppercase tracking-wider text-center">
                                    We respect your privacy
                                </p>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8 space-y-4"
                            >
                                <div className="w-12 h-12 border border-[#B4F000] rounded-full flex items-center justify-center mx-auto">
                                    <span className="text-[#B4F000] text-xl">✓</span>
                                </div>
                                <h3 className="text-xl uppercase tracking-wider font-bold">
                                    You&apos;re In
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    We&apos;ll notify you before the next drop.
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
