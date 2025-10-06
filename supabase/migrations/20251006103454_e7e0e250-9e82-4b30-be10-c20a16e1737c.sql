-- Phase 2: Runway Timing Agent Database Foundation

-- Create runway_schedules table
CREATE TABLE public.runway_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  
  -- Schedule metadata
  schedule_name TEXT NOT NULL,
  total_duration_minutes INTEGER NOT NULL,
  
  -- AI-generated schedule data
  designers JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Structure: [{ designer_name, slot_start, slot_end, looks_count, backstage_time }]
  
  transitions JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{ from_designer, to_designer, duration_minutes, type }]
  
  backstage_calls JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{ designer, call_time, notes }]
  
  -- AI analysis
  ai_optimization_score INTEGER CHECK (ai_optimization_score >= 0 AND ai_optimization_score <= 100),
  ai_reasoning TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'optimizing', 'approved', 'published')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.runway_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Organizers can manage their event schedules
CREATE POLICY "runway_schedules_select_organizer"
  ON public.runway_schedules
  FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events 
      WHERE organizer_id = public.current_profile_id()
    )
  );

CREATE POLICY "runway_schedules_select_admin"
  ON public.runway_schedules
  FOR SELECT
  USING (public.has_role('admin'::public.app_role));

CREATE POLICY "runway_schedules_insert_organizer"
  ON public.runway_schedules
  FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM public.events 
      WHERE organizer_id = public.current_profile_id()
    )
  );

CREATE POLICY "runway_schedules_update_organizer"
  ON public.runway_schedules
  FOR UPDATE
  USING (
    event_id IN (
      SELECT id FROM public.events 
      WHERE organizer_id = public.current_profile_id()
    )
  );

CREATE POLICY "runway_schedules_delete_organizer"
  ON public.runway_schedules
  FOR DELETE
  USING (
    event_id IN (
      SELECT id FROM public.events 
      WHERE organizer_id = public.current_profile_id()
    )
  );

-- Indexes for performance
CREATE INDEX idx_runway_schedules_event_id ON public.runway_schedules(event_id);
CREATE INDEX idx_runway_schedules_status ON public.runway_schedules(status);
CREATE INDEX idx_runway_schedules_created_at ON public.runway_schedules(created_at DESC);