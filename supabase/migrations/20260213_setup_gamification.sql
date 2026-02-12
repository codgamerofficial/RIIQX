-- Migration: Add Gamification System

-- 1. Add gamification columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Initiate';

-- 2. Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- Lucide icon name or emoji
    xp_reward INTEGER DEFAULT 100,
    condition_type TEXT, -- e.g., 'purchase_count', 'login_streak'
    condition_value INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create user_achievements junction table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- 4. RLS Policies

-- Profiles: Everyone can see levels (for modifying leaderboards later), but only owner updates
-- (Existing policies on profiles likely cover update, but ensuring select is open)

-- Achievements: Public read
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are viewable by everyone" ON public.achievements FOR SELECT USING (true);

-- User Achievements: Public read (to see others' badges), Insert/Update only by server/owner (service role usually handles awards)
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User achievements are viewable by everyone" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can see their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

-- 5. Seed Initial Achievements
INSERT INTO public.achievements (name, description, icon, xp_reward, condition_type, condition_value)
VALUES 
    ('The Awakening', 'Created your RIIQX account.', 'zap', 50, 'signup', 1),
    ('First Drop', 'Purchased your first item.', 'shopping-bag', 200, 'purchase_count', 1),
    ('Trendsetter', 'Made 5 purchases.', 'star', 1000, 'purchase_count', 5),
    ('Night Owl', 'Visited the store between 2AM and 5AM.', 'moon', 150, 'time_visit', 1),
    ('Konami Code', 'Discovered the secret cheat code.', 'gamepad-2', 500, 'secret', 1)
ON CONFLICT DO NOTHING;
