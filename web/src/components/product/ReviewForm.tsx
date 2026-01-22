'use client';

import { useState } from 'react';
import { Star, Upload, X } from 'lucide-react';
import { StarRating } from './StarRating';
import { submitReview, uploadReviewImage } from '@/lib/supabase/reviews';
import { toast } from 'sonner';

interface ReviewFormProps {
    productId: string;
    onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }
        setImages([...images, ...files]);
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);

        try {
            // Submit review first
            const review = await submitReview({
                product_id: productId,
                user_id: 'anonymous', // Replace with actual user ID from auth
                user_name: name,
                user_email: email,
                rating,
                title,
                comment,
                verified_purchase: false,
                images: [],
            });

            // Upload images if any
            const imageUrls: string[] = [];
            for (const image of images) {
                const url = await uploadReviewImage(image, review.id);
                imageUrls.push(url);
            }

            // Update review with image URLs if needed
            // (You can add an update function to the reviews service)

            toast.success('Review submitted successfully!');

            // Reset form
            setRating(0);
            setTitle('');
            setComment('');
            setName('');
            setEmail('');
            setImages([]);

            onSuccess?.();
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-light border border-neutral-gray rounded-xl p-6">
            <h3 className="text-2xl font-black font-serif text-rich-black uppercase">Write a Review</h3>

            {/* Rating */}
            <div>
                <label className="block text-sm font-bold text-rich-black uppercase mb-2">
                    Your Rating *
                </label>
                <StarRating
                    rating={rating}
                    interactive
                    onRatingChange={setRating}
                    size="lg"
                />
            </div>

            {/* Title */}
            <div>
                <label className="block text-sm font-bold text-rich-black uppercase mb-2">
                    Review Title *
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Sum up your experience"
                    required
                    className="w-full bg-white border border-neutral-gray rounded-lg px-4 py-3 text-rich-black focus:border-cherry-red focus:outline-none"
                />
            </div>

            {/* Comment */}
            <div>
                <label className="block text-sm font-bold text-rich-black uppercase mb-2">
                    Your Review *
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    required
                    rows={4}
                    className="w-full bg-white border border-neutral-gray rounded-lg px-4 py-3 text-rich-black focus:border-cherry-red focus:outline-none resize-none"
                />
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-rich-black uppercase mb-2">
                        Your Name *
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-white border border-neutral-gray rounded-lg px-4 py-3 text-rich-black focus:border-cherry-red focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-rich-black uppercase mb-2">
                        Your Email *
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white border border-neutral-gray rounded-lg px-4 py-3 text-rich-black focus:border-cherry-red focus:outline-none"
                    />
                </div>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-bold text-rich-black uppercase mb-2">
                    Add Photos (Optional)
                </label>
                <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-neutral-gray rounded-lg p-4 cursor-pointer hover:border-cherry-red transition-colors">
                        <Upload className="w-5 h-5 text-neutral-gray" />
                        <span className="text-sm text-neutral-gray">Upload up to 5 images</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>

                    {images.length > 0 && (
                        <div className="grid grid-cols-5 gap-2">
                            {images.map((image, index) => (
                                <div key={index} className="relative aspect-square">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Upload ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-cherry-red text-white rounded-full flex items-center justify-center hover:bg-cherry-red/90"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cherry-red text-white py-4 rounded-lg font-semibold hover:bg-cherry-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
