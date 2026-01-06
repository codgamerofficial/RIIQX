"use client";

import { CinematicHero } from "@/components/ui/CinematicHero";
import { motion } from "framer-motion";

const products = [
    { id: 1, name: "Neural Link Cap", price: 35, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=2000&auto=format&fit=crop" },
    { id: 2, name: "Cyber Visor", price: 65, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2000&auto=format&fit=crop" },
    { id: 3, name: "Holo Watch", price: 250, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=2000&auto=format&fit=crop" },
    { id: 4, name: "Utility Belt", price: 55, image: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=2000&auto=format&fit=crop" },
];

export default function AccessoriesPage() {
    return (
        <main className="bg-black min-h-screen pb-20">
            <CinematicHero
                title="ACCESSORIES"
                subtitle="Upgrade Your Loadout"
            />

            <section className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
                        >
                            <div className="aspect-square relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm md:text-md font-bold text-white truncate">{product.name}</h3>
                                <p className="text-xs md:text-sm text-gray-400 mt-1">${product.price}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
