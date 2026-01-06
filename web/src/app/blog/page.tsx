"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const articles = [
    {
        id: 1,
        title: "The Future of Digital Fashion",
        date: "Jan 05, 2026",
        category: "Industry",
        excerpt: "How AR and VR are reshaping the way we interact with clothing in the metaverse.",
        image: "https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=2059&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Designing RIIQX: A Case Study",
        date: "Dec 28, 2025",
        category: "Engineering",
        excerpt: "A deep dive into the tech stack and animation libraries that power our platform.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Sustainability in Print-on-Demand",
        date: "Dec 15, 2025",
        category: "Ethics",
        excerpt: "Reducing waste through AI-driven inventory management and eco-friendly inks.",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2813&auto=format&fit=crop"
    }
];

export default function BlogPage() {
    return (
        <main className="bg-black min-h-screen pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8 gap-8">
                    <div>
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4">
                            TRANSMISSIONS
                        </h1>
                        <p className="text-muted-foreground">Updates, insights, and signals from the H.Q.</p>
                    </div>
                    <div className="flex gap-4">
                        {["All", "Engineering", "Design", "Culture"].map((filter) => (
                            <button key={filter} className="text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest">
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((post, idx) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer space-y-4"
                        >
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden relative border border-white/10">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                                    {post.category}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs font-mono text-white/40">{post.date}</div>
                                <h2 className="text-2xl font-bold text-white group-hover:text-primary transition-colors leading-tight">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </main>
    );
}
