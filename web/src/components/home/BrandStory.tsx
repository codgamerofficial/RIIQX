"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Zap } from "lucide-react";
import Link from "next/link";

const PRODUCTS_SHOWCASE = [
    { name: "VARSITY JACKETS", image: "/assets/hero/slide-captains.jpg" },
    { name: "HEAVYWEIGHT HOODIES", image: "/assets/hero/slide-savage.jpg" },
    { name: "TECH SWEATSHIRTS", image: "/assets/hero/slide-grunge-group.jpg" },
    { name: "PERFORMANCE PANTS", image: "/assets/hero/slide-run.jpg" },
    { name: "DRAWSTRING BAGS", image: "/assets/hero/slide-ipl-teams-1.jpg" },
    { name: "URBAN BACKPACKS", image: "/assets/hero/slide-ipl-teams-2.jpg" },
    { name: "GRAPHIC TEES", image: "/assets/hero/slide-csk-dhoni.jpg" },
    { name: "ESSENTIAL GEAR", image: "/assets/hero/slide-mindset-group.jpg" }
];

export function BrandStory() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

    return (
        <section ref={containerRef} className="min-h-screen py-32 bg-[#050505] relative flex items-center overflow-hidden border-t border-white/5">
            {/* 3D Background Text */}
            <motion.div style={{ x }} className="absolute h-full w-[200%] top-0 left-0 flex flex-col justify-center opacity-[0.03] pointer-events-none select-none z-0">
                <h1 className="text-[20vw] font-black uppercase font-display leading-[0.8] text-white whitespace-nowrap">
                    Premium Gear RIIQX
                </h1>
                <h1 className="text-[20vw] font-black uppercase font-display leading-[0.8] text-white whitespace-nowrap ml-48">
                    Varsity Tech
                </h1>
            </motion.div>

            <div className="max-w-[1800px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">

                {/* Left: Aggressive Typography */}
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="h-px w-12 bg-accent"></span>
                            <span className="text-accent text-sm font-black uppercase tracking-[0.3em] font-mono">
                                The Collection 2026
                            </span>
                        </div>

                        <h2 className="text-7xl md:text-[7rem] font-black text-white leading-[0.85] font-display uppercase tracking-tighter mb-12 mix-blend-difference">
                            Built For <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">The Elite.</span>
                        </h2>

                        <p className="text-2xl text-white/50 font-light leading-relaxed max-w-xl mb-12">
                            Dominating the streets with <strong className="text-white">Heavyweight Hoodies</strong>, <strong className="text-white">Premium Varsity Jackets</strong>, and <strong className="text-white">Tech Accessories</strong>.
                            Engineered for those who demand power in every thread.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/shop" className="group relative px-8 py-4 bg-white text-black font-black uppercase tracking-wider overflow-hidden">
                                <span className="relative z-10 flex items-center gap-2">
                                    Shop Collection <ArrowUpRight className="w-5 h-5" />
                                </span>
                                <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                            </Link>
                            <Link href="/about" className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
                                Explore The Lores
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Right: 3D Product Slider */}
                <div className="relative h-[800px] w-full perspective-[2000px] group">
                    {/* Tilted Container */}
                    <div className="absolute inset-0 transform rotate-y-[-15deg] rotate-x-[5deg] scale-90 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-100 ease-out">

                        <div className="relative h-full w-full overflow-hidden clip-path-slant bg-[#0A0A0A] border border-white/10 shadow-2xl">
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

                            {/* Infinite Vertical Slider for maximum "Feed" look */}
                            <motion.div
                                className="flex flex-col"
                                animate={{
                                    y: ["0%", "-50%"]
                                }}
                                transition={{
                                    y: {
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        duration: 25,
                                        ease: "linear",
                                    },
                                }}
                            >
                                {/* Quadruple the array for seamless vertical loop */}
                                {[...PRODUCTS_SHOWCASE, ...PRODUCTS_SHOWCASE, ...PRODUCTS_SHOWCASE, ...PRODUCTS_SHOWCASE].map((product, i) => (
                                    <div
                                        key={i}
                                        className="relative w-full h-[300px] flex-shrink-0 border-b border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden"
                                    >
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                                        />

                                        {/* Product Label Overlay (Big Brand Style) */}
                                        <div className="absolute bottom-6 left-6 z-30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap className="w-4 h-4 text-accent fill-accent" />
                                                <span className="text-[10px] bg-accent text-black px-2 py-0.5 font-bold uppercase tracking-widest">In Stock</span>
                                            </div>
                                            <h3 className="text-4xl font-black text-white uppercase font-display italic leading-none drop-shadow-lg">
                                                {product.name}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    {/* Decorative 3D Elements */}
                    <div className="absolute -z-10 top-20 -right-20 w-full h-full border-2 border-white/5 rounded-[40px] transform rotate-6 scale-95" />
                    <div className="absolute -z-20 top-10 -right-10 w-full h-full bg-accent/5 blur-3xl rounded-full" />
                </div>
            </div>
        </section>
    );
}
