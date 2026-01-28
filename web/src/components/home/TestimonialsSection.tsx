"use client";

import { motion, useAnimationControls } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useEffect, useRef } from "react";

const TESTIMONIALS = [
    {
        id: 1,
        text: "The quality is absolutely insane. Feels like I'm wearing the future.",
        author: "Alex M.",
        role: "Verified Buyer",
        rating: 5
    },
    {
        id: 2,
        text: "RIIQX isn't just a brand, it's a movement. The tech pack hoodie is next level.",
        author: "Sarah K.",
        role: "Fashion Blogger",
        rating: 5
    },
    {
        id: 3,
        text: "Finally, streetwear that actually fits and feels premium. 10/10 recommended.",
        author: "James R.",
        role: "Verified Buyer",
        rating: 5
    },
    {
        id: 4,
        text: "Shipping was super fast and the packaging was an experience in itself.",
        author: "Michael T.",
        role: "Designer",
        rating: 4.8
    }
];

export function TestimonialsSection() {
    return (
        <section className="py-32 bg-[#050505] overflow-hidden relative border-t border-white/5">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 mb-20 text-center relative z-10">
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white font-display mb-6 italic">
                    Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Voices.</span>
                </h2>
                <div className="w-24 h-1 bg-accent mx-auto clip-path-slant" />
            </div>

            {/* Framer Motion Infinite Slider */}
            <div className="relative flex overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-10 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-10 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />

                <motion.div
                    className="flex gap-8 px-8"
                    animate={{
                        x: ["0%", "-50%"]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30, // Slow, premium speed
                            ease: "linear",
                        },
                    }}
                >
                    {/* Double the array for seamless loop */}
                    {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <div
                            key={`${t.id}-${i}`}
                            className="flex-shrink-0 w-[400px] bg-[#080808] border border-white/5 p-10 relative group hover:border-accent transition-all duration-500 clip-path-slant-right-bottom hover:-translate-y-2"
                        >
                            {/* Quote Icon */}
                            <Quote className="absolute top-8 right-8 w-16 h-16 text-white/5 group-hover:text-accent/10 transition-colors" />

                            <div className="flex gap-1.5 mb-8 relative z-10">
                                {[...Array(5)].map((_, idx) => (
                                    <Star
                                        key={idx}
                                        className={`w-4 h-4 ${idx < Math.floor(t.rating) ? "text-white fill-white" : "text-white/10"}`}
                                    />
                                ))}
                            </div>

                            <p className="text-white text-xl font-medium leading-relaxed mb-10 min-h-[90px] relative z-10">
                                "{t.text}"
                            </p>

                            <div className="border-t border-white/10 pt-6 relative z-10">
                                <h4 className="text-white font-black uppercase tracking-widest text-lg font-display italic">
                                    {t.author}
                                </h4>
                                <span className="text-accent text-xs uppercase tracking-[0.25em] font-bold block mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    {t.role}
                                </span>
                            </div>

                            {/* Neon Glow on Hover */}
                            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
