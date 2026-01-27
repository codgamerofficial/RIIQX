"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ArrowRight, LayoutGrid, Shirt, Footprints, Watch } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "men" | "women" | "gear";

const CATEGORY_DATA = {
    men: {
        highlights: [
            { id: 1, title: "New Arrivals", image: "/assets/marketing/design-02.png", link: "/new-arrivals?gender=men" },
            { id: 2, title: "Oversized Tees", image: "/assets/marketing/design-02.png", link: "/collections/oversized-tees" },
            { id: 3, title: "Tech Hoodies", image: "/assets/marketing/design-02.png", link: "/collections/hoodies" },
            { id: 4, title: "Cargo Pants", image: "/assets/marketing/design-02.png", link: "/collections/cargo" },
        ],
        accordions: [
            {
                title: "Topwear",
                items: [
                    { title: "All Topwear", image: "/assets/marketing/design-02.png", link: "/collections/topwear" },
                    { title: "T-Shirts", image: "/assets/marketing/design-02.png", link: "/collections/t-shirts" },
                    { title: "Hoodies & Sweatshirts", image: "/assets/marketing/design-02.png", link: "/collections/hoodies" },
                    { title: "Jackets", image: "/assets/marketing/design-02.png", link: "/collections/jackets" },
                ]
            },
            {
                title: "Bottomwear",
                items: [
                    { title: "All Bottomwear", image: "/assets/marketing/design-02.png", link: "/collections/bottomwear" },
                    { title: "Cargo Pants", image: "/assets/marketing/design-02.png", link: "/collections/cargo" },
                    { title: "Joggers", image: "/assets/marketing/design-02.png", link: "/collections/joggers" },
                    { title: "Shorts", image: "/assets/marketing/design-02.png", link: "/collections/shorts" },
                ]
            }
        ]
    },
    women: {
        highlights: [
            { id: 1, title: "New Arrivals", image: "/assets/marketing/design-02.png", link: "/new-arrivals?gender=women" },
            { id: 2, title: "Crop Tops", image: "/assets/marketing/design-02.png", link: "/collections/crop-tops" },
            { id: 3, title: "Dresses", image: "/assets/marketing/design-02.png", link: "/collections/dresses" },
            { id: 4, title: "Co-ords", image: "/assets/marketing/design-02.png", link: "/collections/coords" },
        ],
        accordions: [
            {
                title: "Topwear",
                items: [
                    { title: "All Topwear", image: "/assets/marketing/design-02.png", link: "/collections/topwear" },
                    { title: "Tops", image: "/assets/marketing/design-02.png", link: "/collections/tops" },
                    { title: "Hoodies", image: "/assets/marketing/design-02.png", link: "/collections/hoodies" },
                ]
            },
            {
                title: "Bottomwear",
                items: [
                    { title: "Jeans", image: "/assets/marketing/design-02.png", link: "/collections/jeans" },
                    { title: "Skirts", image: "/assets/marketing/design-02.png", link: "/collections/skirts" },
                ]
            }
        ]
    },
    gear: {
        highlights: [
            { id: 1, title: "Backpacks", image: "/assets/marketing/design-02.png", link: "/collections/backpacks" },
            { id: 2, title: "Sneakers", image: "/assets/marketing/design-01.png", link: "/collections/sneakers" },
            { id: 3, title: "Caps", image: "/assets/marketing/design-02.png", link: "/collections/caps" },
        ],
        accordions: [
            {
                title: "Accessories",
                items: [
                    { title: "Bags", image: "/assets/marketing/design-02.png", link: "/collections/bags" },
                    { title: "Footwear", image: "/assets/marketing/design-01.png", link: "/collections/footwear" },
                    { title: "Jewelry", image: "/assets/marketing/design-02.png", link: "/collections/jewelry" },
                ]
            }
        ]
    }
};

export function CategoryDiscovery() {
    const [activeTab, setActiveTab] = useState<Tab>("men");
    const [openAccordion, setOpenAccordion] = useState<string | null>("Topwear");

    const data = CATEGORY_DATA[activeTab];

    return (
        <section className="py-24 bg-[#050505] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white font-display mb-2">
                            Shop Categories
                        </h2>
                        <p className="text-white/40 text-sm tracking-widest uppercase">
                            Explore the Collection
                        </p>
                    </div>

                    {/* Segmented Tabs */}
                    <div className="flex bg-white/5 p-1 rounded-full backdrop-blur-sm border border-white/10 self-start md:self-auto">
                        {(["men", "women", "gear"] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all relative overflow-hidden",
                                    activeTab === tab ? "text-black" : "text-white/60 hover:text-white"
                                )}
                            >
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{tab}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Highlights Scroller */}
                <div className="mb-16">
                    <motion.div
                        key={`${activeTab}-highlights`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x"
                    >
                        {data.highlights.map((item) => (
                            <Link
                                key={item.id}
                                href={item.link}
                                className="flex-shrink-0 w-[200px] md:w-[260px] group relative snap-start"
                            >
                                <div className="aspect-[4/5] bg-[#0B0B0B] rounded-2xl overflow-hidden border border-white/5 relative mb-3">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <span className="text-white font-bold uppercase tracking-tight text-lg group-hover:text-accent transition-colors">
                                            {item.title}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                </div>

                {/* Accordions */}
                <div className="space-y-4">
                    {data.accordions.map((section) => (
                        <div key={section.title} className="border-b border-white/10 pb-4">
                            <button
                                onClick={() => setOpenAccordion(openAccordion === section.title ? null : section.title)}
                                className="w-full flex items-center justify-between py-4 text-white hover:text-accent transition-colors group"
                            >
                                <span className="text-xl md:text-2xl font-black uppercase tracking-tight font-display">
                                    {section.title}
                                </span>
                                <ChevronDown
                                    className={cn(
                                        "w-5 h-5 transition-transform duration-300",
                                        openAccordion === section.title ? "rotate-180" : "group-hover:translate-y-1"
                                    )}
                                />
                            </button>

                            <AnimatePresence>
                                {openAccordion === section.title && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                                            {section.items.map((subItem) => (
                                                <Link key={subItem.title} href={subItem.link} className="group flex gap-4 items-center p-3 rounded-xl hover:bg-white/5 transition-colors">
                                                    <div className="w-16 h-16 rounded-lg bg-neutral-900 relative overflow-hidden flex-shrink-0 border border-white/5">
                                                        <Image
                                                            src={subItem.image}
                                                            alt={subItem.title}
                                                            fill
                                                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold uppercase tracking-wide text-white/70 group-hover:text-white transition-colors">
                                                        {subItem.title}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
