-- ============================================
-- Row Level Security (RLS) Policies
-- Version: 1.0.0
-- Date: October 2, 2025
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_interactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "users_read_own" ON users
  FOR SELECT
  USING (
    clerk_id = auth.jwt() ->> 'sub'
    OR id = auth.uid()
  );

-- Users can update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  USING (
    clerk_id = auth.jwt() ->> 'sub'
    OR id = auth.uid()
  )
  WITH CHECK (
    clerk_id = auth.jwt() ->> 'sub'
    OR id = auth.uid()
  );

-- Users can insert their own profile
CREATE POLICY "users_insert_own" ON users
  FOR INSERT
  WITH CHECK (
    clerk_id = auth.jwt() ->> 'sub'
  );

-- Public can view basic user info for events
CREATE POLICY "users_public_read" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.organizer_id = users.id
      AND events.status = 'published'
    )
  );

-- ============================================
-- EVENTS TABLE POLICIES
-- ============================================

-- Anyone can view published events
CREATE POLICY "events_public_read" ON events
  FOR SELECT
  USING (status = 'published');

-- Organizers can view their own events
CREATE POLICY "events_organizer_read" ON events
  FOR SELECT
  USING (
    organizer_id IN (
      SELECT id FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Organizers can create events
CREATE POLICY "events_organizer_create" ON events
  FOR INSERT
  WITH CHECK (
    organizer_id IN (
      SELECT id FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Organizers can update their own events
CREATE POLICY "events_organizer_update" ON events
  FOR UPDATE
  USING (
    organizer_id IN (
      SELECT id FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  )
  WITH CHECK (
    organizer_id IN (
      SELECT id FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Organizers can delete their own draft events
CREATE POLICY "events_organizer_delete" ON events
  FOR DELETE
  USING (
    organizer_id IN (
      SELECT id FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
    )
    AND status = 'draft'
  );

-- ============================================
-- WIZARD_SESSIONS TABLE POLICIES
-- ============================================

-- Users can read their own sessions
CREATE POLICY "wizard_sessions_read_own" ON wizard_sessions
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Users can create their own sessions
CREATE POLICY "wizard_sessions_create_own" ON wizard_sessions
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Users can update their own sessions
CREATE POLICY "wizard_sessions_update_own" ON wizard_sessions
  FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM users
      WHERE clerk_id = auth.jwt() ->> 'sub'
    )
  );

-- Users cannot delete sessions (audit trail)
-- No DELETE policy = no deletes allowed

-- ============================================
-- WIZARD_ACTIONS TABLE POLICIES
-- ============================================

-- Users can read actions for their sessions
CREATE POLICY "wizard_actions_read_own" ON wizard_actions
  FOR SELECT
  USING (
    session_id IN (
      SELECT session_id FROM wizard_sessions
      WHERE user_id IN (
        SELECT id FROM users
        WHERE clerk_id = auth.jwt() ->> 'sub'
      )
    )
  );

-- Users can insert actions for their sessions
CREATE POLICY "wizard_actions_insert_own" ON wizard_actions
  FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT session_id FROM wizard_sessions
      WHERE user_id IN (
        SELECT id FROM users
        WHERE clerk_id = auth.jwt() ->> 'sub'
      )
    )
  );

-- No UPDATE or DELETE policies (immutable audit log)

-- ============================================
-- WIZARD_INTERACTIONS TABLE POLICIES
-- ============================================

-- Users can read interactions for their sessions
CREATE POLICY "wizard_interactions_read_own" ON wizard_interactions
  FOR SELECT
  USING (
    session_id IN (
      SELECT session_id FROM wizard_sessions
      WHERE user_id IN (
        SELECT id FROM users
        WHERE clerk_id = auth.jwt() ->> 'sub'
      )
    )
  );

-- Users can insert interactions for their sessions
CREATE POLICY "wizard_interactions_insert_own" ON wizard_interactions
  FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT session_id FROM wizard_sessions
      WHERE user_id IN (
        SELECT id FROM users
        WHERE clerk_id = auth.jwt() ->> 'sub'
      )
    )
  );

-- No UPDATE or DELETE policies (immutable audit log)

-- ============================================
-- SERVICE ROLE POLICIES (for analytics)
-- ============================================

-- Service role can read all data for analytics with audit logging
-- Note: These policies only apply when using service role key
-- Regular users cannot access these

CREATE POLICY "service_read_all_sessions" ON wizard_sessions
  FOR SELECT
  TO service_role
  USING (true)
  WITH CHECK (
    -- Log service role access
    INSERT INTO service_role_audit_log (operation, table_name, accessed_by, accessed_at)
    VALUES ('SELECT', 'wizard_sessions', current_user, NOW())
  );

CREATE POLICY "service_read_all_actions" ON wizard_actions
  FOR SELECT
  TO service_role
  USING (true)
  WITH CHECK (
    -- Log service role access
    INSERT INTO service_role_audit_log (operation, table_name, accessed_by, accessed_at)
    VALUES ('SELECT', 'wizard_actions', current_user, NOW())
  );

CREATE POLICY "service_read_all_interactions" ON wizard_interactions
  FOR SELECT
  TO service_role
  USING (true)
  WITH CHECK (
    -- Log service role access
    INSERT INTO service_role_audit_log (operation, table_name, accessed_by, accessed_at)
    VALUES ('SELECT', 'wizard_interactions', current_user, NOW())
  );

-- ============================================
-- SERVICE ROLE AUDIT LOGGING
-- ============================================

-- Create audit log table for service role access
CREATE TABLE IF NOT EXISTS service_role_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operation TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  accessed_by TEXT NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for audit log queries
CREATE INDEX idx_service_audit_table ON service_role_audit_log(table_name);
CREATE INDEX idx_service_audit_accessed_at ON service_role_audit_log(accessed_at);

-- Audit logging function for service role access
CREATE OR REPLACE FUNCTION log_service_role_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO service_role_audit_log (
    operation,
    table_name,
    record_id,
    accessed_by,
    metadata
  ) VALUES (
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    current_setting('request.jwt.claims', true)::jsonb->>'sub',
    jsonb_build_object(
      'role', current_setting('role', true),
      'operation', TG_OP
    )
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables (service role only)
CREATE TRIGGER audit_service_sessions
  AFTER SELECT ON wizard_sessions
  FOR EACH STATEMENT
  WHEN (current_setting('role') = 'service_role')
  EXECUTE FUNCTION log_service_role_access();

CREATE TRIGGER audit_service_actions
  AFTER SELECT ON wizard_actions
  FOR EACH STATEMENT
  WHEN (current_setting('role') = 'service_role')
  EXECUTE FUNCTION log_service_role_access();

CREATE TRIGGER audit_service_interactions
  AFTER SELECT ON wizard_interactions
  FOR EACH STATEMENT
  WHEN (current_setting('role') = 'service_role')
  EXECUTE FUNCTION log_service_role_access();

-- ============================================
-- SECURITY NOTES
-- ============================================

-- 1. All policies use auth.jwt() ->> 'sub' to get Clerk user ID
-- 2. Wizard actions and interactions are immutable (no UPDATE/DELETE)
-- 3. Sessions cannot be deleted (audit trail)
-- 4. Only draft events can be deleted
-- 5. Published events are publicly visible
-- 6. Service role has read-only access for analytics

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Test RLS is working (run as authenticated user):
-- SELECT * FROM wizard_sessions;
-- Should only return sessions for the authenticated user

-- Test audit trail is immutable:
-- UPDATE wizard_actions SET action_name = 'hacked' WHERE id = 'some-id';
-- Should fail with permission denied

-- Test cross-user isolation:
-- SELECT * FROM wizard_sessions WHERE user_id = 'other-user-id';
-- Should return empty set
