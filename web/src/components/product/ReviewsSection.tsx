"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ThumbsUp, CheckCircle, X, Send, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { getProductReviews, getReviewStats, submitReview, Review } from "@/lib/supabase/reviews";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const FAKE_REVIEWS: Review[] = [
    {
        id: "fake-1",
        product_id: "fake",
        user_id: "fake-u1",
        user_name: "David K.",
        user_email: "fake@email.com",
        rating: 5,
        title: "WORTH EVERY PENNY",
        comment: "The material is unlike anything else I own. It holds its shape perfectly and the fit is exactly as described.",
        verified_purchase: true,
        helpful_count: 12,
        images: [],
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updated_at: new Date().toISOString()
    },
    {
        id: "fake-2",
        product_id: "fake",
        user_id: "fake-u2",
        user_name: "Marcus T.",
        user_email: "fake@email.com",
        rating: 5,
        title: "FUTURE OF FASHION INDEED",
        comment: "I was skeptical about the 'tech pack' claims but this hoodie actually regulates temperature. Insane quality.",
        verified_purchase: true,
        helpful_count: 8,
        images: [],
        created_at: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
        updated_at: new Date().toISOString()
    },
    {
        id: "fake-3",
        product_id: "fake",
        user_id: "fake-u3",
        user_name: "Sarah L.",
        user_email: "fake@email.com",
        rating: 4,
        title: "GREAT FIT, FAST SHIPPING",
        comment: "Love the design. Shipping was super fast too. Only wish it came in more colors.",
        verified_purchase: true,
        helpful_count: 5,
        images: [],
        created_at: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
        updated_at: new Date().toISOString()
    },
    {
        id: "fake-4",
        product_id: "fake",
        user_id: "fake-u4",
        user_name: "Alex R.",
        user_email: "fake@email.com",
        rating: 5,
        title: "UNMATCHED AESTHETIC",
        comment: "This fits the cyberpunk vibe perfectly. The cut is aggressive but comfortable. Definitely buying the pants to match.",
        verified_purchase: true,
        helpful_count: 24,
        images: [],
        created_at: new Date(Date.now() - 1814400000).toISOString(), // 3 weeks ago
        updated_at: new Date().toISOString()
    }
];

