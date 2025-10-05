-- ============================================
-- STAGE 7: FIX MATERIALIZED VIEW ACCESS
-- ============================================

-- Restrict access to dashboard_analytics materialized view
-- Only admins and service role should access it directly
REVOKE ALL ON public.dashboard_analytics FROM anon, authenticated;

-- Admins can select through a policy-controlled wrapper
CREATE OR REPLACE FUNCTION public.get_dashboard_analytics()
RETURNS SETOF public.dashboard_analytics
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT * FROM public.dashboard_analytics
  WHERE organization_id IN (
    SELECT p.organization_id 
    FROM public.profiles p
    WHERE p.id = public.current_profile_id()
  )
  OR EXISTS (
    SELECT 1 WHERE public.has_role('admin'::public.app_role)
  );
$function$;

GRANT EXECUTE ON FUNCTION public.get_dashboard_analytics() TO authenticated;

-- ✅ STAGE 7 COMPLETE! Materialized view now accessed through secure function