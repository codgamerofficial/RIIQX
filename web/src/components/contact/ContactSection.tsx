"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function ContactSection() {
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
                <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-center">
                    {/* Left Side - Image with Stripes */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="md:col-span-2 relative"
                    >
                        {/* Vertical Stripes */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24">
                            <div className="w-full h-full" style={{
                                background: 'repeating-linear-gradient(0deg, black, black 20px, white 20px, white 40px)'
                            }} />
                        </div>

                        {/* Professional Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative ml-20 md:ml-32 aspect-[3/4] overflow-hidden"
                        >
                            <Image
                                src="/assets/team/contact-person.jpg"
                                alt="Contact person"
                                fill
                                className="object-cover grayscale"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="md:col-span-3 space-y-8"
                    >
                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight"
                        >
                            CONTACT US
                        </motion.h2>

                        {/* Address */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="space-y-2"
                        >
                            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
                                Contai, East Medinipur, West Bengal, India, 721401
                            </p>
                        </motion.div>

                        {/* Contact Grid */}
                        <div className="grid md:grid-cols-2 gap-6 pt-4">
                            {/* Email */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="space-y-2"
                            >
                                <h3 className="text-white font-bold text-lg uppercase tracking-wider">Email</h3>
                                <Link
                                    href="mailto:thelegacyoars@gmail.com"
                                    className="text-white/70 hover:text-lime-400 transition-colors duration-300 block"
                                >
                                    thelegacyoars@gmail.com
                                </Link>
                            </motion.div>

                            {/* Website */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="space-y-2"
                            >
                                <h3 className="text-white font-bold text-lg uppercase tracking-wider">Website</h3>
                                <Link
                                    href="https://www.riiqx.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/70 hover:text-lime-400 transition-colors duration-300 block"
                                >
                                    www.riiqx.in
                                </Link>
                            </motion.div>

                            {/* Social Media */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="space-y-2"
                            >
                                <h3 className="text-white font-bold text-lg uppercase tracking-wider">Social Media</h3>
                                <Link
                                    href="https://instagram.com/iam.riik"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/70 hover:text-lime-400 transition-colors duration-300 block"
                                >
                                    @iam.riik
                                </Link>
                            </motion.div>

                            {/* Phone Number */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="space-y-2"
                            >
                                <h3 className="text-white font-bold text-lg uppercase tracking-wider">Phone Number</h3>
                                <Link
                                    href="tel:+918145172429"
                                    className="text-white/70 hover:text-lime-400 transition-colors duration-300 block"
                                >
                                    +91 8145172429
                                </Link>
                            </motion.div>
                        </div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="pt-6"
                        >
                            <Link href="/contact">
                                <motion.button
                                    className="px-8 py-4 bg-white text-black font-bold text-lg uppercase tracking-wider rounded-full hover:bg-lime-400 transition-colors duration-300 shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Send Message
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
