"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

import { NeonButton } from "@/components/ui/neon-button";

export function HeroSection() {
    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background">
            {/* 2D Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0505] to-black" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=2568&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* @ts-ignore */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wider mb-4 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                        NEXT-GEN APPAREL
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white mb-6">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 pb-2">
                            WEAR THE
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient text-glow">
                            UNIVERSE
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
                        Experience the fusion of cinematic aesthetics and premium streetwear.
                        Designed for the heroes of tomorrow.
                    </p>
                </motion.div>

                {/* @ts-ignore */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/shop">
                        <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-700 to-primary text-white font-medium text-lg flex items-center shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:shadow-[0_0_30px_rgba(109,40,217,0.6)] hover:scale-105 transition-all duration-300 group">
                            <span className="mr-2">Explore Collection</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>

                    <Link href="/showreel">
                        <button className="px-6 py-4 rounded-xl flex items-center text-white/90 hover:text-white hover:bg-white/5 transition-all group">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20 transition-colors">
                                <Play className="w-4 h-4 fill-white ml-0.5" />
                            </div>
                            <span className="font-medium text-lg">Watch Showreel</span>
                        </button>
                    </Link>
                </motion.div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
        </section>
    );
}
