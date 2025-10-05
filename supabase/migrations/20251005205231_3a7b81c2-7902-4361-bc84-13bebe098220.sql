-- ============================================
-- STAGE 4: FIX MISSING RLS POLICIES (EXISTING TABLES ONLY)
-- ============================================

-- 1. VENUE_BOOKINGS - Venue owners and event organizers can manage
CREATE POLICY "venue_bookings_select_owner_organizer_admin" ON public.venue_bookings
FOR SELECT
TO authenticated
USING (
  organizer_id = public.current_profile_id()  -- Event organizer
  OR venue_id IN (  -- Venue owner
    SELECT v.id FROM public.venues v
    WHERE v.owner_id = public.current_profile_id()
  )
  OR public.has_role('admin'::public.app_role)  -- Admin
);

CREATE POLICY "venue_bookings_insert_organizer" ON public.venue_bookings
FOR INSERT
TO authenticated
WITH CHECK (organizer_id = public.current_profile_id());

CREATE POLICY "venue_bookings_update_owner_organizer" ON public.venue_bookings
FOR UPDATE
TO authenticated
USING (
  organizer_id = public.current_profile_id()
  OR venue_id IN (
    SELECT v.id FROM public.venues v
    WHERE v.owner_id = public.current_profile_id()
  )
);

CREATE POLICY "venue_bookings_delete_admin" ON public.venue_bookings
FOR DELETE
TO authenticated
USING (public.has_role('admin'::public.app_role));

-- 2. EMAIL_CAMPAIGNS - Organization members and admins only
CREATE POLICY "email_campaigns_select_org_admin" ON public.email_campaigns
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT p.organization_id FROM public.profiles p
    WHERE p.id = public.current_profile_id()
  )
  OR public.has_role('admin'::public.app_role)
);

CREATE POLICY "email_campaigns_insert_org_admin" ON public.email_campaigns
FOR INSERT
TO authenticated
WITH CHECK (
  organization_id IN (
    SELECT p.organization_id FROM public.profiles p
    WHERE p.id = public.current_profile_id()
  )
  OR public.has_role('admin'::public.app_role)
);

CREATE POLICY "email_campaigns_update_org_admin" ON public.email_campaigns
FOR UPDATE
TO authenticated
USING (
  organization_id IN (
    SELECT p.organization_id FROM public.profiles p
    WHERE p.id = public.current_profile_id()
  )
  OR public.has_role('admin'::public.app_role)
);

CREATE POLICY "email_campaigns_delete_org_admin" ON public.email_campaigns
FOR DELETE
TO authenticated
USING (
  organization_id IN (
    SELECT p.organization_id FROM public.profiles p
    WHERE p.id = public.current_profile_id()
  )
  OR public.has_role('admin'::public.app_role)
);

-- Stage 4 complete! ✅
-- Fixed RLS policies for existing tables