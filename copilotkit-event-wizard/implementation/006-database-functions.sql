-- ============================================
-- Database Functions and Triggers
-- Version: 1.0.0
-- Date: October 2, 2025
-- ============================================

-- ============================================
-- WIZARD SESSION FUNCTIONS
-- ============================================

-- Create a new wizard session
CREATE OR REPLACE FUNCTION create_wizard_session(
  p_user_id UUID
) RETURNS wizard_sessions AS $$
DECLARE
  v_session wizard_sessions;
BEGIN
  -- Expire any active sessions for this user
  UPDATE wizard_sessions
  SET status = 'expired'
  WHERE user_id = p_user_id
  AND status = 'active';
  
  -- Create new session
  INSERT INTO wizard_sessions (
    user_id,
    current_stage,
    status,
    completion_percentage,
    data
  ) VALUES (
    p_user_id,
    'organizerSetup',
    'active',
    0,
    '{}'::jsonb
  )
  RETURNING * INTO v_session;
  
  -- Log session creation
  INSERT INTO wizard_actions (
    session_id,
    action_name,
    stage,
    params,
    success
  ) VALUES (
    v_session.session_id,
    'session_created',
    'organizerSetup',
    jsonb_build_object('user_id', p_user_id),
    true
  );
  
  RETURN v_session;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate session completion percentage (moved before usage)
CREATE OR REPLACE FUNCTION calculate_completion_percentage(
  p_session_id UUID
) RETURNS INTEGER AS $$
DECLARE
  v_data JSONB;
  v_completed_stages INTEGER := 0;
  v_total_stages INTEGER := 6;
BEGIN
  SELECT data INTO v_data
  FROM wizard_sessions
  WHERE session_id = p_session_id;
  
  IF v_data ? 'organizerSetup' AND v_data->'organizerSetup' != 'null' THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  IF v_data ? 'eventSetup' AND v_data->'eventSetup' != 'null' THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  IF v_data ? 'venueSetup' AND v_data->'venueSetup' != 'null' THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  IF v_data ? 'ticketSetup' AND v_data->'ticketSetup' != 'null' THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  IF v_data ? 'sponsorSetup' AND v_data->'sponsorSetup' != 'null' THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  IF v_data ? 'reviewPublish' AND v_data->'reviewPublish' != 'null' THEN
    v_completed_stages := v_completed_stages + 1;
  END IF;
  
  RETURN (v_completed_stages * 100) / v_total_stages;
END;
$$ LANGUAGE plpgsql;

-- Update wizard session data
CREATE OR REPLACE FUNCTION update_wizard_session(
  p_session_id UUID,
  p_stage wizard_stage,
  p_data JSONB
) RETURNS wizard_sessions AS $$
DECLARE
  v_session wizard_sessions;
  v_completion INTEGER;
BEGIN
  -- Update session data
  UPDATE wizard_sessions
  SET 
    data = data || jsonb_build_object(p_stage::text, p_data),
    current_stage = p_stage,
    last_activity_at = NOW()
  WHERE session_id = p_session_id
  RETURNING * INTO v_session;
  
  -- Calculate completion percentage
  v_completion := calculate_completion_percentage(p_session_id);
  
  -- Update completion
  UPDATE wizard_sessions
  SET completion_percentage = v_completion
  WHERE session_id = p_session_id;
  
  -- Log the update
  INSERT INTO wizard_actions (
    session_id,
    action_name,
    stage,
    params,
    success
  ) VALUES (
    p_session_id,
    'stage_updated',
    p_stage,
    jsonb_build_object('stage', p_stage::text),
    true
  );
  
  RETURN v_session;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Complete wizard and create event
CREATE OR REPLACE FUNCTION complete_wizard_session(
  p_session_id UUID,
  p_idempotency_key UUID DEFAULT NULL
) RETURNS events AS $$
DECLARE
  v_session wizard_sessions;
  v_event events;
  v_user_id UUID;
  v_idempotency_key UUID;
