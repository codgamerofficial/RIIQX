"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function EditorialSection() {
    return (
        <section className="py-32 bg-[#0B0B0B] overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

                    {/* Left: Text Block (Sticky-ish feel) */}
                    <div className="md:col-span-4 space-y-12 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-accent text-xs font-bold uppercase tracking-widest mb-4 block">
                                The Philosophy
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white font-display leading-[0.9]">
                                Beyond
                                <br />
                                The
                                <br />
                                Fabric
                            </h2>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-white/60 text-lg leading-relaxed max-w-sm"
                        >
                            RIIQX isn't just clothing. It's an armor for the digital age.
                            Combining high-performance tech fabrics with cyberpunk aesthetics
                            to create the uniform of tomorrow.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Link href="/about" className="inline-block text-white border-b border-white pb-1 font-bold uppercase tracking-widest hover:text-accent hover:border-accent transition-colors">
                                Read Our Story
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: Asymmetric Image Grid */}
                    <div className="md:col-span-8 relative">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Image 1 - Large vertical */}
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="relative aspect-[3/4] md:translate-y-24"
                            >
                                <div className="absolute inset-0 bg-neutral-800 rounded-sm overflow-hidden">
                                    {/* Placeholder styling since we might not have 'design-01' */}
                                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center text-white/10 font-black text-4xl uppercase">
                                        Vision
                                    </div>
                                    {/* Try to use mock if available */}
                                    <Image
                                        src="/assets/marketing/design-02.png" // Reusing available asset for now
                                        alt="Editorial Vision"
                                        fill
                                        className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                            </motion.div>

                            {/* Image 2 - Smaller offset */}
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                className="relative aspect-square self-end"
                            >
                                <div className="absolute inset-0 bg-neutral-900 rounded-sm overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-tl from-accent/20 to-black flex items-center justify-center text-white/10 font-black text-4xl uppercase">
                                        Craft
                                    </div>
                                    {/* Fallback to color blocks if image fails, but using consistent placeholder */}
                                    {/* <Image ... /> if we had another asset */}
                                </div>
                                <div className="absolute -bottom-8 -left-8 md:-left-24 bg-accent p-6 text-black rounded-sm max-w-[200px]">
                                    <p className="font-bold text-xs uppercase tracking-widest leading-relaxed">
                                        "The most comfortable hoodie I've ever owned."
                                    </p>
                                    <span className="block mt-2 text-[10px] font-mono opacity-80">— HYPEBEAST</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
