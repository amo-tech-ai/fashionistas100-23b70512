# 3. Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE wizard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 1. Sessions Policies (users can only access their own)
CREATE POLICY sessions_user_access ON wizard_sessions
  FOR ALL 
  USING (
    user_id = auth.uid() 
    OR (auth.jwt_org_id() IS NOT NULL AND organization_id = auth.jwt_org_id())
  )
  WITH CHECK (
    user_id = auth.uid() 
    OR (auth.jwt_org_id() IS NOT NULL AND organization_id = auth.jwt_org_id())
  );

-- 2. Actions Policies (read-only for users)
CREATE POLICY actions_user_read ON wizard_actions
  FOR SELECT 
  USING (
    session_id IN (
      SELECT session_id FROM wizard_sessions 
      WHERE user_id = auth.uid() 
        OR organization_id = auth.jwt_org_id()
    )
  );

-- Service role can insert (for logging)
CREATE POLICY actions_service_insert ON wizard_actions
  FOR INSERT
  WITH CHECK (true); -- RPCs handle validation

-- 3. Interactions Policies
CREATE POLICY interactions_user_read ON wizard_interactions
  FOR SELECT 
  USING (
    session_id IN (
      SELECT session_id FROM wizard_sessions 
      WHERE user_id = auth.uid() 
        OR organization_id = auth.jwt_org_id()
    )
  );

CREATE POLICY interactions_service_insert ON wizard_interactions
  FOR INSERT
  WITH CHECK (true); -- RPCs handle validation

-- 4. Events Policies
-- Users can manage their own events
CREATE POLICY events_user_manage ON events
  FOR ALL 
  USING (
    user_id = auth.uid() 
    OR (auth.jwt_org_id() IS NOT NULL AND organization_id = auth.jwt_org_id())
  )
  WITH CHECK (
    user_id = auth.uid() 
    OR (auth.jwt_org_id() IS NOT NULL AND organization_id = auth.jwt_org_id())
  );

-- Public can view published events
CREATE POLICY events_public_read ON events
  FOR SELECT
  USING (status = 'published');

-- 5. Stripe Events (service role only)
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY stripe_events_service_only ON stripe_events
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
```