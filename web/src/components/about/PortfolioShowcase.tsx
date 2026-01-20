"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function PortfolioShowcase() {
    return (
        <section className="relative bg-black py-20 md:py-32 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                    {/* Left Side - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-none"
                            >
                                OUR<br />PORTFOLIO
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-lg"
                            >
                                "We are a detail-oriented QA Engineer and Full Stack Developer focused on crafting
                                robust, scalable digital experiences."
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Link href="/portfolio">
                                    <motion.button
                                        className="group flex items-center gap-3 text-white font-bold text-lg uppercase tracking-wider hover:text-lime-400 transition-colors duration-300"
                                        whileHover={{ x: 10 }}
                                    >
                                        READ MORE
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="group-hover:translate-x-2 transition-transform"
                                        >
                                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                                        </svg>
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Side - Image Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* "FEARLESS" Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="absolute -top-8 left-0 z-10"
                        >
                            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-2 rounded-full">
                                <span className="text-white font-black text-sm tracking-wider">FEARLESS</span>
                            </div>
                        </motion.div>

                        {/* Portfolio Showcase Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="relative w-full aspect-video overflow-hidden rounded-lg group"
                        >
                            <Image
                                src="/assets/portfolio/project-showcase.jpg"
                                alt="Project Portfolio Showcase"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">View Full Portfolio</span>
                            </div>
                        </motion.div>

                        {/* Diagonal Stripes */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="absolute -bottom-4 left-1/4 w-32 h-8"
                        >
                            <div className="w-full h-full bg-white transform -skew-x-12" style={{
                                background: 'repeating-linear-gradient(45deg, white, white 10px, black 10px, black 20px)'
                            }} />
                        </motion.div>

                        {/* Arrow Icon - Bottom Right */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="absolute -bottom-6 -right-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl"
                        >
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-black"
                            >
                                <path d="M7 17L17 7M17 7H7M17 7v10" />
                            </svg>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
