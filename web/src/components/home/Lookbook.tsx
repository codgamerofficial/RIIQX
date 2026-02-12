"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const lookbookImages = [
    {
        src: "/hero/slide-2.png",
        alt: "RIIQX Street Fashion Lookbook",
        label: "Street Fashion",
    },
    {
        src: "/hero/slide-5.png",
        alt: "RIIQX Brand Identity Lookbook",
        label: "Who We Are",
    },
];

export default function Lookbook() {
    return (
        <section className="bg-black py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 flex justify-between items-end"
                >
                    <div>
                        <span className="text-[#B4F000] text-xs font-bold uppercase tracking-[0.3em] block mb-4">
                            Editorial
                        </span>
                        <h2 className="text-4xl md:text-5xl text-white font-bold uppercase font-[family-name:var(--font-oswald)]">
                            Lookbook 2026
                        </h2>
                    </div>
                    <span className="hidden md:block text-gray-600 text-xs uppercase tracking-[0.3em] font-mono">
                        SS26 Collection
                    </span>
                </motion.div>

                {/* Image Grid */}
                <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                    {lookbookImages.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.2 }}
                            className="relative h-[400px] md:h-[600px] group overflow-hidden"
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Hover overlay with label */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-white text-sm uppercase tracking-[0.2em] font-medium">
                                    {img.label}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
