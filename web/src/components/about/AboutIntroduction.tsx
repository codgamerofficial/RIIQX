"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutIntroduction() {
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
                    {/* Left Side - Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative">
                            {/* Main Heading */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-5xl md:text-6xl font-black text-white mb-12 tracking-tight"
                            >
                                WHO ARE<br />WE?
                            </motion.h2>

                            {/* Image Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Professional Image 1 */}
                                <motion.div
                                    initial={{ opacity: 0, rotate: -5, y: 20 }}
                                    whileInView={{ opacity: 1, rotate: -3, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    whileHover={{ rotate: 0, scale: 1.05 }}
                                    className="relative bg-white p-3 shadow-2xl"
                                >
                                    <div className="relative aspect-[3/4] bg-gray-200">
                                        <Image
                                            src="/assets/team/professional-1.jpg"
                                            alt="Professional headshot"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </motion.div>

                                {/* Professional Image 2 */}
                                <motion.div
                                    initial={{ opacity: 0, rotate: 5, y: 20 }}
                                    whileInView={{ opacity: 1, rotate: 3, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    whileHover={{ rotate: 0, scale: 1.05 }}
                                    className="relative bg-white p-3 shadow-2xl mt-8"
                                >
                                    <div className="relative aspect-[3/4] bg-gray-200">
                                        <Image
                                            src="/assets/team/professional-2.jpg"
                                            alt="Team member"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Globe Icon */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="absolute -bottom-6 left-1/2 -translate-x-1/2"
                            >
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                                    <svg
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="text-black"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Diagonal Stripes */}
                            <div className="absolute -bottom-4 -right-4 w-32 h-8 opacity-80">
                                <div className="w-full h-full bg-white transform -skew-x-12" style={{
                                    background: 'repeating-linear-gradient(45deg, white, white 10px, black 10px, black 20px)'
                                }} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <motion.h3
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                            >
                                INTRODUCTION
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="text-xl md:text-2xl text-white/90 font-light mb-6 leading-relaxed"
                            >
                                Full Stack Developer & QA Engineer.
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="text-lg md:text-xl text-white/80 leading-relaxed mb-8"
                            >
                                Building the impossible, one pixel at a time.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="p-6 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm"
                            >
                                <p className="text-white/70 italic leading-relaxed">
                                    "I am a detail-oriented QA Engineer and Full Stack Developer focused on crafting robust,
                                    scalable digital experiences."
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
