-- Fix security linter issues detected in the previous migration

-- =====================================
-- 1. FIX SECURITY DEFINER VIEW ISSUE
-- =====================================

-- Drop the existing view and recreate without SECURITY DEFINER
DROP VIEW IF EXISTS public.users;

-- Create a standard view (no SECURITY DEFINER)
CREATE VIEW public.users AS
SELECT 
    id,
    user_id,
    email,
    first_name,
    last_name,
    avatar_url,
    role,
    created_at,
    updated_at
FROM public.profiles;

-- =====================================
-- 2. FIX FUNCTION SEARCH PATH ISSUES
-- =====================================

-- Update requesting_org_id function with proper search_path
CREATE OR REPLACE FUNCTION public.requesting_org_id()
RETURNS UUID AS $$
BEGIN
    RETURN (current_setting('request.jwt.claims', true)::json->>'org_id')::uuid;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Update requesting_user_id function with proper search_path
CREATE OR REPLACE FUNCTION public.requesting_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('request.jwt.claims', true)::json->>'sub';
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;