-- ============================================
-- PHASE 1: AI Event Planning - Database Foundation
-- Model Casting + AI Agent Logging
-- ============================================

-- 1. Create model_castings table
CREATE TABLE IF NOT EXISTS public.model_castings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  agency TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'confirmed', 'declined', 'backup')),
  ai_match_score INTEGER CHECK (ai_match_score BETWEEN 0 AND 100),
  ai_reasoning TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create ai_agent_logs table (service-role only)
CREATE TABLE IF NOT EXISTS public.ai_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  operation TEXT NOT NULL,
  model TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  tokens_used INTEGER,
  latency_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.model_castings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for model_castings

-- SELECT: Organizers view their event castings
CREATE POLICY "model_castings_select_organizer" ON public.model_castings
  FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE organizer_id = current_profile_id()
    )
  );

-- SELECT: Admins view all castings
CREATE POLICY "model_castings_select_admin" ON public.model_castings
  FOR SELECT
  USING (has_role('admin'));

-- INSERT: Organizers create castings for their events
CREATE POLICY "model_castings_insert_organizer" ON public.model_castings
  FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM public.events WHERE organizer_id = current_profile_id()
    )
  );

-- UPDATE: Organizers update their event castings
CREATE POLICY "model_castings_update_organizer" ON public.model_castings
  FOR UPDATE
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE organizer_id = current_profile_id()
    )
  );

-- DELETE: Organizers delete their event castings
CREATE POLICY "model_castings_delete_organizer" ON public.model_castings
  FOR DELETE
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE organizer_id = current_profile_id()
    )
  );

-- 5. RLS Policies for ai_agent_logs (service-role only, blocks all public access)
CREATE POLICY "ai_agent_logs_service_only" ON public.ai_agent_logs
  FOR ALL
  USING (false);

-- 6. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_model_castings_event_id ON public.model_castings(event_id);
CREATE INDEX IF NOT EXISTS idx_model_castings_status ON public.model_castings(status);
CREATE INDEX IF NOT EXISTS idx_model_castings_created_at ON public.model_castings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_agent_type ON public.ai_agent_logs(agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_event_id ON public.ai_agent_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_created_at ON public.ai_agent_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_success ON public.ai_agent_logs(success);

-- 7. Add trigger for updated_at
CREATE TRIGGER update_model_castings_updated_at
  BEFORE UPDATE ON public.model_castings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();