-- FIX: Add missing columns to reviews table safely
DO $$
BEGIN
    -- Add user_email if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='user_email') THEN
        ALTER TABLE public.reviews ADD COLUMN user_email TEXT;
    END IF;

    -- Add user_name if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='user_name') THEN
        ALTER TABLE public.reviews ADD COLUMN user_name TEXT;
    END IF;

    -- Add helpful_count if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='helpful_count') THEN
        ALTER TABLE public.reviews ADD COLUMN helpful_count INTEGER DEFAULT 0;
    END IF;

    -- Add verified_purchase if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='verified_purchase') THEN
        ALTER TABLE public.reviews ADD COLUMN verified_purchase BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Force schema cache reload in Supabase Client (sometimes needed)
NOTIFY pgrst, 'reload schema';
