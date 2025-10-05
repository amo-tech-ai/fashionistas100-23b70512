-- ============================================
-- STAGE 2: LOCK DOWN PROFILES PII
-- ============================================

-- 1. Drop the permissive public read policy
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;

-- 2. Create public_profiles view (non-PII fields only)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  first_name,
  last_name,
  avatar_url,
  bio,
  organization_id,
  created_at
FROM public.profiles;

-- 3. Grant access to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 4. Create restrictive policy for profiles table
CREATE POLICY "profiles_select_owner_or_admin" ON public.profiles
FOR SELECT
TO authenticated
USING (
  clerk_id = (auth.jwt()->>'sub')  -- User can see their own profile
  OR public.has_role('admin'::public.app_role)  -- Admins can see all profiles
);

-- Stage 2 complete! ✅