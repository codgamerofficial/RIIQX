"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
    productId: string;
    onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError("Please login to submit a review");
                setLoading(false);
                return;
            }

            const { error: insertError } = await supabase
                .from("reviews")
                .insert({
                    user_id: user.id,
                    product_id: productId,
                    rating,
                    title,
                    comment,
                });

            if (insertError) throw insertError;

            // Reset form
            setRating(0);
            setTitle("");
            setComment("");
            onSuccess?.();
        } catch (err: any) {
            setError(err.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-900 border border-white/10 rounded-xl p-6">
            <h3 className="text-2xl font-black text-white uppercase">Write a Review</h3>

            {error && (
                <div className="p-4 bg-neon-red/10 border border-neon-red/20 rounded-lg">
                    <p className="text-neon-red text-sm">{error}</p>
                </div>
            )}

            {/* Star Rating */}
            <div>
                <label className="block text-sm font-bold text-white uppercase mb-3">
                    Your Rating *
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={cn(
                                    "w-10 h-10",
                                    (hoverRating || rating) >= star
                                        ? "fill-bewakoof-yellow text-bewakoof-yellow"
                                        : "text-gray-600"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Title */}
            <div>
                <label className="block text-sm font-bold text-white uppercase mb-2">
                    Review Title *
                </label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Sum up your experience"
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors"
                />
            </div>

            {/* Comment */}
            <div>
                <label className="block text-sm font-bold text-white uppercase mb-2">
                    Your Review *
                </label>
                <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you think about this product"
                    rows={5}
                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-bewakoof-yellow focus:outline-none transition-colors resize-none"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading || rating === 0}
                className="w-full bewakoof-btn bewakoof-btn-primary py-3 disabled:opacity-50"
            >
                {loading ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
}
