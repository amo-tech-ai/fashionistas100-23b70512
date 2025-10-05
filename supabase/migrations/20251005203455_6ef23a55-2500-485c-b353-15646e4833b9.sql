-- ============================================
-- STAGE 1: ROLES TABLE + CLERK-AWARE HELPERS
-- ============================================

-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'organizer', 'designer', 'model', 'venue', 'vendor', 'sponsor', 'media', 'buyer', 'attendee');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, role)
);

-- 3. Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create indexes
CREATE INDEX idx_user_roles_profile_id ON public.user_roles(profile_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

-- 5. Create helper function to get current profile ID
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT id 
  FROM public.profiles 
  WHERE clerk_id = (auth.jwt()->>'sub')
  LIMIT 1
$$;

-- 6. Create helper function to check role
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE profile_id = public.current_profile_id()
      AND role = _role
  )
$$;

-- 7. Migrate existing roles from profiles table
INSERT INTO public.user_roles (profile_id, role)
SELECT id, role::text::public.app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (profile_id, role) DO NOTHING;

-- 8. RLS Policies for user_roles table

-- Users can read their own roles
CREATE POLICY "user_roles_select_own" ON public.user_roles
FOR SELECT
TO authenticated
USING (profile_id = public.current_profile_id());

-- Admins can read all roles
CREATE POLICY "user_roles_select_admin" ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role('admin'::public.app_role));

-- Admins can insert roles
CREATE POLICY "user_roles_insert_admin" ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role('admin'::public.app_role));

-- Admins can update roles
CREATE POLICY "user_roles_update_admin" ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role('admin'::public.app_role));

-- Admins can delete roles
CREATE POLICY "user_roles_delete_admin" ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role('admin'::public.app_role));

-- 9. Create trigger for updated_at
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Stage 1 complete! ✅