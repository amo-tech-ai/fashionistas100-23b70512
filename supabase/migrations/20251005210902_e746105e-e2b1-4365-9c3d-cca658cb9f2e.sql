-- ============================================
-- STAGE 8: FIX SECURITY DEFINER VIEWS
-- ============================================

-- Fix all views to use SECURITY INVOKER mode
-- This makes views respect RLS policies instead of bypassing them

-- 1. Fix public_profiles view
ALTER VIEW public.public_profiles SET (security_invoker = on);

-- 2. Fix dashboard_metrics_realtime view (if exists)
ALTER VIEW IF EXISTS public.dashboard_metrics_realtime SET (security_invoker = on);

-- 3. Fix event_performance_analytics view (if exists)
ALTER VIEW IF EXISTS public.event_performance_analytics SET (security_invoker = on);

-- 4. Fix revenue_analytics view (if exists)
ALTER VIEW IF EXISTS public.revenue_analytics SET (security_invoker = on);

-- 5. Fix rls_performance view (if exists)
ALTER VIEW IF EXISTS public.rls_performance SET (security_invoker = on);

-- 6. Fix users view (if exists)
ALTER VIEW IF EXISTS public.users SET (security_invoker = on);

-- ✅ STAGE 8 COMPLETE! ALL VIEWS NOW USE SECURITY INVOKER