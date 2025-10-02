# 2. RPC Functions (Required for JSONB Operations)

```sql
-- CRITICAL: These RPC functions are required - direct JSONB updates will fail

-- 1. Merge stage data (with correct CASE syntax)
CREATE OR REPLACE FUNCTION wizard_merge_stage_data(
  p_session_id TEXT,
  p_stage TEXT,
  p_data JSONB
) RETURNS VOID 
SECURITY INVOKER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the appropriate stage column
  UPDATE wizard_sessions
  SET
    organizer_data = CASE WHEN p_stage = 'organizer' THEN organizer_data || p_data ELSE organizer_data END,
    event_data     = CASE WHEN p_stage = 'event'     THEN event_data || p_data     ELSE event_data END,
    ticket_data    = CASE WHEN p_stage = 'ticket'    THEN ticket_data || p_data    ELSE ticket_data END,
    venue_data     = CASE WHEN p_stage = 'venue'     THEN venue_data || p_data     ELSE venue_data END,
    payment_data   = CASE WHEN p_stage = 'payment'   THEN payment_data || p_data   ELSE payment_data END,
    sponsor_data   = CASE WHEN p_stage = 'sponsor'   THEN sponsor_data || p_data   ELSE sponsor_data END,
    updated_at = NOW()
  WHERE session_id = p_session_id
    AND (user_id = auth.uid() OR organization_id = auth.jwt_org_id());
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found or access denied';
  END IF;
END;
$$;

-- 2. Update progress with weighted calculation
CREATE OR REPLACE FUNCTION wizard_update_progress(
  p_session_id TEXT,
  p_stage TEXT,
  p_percentage INTEGER
) RETURNS INTEGER
SECURITY INVOKER
LANGUAGE plpgsql
AS $$
DECLARE
  v_details JSONB;
  v_total INTEGER := 0;
BEGIN
  -- Update completion for specific stage
  UPDATE wizard_sessions
  SET 
    completion_details = completion_details || jsonb_build_object(p_stage, p_percentage),
    updated_at = NOW()
  WHERE session_id = p_session_id
    AND (user_id = auth.uid() OR organization_id = auth.jwt_org_id())
  RETURNING completion_details INTO v_details;
  
  IF v_details IS NULL THEN
    RAISE EXCEPTION 'Session not found or access denied';
  END IF;
  
  -- Calculate weighted total (weights sum to 100)
  v_total := (
    COALESCE((v_details->>'organizerSetup')::INT, 0) * 15 +
    COALESCE((v_details->>'eventSetup')::INT, 0) * 20 +
    COALESCE((v_details->>'venueSetup')::INT, 0) * 15 +
    COALESCE((v_details->>'ticketSetup')::INT, 0) * 20 +
    COALESCE((v_details->>'sponsorsMedia')::INT, 0) * 15 +
    COALESCE((v_details->>'reviewPublish')::INT, 0) * 15
  ) / 100;
  
  -- Update total percentage
  UPDATE wizard_sessions
  SET completion_percentage = v_total
  WHERE session_id = p_session_id;
  
  RETURN v_total;
END;
$$;

-- 3. Stage transition with validation
CREATE OR REPLACE FUNCTION wizard_transition_stage(
  p_session_id TEXT,
  p_from_stage TEXT,
  p_to_stage TEXT
) RETURNS VOID
SECURITY INVOKER
LANGUAGE plpgsql
AS $$
DECLARE
  v_org_id UUID;
BEGIN
  -- Transition to next stage
  UPDATE wizard_sessions
  SET 
    current_stage = p_to_stage,
    completed_stages = ARRAY(
      SELECT DISTINCT unnest(completed_stages || p_from_stage)
    ),
    updated_at = NOW()
  WHERE session_id = p_session_id
    AND current_stage = p_from_stage
    AND (user_id = auth.uid() OR organization_id = auth.jwt_org_id())
  RETURNING organization_id INTO v_org_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid transition or access denied';
  END IF;
  
  -- Log the transition
  INSERT INTO wizard_actions (
    session_id,
    organization_id,
    action_name,
    stage,
    payload
  ) VALUES (
    p_session_id,
    v_org_id,
    'stage_transition',
    p_to_stage,
    jsonb_build_object('from', p_from_stage, 'to', p_to_stage)
  );
END;
$$;

-- 4. Get or create session
CREATE OR REPLACE FUNCTION wizard_get_or_create_session(
  p_session_id TEXT,
  p_user_id UUID,
  p_org_id UUID DEFAULT NULL
) RETURNS wizard_sessions
SECURITY INVOKER
LANGUAGE plpgsql
AS $$
DECLARE
  v_session wizard_sessions;
BEGIN
  -- Try to get existing active session
  SELECT * INTO v_session
  FROM wizard_sessions
  WHERE session_id = p_session_id
    AND is_active = true
    AND user_id = p_user_id;
  
  IF FOUND THEN
    RETURN v_session;
  END IF;
  
  -- Create new session
  INSERT INTO wizard_sessions (
    session_id,
    user_id,
    organization_id,
    current_stage
  ) VALUES (
    p_session_id,
    p_user_id,
    p_org_id,
    'organizerSetup'
  )
  RETURNING * INTO v_session;
  
  RETURN v_session;
END;
$$;

-- 5. Cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Mark expired sessions
  UPDATE wizard_sessions
  SET 
    status = 'expired',
    is_active = false
  WHERE expires_at < NOW() 
    AND status = 'in_progress';
  
  -- Delete old expired sessions
  DELETE FROM wizard_sessions
  WHERE status = 'expired'
    AND updated_at < NOW() - INTERVAL '30 days';
END;
$$;
```