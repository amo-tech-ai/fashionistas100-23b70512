-- ============================================
-- STAGE 5 PART 3: FIX REMAINING FUNCTIONS (26 MORE)
-- ============================================

-- 21. process_payment_idempotent
CREATE OR REPLACE FUNCTION public.process_payment_idempotent(
  p_booking_id uuid, 
  p_amount_cents integer, 
  p_currency character varying, 
  p_payment_method character varying, 
  p_stripe_payment_intent_id character varying, 
  p_idempotency_key character varying, 
  p_status character varying DEFAULT 'pending'::character varying
)
RETURNS TABLE(payment_id uuid, is_duplicate boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_payment_id UUID;
  v_existing_payment_id UUID;
  v_booking_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.bookings WHERE id = p_booking_id) INTO v_booking_exists;
  
  IF NOT v_booking_exists THEN
    RETURN QUERY SELECT NULL::UUID, false, 'Booking not found';
    RETURN;
  END IF;
  
  SELECT id INTO v_existing_payment_id 
  FROM public.payments 
  WHERE idempotency_key = p_idempotency_key;
  
  IF v_existing_payment_id IS NOT NULL THEN
    RETURN QUERY SELECT v_existing_payment_id, true, 'Payment already processed';
    RETURN;
  END IF;
  
  INSERT INTO public.payments (
    booking_id,
    amount_cents,
    currency,
    payment_method,
    stripe_payment_intent_id,
    idempotency_key,
    status,
    created_at,
    updated_at
  ) VALUES (
    p_booking_id,
    p_amount_cents,
    p_currency,
    p_payment_method,
    p_stripe_payment_intent_id,
    p_idempotency_key,
    p_status,
    NOW(),
    NOW()
  ) RETURNING id INTO v_payment_id;
  
  RETURN QUERY SELECT v_payment_id, false, 'Payment created successfully';
END;
$function$;

-- 22. reconcile_payment_with_stripe
CREATE OR REPLACE FUNCTION public.reconcile_payment_with_stripe(
  p_stripe_payment_intent_id character varying, 
  p_stripe_status character varying, 
  p_stripe_amount_received integer DEFAULT NULL::integer
)
RETURNS TABLE(payment_id uuid, reconciliation_status character varying, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_payment_id UUID;
  v_current_amount INTEGER;
  v_current_status VARCHAR(50);
BEGIN
  SELECT id, amount_cents, status 
  INTO v_payment_id, v_current_amount, v_current_status
  FROM public.payments 
  WHERE stripe_payment_intent_id = p_stripe_payment_intent_id;
  
  IF v_payment_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, 'not_found', 'Payment not found for Stripe payment intent ID';
    RETURN;
  END IF;
  
  IF p_stripe_amount_received IS NOT NULL AND v_current_amount != p_stripe_amount_received THEN
    RETURN QUERY SELECT v_payment_id, 'amount_mismatch', 
      'Amount mismatch: expected ' || v_current_amount || ', received ' || p_stripe_amount_received;
    RETURN;
  END IF;
  
  IF v_current_status != p_stripe_status THEN
    UPDATE public.payments 
    SET 
      status = p_stripe_status,
      updated_at = NOW()
    WHERE id = v_payment_id;
    
    RETURN QUERY SELECT v_payment_id, 'updated', 'Payment status updated from ' || v_current_status || ' to ' || p_stripe_status;
  ELSE
    RETURN QUERY SELECT v_payment_id, 'unchanged', 'Payment status already matches';
  END IF;
END;
$function$;

-- 23. log_payment_audit
CREATE OR REPLACE FUNCTION public.log_payment_audit(
  p_payment_id uuid, 
  p_action character varying, 
  p_old_status character varying DEFAULT NULL::character varying, 
  p_new_status character varying DEFAULT NULL::character varying, 
  p_metadata jsonb DEFAULT NULL::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_audit_id UUID;
  v_payment_data RECORD;
BEGIN
  SELECT amount_cents, stripe_payment_intent_id, idempotency_key
  INTO v_payment_data
  FROM public.payments 
  WHERE id = p_payment_id;
  
  INSERT INTO public.payment_audit_log (
    payment_id,
    action,
    old_status,
    new_status,
    amount_cents,
    stripe_payment_intent_id,
    idempotency_key,
    metadata,
    created_by
  ) VALUES (
    p_payment_id,
    p_action,
    p_old_status,
    p_new_status,
    v_payment_data.amount_cents,
    v_payment_data.stripe_payment_intent_id,
    v_payment_data.idempotency_key,
    p_metadata,
    auth.uid()
  ) RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$function$;

-- 24. trigger_payment_audit
CREATE OR REPLACE FUNCTION public.trigger_payment_audit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_payment_audit(
      NEW.id,
      'created',
      NULL,
      NEW.status,
      jsonb_build_object(
        'booking_id', NEW.booking_id,
        'payment_method', NEW.payment_method,
        'currency', NEW.currency
      )
    );
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      PERFORM public.log_payment_audit(
        NEW.id,
        'status_changed',
        OLD.status,
        NEW.status,
        jsonb_build_object(
          'old_amount_cents', OLD.amount_cents,
          'new_amount_cents', NEW.amount_cents
        )
      );
    END IF;
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$function$;

-- 25. update_event_stats
CREATE OR REPLACE FUNCTION public.update_event_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.events
  SET metadata = metadata || jsonb_build_object(
    'last_booking_update', NOW(),
    'total_bookings', (
      SELECT COUNT(*) FROM public.bookings WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)
    ),
    'confirmed_bookings', (
      SELECT COUNT(*) FROM public.bookings 
      WHERE event_id = COALESCE(NEW.event_id, OLD.event_id) AND status = 'confirmed'
    )
  )
  WHERE id = COALESCE(NEW.event_id, OLD.event_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- 26. update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 27. update_session_activity
CREATE OR REPLACE FUNCTION public.update_session_activity()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.wizard_sessions
  SET last_activity_at = NOW(), updated_at = NOW()
  WHERE session_id = NEW.session_id;
  RETURN NEW;
END;
$function$;

-- 28. validate_booking_capacity
CREATE OR REPLACE FUNCTION public.validate_booking_capacity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  event_capacity integer;
  current_bookings integer;
BEGIN
  SELECT capacity INTO event_capacity
  FROM public.events
  WHERE id = NEW.event_id;
  
  SELECT COUNT(*) INTO current_bookings
  FROM public.bookings
  WHERE event_id = NEW.event_id
  AND status = 'confirmed';
  
  IF event_capacity IS NOT NULL AND event_capacity > 0 THEN
    IF current_bookings >= event_capacity THEN
      RAISE EXCEPTION 'Event capacity exceeded. Cannot create more bookings.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 29. validate_event_dates
CREATE OR REPLACE FUNCTION public.validate_event_dates(start_time timestamp with time zone, end_time timestamp with time zone)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = 'public'
AS $function$
  SELECT start_time < end_time;
$function$;

-- 30. validate_stripe_webhook
CREATE OR REPLACE FUNCTION public.validate_stripe_webhook(
  p_signature text, 
  p_payload text, 
  p_secret text DEFAULT 'whsec_test_secret'::text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF p_signature IS NULL OR p_signature = '' THEN
    RETURN FALSE;
  END IF;
  
  IF p_payload IS NULL OR p_payload = '' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$function$;

-- Stage 5 Part 3 complete (30/46)