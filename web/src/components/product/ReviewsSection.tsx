"use client";

import { useState, useRef, useEffect } from "react";
import { Star, ThumbsUp, CheckCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";

const FAKE_REVIEWS = [
    {
        id: 1,
        author: "David K.",
        rating: 5,
        date: "2 DAYS AGO",
        title: "WORTH EVERY PENNY",
        content: "The material is unlike anything else I own. It holds its shape perfectly and the fit is exactly as described.",
        verified: true,
        helpful: 12
    },
    {
        id: 2,
        author: "Marcus T.",
        rating: 5,
        date: "1 WEEK AGO",
        title: "FUTURE OF FASHION INDEED",
        content: "I was skeptical about the 'tech pack' claims but this hoodie actually regulates temperature. Insane quality.",
        verified: true,
        helpful: 8
    },
    {
        id: 3,
        author: "Sarah L.",
        rating: 4,
        date: "2 WEEKS AGO",
        title: "GREAT FIT, FAST SHIPPING",
        content: "Love the design. Shipping was super fast too. Only wish it came in more colors.",
        verified: true,
        helpful: 5
    },
    {
        id: 4,
        author: "Alex R.",
        rating: 5,
        date: "3 WEEKS AGO",
        title: "UNMATCHED AESTHETIC",
        content: "This fits the cyberpunk vibe perfectly. The cut is aggressive but comfortable. Definitely buying the pants to match.",
        verified: true,
        helpful: 24
    },
    {
        id: 5,
        author: "Jaxon V.",
        rating: 5,
        date: "1 MONTH AGO",
        title: "SILENT LUXURY CONFIRMED",
        content: "Minimal branding but everyone asks where I got it. The fabric weight is heavy but breathable. 10/10.",
        verified: true,
        helpful: 19
    },
    {
        id: 6,
        author: "Elena M.",
        rating: 4,
        date: "1 MONTH AGO",
        title: "SLIGHTLY OVERSIZED",
        content: "Runs a bit big, but that works for the style. If you want a tight fit, size down. Quality is top tier.",
        verified: true,
        helpful: 7
    }
];

export function ReviewsSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <section className="py-24 bg-[#050505] border-t border-white/5 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid md:grid-cols-12 gap-16">
                    {/* Summary Column (Fixed/Sticky) */}
                    <div className="md:col-span-4 space-y-12 h-fit md:sticky md:top-32">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white font-display mb-8">
                                Reviews (482)
                            </h2>

                            <div className="flex items-center gap-6 mb-8">
                                <span className="text-8xl font-black text-white leading-none">4.9</span>
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-6 h-6 text-accent fill-accent" />
                                        ))}
                                    </div>
                                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Based on 482 Reviews</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-12">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/60">
                                        <span className="w-8">{rating} ★</span>
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: rating === 5 ? '85%' : rating === 4 ? '10%' : '2%' }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-white"
                                            />
                                        </div>
                                        <span className="w-8 text-right">{rating === 5 ? '85' : rating === 4 ? '10' : '2'}%</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full py-5 border border-white/20 text-white font-black uppercase tracking-widest hover:bg-white hover:text-black hover:scale-[1.02] transition-all duration-300"
                            >
                                Write a Review
                            </button>
                        </div>
                    </div>

                    {/* Reviews Feed (Vertical Infinite Scroll) */}
                    <div className="md:col-span-8 relative h-[800px] overflow-hidden mask-gradient-b">
                        {/* Two duplicate lists for infinite scroll */}
                        <div className="animate-marquee-vertical space-y-6 hover:[animation-play-state:paused]">
                            {[...FAKE_REVIEWS, ...FAKE_REVIEWS, ...FAKE_REVIEWS].map((review, idx) => (
                                <ReviewCard key={`${review.id}-${idx}`} review={review} />
                            ))}
                        </div>
                        {/* Gradient Masks */}
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Write Review Modal */}
            <AnimatePresence>
                {isModalOpen && <WriteReviewModal onClose={() => setIsModalOpen(false)} />}
            </AnimatePresence>
        </section>
    );
}

function ReviewCard({ review }: { review: typeof FAKE_REVIEWS[0] }) {
    return (
        <div className="p-8 bg-[#0A0A0A] border border-white/5 hover:border-accent/30 transition-colors duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center font-bold text-white">
                        {review.author.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white tracking-wide uppercase">{review.author}</span>
                            {review.verified && (
                                <span className="flex items-center gap-1 text-[9px] bg-accent/10 text-accent px-2 py-0.5 border border-accent/20 uppercase tracking-widest font-bold">
                                    <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                            )}
                        </div>
                        <span className="text-white/30 text-[10px] font-bold uppercase tracking-wider">{review.date}</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "text-white fill-white" : "text-white/20"}`}
                        />
                    ))}
                </div>
            </div>

            <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{review.title}</h4>
            <p className="text-white/60 leading-relaxed mb-6 font-mono text-sm">"{review.content}"</p>

            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                    <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpful})
                </button>
            </div>
        </div>
    );
}

function WriteReviewModal({ onClose }: { onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl bg-[#080808] border border-white/10 p-12 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />

                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white font-display">Write a Review</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Name</label>
                            <input type="text" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors" placeholder="YOUR NAME" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Email</label>
                            <input type="email" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors" placeholder="YOUR EMAIL" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button" className="group p-1">
                                    <Star className="w-8 h-8 text-white/20 group-hover:text-accent group-hover:fill-accent transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Review</label>
                        <textarea rows={4} className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors resize-none" placeholder="SHARE YOUR THOUGHTS..." />
                    </div>

                    <button className="w-full py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-3 group">
                        <span>Submit Review</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}
