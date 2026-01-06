"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function StoryPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <main ref={containerRef} className="bg-black min-h-screen text-white overflow-x-hidden selection:bg-purple-500/30">
            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
                <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-7xl md:text-9xl font-black tracking-tighter text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 z-10"
                >
                    OUR<br />ORIGIN
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 animate-bounce text-xs tracking-[0.2em] text-white/50"
                >
                    SCROLL TO DISCOVER
                </motion.div>
            </section>

            {/* Narrative Sections */}
            <NarrativeBlock
                year="2023"
                title="The Spark"
                text="In a digital landscape saturated with monotony, a single idea emerged. To fuse the cinematic grandeur of the silver screen with the interactivity of the web. RIIQX was born not just as a brand, but as a rebellion against boring e-commerce."
                align="left"
            />

            <NarrativeBlock
                year="2024"
                title="The Forge"
                text="Countless nights of coding. Experimenting with 3D engines, fluid dynamics, and server-side rendering. We built our own design system from scratch, rejecting templates to ensure every pixel breathed unique life."
                align="right"
            />

            <NarrativeBlock
                year="2025"
                title="The Awakening"
                text="RIIQX launched. A platform where fashion meets future tech. Integrating AI-driven personalization with a seamless, glassmorphic UI that feels like it belongs in the year 3000."
                align="left"
            />

            {/* Final Statement */}
            <section className="h-screen flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent" />
                <h2 className="text-4xl md:text-6xl font-bold text-center max-w-4xl px-4 leading-tight">
                    "We don't just sell clothes.<br />
                    <span className="text-purple-500">We engineer identities.</span>"
                </h2>
            </section>
        </main>
    );
}

function NarrativeBlock({ year, title, text, align }: { year: string, title: string, text: string, align: 'left' | 'right' }) {
    return (
        <section className={`py-32 px-4 md:px-20 flex flex-col ${align === 'right' ? 'md:items-end text-right' : 'md:items-start text-left'}`}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-20%" }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl space-y-6"
            >
                <span className="text-8xl font-black text-white/5 absolute -z-10 select-none transform translate-x-[-10%] translate-y-[-20%]">
                    {year}
                </span>
                <h3 className="text-4xl md:text-5xl font-bold text-white relative z-10">{title}</h3>
                <p className="text-xl text-gray-400 leading-relaxed relative z-10">
                    {text}
                </p>
                <div className={`h-1 w-20 bg-purple-500 ${align === 'right' ? 'ml-auto' : 'mr-auto'}`} />
            </motion.div>
        </section>
    );
}
