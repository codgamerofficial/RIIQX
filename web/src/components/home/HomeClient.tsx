"use client";

import { useState, useEffect } from "react";
import { OpeningSequence } from "@/components/OpeningSequence";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import FeaturedGrid from "@/components/home/FeaturedGrid";
import Manifesto from "@/components/home/Manifesto";
import Lookbook from "@/components/home/Lookbook";
import Countdown from "@/components/home/Countdown";
import EmailPopup from "@/components/home/EmailPopup";

interface HomeClientProps {
    newArrivals?: unknown[];
    heroProducts?: unknown[];
    activeDrop?: any;
}

export function HomeClient({ newArrivals = [], heroProducts = [], activeDrop }: HomeClientProps) {
    // Hydration-safe initial state
    const [mounted, setMounted] = useState(false);
    const [showOpening, setShowOpening] = useState(true);

    useEffect(() => {
        setMounted(true);
        const hasPlayed = sessionStorage.getItem("riiqx-intro-played");
        if (hasPlayed) {
            setShowOpening(false);
        }
    }, []);

    const handleIntroComplete = () => {
        sessionStorage.setItem("riiqx-intro-played", "true");
        setShowOpening(false);
    };

    // Prevent hydration mismatch by returning null or simple layout on first server render if needed, 
    // but here we want content to be SEO friendly, so we render content by default.
    // The OpeningSequence will be an absolute overlay.

    return (
        <main className="flex flex-col min-h-screen bg-black text-white overflow-x-hidden relative">
            {/* Intro Overlay - Only show if mounted and explicitly true */}
            <AnimatePresence>
                {mounted && showOpening && (
                    <div className="fixed inset-0 z-[100]">
                        <OpeningSequence onComplete={handleIntroComplete} />
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content - Always Rendered for SEO and Instant Nav */}
            <div className={mounted && showOpening ? "opacity-0 h-screen overflow-hidden" : "opacity-100 transition-opacity duration-1000"}>
                {/* Hero Carousel */}
                <HeroSection />

                {/* Premium Product Grid */}
                <FeaturedGrid products={newArrivals as any} />

                {/* Brand Manifesto */}
                <Manifesto />

                {/* Lookbook 2026 */}
                <Lookbook />

                {/* Drop Countdown */}
                <Countdown drop={activeDrop} />

                {/* Email Capture Popup */}
                <EmailPopup />
            </div>
        </main>
    );
}
