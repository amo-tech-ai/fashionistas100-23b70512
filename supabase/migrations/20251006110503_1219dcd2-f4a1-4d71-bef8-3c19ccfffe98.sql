-- Phase 5: Event Health Scorer Agent Database Setup
-- Create event_health_scores table to track AI-generated health assessments

CREATE TABLE IF NOT EXISTS public.event_health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Health Score Metrics (0-100)
  overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  ticket_sales_score INTEGER NOT NULL CHECK (ticket_sales_score BETWEEN 0 AND 100),
  timeline_score INTEGER NOT NULL CHECK (timeline_score BETWEEN 0 AND 100),
  vendor_readiness_score INTEGER NOT NULL CHECK (vendor_readiness_score BETWEEN 0 AND 100),
  model_casting_score INTEGER NOT NULL CHECK (model_casting_score BETWEEN 0 AND 100),
  
  -- AI Analysis
  health_status TEXT NOT NULL CHECK (health_status IN ('excellent', 'good', 'warning', 'critical')),
  ai_reasoning TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  risk_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Metadata
  ai_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-flash',
  confidence_score NUMERIC(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.event_health_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Organizers can view scores for their events
CREATE POLICY "event_health_scores_select_organizer"
ON public.event_health_scores
FOR SELECT
TO authenticated
USING (
  event_id IN (
    SELECT id FROM public.events
    WHERE organizer_id = public.current_profile_id()
  )
);

-- Admins can view all scores
CREATE POLICY "event_health_scores_select_admin"
ON public.event_health_scores
FOR SELECT
TO authenticated
USING (public.has_role('admin'::public.app_role));

-- System/service role can insert scores
CREATE POLICY "event_health_scores_insert_system"
ON public.event_health_scores
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Performance Indexes
CREATE INDEX idx_event_health_scores_event_id ON public.event_health_scores(event_id);
CREATE INDEX idx_event_health_scores_organization_id ON public.event_health_scores(organization_id);
CREATE INDEX idx_event_health_scores_created_at ON public.event_health_scores(created_at DESC);
CREATE INDEX idx_event_health_scores_health_status ON public.event_health_scores(health_status);

-- Composite index for common query patterns (event + latest score)
CREATE INDEX idx_event_health_scores_event_created ON public.event_health_scores(event_id, created_at DESC);

-- Trigger to auto-update updated_at timestamp
CREATE TRIGGER update_event_health_scores_updated_at
BEFORE UPDATE ON public.event_health_scores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add helpful comment
COMMENT ON TABLE public.event_health_scores IS 'AI-generated health assessments for events, tracking readiness across ticket sales, timeline, vendors, and model casting';