"use client";

import { useEffect, useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

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
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-neutral-900 border border-white/10 rounded-xl p-6"
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
                                                        ? "fill-bewakoof-yellow text-bewakoof-yellow"
                                                        : "text-gray-600"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-white font-bold">
                                        {review.profiles?.name || "Anonymous"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <h4 className="text-lg font-bold text-white mb-2">{review.title}</h4>
                            <p className="text-muted-foreground mb-4">{review.comment}</p>

                            {/* Helpful Button */}
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span>Helpful ({review.helpful_count})</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
