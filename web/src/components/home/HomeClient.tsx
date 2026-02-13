"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const OpeningSequence = dynamic(() => import("@/components/OpeningSequence").then(mod => mod.OpeningSequence), { ssr: false });
const HeroSection = dynamic(() => import("@/components/home/HeroSection"));
const FeaturedGrid = dynamic(() => import("@/components/home/FeaturedGrid"));
const Manifesto = dynamic(() => import("@/components/home/Manifesto"));
const Lookbook = dynamic(() => import("@/components/home/Lookbook"));
const Countdown = dynamic(() => import("@/components/home/Countdown"));
const EmailPopup = dynamic(() => import("@/components/home/EmailPopup"), { ssr: false });

interface HomeClientProps {
    newArrivals?: unknown[];
    heroProducts?: unknown[];
    activeDrop?: any;
}

export function HomeClient({ newArrivals = [], heroProducts = [], activeDrop }: HomeClientProps) {
    // Hydration-safe initial state
    const [mounted, setMounted] = useState(false);
    const [showOpening, setShowOpening] = useState(false);

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
                        <OpeningSequence
                            products={heroProducts as any[]}
                            onComplete={handleIntroComplete}
                        />
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content - Always Rendered for SEO and Instant Nav */}
            <div className="relative z-0">
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