BEGIN
  -- Generate or use provided idempotency key
  v_idempotency_key := COALESCE(p_idempotency_key, uuid_generate_v4());

  -- Check if event already exists for this session (idempotency check)
  SELECT * INTO v_event
  FROM events
  WHERE wizard_session_id = p_session_id
  OR idempotency_key = v_idempotency_key;

  IF FOUND THEN
    -- Event already created, return it
    RAISE NOTICE 'Event already exists for session %, returning existing event', p_session_id;
    RETURN v_event;
  END IF;

  -- Get session data
  SELECT * INTO v_session
  FROM wizard_sessions
  WHERE session_id = p_session_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found: %', p_session_id;
  END IF;

  IF v_session.status = 'completed' AND v_session.event_id IS NOT NULL THEN
    -- Session already completed, return existing event
    SELECT * INTO v_event FROM events WHERE id = v_session.event_id;
    IF FOUND THEN
      RAISE NOTICE 'Session already completed, returning existing event';
      RETURN v_event;
    END IF;
  END IF;

  IF v_session.status NOT IN ('active', 'completed') THEN
    RAISE EXCEPTION 'Session is not active or completed: status=%', v_session.status;
  END IF;

  -- Validate required data exists
  IF NOT (v_session.data ? 'eventSetup') THEN
    RAISE EXCEPTION 'Missing eventSetup data';
  END IF;

  IF NOT (v_session.data ? 'venueSetup') THEN
    RAISE EXCEPTION 'Missing venueSetup data';
  END IF;

  -- Create event from session data with error handling
  BEGIN
    INSERT INTO events (
      title,
      slug,
      description,
      event_type,
      status,
      organizer_id,
      venue_id,
      start_date,
      end_date,
      capacity,
      ticket_tiers,
      featured_image,
      metadata,
      wizard_session_id,
      idempotency_key
    )
    SELECT
      COALESCE(v_session.data->'eventSetup'->>'title', 'Untitled Event'),
      COALESCE(
        v_session.data->'eventSetup'->>'slug',
        generate_event_slug(v_session.data->'eventSetup'->>'title')
      ),
      v_session.data->'eventSetup'->>'description',
      v_session.data->'eventSetup'->>'eventType',
      'published'::event_status,
      v_session.user_id,
      (v_session.data->'venueSetup'->>'venueId')::UUID,
      (v_session.data->'eventSetup'->>'startDate')::TIMESTAMP WITH TIME ZONE,
      (v_session.data->'eventSetup'->>'endDate')::TIMESTAMP WITH TIME ZONE,
      (v_session.data->'venueSetup'->>'capacity')::INTEGER,
      COALESCE(v_session.data->'ticketSetup'->'tiers', '[]'::jsonb),
      v_session.data->'eventSetup'->>'featuredImage',
      v_session.data,
      p_session_id,
      v_idempotency_key
    RETURNING * INTO v_event;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log error
      INSERT INTO wizard_actions (
        session_id,
        action_name,
        stage,
        params,
        success,
        error_message
      ) VALUES (
        p_session_id,
        'session_completion_failed',
        'reviewPublish',
        jsonb_build_object('error', SQLERRM),
        false,
        SQLERRM
      );
      RAISE EXCEPTION 'Failed to create event: %', SQLERRM;
  END;

  -- Update session
  UPDATE wizard_sessions
  SET
    status = 'completed',
    completed_at = NOW(),
    event_id = v_event.id,
    completion_percentage = 100
  WHERE session_id = p_session_id;

  -- Log completion
  INSERT INTO wizard_actions (
    session_id,
    action_name,
    stage,
    params,
    result,
    success
  ) VALUES (
    p_session_id,
    'session_completed',
    'reviewPublish',
    jsonb_build_object('event_id', v_event.id, 'idempotency_key', v_idempotency_key),
    jsonb_build_object('event_id', v_event.id, 'slug', v_event.slug),
    true
  );

  RETURN v_event;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ACTION LOGGING FUNCTIONS
-- ============================================

-- Log wizard action
CREATE OR REPLACE FUNCTION log_wizard_action(
  p_session_id UUID,
  p_action_name TEXT,
  p_stage wizard_stage,
  p_params JSONB DEFAULT '{}'::jsonb,
  p_result JSONB DEFAULT '{}'::jsonb,
  p_success BOOLEAN DEFAULT false,
  p_error_message TEXT DEFAULT NULL,
  p_duration_ms INTEGER DEFAULT NULL
) RETURNS wizard_actions AS $$
DECLARE
  v_action wizard_actions;
BEGIN
  INSERT INTO wizard_actions (
    session_id,
    action_name,
    stage,
    params,
    result,
    success,
    error_message,
    duration_ms
  ) VALUES (
    p_session_id,
    p_action_name,
    p_stage,
    p_params,
    p_result,
    p_success,
    p_error_message,
    p_duration_ms
  )
  RETURNING * INTO v_action;
  
  RETURN v_action;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log AI interaction
