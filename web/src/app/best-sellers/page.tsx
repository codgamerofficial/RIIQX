"use client";

import { CinematicHero } from "@/components/ui/CinematicHero";
import { motion } from "framer-motion";

const products = [
    { id: 1, name: "Stealth Cargo Pants", price: 95, image: "https://images.unsplash.com/photo-1517445312882-64159f4d896f?q=80&w=2000&auto=format&fit=crop" },
    { id: 2, name: "Obsidian Bomber", price: 180, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2000&auto=format&fit=crop" },
    { id: 3, name: "Tech Runner", price: 150, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000&auto=format&fit=crop" },
];

export default function BestSellersPage() {
    return (
        <main className="bg-black min-h-screen pb-20">
            <CinematicHero
                title="BEST SELLERS"
                subtitle="Community Favorites"
            />

            <section className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="aspect-square overflow-hidden rounded-2xl bg-white/5 border border-white/10 relative">
                                <div className="absolute top-4 left-4 z-10 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Top Rated
                                </div>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-linear-to-t from-black via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                                    <div className="flex justify-between items-center">
                                        <p className="text-primary font-bold text-lg">${product.price}</p>
                                        <button className="text-sm font-bold text-white border-b border-white">Buy Now</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
