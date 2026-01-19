"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Collection } from "@/lib/shopify/types";

interface TrendingCategoriesProps {
    collections: Collection[];
}

export function TrendingCategories({ collections }: TrendingCategoriesProps) {
    if (!collections || collections.length === 0) return null;

    return (
        <section className="py-16 bg-neutral-50">
            <div className="max-w-7xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bewakoof-section-header text-3xl md:text-4xl mb-12 text-black"
                >
                    Trending Categories
                </motion.h2>

                <div className="bewakoof-category-grid">
                    {collections.slice(0, 6).map((collection, idx) => (
                        <motion.div
                            key={collection.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link
                                href={`/collections/${collection.handle}`}
                                className="group block relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                {collection.image && (
                                    <Image
                                        src={collection.image.url}
                                        alt={collection.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="font-montserrat font-bold text-white text-center uppercase text-sm md:text-base">
                                        {collection.title}
                                    </h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
