"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = [
    {
        id: 1,
        name: "Cybernetics",
        description: "Futuristic tech-wear essentials",
        image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=3000&auto=format&fit=crop",
        href: "/shop?q=Cybernetics",
        colSpan: "md:col-span-2",
    },
    {
        id: 2,
        name: "Noir",
        description: "Dark, sleek, and mysterious",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop",
        href: "/shop?q=Noir",
        colSpan: "md:col-span-1",
    },
    {
        id: 3,
        name: "Neon Lights",
        description: "Vibrant colors for the bold",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
        href: "/shop?q=Neon",
        colSpan: "md:col-span-1",
    },
    {
        id: 4,
        name: "Accessories",
        description: "Complete your loadout",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2000&auto=format&fit=crop",
        href: "/accessories",
        colSpan: "md:col-span-2",
    },
];

export function FeaturedCategories() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-white">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">FEATURED</span> DROPS
                    </h2>
                    <p className="text-muted-foreground max-w-md">
                        Explore our curated collections designed for the modern aesthetic.
                    </p>
                </div>
                <Link href="/collections" className="group flex items-center space-x-2 text-white font-medium hover:text-primary transition-colors">
                    <span>View All Collections</span>
                    <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative h-[400px] overflow-hidden rounded-2xl border border-white/10 ${category.colSpan}`}
                    >
                        <Link href={category.href} className="block w-full h-full">
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-8 z-10 translate-y-2 group-hover:translate-y-0 transition-transform">
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-sm text-gray-300">{category.description}</p>
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
