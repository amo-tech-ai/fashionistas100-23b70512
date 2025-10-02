-- ============================================
-- FashionOS Event Wizard Database Schema
-- Version: 1.0.0
-- Date: October 2, 2025
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================

-- User roles enum
CREATE TYPE user_role AS ENUM (
  'organizer',
  'designer', 
  'model',
  'venue',
  'vendor',
  'sponsor',
  'media',
  'buyer'
);

-- Event status enum
CREATE TYPE event_status AS ENUM (
  'draft',
  'published',
  'cancelled',
  'completed'
);

-- Wizard stage enum
CREATE TYPE wizard_stage AS ENUM (
  'organizerSetup',
  'eventSetup',
  'venueSetup',
  'ticketSetup',
  'sponsorSetup',
  'reviewPublish'
);

-- Session status enum
CREATE TYPE session_status AS ENUM (
  'active',
  'completed',
  'abandoned',
  'expired'
);

-- ============================================
-- CORE TABLES
-- ============================================

-- Users table (extends Clerk auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'organizer',
  profile_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  status event_status DEFAULT 'draft',
  organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  venue_id UUID,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  capacity INTEGER,
  ticket_tiers JSONB DEFAULT '[]'::jsonb,
  featured_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  wizard_session_id UUID REFERENCES wizard_sessions(session_id) ON DELETE SET NULL,
  idempotency_key UUID UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date > start_date),
  CONSTRAINT valid_capacity CHECK (capacity > 0)
);

-- ============================================
-- WIZARD TABLES
-- ============================================

-- Wizard sessions table
CREATE TABLE IF NOT EXISTS wizard_sessions (
  session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_stage wizard_stage DEFAULT 'organizerSetup',
  status session_status DEFAULT 'active',
  completion_percentage INTEGER DEFAULT 0,
  data JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  CONSTRAINT valid_percentage CHECK (completion_percentage >= 0 AND completion_percentage <= 100)
);

-- Wizard actions table (audit log)
CREATE TABLE IF NOT EXISTS wizard_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES wizard_sessions(session_id) ON DELETE CASCADE,
  action_name TEXT NOT NULL,
  stage wizard_stage NOT NULL,
  params JSONB DEFAULT '{}'::jsonb,
  result JSONB DEFAULT '{}'::jsonb,
  success BOOLEAN DEFAULT false,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wizard interactions table (AI interactions)
CREATE TABLE IF NOT EXISTS wizard_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES wizard_sessions(session_id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  stage wizard_stage NOT NULL,
  user_message TEXT,
  ai_response TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Users indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Events indexes
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_wizard_session ON events(wizard_session_id);
CREATE INDEX idx_events_idempotency_key ON events(idempotency_key);

-- Wizard sessions indexes
CREATE INDEX idx_wizard_sessions_user ON wizard_sessions(user_id);
CREATE INDEX idx_wizard_sessions_status ON wizard_sessions(status);
CREATE INDEX idx_wizard_sessions_stage ON wizard_sessions(current_stage);
CREATE INDEX idx_wizard_sessions_activity ON wizard_sessions(last_activity_at);

-- Wizard actions indexes
CREATE INDEX idx_wizard_actions_session ON wizard_actions(session_id);
CREATE INDEX idx_wizard_actions_created ON wizard_actions(created_at);
CREATE INDEX idx_wizard_actions_name ON wizard_actions(action_name);

-- Wizard interactions indexes
CREATE INDEX idx_wizard_interactions_session ON wizard_interactions(session_id);
CREATE INDEX idx_wizard_interactions_type ON wizard_interactions(interaction_type);
CREATE INDEX idx_wizard_interactions_created ON wizard_interactions(created_at);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp triggers
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Update session activity trigger
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE wizard_sessions
  SET last_activity_at = NOW()
  WHERE session_id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply activity triggers
CREATE TRIGGER update_session_on_action
  AFTER INSERT ON wizard_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_activity();

CREATE TRIGGER update_session_on_interaction
  AFTER INSERT ON wizard_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_activity();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Create or get user function
CREATE OR REPLACE FUNCTION create_or_get_user(
  p_clerk_id TEXT,
  p_email TEXT,
  p_role user_role DEFAULT 'organizer'
) RETURNS users AS $$
DECLARE
  v_user users;
BEGIN
  -- Try to get existing user
  SELECT * INTO v_user
  FROM users
  WHERE clerk_id = p_clerk_id;
  
  -- If not found, create new user
  IF NOT FOUND THEN
    INSERT INTO users (clerk_id, email, role)
    VALUES (p_clerk_id, p_email, p_role)
    RETURNING * INTO v_user;
  END IF;
  
  RETURN v_user;
END;
$$ LANGUAGE plpgsql;

-- Calculate session completion percentage
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

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'User accounts linked to Clerk authentication';
COMMENT ON TABLE events IS 'Fashion events created through the wizard';
COMMENT ON TABLE wizard_sessions IS 'Event creation wizard sessions';
COMMENT ON TABLE wizard_actions IS 'Audit log of all wizard actions';
COMMENT ON TABLE wizard_interactions IS 'AI interactions during wizard process';

COMMENT ON COLUMN wizard_sessions.data IS 'JSONB storage for all wizard form data';
COMMENT ON COLUMN wizard_actions.params IS 'Action parameters passed by user';
COMMENT ON COLUMN wizard_actions.result IS 'Action execution result';
