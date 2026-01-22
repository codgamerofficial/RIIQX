'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp, Check, Image as ImageIcon } from 'lucide-react';
import { StarRating } from './StarRating';
import { ReviewForm } from './ReviewForm';
import { getProductReviews, getReviewStats, voteReviewHelpful, type Review } from '@/lib/supabase/reviews';
import { formatDistanceToNow } from 'date-fns';

interface ReviewSectionProps {
    productId: string;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0, ratingDistribution: {} as any });
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

    useEffect(() => {
        loadReviews();
    }, [productId]);

    const loadReviews = async () => {
        try {
            const [reviewsData, statsData] = await Promise.all([
                getProductReviews(productId),
                getReviewStats(productId),
            ]);
            setReviews(reviewsData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sortBy === 'helpful') return b.helpful_count - a.helpful_count;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
    });

    if (isLoading) {
        return <div className="text-center py-12">Loading reviews...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Review Summary */}
            <div className="bg-neutral-light border border-neutral-gray rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Average Rating */}
                    <div className="text-center md:text-left">
                        <div className="text-5xl font-black text-rich-black mb-2">
                            {stats.averageRating.toFixed(1)}
                        </div>
                        <StarRating rating={stats.averageRating} size="lg" />
                        <p className="text-neutral-gray mt-2">
                            Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = stats.ratingDistribution[rating] || 0;
                            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

                            return (
                                <div key={rating} className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-rich-black w-8">{rating} ★</span>
                                    <div className="flex-1 h-2 bg-neutral-gray rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gold transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-neutral-gray w-12 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Write Review Button */}
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="w-full mt-6 bg-cherry-red text-white py-3 rounded-lg font-semibold hover:bg-cherry-red/90 transition-colors"
                >
                    {showForm ? 'Cancel' : 'Write a Review'}
                </button>
            </div>

            {/* Review Form */}
            {showForm && (
                <ReviewForm
                    productId={productId}
                    onSuccess={() => {
                        setShowForm(false);
                        loadReviews();
                    }}
                />
            )}

            {/* Sort Options */}
            {reviews.length > 0 && (
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-rich-black">Sort by:</span>
                    <div className="flex gap-2">
                        {[
                            { value: 'recent', label: 'Most Recent' },
                            { value: 'helpful', label: 'Most Helpful' },
                            { value: 'rating', label: 'Highest Rating' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setSortBy(option.value as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${sortBy === option.value
                                        ? 'bg-cherry-red text-white'
                                        : 'bg-neutral-light text-rich-black hover:bg-neutral-gray'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {sortedReviews.length === 0 ? (
                    <div className="text-center py-12 bg-neutral-light border border-neutral-gray rounded-xl">
                        <p className="text-neutral-gray">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    sortedReviews.map((review) => (
                        <div key={review.id} className="bg-neutral-light border border-neutral-gray rounded-xl p-6">
                            {/* Review Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold text-rich-black">{review.user_name}</span>
                                        {review.verified_purchase && (
                                            <span className="flex items-center gap-1 text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">
                                                <Check className="w-3 h-3" />
                                                Verified Purchase
                                            </span>
                                        )}
                                    </div>
                                    <StarRating rating={review.rating} size="sm" />
                                </div>
                                <span className="text-sm text-neutral-gray">
                                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                </span>
                            </div>

                            {/* Review Content */}
                            <h4 className="font-bold text-rich-black mb-2">{review.title}</h4>
                            <p className="text-neutral-gray mb-4">{review.comment}</p>

                            {/* Review Images */}
                            {review.images && review.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {review.images.map((image, idx) => (
                                        <img
                                            key={idx}
                                            src={image}
                                            alt={`Review image ${idx + 1}`}
                                            className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Helpful Button */}
                            <button
                                onClick={() => voteReviewHelpful(review.id, 'anonymous', true)}
                                className="flex items-center gap-2 text-sm text-neutral-gray hover:text-cherry-red transition-colors"
                            >
                                <ThumbsUp className="w-4 h-4" />
                                <span>Helpful ({review.helpful_count})</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