export function ReviewsSection({ productId }: { productId: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Initialize with FAKE_REVIEWS directly
    const [reviews, setReviews] = useState<Review[]>(FAKE_REVIEWS);
    const [loading, setLoading] = useState(true);
    // Initialize stats based on fake reviews for immediate display
    const [stats, setStats] = useState({
        averageRating: 4.8,
        totalReviews: 482, // Marketing number
        ratingDistribution: { 5: 350, 4: 100, 3: 20, 2: 10, 1: 2 } as Record<number, number>
    });

    // Fetch reviews
    const fetchReviews = async () => {
        try {
            // Keep fake reviews while loading real ones
            const [reviewsData, statsData] = await Promise.all([
                getProductReviews(productId).catch(() => []),
                getReviewStats(productId).catch(() => ({ averageRating: 0, totalReviews: 0, ratingDistribution: {} }))
            ]);

            // If we have real reviews, put them first, otherwise keep showing fakes
            if (reviewsData.length > 0) {
                setReviews([...reviewsData, ...FAKE_REVIEWS]);
                // Merge stats logic (simplified for now, prioritizes real stats if significant, or blends)
                setStats(statsData.totalReviews > 0 ? statsData : {
                    averageRating: 4.8,
                    totalReviews: 482 + reviewsData.length,
                    ratingDistribution: { ...stats.ratingDistribution, 5: stats.ratingDistribution[5] + reviewsData.length }
                });
            } else {
                setReviews(FAKE_REVIEWS);
            }

        } catch (error) {
            console.error("Error fetching reviews:", error);
            // Fallback to fakes is already handled by initial state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchReviews();
    }, [productId]);

    // Slider Logic
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section className="py-24 bg-[#050505] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-16 items-start">
                    {/* Summary Header (Left Side) */}
                    <div className="w-full md:w-1/3 space-y-10 sticky top-32">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white font-display mb-8">
                                Reviews ({stats.totalReviews})
                            </h2>

                            <div className="flex items-center gap-6 mb-8">
                                <span className="text-8xl font-black text-white leading-none">{stats.averageRating.toFixed(1)}</span>
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-6 h-6 ${i < Math.round(stats.averageRating) ? "text-accent fill-accent" : "text-white/20"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Based on {stats.totalReviews} Reviews</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-12">
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count = stats.ratingDistribution[rating] || 0;
                                    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                                    return (
                                        <div key={rating} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/60">
                                            <span className="w-8">{rating} ★</span>
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full bg-white"
                                                />
                                            </div>
                                            <span className="w-8 text-right">{Math.round(percentage)}%</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full py-5 border border-white/20 text-white font-black uppercase tracking-widest hover:bg-white hover:text-black hover:scale-[1.02] transition-all duration-300"
                            >
                                Write a Review
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Slider (Right Side) */}
                    <div className="w-full md:w-2/3 overflow-visible">
                        {loading ? (
                            <div className="h-64 flex items-center justify-center text-white/20">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-white/20 border border-white/5 rounded-xl bg-white/[0.02]">
                                <Star className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-bold uppercase tracking-widest text-sm">No reviews yet</p>
                                <p className="text-xs mt-2">Be the first to share your thoughts.</p>
                            </div>
                        ) : (
                            <div className="relative group cursor-grab active:cursor-grabbing" ref={containerRef}>
                                <motion.div
                                    className="flex gap-6"
                                    drag="x"
                                    dragConstraints={containerRef}
                                    whileTap={{ cursor: "grabbing" }}
                                >
                                    {reviews.map((review) => (
                                        <motion.div
                                            key={review.id}
                                            className="min-w-[320px] md:min-w-[400px] p-8 bg-[#0A0A0A] border border-white/5 hover:border-accent/30 transition-colors duration-300 rounded-lg flex flex-col h-[350px]"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center font-bold text-white uppercase">
                                                        {review.user_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-white tracking-wide uppercase text-sm truncate max-w-[120px]">{review.user_name}</span>
                                                            {review.verified_purchase && (
                                                                <span className="flex items-center gap-1 text-[9px] bg-accent/10 text-accent px-2 py-0.5 border border-accent/20 uppercase tracking-widest font-bold rounded-sm">
                                                                    <CheckCircle className="w-3 h-3" /> Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-white/30 text-[10px] font-bold uppercase tracking-wider block mt-1">
                                                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3.5 h-3.5 ${i < review.rating ? "text-white fill-white" : "text-white/20"}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <h4 className="text-lg font-black text-white mb-3 uppercase tracking-tight line-clamp-2">{review.title}</h4>
                                            <p className="text-white/60 leading-relaxed mb-6 font-mono text-sm line-clamp-4 flex-grow">"{review.comment}"</p>

                                            <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-auto">
                                                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                                                    <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpful_count})
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        )}

                        <div className="flex gap-4 mt-8 justify-end opacity-50">
                            <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest">
                                Drag to explore
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Write Review Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <WriteReviewModal
                        productId={productId}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={() => {
                            fetchReviews();
                            toast.success("Review submitted for approval!");
                        }}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

function WriteReviewModal({ onClose, productId, onSuccess }: { onClose: () => void, productId: string, onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(5);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const title = formData.get("title") as string;
        const comment = formData.get("comment") as string;

        try {
            await submitReview({
                product_id: productId,
                user_name: name,
                user_email: email,
                user_id: null,
                rating,
                title,
                comment,
                verified_purchase: false,
                images: []
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to submit review:", error);
            toast.error("Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    // Use createPortal to break out of stacking context
    const { createPortal } = require('react-dom');

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ type: "spring", damping: 25, stiffness: 350, mass: 0.5 }}
                className="w-full max-w-2xl bg-[#080808] border border-white/10 p-8 md:p-12 relative overflow-hidden rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />

                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white font-display">Write a Review</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Name</label>
                            <input name="name" required type="text" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors rounded-none" placeholder="YOUR NAME" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Email</label>
                            <input name="email" required type="email" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors rounded-none" placeholder="YOUR EMAIL" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="group p-1"
                                >
                                    <Star className={`w-8 h-8 transition-colors ${star <= rating ? "text-accent fill-accent" : "text-white/20 group-hover:text-white"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Title</label>
                        <input name="title" required type="text" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors rounded-none" placeholder="REVIEW TITLE" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Review</label>
                        <textarea name="comment" required rows={4} className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors resize-none rounded-none" placeholder="SHARE YOUR THOUGHTS..." />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <span>Submit Review</span>
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </motion.div>,
        document.body
    );
}
