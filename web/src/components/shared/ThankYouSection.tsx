"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function ThankYouSection() {
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
                <div className="relative max-w-6xl mx-auto">
                    {/* Diagonal Stripes - Top */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="absolute -top-8 left-0 w-32 h-8 z-10"
                    >
                        <div className="w-full h-full bg-white transform -skew-x-12" style={{
                            background: 'repeating-linear-gradient(45deg, white, white 10px, black 10px, black 20px)'
                        }} />
                    </motion.div>

                    {/* Main Content */}
                    <div className="grid md:grid-cols-2 gap-0 items-center">
                        {/* Left Side - Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-[4/5] md:aspect-square overflow-hidden"
                        >
                            <Image
                                src="/assets/lifestyle/thank-you-image.jpg"
                                alt="Thank you"
                                fill
                                className="object-cover"
                            />

                            {/* Vertical Text - WWW.RIIQX.IN */}
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
                                <span className="text-white font-black text-2xl md:text-3xl tracking-[0.3em] uppercase">
                                    WWW.RIIQX.IN
                                </span>
                            </div>
                        </motion.div>

                        {/* Right Side - Text */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white p-12 md:p-16 flex items-center justify-center min-h-[400px]"
                        >
                            <div className="text-center">
                                <motion.h2
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="text-6xl md:text-8xl font-black text-black mb-6 tracking-tight leading-none"
                                >
                                    THANK<br />YOU
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                    className="text-black/60 text-lg md:text-xl"
                                >
                                    For being part of our journey
                                </motion.p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Diagonal Stripes - Bottom */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="absolute -bottom-8 right-0 w-32 h-8"
                    >
                        <div className="w-full h-full bg-white transform -skew-x-12" style={{
                            background: 'repeating-linear-gradient(45deg, white, white 10px, black 10px, black 20px)'
                        }} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
