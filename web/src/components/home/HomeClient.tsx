"use client";

import { useState } from "react";
import { OpeningSequence } from "@/components/OpeningSequence";
import { Hero3D } from "@/components/Hero3D";
import { Product } from "@/lib/shopify/types";
import { BrandStory } from "@/components/home/BrandStory";
import { NewDrops } from "@/components/home/NewDrops";
import { HorizontalGallery } from "@/components/home/HorizontalGallery";
import { EditorialSection } from "@/components/home/EditorialSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ParticleSystem } from "@/components/ui/ParticleSystem";
import { motion, AnimatePresence } from "framer-motion";

interface HomeClientProps {
    newArrivals: Product[];
    heroProducts: Product[];
}

export function HomeClient({ newArrivals, heroProducts }: HomeClientProps) {
    const [showOpening, setShowOpening] = useState(true);

    return (
        <main className="flex flex-col min-h-screen bg-[#0B0B0B] text-white overflow-x-hidden">
            <OpeningSequence onComplete={() => setShowOpening(false)} />

            <AnimatePresence>
                {!showOpening && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <ParticleSystem count={150} color="#7C3AED" size={0.03} />

                        {/* 3D Hero Section */}
                        <Hero3D products={heroProducts} />

                        <BrandStory />

                        <div className="relative z-10 bg-[#0B0B0B]">
                            <NewDrops products={newArrivals} />
                            <HorizontalGallery />
                            <EditorialSection />
                            <TestimonialsSection />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
