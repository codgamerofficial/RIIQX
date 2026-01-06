"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function BioSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.8", "start 0.2"],
    });

    const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
    const blur = useTransform(scrollYProgress, [0, 1], ["10px", "0px"]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

    return (
        <section ref={containerRef} className="py-32 px-4 bg-black relative">
            <div className="max-w-4xl mx-auto text-center space-y-12">
                <motion.div style={{ opacity, filter: `blur(${blur})`, scale }}>
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        "I am a detail-oriented <span className="text-primary">QA Engineer</span> and <span className="text-primary">Full Stack Developer</span> focused on crafting robust, scalable digital experiences."
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left pt-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold text-white mb-4 border-b border-primary/30 pb-2">My Mission</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Seeking an entry-level QA role to contribute to quality assurance processes, ensure product reliability, and grow within a dynamic organization. My background in computer science and hands-on experience allows me to bridge the gap between development and testing.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold text-white mb-4 border-b border-primary/30 pb-2">Where I Thrive</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            I specialize in software testing fundamentals, SDLC, STLC, and defect lifecycles. Beyond QA, I build futuristic web applications like RIIQX using the latest tech stack including Next.js, React, and Supabase.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
