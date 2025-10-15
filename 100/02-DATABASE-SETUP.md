# FashionOS AI - Database Setup Guide

Complete SQL scripts for all AI-related tables, RLS policies, and indexes.

---

## Core AI Tables

### 1. Model Castings Table

Tracks AI-generated model recommendations for events.

```sql
-- Model Castings (track AI recommendations)
CREATE TABLE model_castings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) NOT NULL,
  model_name TEXT NOT NULL,
  agency TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'invited' 
    CHECK (status IN ('invited', 'confirmed', 'declined', 'backup')),
  ai_match_score INTEGER CHECK (ai_match_score BETWEEN 0 AND 100),
  ai_reasoning TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_model_castings_event_id ON model_castings(event_id);
CREATE INDEX idx_model_castings_status ON model_castings(status);
```

### 2. AI Agent Logs Table

Service-role only table for observability and debugging.

```sql
-- AI Agent Logs (service-role only - observability)
CREATE TABLE ai_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL,
  event_id UUID REFERENCES events(id),
  operation TEXT NOT NULL,
  model TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  tokens_used INTEGER,
  latency_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ai_agent_logs_event_id ON ai_agent_logs(event_id);
CREATE INDEX idx_ai_agent_logs_created_at ON ai_agent_logs(created_at DESC);
CREATE INDEX idx_ai_agent_logs_agent_type ON ai_agent_logs(agent_type);
```

---

## Row Level Security (RLS)

### Model Castings Policies

```sql
-- Enable RLS
ALTER TABLE model_castings ENABLE ROW LEVEL SECURITY;

-- Organizers manage their event castings
CREATE POLICY "organizers_manage_castings" ON model_castings
  FOR ALL 
  USING (event_id IN (
    SELECT id FROM events WHERE organizer_id = current_profile_id()
  ));

-- Admins view all castings
CREATE POLICY "admins_view_all_castings" ON model_castings
  FOR SELECT
  USING (has_role('admin'));
```

### AI Agent Logs Policies

```sql
-- Enable RLS
ALTER TABLE ai_agent_logs ENABLE ROW LEVEL SECURITY;

-- Service role only for logs (blocks all public access)
CREATE POLICY "service_role_only" ON ai_agent_logs
  FOR ALL USING (false);
```

---

## Fix Incomplete RLS on Existing Tables

### Events Table

```sql
-- Events table (currently only has public SELECT)
CREATE POLICY "organizers_insert_events" ON events
  FOR INSERT
  WITH CHECK (organizer_id = current_profile_id());

CREATE POLICY "organizers_update_own_events" ON events
  FOR UPDATE
  USING (organizer_id = current_profile_id());

CREATE POLICY "organizers_delete_own_events" ON events
  FOR DELETE
  USING (organizer_id = current_profile_id());

CREATE POLICY "admins_manage_all_events" ON events
  FOR ALL
  USING (has_role('admin'));
```

### Missing Indexes

```sql
-- Add indexes on foreign keys for performance
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
```

---

## Helper Functions

### Current Profile ID

```sql
-- Helper function to get current user's profile ID
CREATE OR REPLACE FUNCTION current_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;
```

### Role Check

```sql
-- Helper function to check if user has a specific role
CREATE OR REPLACE FUNCTION has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = role_name
  )
$$ LANGUAGE sql SECURITY DEFINER;
```

---

## Verification Queries

### Check RLS is Enabled

```sql
-- Verify RLS is enabled on all critical tables
SELECT 
  schemaname,
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('events', 'model_castings', 'ai_agent_logs')
ORDER BY tablename;
```

### Check Policies

```sql
-- List all policies on AI tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('model_castings', 'ai_agent_logs')
ORDER BY tablename, policyname;
```

### Check Indexes

```sql
-- Verify indexes are created
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('model_castings', 'ai_agent_logs')
ORDER BY tablename, indexname;
```

---

## Troubleshooting

### Common Issues

**Issue:** Cannot insert into model_castings  
**Solution:** Ensure user has a profile and is the event organizer

**Issue:** Cannot read ai_agent_logs  
**Solution:** This is expected - only service role can access logs

**Issue:** Slow queries on large tables  
**Solution:** Verify indexes are created, run `ANALYZE model_castings;`

---

**Version:** 1.0  
**Last Updated:** January 2025
