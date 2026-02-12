"use client";

import { motion } from "framer-motion";

export default function Manifesto() {
    return (
        <section className="bg-[#0a0a0a] text-white py-32 px-6 relative overflow-hidden">
            {/* Subtle background texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(180,240,0,0.03),transparent_70%)]" />

            <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
                {/* Brand Name */}
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-5xl md:text-7xl font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-oswald)]"
                >
                    RIIQX
                </motion.h2>

                {/* Accent line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-24 h-[1px] bg-[#B4F000] mx-auto"
                />

                {/* Primary Statement */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-gray-400 leading-relaxed"
                >
                    RIIQX is built on presence.
                    <br />
                    We don&apos;t follow trends.
                    <br />
                    We design identity.
                </motion.p>

                {/* Secondary Statement */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
                >
                    Every release is intentional.
                    <br />
                    Limited. Structured. Refined.
                    <br />
                    Made for those who don&apos;t need validation —
                    <br />
                    only impact.
                </motion.p>

                {/* Engineered Presence tagline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="pt-8"
                >
                    <span className="text-xs uppercase tracking-[0.5em] text-gray-600 font-mono">
                        Engineered Presence
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
