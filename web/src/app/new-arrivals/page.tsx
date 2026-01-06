"use client";

import { CinematicHero } from "@/components/ui/CinematicHero";
import { ProductCard } from "@/components/shop/ProductCard"; // Assuming you have a reusable card, or I'll implement a grid if not
import { motion } from "framer-motion";

// Placeholder products - in a real app, you'd fetch this data
const products = [
    { id: 1, name: "Neon Hoodie", price: 89, image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=2000&auto=format&fit=crop" },
    { id: 2, name: "Cyberpunk Jacket", price: 149, image: "https://images.unsplash.com/photo-1551028919-38f1ebc9664c?q=80&w=2000&auto=format&fit=crop" },
    { id: 3, name: "Void Tee", price: 45, image: "https://images.unsplash.com/photo-1523396870777-191237e172aa?q=80&w=2000&auto=format&fit=crop" },
    { id: 4, name: "Tactical Vest", price: 120, image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=2000&auto=format&fit=crop" },
];

export default function NewArrivalsPage() {
    return (
        <main className="bg-black min-h-screen pb-20">
            <CinematicHero
                title="NEW ARRIVALS"
                subtitle="Fresh Drops"
            />

            <section className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-white/5 border border-white/10">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="w-full bg-white text-black font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                        View Product
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 space-y-1">
                                <h3 className="text-lg font-bold text-white">{product.name}</h3>
                                <p className="text-gray-400">${product.price}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
