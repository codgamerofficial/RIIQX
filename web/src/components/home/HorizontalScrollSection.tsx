"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const items = [
    { id: 1, title: "Cyber Punks", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Neon Nights", image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Future Tech", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" },
    { id: 4, title: "Urban Glitch", image: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=80&w=800&auto=format&fit=crop" },
    { id: 5, title: "Holo World", image: "https://images.unsplash.com/photo-1580447195415-321b0dc56834?q=80&w=800&auto=format&fit=crop" },
];

export function HorizontalScrollSection() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="group relative h-[450px] w-[450px] overflow-hidden rounded-2xl bg-neutral-800 border border-white/10 hover:border-primary/50 transition-colors"
                        >
                            <div
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                                className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                                <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">
                                    {item.title}
                                </h3>
                                <p className="text-primary font-medium mt-2">New Collection 2049</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
