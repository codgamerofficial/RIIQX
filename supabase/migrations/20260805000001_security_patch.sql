-- ====================================================================
-- RIIQX DB SECURITY PATCH: AUTH & RLS ALIGNMENT (PROJECT 10 + 11)
-- Migration File: supabase/migrations/20260805000001_security_patch.sql
-- ====================================================================

-- 1. Create Security Definer Helper to Prevent RLS Infinite Recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Hardened Auto-Profile Creation Trigger (OAuth + Magic Links Compatible)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      ''
    ),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Update Profiles RLS Policies Using Helper Function
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles SELECT Policy" ON profiles;
DROP POLICY IF EXISTS "Profiles UPDATE Policy" ON profiles;

CREATE POLICY "Profiles SELECT Policy" ON profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Profiles UPDATE Policy" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid())); -- Prevents self-elevation to admin

-- 4. Explicit Order Items Ownership Policy
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Order Items SELECT Policy" ON order_items;
CREATE POLICY "Order Items SELECT Policy" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

-- 5. Storage Bucket Security Policies (Product Images & Avatars)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Product Images Read" ON storage.objects;
DROP POLICY IF EXISTS "Admin Product Images Insert" ON storage.objects;

CREATE POLICY "Public Product Images Read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin Product Images Insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
