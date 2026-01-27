"use client";

import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const REVIEWS = [
    {
        id: 1,
        author: "David K.",
        rating: 5,
        date: "2 days ago",
        title: "Worth every penny",
        content: "The material is unlike anything else I own. It holds its shape perfectly and the fit is exactly as described.",
        verified: true,
        helpful: 12
    },
    {
        id: 2,
        author: "Marcus T.",
        rating: 5,
        date: "1 week ago",
        title: "Future of fashion indeed",
        content: "I was skeptical about the 'tech pack' claims but this hoodie actually regulates temperature. Insane quality.",
        verified: true,
        helpful: 8
    },
    {
        id: 3,
        author: "Sarah L.",
        rating: 4,
        date: "2 weeks ago",
        title: "Great fit, fast shipping",
        content: "Love the design. Shipping was super fast too. Only wish it came in more colors.",
        verified: true,
        helpful: 5
    }
];

export function ReviewsSection() {
    return (
        <section className="py-24 bg-[#050505] border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid md:grid-cols-12 gap-12">
                    {/* Summary Column */}
                    <div className="md:col-span-4 space-y-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white font-display">
                            Reviews (482)
                        </h2>

                        <div className="flex items-center gap-4">
                            <span className="text-6xl font-black text-white">4.9</span>
                            <div className="space-y-1">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                                    ))}
                                </div>
                                <p className="text-white/40 text-sm font-medium uppercase tracking-wide">Based on 482 Reviews</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/60">
                                    <span className="w-8">{rating} Star</span>
                                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white opacity-80"
                                            style={{ width: rating === 5 ? '85%' : rating === 4 ? '10%' : '2%' }}
                                        />
                                    </div>
                                    <span className="w-8 text-right">{rating === 5 ? '85' : rating === 4 ? '10' : '2'}%</span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                            Write a Review
                        </button>
                    </div>

                    {/* Reviews Grid */}
                    <div className="md:col-span-8 space-y-8">
                        {REVIEWS.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white tracking-wide">{review.author}</span>
                                        {review.verified && (
                                            <span className="flex items-center gap-1 text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                                <CheckCircle className="w-3 h-3" /> Verified
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-white/30 text-xs font-medium uppercase tracking-wider">{review.date}</span>
                                </div>

                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? "text-accent fill-accent" : "text-white/20"}`}
                                        />
                                    ))}
                                </div>

                                <h4 className="text-lg font-bold text-white mb-2">{review.title}</h4>
                                <p className="text-white/70 leading-relaxed mb-6">"{review.content}"</p>

                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                        <ThumbsUp className="w-4 h-4" /> Helpful ({review.helpful})
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
