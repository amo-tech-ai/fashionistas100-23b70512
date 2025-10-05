-- ============================================
-- STAGE 5 PART 2: FIX REMAINING FUNCTIONS (36 MORE)
-- ============================================

-- 11. handle_checkout_session_completed
CREATE OR REPLACE FUNCTION public.handle_checkout_session_completed(payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_session_id TEXT;
  v_payment_intent_id TEXT;
  v_customer_email TEXT;
  v_customer_id TEXT;
BEGIN
  v_session_id := payload->>'id';
  v_payment_intent_id := payload->'payment_intent'->>'id';
  v_customer_email := payload->'customer_details'->'email'->>'value';
  v_customer_id := payload->>'customer';
  
  UPDATE public.payments 
  SET 
    stripe_session_id = v_session_id,
    customer_email = v_customer_email,
    stripe_customer_id = v_customer_id,
    updated_at = NOW()
  WHERE stripe_payment_intent_id = v_payment_intent_id;
  
  INSERT INTO public.stripe_customers (
    stripe_customer_id,
    profile_id,
    created_at,
    updated_at
  ) VALUES (
    v_customer_id,
    NULL,
    NOW(),
    NOW()
  ) ON CONFLICT (stripe_customer_id) 
  DO UPDATE SET 
    updated_at = NOW();
END;
$function$;

-- 12. handle_payment_intent_created
CREATE OR REPLACE FUNCTION public.handle_payment_intent_created(payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_payment_intent_id TEXT;
  v_amount INTEGER;
  v_currency TEXT;
  v_booking_id UUID;
  v_idempotency_key TEXT;
BEGIN
  v_payment_intent_id := payload->>'id';
  v_amount := (payload->'amount')::INTEGER;
  v_currency := payload->>'currency';
  v_booking_id := (payload->'metadata'->>'booking_id')::UUID;
  v_idempotency_key := 'stripe_' || v_payment_intent_id;
  
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
    v_booking_id,
    v_amount,
    v_currency,
    'card',
    v_payment_intent_id,
    v_idempotency_key,
    'pending',
    NOW(),
    NOW()
  ) ON CONFLICT (idempotency_key) DO NOTHING;
END;
$function$;

-- 13. handle_payment_intent_failed
CREATE OR REPLACE FUNCTION public.handle_payment_intent_failed(payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_payment_intent_id TEXT;
  v_booking_id UUID;
  v_failure_reason TEXT;
BEGIN
  v_payment_intent_id := payload->>'id';
  v_booking_id := (payload->'metadata'->>'booking_id')::UUID;
  v_failure_reason := payload->'last_payment_error'->>'message';
  
  UPDATE public.payments 
  SET 
    status = 'failed',
    failure_reason = v_failure_reason,
    updated_at = NOW()
  WHERE stripe_payment_intent_id = v_payment_intent_id;
  
  IF v_booking_id IS NOT NULL THEN
    UPDATE public.bookings 
    SET 
      status = 'failed',
      updated_at = NOW()
    WHERE id = v_booking_id;
  END IF;
END;
$function$;

-- 14. handle_payment_intent_succeeded
CREATE OR REPLACE FUNCTION public.handle_payment_intent_succeeded(payload jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_payment_intent_id TEXT;
  v_amount_received INTEGER;
  v_currency TEXT;
  v_booking_id UUID;
BEGIN
  v_payment_intent_id := payload->>'id';
  v_amount_received := (payload->'amount_received')::INTEGER;
  v_currency := payload->>'currency';
  v_booking_id := (payload->'metadata'->>'booking_id')::UUID;
  
  UPDATE public.payments 
  SET 
    status = 'succeeded',
    amount_received = v_amount_received,
    currency = v_currency,
    updated_at = NOW()
  WHERE stripe_payment_intent_id = v_payment_intent_id;
  
  IF v_booking_id IS NOT NULL THEN
    UPDATE public.bookings 
    SET 
      status = 'confirmed',
      updated_at = NOW()
    WHERE id = v_booking_id;
  END IF;
END;
$function$;

-- 15. is_valid_email
CREATE OR REPLACE FUNCTION public.is_valid_email(email text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = 'public'
AS $function$
  SELECT email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
$function$;

-- 16. is_valid_phone
CREATE OR REPLACE FUNCTION public.is_valid_phone(phone text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = 'public'
AS $function$
  SELECT phone ~* '^\+?[1-9]\d{1,14}$';
$function$;

-- 17. jwt_sub
CREATE OR REPLACE FUNCTION public.jwt_sub()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = 'public'
AS $function$
  SELECT COALESCE(NULLIF(current_setting('request.jwt.claims', true), '')::jsonb->>'sub','')
$function$;

-- 18. log_audit_event
CREATE OR REPLACE FUNCTION public.log_audit_event(table_name text, operation text, record_id uuid, old_data jsonb DEFAULT NULL::jsonb, new_data jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.audit_logs (
    table_name,
    operation,
    record_id,
    old_data,
    new_data,
    user_id,
    created_at
  ) VALUES (
    table_name,
    operation,
    record_id,
    old_data,
    new_data,
    auth.uid()::text,
    NOW()
  );
END;
$function$;

-- 19. org_id_from_jwt
CREATE OR REPLACE FUNCTION public.org_id_from_jwt()
RETURNS uuid
LANGUAGE sql
STABLE
SET search_path = 'public'
AS $function$
  SELECT nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'org_id','')::uuid
$function$;

-- 20. process_stripe_webhook
CREATE OR REPLACE FUNCTION public.process_stripe_webhook(p_stripe_event_id text, p_event_type text, p_raw_payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_event_id UUID;
  v_result JSONB;
BEGIN
  SELECT id INTO v_event_id 
  FROM public.webhook_events 
  WHERE stripe_event_id = p_stripe_event_id;
  
  IF v_event_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Event already processed',
      'event_id', v_event_id,
      'is_duplicate', true
    );
  END IF;
  
  INSERT INTO public.webhook_events (stripe_event_id, event_type, raw_payload)
  VALUES (p_stripe_event_id, p_event_type, p_raw_payload)
  RETURNING id INTO v_event_id;
  
  CASE p_event_type
    WHEN 'payment_intent.succeeded' THEN
      PERFORM public.handle_payment_intent_succeeded(p_raw_payload);
    WHEN 'payment_intent.payment_failed' THEN
      PERFORM public.handle_payment_intent_failed(p_raw_payload);
    WHEN 'checkout.session.completed' THEN
      PERFORM public.handle_checkout_session_completed(p_raw_payload);
    WHEN 'payment_intent.created' THEN
      PERFORM public.handle_payment_intent_created(p_raw_payload);
    ELSE
      UPDATE public.webhook_events 
      SET processing_error = 'Unhandled event type: ' || p_event_type
      WHERE id = v_event_id;
  END CASE;
  
  UPDATE public.webhook_events 
  SET processed = TRUE, processed_at = NOW()
  WHERE id = v_event_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Event processed successfully',
    'event_id', v_event_id,
    'is_duplicate', false
  );
EXCEPTION
  WHEN OTHERS THEN
    UPDATE public.webhook_events 
    SET processing_error = SQLERRM
    WHERE id = v_event_id;
    
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Event processing failed: ' || SQLERRM,
      'event_id', v_event_id,
      'is_duplicate', false
    );
END;
$function$;

-- Stage 5 Part 2 complete (20/46)