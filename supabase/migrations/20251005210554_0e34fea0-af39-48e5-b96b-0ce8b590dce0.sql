-- ============================================
-- STAGE 6: FIX 8 REMAINING TABLES WITH NO RLS POLICIES
-- ============================================

-- 1. AI_RECOMMENDATIONS - Users see own recommendations, admins see all
CREATE POLICY "ai_recommendations_select_own_or_admin" ON public.ai_recommendations
FOR SELECT
TO authenticated
USING (
  profile_id = public.current_profile_id()
  OR public.has_role('admin'::public.app_role)
);

CREATE POLICY "ai_recommendations_insert_system" ON public.ai_recommendations
FOR INSERT
TO service_role
WITH CHECK (true);

-- 2. ASSETS - Users manage own assets
CREATE POLICY "assets_select_own_or_admin" ON public.assets
FOR SELECT
TO authenticated
USING (
  profile_id = public.current_profile_id()
  OR public.has_role('admin'::public.app_role)
);

CREATE POLICY "assets_insert_own" ON public.assets
FOR INSERT
TO authenticated
WITH CHECK (profile_id = public.current_profile_id());

CREATE POLICY "assets_update_own" ON public.assets
FOR UPDATE
TO authenticated
USING (profile_id = public.current_profile_id());

CREATE POLICY "assets_delete_own" ON public.assets
FOR DELETE
TO authenticated
USING (profile_id = public.current_profile_id());

-- 3. DESIGNER_PROFILES - Designers manage own, public can read
CREATE POLICY "designer_profiles_select_public" ON public.designer_profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "designer_profiles_manage_own" ON public.designer_profiles
FOR ALL
TO authenticated
USING (
  designer_id IN (
    SELECT d.id FROM public.designers d
    WHERE d.profile_id = public.current_profile_id()
  )
)
WITH CHECK (
  designer_id IN (
    SELECT d.id FROM public.designers d
    WHERE d.profile_id = public.current_profile_id()
  )
);

-- 4. EMAIL_MESSAGES - Organization members manage, system inserts
CREATE POLICY "email_messages_select_org_admin" ON public.email_messages
FOR SELECT
TO authenticated
USING (
  campaign_id IN (
    SELECT ec.id FROM public.email_campaigns ec
    WHERE ec.organization_id IN (
      SELECT p.organization_id FROM public.profiles p
      WHERE p.id = public.current_profile_id()
    )
  )
  OR public.has_role('admin'::public.app_role)
);

CREATE POLICY "email_messages_insert_system" ON public.email_messages
FOR INSERT
TO service_role
WITH CHECK (true);

-- 5. EVENT_BOOKINGS - Attendees manage own, organizers see event bookings
CREATE POLICY "event_bookings_select_attendee_organizer_admin" ON public.event_bookings
FOR SELECT
TO authenticated
USING (
  attendee_id = public.current_profile_id()
  OR event_id IN (
    SELECT e.id FROM public.events e
    WHERE e.organizer_id = public.current_profile_id()
  )
  OR public.has_role('admin'::public.app_role)
);

CREATE POLICY "event_bookings_insert_own" ON public.event_bookings
FOR INSERT
TO authenticated
WITH CHECK (attendee_id = public.current_profile_id());

CREATE POLICY "event_bookings_update_own" ON public.event_bookings
FOR UPDATE
TO authenticated
USING (attendee_id = public.current_profile_id());

-- 6. STRIPE_SUBSCRIPTIONS - Users see own subscriptions
CREATE POLICY "stripe_subscriptions_select_own_or_admin" ON public.stripe_subscriptions
FOR SELECT
TO authenticated
USING (
  profile_id = public.current_profile_id()
  OR public.has_role('admin'::public.app_role)
);

CREATE POLICY "stripe_subscriptions_service_manage" ON public.stripe_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 7. WHATSAPP_CONTACTS - Users manage own contacts
CREATE POLICY "whatsapp_contacts_select_own_or_admin" ON public.whatsapp_contacts
FOR SELECT
TO authenticated
USING (
  profile_id = public.current_profile_id()
  OR public.has_role('admin'::public.app_role)
);

CREATE POLICY "whatsapp_contacts_insert_own" ON public.whatsapp_contacts
FOR INSERT
TO authenticated
WITH CHECK (profile_id = public.current_profile_id());

CREATE POLICY "whatsapp_contacts_update_own" ON public.whatsapp_contacts
FOR UPDATE
TO authenticated
USING (profile_id = public.current_profile_id());

-- 8. WHATSAPP_MESSAGES - Users see messages for their contacts
CREATE POLICY "whatsapp_messages_select_own_or_admin" ON public.whatsapp_messages
FOR SELECT
TO authenticated
USING (
  contact_id IN (
    SELECT wc.id FROM public.whatsapp_contacts wc
    WHERE wc.profile_id = public.current_profile_id()
  )
  OR public.has_role('admin'::public.app_role)
);

CREATE POLICY "whatsapp_messages_insert_system" ON public.whatsapp_messages
FOR INSERT
TO service_role
WITH CHECK (true);

-- ✅ STAGE 6 COMPLETE! ALL 8 TABLES NOW HAVE RLS POLICIES