CREATE OR REPLACE FUNCTION log_ai_interaction(
  p_session_id UUID,
  p_interaction_type TEXT,
  p_stage wizard_stage,
  p_user_message TEXT DEFAULT NULL,
  p_ai_response TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS wizard_interactions AS $$
DECLARE
  v_interaction wizard_interactions;
BEGIN
  INSERT INTO wizard_interactions (
    session_id,
    interaction_type,
    stage,
    user_message,
    ai_response,
    metadata
  ) VALUES (
    p_session_id,
    p_interaction_type,
    p_stage,
    p_user_message,
    p_ai_response,
    p_metadata
  )
  RETURNING * INTO v_interaction;
  
  RETURN v_interaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ANALYTICS FUNCTIONS
-- ============================================

-- Get session analytics
CREATE OR REPLACE FUNCTION get_session_analytics(
  p_session_id UUID
) RETURNS TABLE (
  total_actions BIGINT,
  successful_actions BIGINT,
  failed_actions BIGINT,
  total_interactions BIGINT,
  avg_action_duration_ms NUMERIC,
  time_spent_minutes NUMERIC,
  completion_percentage INTEGER,
  current_stage wizard_stage
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT wa.id) AS total_actions,
    COUNT(DISTINCT wa.id) FILTER (WHERE wa.success = true) AS successful_actions,
    COUNT(DISTINCT wa.id) FILTER (WHERE wa.success = false) AS failed_actions,
    COUNT(DISTINCT wi.id) AS total_interactions,
    AVG(wa.duration_ms)::NUMERIC AS avg_action_duration_ms,
    EXTRACT(EPOCH FROM (ws.last_activity_at - ws.started_at)) / 60 AS time_spent_minutes,
    ws.completion_percentage,
    ws.current_stage
  FROM wizard_sessions ws
  LEFT JOIN wizard_actions wa ON wa.session_id = ws.session_id
  LEFT JOIN wizard_interactions wi ON wi.session_id = ws.session_id
  WHERE ws.session_id = p_session_id
  GROUP BY ws.session_id, ws.last_activity_at, ws.started_at, ws.completion_percentage, ws.current_stage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user analytics
CREATE OR REPLACE FUNCTION get_user_analytics(
  p_user_id UUID
) RETURNS TABLE (
  total_sessions BIGINT,
  completed_sessions BIGINT,
  abandoned_sessions BIGINT,
  total_events_created BIGINT,
  avg_completion_time_minutes NUMERIC,
  avg_completion_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT ws.session_id) AS total_sessions,
    COUNT(DISTINCT ws.session_id) FILTER (WHERE ws.status = 'completed') AS completed_sessions,
    COUNT(DISTINCT ws.session_id) FILTER (WHERE ws.status = 'abandoned') AS abandoned_sessions,
    COUNT(DISTINCT e.id) AS total_events_created,
    AVG(
      CASE 
        WHEN ws.status = 'completed' THEN
          EXTRACT(EPOCH FROM (ws.completed_at - ws.started_at)) / 60
        ELSE NULL
      END
    )::NUMERIC AS avg_completion_time_minutes,
    AVG(ws.completion_percentage)::NUMERIC AS avg_completion_percentage
  FROM wizard_sessions ws
  LEFT JOIN events e ON e.id = ws.event_id
  WHERE ws.user_id = p_user_id
  GROUP BY ws.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Generate unique slug for event
CREATE OR REPLACE FUNCTION generate_event_slug(
  p_title TEXT
) RETURNS TEXT AS $$
DECLARE
  v_slug TEXT;
  v_counter INTEGER := 0;
  v_exists BOOLEAN;
BEGIN
  -- Create base slug
  v_slug := lower(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := trim(both '-' from v_slug);
  
  -- Check if slug exists
  SELECT EXISTS(SELECT 1 FROM events WHERE slug = v_slug) INTO v_exists;
  
  -- Add counter if needed
  WHILE v_exists LOOP
    v_counter := v_counter + 1;
    v_slug := v_slug || '-' || v_counter;
    SELECT EXISTS(SELECT 1 FROM events WHERE slug = v_slug) INTO v_exists;
  END LOOP;
  
  RETURN v_slug;
END;
$$ LANGUAGE plpgsql;

-- Cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions() 
RETURNS void AS $$
BEGIN
  -- Mark sessions as expired if inactive for 24 hours
  UPDATE wizard_sessions
  SET status = 'expired'
  WHERE status = 'active'
  AND last_activity_at < NOW() - INTERVAL '24 hours';
  
  -- Mark sessions as abandoned if incomplete for 7 days
  UPDATE wizard_sessions
  SET status = 'abandoned'
  WHERE status = 'active'
  AND completion_percentage < 100
  AND started_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PERMISSIONS
-- ============================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION create_wizard_session(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_wizard_session(UUID, wizard_stage, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_wizard_session(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION log_wizard_action(UUID, TEXT, wizard_stage, JSONB, JSONB, BOOLEAN, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION log_ai_interaction(UUID, TEXT, wizard_stage, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_session_analytics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_analytics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_event_slug(TEXT) TO authenticated;

-- Service role permissions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;
