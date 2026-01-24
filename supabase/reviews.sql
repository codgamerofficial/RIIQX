-- REVIEW STATISTICS
-- (Optional: aggregate view or simply strict RLS)

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id TEXT NOT NULL, -- Corresponds to Shopify Product ID (string)
    user_id UUID DEFAULT auth.uid(), -- Can be null for anonymous, or link to profiles
    user_name TEXT,
    user_email TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REVIEW VOTES (Helpful/Not Helpful)
CREATE TABLE IF NOT EXISTS public.review_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_id UUID DEFAULT auth.uid(),
    is_helpful BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(review_id, user_id)
);

-- RLS POLICIES FOR REVIEWS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read reviews
CREATE POLICY "Reviews are viewable by everyone." 
ON public.reviews FOR SELECT 
USING ( true );

-- Authenticated users (or anonymous if allowed) can insert reviews
CREATE POLICY "Anyone can insert reviews." 
ON public.reviews FOR INSERT 
WITH CHECK ( true );

-- Users can update their own reviews (if user_id matches)
CREATE POLICY "Users can update own reviews." 
ON public.reviews FOR UPDATE 
USING ( auth.uid() = user_id );

-- STORAGE FOR REVIEW IMAGES
-- NOTE: You must create a bucket named 'reviews' in Supabase Storage manually
-- or run: insert into storage.buckets (id, name, public) values ('reviews', 'reviews', true);

-- Policy for storage (if buckets exist)
-- create policy "Review images are public" on storage.objects for select using ( bucket_id = 'reviews' );
-- create policy "Anyone can upload review images" on storage.objects for insert with check ( bucket_id = 'reviews' );
