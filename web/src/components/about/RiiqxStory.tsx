"use client";

import { motion } from "framer-motion";
import { Code, Layout, Layers, MousePointer2 } from "lucide-react";

const features = [
    {
        icon: <Layout className="w-8 h-8 text-cyan-400" />,
        title: "Parallax Scrolling",
        desc: "Implemented complex depth perception using Framer Motion's useScroll hook, mapping vertical scroll progress to relative Y-axis transformations for varied element speeds."
    },
    {
        icon: <MousePointer2 className="w-8 h-8 text-purple-400" />,
        title: "Elastic Overscroll",
        desc: "Utilized Lenis for smooth, inertia-based scrolling that mimics mobile-native momentum. Added custom Bezier curves for that premium 'heavy' feel."
    },
    {
        icon: <Layers className="w-8 h-8 text-pink-400" />,
        title: "Scroll-Linked Masking",
        desc: "Dynamic SVG clip-paths that reveal content based on viewport position. The 'Bio' section uses this to sharpen blurry text as it enters the focal area."
    },
    {
        icon: <Code className="w-8 h-8 text-green-400" />,
        title: "Component Architecture",
        desc: "Modular design pattern with isolated animation logic. Each section (Hero, Timeline, TechStack) manages its own scroll context for maximum performance."
    }
];

export function RiiqxStory() {
    return (
        <section className="py-32 px-4 bg-zinc-950 border-t border-white/10">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-16">
                    <div className="flex-1 space-y-8 sticky top-32 h-fit">
                        <h2 className="text-5xl font-black text-white leading-tight">
                            Behind the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                                Architecture
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            RIIQX isn't just an e-commerce store; it's a playground for advanced frontend engineering.
                            I built this to push the boundaries of what's possible in a browser, merging cinematic aesthetics with performant code.
                        </p>
                    </div>

                    <div className="flex-1 grid gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-100px" }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5 }}
                                className="p-8 bg-black border border-white/10 rounded-3xl hover:border-white/20 transition-colors group perspective-1000"
                            >
                                <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-white/10 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
