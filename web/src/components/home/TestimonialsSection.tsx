"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

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
        <section className="py-24 bg-[#050505] overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="max-w-[1400px] mx-auto px-6 mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white font-display mb-4">
                    Community Voices
                </h2>
                <p className="text-white/50 text-sm tracking-widest uppercase">
                    Join 10,000+ Visionaries
                </p>
            </div>

            {/* Marquee Container */}
            <div className="relative flex overflow-x-hidden">
                <div className="flex animate-marquee space-x-8">
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <div
                            key={`${t.id}-${i}`}
                            className="flex-shrink-0 w-[300px] md:w-[400px] p-8 glass rounded-2xl relative group hover:border-accent/50 transition-colors duration-300"
                        >
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-accent/20 transition-colors" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, idx) => (
                                    <Star
                                        key={idx}
                                        className={`w-4 h-4 ${idx < Math.floor(t.rating) ? "text-accent fill-accent" : "text-white/20"}`}
                                    />
                                ))}
                            </div>

                            <p className="text-white/80 text-lg font-medium leading-relaxed mb-6">
                                "{t.text}"
                            </p>

                            <div>
                                <h4 className="text-white font-bold uppercase tracking-wider text-sm">
                                    {t.author}
                                </h4>
                                <span className="text-white/40 text-xs uppercase tracking-widest">
                                    {t.role}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Duplicate for seamless loop - CSS animation handles the movement */}
                <div className="absolute top-0 flex animate-marquee2 space-x-8" aria-hidden="true">
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <div
                            key={`${t.id}-${i}-dup`}
                            className="flex-shrink-0 w-[300px] md:w-[400px] p-8 glass rounded-2xl relative group hover:border-accent/50 transition-colors duration-300"
                        >
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-accent/20 transition-colors" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, idx) => (
                                    <Star
                                        key={idx}
                                        className={`w-4 h-4 ${idx < Math.floor(t.rating) ? "text-accent fill-accent" : "text-white/20"}`}
                                    />
                                ))}
                            </div>

                            <p className="text-white/80 text-lg font-medium leading-relaxed mb-6">
                                "{t.text}"
                            </p>

                            <div>
                                <h4 className="text-white font-bold uppercase tracking-wider text-sm">
                                    {t.author}
                                </h4>
                                <span className="text-white/40 text-xs uppercase tracking-widest">
                                    {t.role}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
