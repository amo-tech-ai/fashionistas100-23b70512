-- ============================================
-- STAGE 3: FIX BOOKINGS & PAYMENTS (FIXED)
-- ============================================

-- 1. Drop all existing permissive policies on bookings
DROP POLICY IF EXISTS "bookings_public_read" ON public.bookings;
DROP POLICY IF EXISTS "booking_tickets_select_own" ON public.booking_tickets;
DROP POLICY IF EXISTS "booking_tickets_insert_own" ON public.booking_tickets;
DROP POLICY IF EXISTS "booking_tickets_update_own" ON public.booking_tickets;
DROP POLICY IF EXISTS "booking_tickets_delete_own" ON public.booking_tickets;

-- 2. Create secure policies for bookings
CREATE POLICY "bookings_select_owner_admin_organizer" ON public.bookings
FOR SELECT
TO authenticated
USING (
  profile_id = public.current_profile_id()  -- Booking owner
  OR public.has_role('admin'::public.app_role)  -- Admin
  OR event_id IN (  -- Event organizer
    SELECT e.id FROM public.events e
    WHERE e.organizer_id = public.current_profile_id()
  )
);

CREATE POLICY "bookings_insert_own" ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (profile_id = public.current_profile_id());

CREATE POLICY "bookings_update_own" ON public.bookings
FOR UPDATE
TO authenticated
USING (profile_id = public.current_profile_id())
WITH CHECK (profile_id = public.current_profile_id());

-- 3. Drop all existing permissive policies on payments
DROP POLICY IF EXISTS "payments_public_read" ON public.payments;
DROP POLICY IF EXISTS "payments_allow_auth" ON public.payments;
DROP POLICY IF EXISTS "payments_block_anon" ON public.payments;
DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
DROP POLICY IF EXISTS "payments_insert_own" ON public.payments;
DROP POLICY IF EXISTS "payments_update_own" ON public.payments;
DROP POLICY IF EXISTS "payments_delete_own" ON public.payments;
DROP POLICY IF EXISTS "payments_no_update" ON public.payments;
DROP POLICY IF EXISTS "payments_no_delete" ON public.payments;
DROP POLICY IF EXISTS "Users view own payments" ON public.payments;

-- 4. Create secure policies for payments
CREATE POLICY "payments_select_admin_or_owner" ON public.payments
FOR SELECT
TO authenticated
USING (
  public.has_role('admin'::public.app_role)  -- Admin can see all
  OR booking_id IN (  -- Booking owner can see their payments
    SELECT b.id FROM public.bookings b
    WHERE b.profile_id = public.current_profile_id()
  )
);

-- Block direct inserts - payments must come through webhooks only
CREATE POLICY "payments_no_insert" ON public.payments
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Block updates and deletes - payments are immutable
CREATE POLICY "payments_no_update" ON public.payments
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "payments_no_delete" ON public.payments
FOR DELETE
TO authenticated
USING (false);

-- Service role can still insert payments (for webhooks)
CREATE POLICY "payments_service_insert" ON public.payments
FOR INSERT
TO service_role
WITH CHECK (true);

-- 5. Drop all existing policies on tickets
DROP POLICY IF EXISTS "tickets_public_read" ON public.tickets;

-- 6. Create secure policies for tickets
CREATE POLICY "tickets_select_admin_or_booking_owner" ON public.tickets
FOR SELECT
TO authenticated
USING (
  public.has_role('admin'::public.app_role)  -- Admin can see all
  OR booking_ticket_id IN (  -- Booking owner can see their tickets
    SELECT bt.id 
    FROM public.booking_tickets bt
    JOIN public.bookings b ON bt.booking_id = b.id
    WHERE b.profile_id = public.current_profile_id()
  )
);

-- 7. Fix booking_tickets policies to use new helper functions
CREATE POLICY "booking_tickets_select_owner_admin" ON public.booking_tickets
FOR SELECT
TO authenticated
USING (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    WHERE b.profile_id = public.current_profile_id()
  )
  OR public.has_role('admin'::public.app_role)
);

CREATE POLICY "booking_tickets_insert_owner" ON public.booking_tickets
FOR INSERT
TO authenticated
WITH CHECK (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    WHERE b.profile_id = public.current_profile_id()
  )
);

CREATE POLICY "booking_tickets_update_owner" ON public.booking_tickets
FOR UPDATE
TO authenticated
USING (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    WHERE b.profile_id = public.current_profile_id()
  )
);

CREATE POLICY "booking_tickets_delete_owner" ON public.booking_tickets
FOR DELETE
TO authenticated
USING (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    WHERE b.profile_id = public.current_profile_id()
  )
);

-- Stage 3 complete! ✅