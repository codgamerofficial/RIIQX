"use client";

import { useEffect, useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

interface Review {
    id: string;
    user_id: string;
    rating: number;
    title: string;
    comment: string;
    helpful_count: number;
    created_at: string;
    profiles?: {
        name: string;
    };
}

interface ReviewListProps {
    productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent");

    const supabase = createClient();

    useEffect(() => {
        fetchReviews();
    }, [productId, sortBy]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("reviews")
                .select(`
          *,
          profiles (name)
        `)
                .eq("product_id", productId);

            // Apply sorting
            if (sortBy === "recent") {
                query = query.order("created_at", { ascending: false });
            } else if (sortBy === "highest") {
                query = query.order("rating", { ascending: false });
            } else {
                query = query.order("rating", { ascending: true });
            }

            const { data, error } = await query;

            if (error) throw error;
            setReviews(data || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews.filter((r) => r.rating === rating).length,
        percentage: reviews.length > 0
            ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100
            : 0,
    }));

    if (loading) {
        return <div className="text-white">Loading reviews...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Summary */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Average Rating */}
                    <div className="text-center">
                        <div className="text-6xl font-black text-white mb-2">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="flex justify-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={cn(
                                        "w-6 h-6",
                                        star <= Math.round(averageRating)
                                            ? "fill-bewakoof-yellow text-bewakoof-yellow"
                                            : "text-gray-600"
                                    )}
                                />
                            ))}
                        </div>
                        <p className="text-muted-foreground">Based on {reviews.length} reviews</p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {ratingDistribution.map(({ rating, count, percentage }) => (
                            <div key={rating} className="flex items-center gap-3">
                                <span className="text-sm text-white w-8">{rating}★</span>
                                <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-bewakoof-yellow"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-muted-foreground w-12 text-right">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Customer Reviews</h3>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-neutral-800 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:border-bewakoof-yellow focus:outline-none"
                >
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                </select>
            </div>

            {/* Reviews */}
            {reviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No reviews yet. Be the first to review this product!
                </div>
            ) : (
                {/* Reviews */ }
            {reviews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No reviews yet. Be the first to review this product!
                </div>
            ) : (
                <>
                    {/* MOBILE: Swipeable Carousel */}
                    <div className="md:hidden -mx-6 px-6">
                        <Swiper
                            slidesPerView={1.2}
                            spaceBetween={16}
                            freeMode={true}
                            modules={[FreeMode]}
                            className="w-full !overflow-visible"
                        >
                            {reviews.map((review) => (
                                <SwiperSlide key={review.id} className="h-auto">
                                    <div className="bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 p-6 h-full flex flex-col justify-between clip-path-slant relative overflow-hidden group">
                                        {/* Neon Accent */}
                                        <div className="absolute top-0 left-0 w-1 h-full bg-accent/50 group-hover:bg-accent transition-colors" />

                                        <div>
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <div className="flex gap-1 mb-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={cn(
                                                                    "w-3 h-3",
                                                                    star <= review.rating
                                                                        ? "fill-accent text-accent"
                                                                        : "text-white/10"
                                                                )}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-white text-xs font-black uppercase tracking-widest">
                                                        {review.profiles?.name || "Verified Buyer"}
                                                    </p>
                                                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1 font-mono">
                                                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <h4 className="text-sm font-black text-white uppercase italic tracking-wider mb-2 line-clamp-1">{review.title}</h4>
                                            <p className="text-white/60 text-xs leading-relaxed line-clamp-4">{review.comment}</p>
                                        </div>

                                        {/* Footer */}
                                        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] text-accent uppercase tracking-widest font-bold">
                                                <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpful_count})
                                            </div>
                                            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* DESKTOP: Vertical Stack */}
                    <div className="hidden md:block space-y-6">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-neutral-900/50 border border-white/5 hover:border-white/20 transition-all p-6 transform hover:-translate-y-1 hover:bg-[#0A0A0A]"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={cn(
                                                        "w-4 h-4",
                                                        star <= review.rating
                                                            ? "fill-accent text-accent"
                                                            : "text-white/10"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-white font-black uppercase tracking-widest">
                                            {review.profiles?.name || "Verified Buyer"}
                                        </p>
                                        <p className="text-xs text-white/40 font-mono uppercase mt-1">
                                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <h4 className="text-lg font-black text-white mb-2 uppercase italic tracking-tighter">{review.title}</h4>
                                <p className="text-white/70 mb-4 font-light leading-relaxed">{review.comment}</p>

                                {/* Helpful Button */}
                                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-accent transition-colors">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Helpful ({review.helpful_count})</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
            )}
        </div>
    );
}
