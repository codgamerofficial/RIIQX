"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const trendingProducts = [
    {
        id: "1",
        name: "Void Walker Hoodie",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
        category: "Hoodies",
        rating: 4.8,
    },
    {
        id: "2",
        name: "Cyber Samurai Tee",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
        category: "T-Shirts",
        rating: 4.9,
    },
    {
        id: "3",
        name: "Neon Drift Jacket",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
        category: "Jackets",
        rating: 5.0,
    },
    {
        id: "4",
        name: "Stealth Cargo Pants",
        price: 75.50,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop",
        category: "Bottoms",
        rating: 4.7,
    },
];

export function TrendingCarousel() {
    return (
        <section className="py-24 bg-gradient-to-b from-background to-secondary/5 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-sm font-medium text-secondary tracking-widest uppercase">Best Sellers</span>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
                        TRENDING GEAR
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trendingProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/product/${product.id}`} className="group block h-full">
                                <div className="bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                                    {/* Image */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center space-x-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs font-bold text-white">{product.rating}</span>
                                        </div>

                                        {/* Quick Add Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <button className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-primary hover:text-white transition-colors shadow-lg">
                                                <ShoppingBag className="w-4 h-4" />
                                                <span>Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-5 flex-grow flex flex-col justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
