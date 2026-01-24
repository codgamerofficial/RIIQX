import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Review {
    id: string;
    product_id: string;
    user_id: string | null;
    user_name: string;
    user_email: string;
    rating: number;
    title: string;
    comment: string;
    verified_purchase: boolean;
    helpful_count: number;
    images: string[];
    created_at: string;
    updated_at: string;
}

export interface ReviewVote {
    id: string;
    review_id: string;
    user_id: string;
    is_helpful: boolean;
    created_at: string;
}

// Get reviews for a product
export async function getProductReviews(productId: string) {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Review[];
}

// Get review statistics
export async function getReviewStats(productId: string) {
    const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);

    if (error) throw error;

    const reviews = data as Review[];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
    };

    return {
        totalReviews,
        averageRating,
        ratingDistribution,
    };
}

// Submit a review
export async function submitReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful_count'>) {
    const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single();

    if (error) throw error;
    return data as Review;
}

// Vote on review helpfulness
export async function voteReviewHelpful(reviewId: string, userId: string, isHelpful: boolean) {
    const { data, error } = await supabase
        .from('review_votes')
        .upsert({
            review_id: reviewId,
            user_id: userId,
            is_helpful: isHelpful,
        })
        .select()
        .single();

    if (error) throw error;
    return data as ReviewVote;
}

// Upload review image
export async function uploadReviewImage(file: File, reviewId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${reviewId}-${Date.now()}.${fileExt}`;
    const filePath = `review-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('reviews')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from('reviews')
        .getPublicUrl(filePath);

    return data.publicUrl;
}
