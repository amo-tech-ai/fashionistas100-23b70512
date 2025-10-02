# 1. Database Schema & RPC Functions

## Complete production-ready schema with all fixes

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Core Tables
CREATE TABLE wizard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID,
  
  -- State tracking
  current_stage VARCHAR(50) NOT NULL DEFAULT 'organizerSetup'
    CHECK (current_stage IN (
      'organizerSetup', 'eventSetup', 'venueSetup', 
      'ticketSetup', 'sponsorsMedia', 'reviewPublish'
    )),
  completed_stages TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  
  -- Stage data (separate for efficiency)
  organizer_data JSONB DEFAULT '{}' NOT NULL,
  event_data JSONB DEFAULT '{}' NOT NULL,
  ticket_data JSONB DEFAULT '{}' NOT NULL,
  venue_data JSONB DEFAULT '{}' NOT NULL,
  payment_data JSONB DEFAULT '{}' NOT NULL,
  sponsor_data JSONB DEFAULT '{}' NOT NULL,
  
  -- Progress
  completion_details JSONB DEFAULT '{
    "organizerSetup": 0,
    "eventSetup": 0,
    "venueSetup": 0,
    "ticketSetup": 0,
    "sponsorsMedia": 0,
    "reviewPublish": 0
  }'::JSONB NOT NULL,
  completion_percentage INTEGER DEFAULT 0 
    CHECK (completion_percentage BETWEEN 0 AND 100),
  
  -- References
  stripe_account_id VARCHAR(255),
  event_id UUID,
  
  -- Status
  status VARCHAR(30) DEFAULT 'in_progress' 
    CHECK (status IN ('in_progress', 'completed', 'abandoned', 'expired')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE TABLE wizard_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES wizard_sessions(session_id) ON DELETE CASCADE,
  organization_id UUID,
  
  action_name VARCHAR(100) NOT NULL,
  idempotency_key TEXT UNIQUE,
  stage VARCHAR(50),
  
  payload JSONB DEFAULT '{}',
  result JSONB DEFAULT '{}',
  error_message TEXT,
  execution_time_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wizard_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES wizard_sessions(session_id) ON DELETE CASCADE,
  
  role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
  stage VARCHAR(50),
  message TEXT,
  
  -- Metrics
  tokens_used INTEGER,
  model VARCHAR(50),
  latency_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stripe_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID,
  
  -- Event details
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  
  -- Schedule
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Venue
  venue_mode VARCHAR(20) CHECK (venue_mode IN ('physical', 'virtual', 'hybrid')),
  venue_data JSONB DEFAULT '{}',
  
  -- Tickets
  ticket_tiers JSONB DEFAULT '[]',
  total_capacity INTEGER,
  
  -- Payment
  stripe_account_id VARCHAR(255),
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes
CREATE INDEX idx_sessions_user_active ON wizard_sessions(user_id) 
  WHERE is_active = true;
CREATE INDEX idx_sessions_org ON wizard_sessions(organization_id) 
  WHERE is_active = true;
CREATE INDEX idx_sessions_stripe ON wizard_sessions(stripe_account_id) 
  WHERE stripe_account_id IS NOT NULL;
CREATE INDEX idx_sessions_expires ON wizard_sessions(expires_at) 
  WHERE status = 'in_progress';
CREATE INDEX idx_actions_idempotency ON wizard_actions(idempotency_key) 
  WHERE idempotency_key IS NOT NULL;
CREATE INDEX idx_interactions_session ON wizard_interactions(session_id, created_at DESC);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_published ON events(status, event_date) 
  WHERE status = 'published';

-- 3. Helper Functions for JWT
CREATE OR REPLACE FUNCTION auth.jwt_claim(claim TEXT) 
RETURNS TEXT 
LANGUAGE SQL STABLE
AS $$
  SELECT 
    COALESCE(
      NULLIF(current_setting('request.jwt.claims', true), '')::json->>claim,
      NULLIF(current_setting('request.jwt.claim.' || claim, true), '')
    )::TEXT;
$$;

CREATE OR REPLACE FUNCTION auth.jwt_org_id() 
RETURNS UUID 
LANGUAGE SQL STABLE
AS $$
  SELECT NULLIF(auth.jwt_claim('organization_id'), '')::UUID;
$$;

-- 4. Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sessions_updated_at 
  BEFORE UPDATE ON wizard_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Slug generation
CREATE OR REPLACE FUNCTION generate_event_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]+', '-', 'g')) 
              || '-' || SUBSTRING(gen_random_uuid()::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_generate_slug 
  BEFORE INSERT ON events
  FOR EACH ROW EXECUTE FUNCTION generate_event_slug();
```