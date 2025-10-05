-- ============================================
-- STAGE 5: FIX FUNCTION SEARCH_PATH (46 FUNCTIONS)
-- ============================================

-- Fix all functions to have SET search_path = 'public'

-- 1. audit_trigger_function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit_event(
      TG_TABLE_NAME,
      'DELETE',
      OLD.id,
      row_to_json(OLD)::jsonb,
      NULL
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_audit_event(
      TG_TABLE_NAME,
      'UPDATE',
      NEW.id,
      row_to_json(OLD)::jsonb,
      row_to_json(NEW)::jsonb
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_event(
      TG_TABLE_NAME,
      'INSERT',
      NEW.id,
      NULL,
      row_to_json(NEW)::jsonb
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

-- 2. calculate_event_revenue
CREATE OR REPLACE FUNCTION public.calculate_event_revenue(event_uuid uuid)
RETURNS numeric
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT COALESCE(SUM(p.amount), 0)
  FROM public.payments p
  JOIN public.bookings b ON p.booking_id = b.id
  WHERE b.event_id = event_uuid
  AND p.status = 'completed';
$function$;

-- 3. calculate_wizard_completion
CREATE OR REPLACE FUNCTION public.calculate_wizard_completion(p_session_id uuid)
RETURNS integer
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
DECLARE
  v_data JSONB;
  v_completed_stages INTEGER := 0;
  v_total_stages INTEGER := 6;
BEGIN
  SELECT data INTO v_data
  FROM public.wizard_sessions
  WHERE session_id = p_session_id;
  
  IF v_data IS NULL THEN
    RETURN 0;
  END IF;
  
  IF v_data ? 'organizerSetup' AND v_data->'organizerSetup' != 'null'::jsonb THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  IF v_data ? 'eventSetup' AND v_data->'eventSetup' != 'null'::jsonb THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  IF v_data ? 'venueSetup' AND v_data->'venueSetup' != 'null'::jsonb THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  IF v_data ? 'ticketSetup' AND v_data->'ticketSetup' != 'null'::jsonb THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  IF v_data ? 'sponsorSetup' AND v_data->'sponsorSetup' != 'null'::jsonb THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  IF v_data ? 'reviewPublish' AND v_data->'reviewPublish' != 'null'::jsonb THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  RETURN (v_completed_stages * 100) / v_total_stages;
END;
$function$;

-- 4. can_access_org
CREATE OR REPLACE FUNCTION public.can_access_org(org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()::text
    AND p.organization_id = org_id
  )
$function$;

-- 5. can_manage_event
CREATE OR REPLACE FUNCTION public.can_manage_event(event_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.events e
    JOIN public.profiles p ON p.user_id = auth.uid()::text
    WHERE e.id = event_uuid
    AND (
      e.organization_id = p.organization_id
      OR e.organizer_id = p.id
      OR p.role IN ('admin', 'organizer')
    )
  );
$function$;

-- 6. clerk_user_id
CREATE OR REPLACE FUNCTION public.clerk_user_id()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = 'public'
AS $function$
  SELECT auth.jwt()->>'sub'
$function$;

-- 7. generate_event_slug (from triggers)
CREATE OR REPLACE FUNCTION public.generate_event_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]+', '-', 'g')) 
              || '-' || SUBSTRING(gen_random_uuid()::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$function$;

-- 8. get_available_venues
CREATE OR REPLACE FUNCTION public.get_available_venues(org_id uuid, start_time timestamp with time zone, end_time timestamp with time zone)
RETURNS TABLE(venue_id uuid, venue_name text, capacity integer, hourly_rate numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT 
    v.id as venue_id,
    v.name as venue_name,
    v.capacity,
    v.hourly_rate
  FROM public.venues v
  WHERE v.organization_id = org_id
  AND v.is_active = true
  AND NOT EXISTS (
    SELECT 1
    FROM public.venue_bookings vb
    WHERE vb.venue_id = v.id
    AND vb.status = 'confirmed'
    AND (
      (vb.start_time < end_time AND vb.end_time > start_time)
    )
  )
  ORDER BY v.name;
$function$;

-- 9. get_event_stats
CREATE OR REPLACE FUNCTION public.get_event_stats(event_uuid uuid)
RETURNS TABLE(total_bookings integer, confirmed_bookings integer, total_revenue numeric, capacity_utilization numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT 
    COUNT(*)::integer as total_bookings,
    COUNT(*) FILTER (WHERE b.status = 'confirmed')::integer as confirmed_bookings,
    COALESCE(SUM(p.amount), 0) as total_revenue,
    CASE 
      WHEN e.capacity > 0 THEN 
        (COUNT(*) FILTER (WHERE b.status = 'confirmed')::numeric / e.capacity::numeric * 100)
      ELSE 0 
    END as capacity_utilization
  FROM public.bookings b
  JOIN public.events e ON b.event_id = e.id
  LEFT JOIN public.payments p ON p.booking_id = b.id AND p.status = 'completed'
  WHERE e.id = event_uuid
  GROUP BY e.capacity;
$function$;

-- 10. get_user_organization_context
CREATE OR REPLACE FUNCTION public.get_user_organization_context()
RETURNS TABLE(user_id text, profile_id uuid, organization_id uuid, organization_name text, user_role user_role)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT 
    p.user_id,
    p.id as profile_id,
    p.organization_id,
    o.name as organization_name,
    p.role as user_role
  FROM public.profiles p
  LEFT JOIN public.organizations o ON p.organization_id = o.id
  WHERE p.user_id = auth.uid()::text
  LIMIT 1;
$function$;

-- Stage 5 Part 1 complete (10/46)
-- Continue with remaining functions...