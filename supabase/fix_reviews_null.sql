-- FIX: Allow NULL user_id for anonymous reviews
ALTER TABLE public.reviews ALTER COLUMN user_id DROP NOT NULL;

-- Ensure RLS allows anonymous inserts if not already set
DROP POLICY IF EXISTS "Anyone can insert reviews." ON public.reviews;
CREATE POLICY "Anyone can insert reviews." 
ON public.reviews FOR INSERT 
WITH CHECK ( true );

-- Force schema reload
NOTIFY pgrst, 'reload schema';
