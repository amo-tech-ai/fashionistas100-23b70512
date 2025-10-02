# Event Wizard - Production-Ready 3-Table Implementation

## Database Schema (Pragmatic Approach)

### 1. Core Tables

```sql
-- 1. wizard_sessions (Single source of truth for state)
CREATE TABLE wizard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- State tracking
  current_stage VARCHAR(50) NOT NULL DEFAULT 'organizerSetup',
  completed_stages TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Compact per-step payloads (not one giant blob)
  organizer_data JSONB DEFAULT '{}',
  event_data JSONB DEFAULT '{}',
  ticket_data JSONB DEFAULT '{}',
  venue_data JSONB DEFAULT '{}',
  payment_data JSONB DEFAULT '{}',
  
  -- Status and references
  status VARCHAR(30) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned', 'expired')),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  
  -- Indexes for performance
  CONSTRAINT valid_stage CHECK (current_stage IN ('organizerSetup', 'eventSetup', 'ticketSetup', 'venueSetup', 'paymentSetup', 'reviewPublish'))
);

-- 2. wizard_actions (Side effects + idempotency)
CREATE TYPE action_status AS ENUM ('pending', 'in_progress', 'completed', 'failed', 'cancelled');

CREATE TABLE wizard_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  session_id VARCHAR(255) NOT NULL REFERENCES wizard_sessions(session_id) ON DELETE CASCADE,
  
  -- Action details
  name VARCHAR(100) NOT NULL, -- e.g., 'publishEvent', 'connectStripe'
  idempotency_key TEXT UNIQUE, -- Prevent duplicate actions
  status action_status NOT NULL DEFAULT 'pending',
  
  -- Data
  payload JSONB DEFAULT '{}',
  result JSONB DEFAULT '{}',
  error_message TEXT,
  execution_time_ms INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. wizard_interactions (User ↔ AI transcripts for debugging)
CREATE TABLE wizard_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  session_id VARCHAR(255) NOT NULL REFERENCES wizard_sessions(session_id) ON DELETE CASCADE,
  
  -- Interaction details
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  stage VARCHAR(50),
  text TEXT,
  
  -- Metrics
  tokens_used INTEGER,
  model TEXT,
  latency_ms INTEGER,
  csat_smallint CHECK (csat_smallint BETWEEN 1 AND 5),
  
  -- Retention
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  redacted_at TIMESTAMPTZ
);

-- 4. events (Final output)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Event core
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('fashion_show', 'popup', 'exhibition', 'launch')),
  description TEXT,
  
  -- Schedule
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  
  -- Details
  venue_mode VARCHAR(20) CHECK (venue_mode IN ('physical', 'virtual', 'hybrid')),
  venue_data JSONB DEFAULT '{}',
  ticket_tiers JSONB DEFAULT '[]',
  total_capacity INTEGER,
  
  -- Payment
  stripe_account_id VARCHAR(255),
  payment_enabled BOOLEAN DEFAULT false,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  published_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Indexes for Performance

```sql
-- Sessions: Fast lookups and resume
CREATE INDEX idx_sessions_org_active ON wizard_sessions (organization_id, is_active, current_stage);
CREATE INDEX idx_sessions_user ON wizard_sessions (user_id) WHERE is_active = true;
CREATE INDEX idx_sessions_expires ON wizard_sessions (expires_at) WHERE status = 'in_progress';

-- Actions: Idempotency and analytics
CREATE INDEX idx_actions_org_session ON wizard_actions (organization_id, session_id, status);
CREATE INDEX idx_actions_idempotency ON wizard_actions (idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Interactions: Debugging and retention
CREATE INDEX idx_interactions_org_session ON wizard_interactions (organization_id, session_id, created_at);
CREATE INDEX idx_interactions_expires ON wizard_interactions (expires_at) WHERE redacted_at IS NULL;

-- Events: Queries
CREATE INDEX idx_events_org ON events (organization_id);
CREATE INDEX idx_events_date ON events (event_date) WHERE status = 'published';
```

### 3. Essential Functions & Triggers

```sql
-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON wizard_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_actions_updated_at BEFORE UPDATE ON wizard_actions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slug
CREATE OR REPLACE FUNCTION generate_event_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug = LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]+', '-', 'g')) 
              || '-' || SUBSTRING(gen_random_uuid()::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER auto_generate_slug BEFORE INSERT ON events 
  FOR EACH ROW EXECUTE FUNCTION generate_event_slug();

-- Cleanup expired sessions (run via pg_cron)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  -- Mark expired
  UPDATE wizard_sessions 
  SET status = 'expired', is_active = false 
  WHERE expires_at < NOW() AND status = 'in_progress';
  
  -- Redact old interactions
  UPDATE wizard_interactions 
  SET text = '[REDACTED]', redacted_at = NOW() 
  WHERE expires_at < NOW() AND redacted_at IS NULL;
  
  -- Delete ancient sessions
  DELETE FROM wizard_sessions 
  WHERE status = 'expired' AND updated_at < NOW() - INTERVAL '90 days';
END;
$$ language 'plpgsql';
```

## 🔒 Row Level Security (Tenant-Safe)

```sql
-- Enable RLS
ALTER TABLE wizard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Set organization context function
CREATE OR REPLACE FUNCTION set_current_org(org_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_org', org_id::text, false);
END;
$$ language 'plpgsql';

-- Sessions: Users see only their org's sessions
CREATE POLICY "Org members can view org sessions" ON wizard_sessions
  FOR ALL USING (
    organization_id = current_setting('app.current_org')::uuid 
    OR user_id = auth.uid()
  );

-- Actions: Read-only within org
CREATE POLICY "Org members can view org actions" ON wizard_actions
  FOR SELECT USING (organization_id = current_setting('app.current_org')::uuid);

-- Interactions: Org-scoped
CREATE POLICY "Org members can view org interactions" ON wizard_interactions
  FOR SELECT USING (organization_id = current_setting('app.current_org')::uuid);

-- Events: Public published, private drafts
CREATE POLICY "Public can view published events" ON events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Org members can manage org events" ON events
  FOR ALL USING (
    organization_id = current_setting('app.current_org')::uuid 
    OR user_id = auth.uid()
  );
```

## 🔌 Edge Functions (Simplified)

### Session Management

```typescript
// /functions/wizard-session/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  const { method } = req
  const auth = req.headers.get('authorization')
  const { data: { user } } = await supabase.auth.getUser(auth)
  
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Set org context for RLS
  await supabase.rpc('set_current_org', { org_id: user.app_metadata.organization_id })
  
  switch (method) {
    case 'POST': {
      // Create or resume session
      const { sessionId } = await req.json()
      
      // Check existing
      const { data: existing } = await supabase
        .from('wizard_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single()
      
      if (existing && existing.is_active) {
        return new Response(JSON.stringify(existing), { status: 200 })
      }
      
      // Create new
      const { data, error } = await supabase
        .from('wizard_sessions')
        .insert({
          organization_id: user.app_metadata.organization_id,
          session_id: sessionId || crypto.randomUUID(),
          user_id: user.id,
          current_stage: 'organizerSetup'
        })
        .select()
        .single()
      
      return new Response(JSON.stringify(data), { 
        status: error ? 400 : 201 
      })
    }
    
    case 'PATCH': {
      // Update stage data with autosave
      const { sessionId, stage, data } = await req.json()
      
      // Build update object for specific stage
      const stageColumn = `${stage}_data`
      const update = {
        current_stage: stage,
        [stageColumn]: data,
        completed_stages: supabase.sql`
          CASE 
            WHEN NOT '${stage}' = ANY(completed_stages) 
            THEN array_append(completed_stages, '${stage}')
            ELSE completed_stages
          END
        `
      }
      
      const { data: updated, error } = await supabase
        .from('wizard_sessions')
        .update(update)
        .eq('session_id', sessionId)
        .eq('is_active', true)
        .select()
        .single()
      
      if (error) {
        return new Response(JSON.stringify({ error }), { status: 400 })
      }
      
      // Log interaction
      await supabase.from('wizard_interactions').insert({
        organization_id: user.app_metadata.organization_id,
        session_id: sessionId,
        role: 'system',
        stage: stage,
        text: `Stage updated: ${stage}`
      })
      
      return new Response(JSON.stringify(updated), { status: 200 })
    }
  }
})
```

### Event Publishing (Idempotent)

```typescript
// /functions/publish-event/index.ts
serve(async (req) => {
  const { sessionId, idempotencyKey } = await req.json()
  const supabase = createClient(/* ... */)
  
  // Check idempotency
  const { data: existingAction } = await supabase
    .from('wizard_actions')
    .select('*')
    .eq('idempotency_key', idempotencyKey)
    .single()
  
  if (existingAction) {
    if (existingAction.status === 'completed') {
      return new Response(JSON.stringify(existingAction.result), { status: 200 })
    }
    if (existingAction.status === 'failed') {
      return new Response(existingAction.error_message, { status: 400 })
    }
    // Still processing
    return new Response('Processing', { status: 202 })
  }
  
  // Create action record
  const { data: action } = await supabase
    .from('wizard_actions')
    .insert({
      organization_id: user.app_metadata.organization_id,
      session_id: sessionId,
      name: 'publishEvent',
      idempotency_key: idempotencyKey,
      status: 'in_progress'
    })
    .select()
    .single()
  
  try {
    // Get session data
    const { data: session } = await supabase
      .from('wizard_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single()
    
    // Create event
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        organization_id: session.organization_id,
        user_id: session.user_id,
        title: session.event_data.title,
        type: session.event_data.type,
        description: session.event_data.description,
        event_date: session.event_data.date,
        start_time: session.event_data.startTime,
        end_time: session.event_data.endTime,
        timezone: session.event_data.timezone || 'America/New_York',
        venue_mode: session.venue_data.mode,
        venue_data: session.venue_data,
        ticket_tiers: session.ticket_data.tiers,
        total_capacity: session.ticket_data.totalCapacity,
        stripe_account_id: session.payment_data.accountId,
        payment_enabled: session.payment_data.enabled,
        status: 'published',
        published_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Update action as completed
    await supabase
      .from('wizard_actions')
      .update({
        status: 'completed',
        result: event,
        execution_time_ms: Date.now() - new Date(action.created_at).getTime()
      })
      .eq('id', action.id)
    
    // Update session
    await supabase
      .from('wizard_sessions')
      .update({
        event_id: event.id,
        status: 'completed',
        is_active: false
      })
      .eq('session_id', sessionId)
    
    return new Response(JSON.stringify(event), { status: 201 })
    
  } catch (error) {
    // Mark action as failed
    await supabase
      .from('wizard_actions')
      .update({
        status: 'failed',
        error_message: error.message,
        execution_time_ms: Date.now() - new Date(action.created_at).getTime()
      })
      .eq('id', action.id)
    
    return new Response(error.message, { status: 400 })
  }
})
```

## 🎯 Frontend Implementation (CopilotKit Pattern)

### State Hook with Autosave

```typescript
// hooks/useWizardState.ts
export function useWizardState() {
  const [session, setSession] = useState<WizardSession>()
  const supabase = useSupabase()
  const { user } = useUser()
  
  // Autosave on stage data change
  const updateStageData = useCallback(
    debounce(async (stage: string, data: any) => {
      if (!session) return
      
      const response = await supabase.functions.invoke('wizard-session', {
        body: {
          method: 'PATCH',
          sessionId: session.session_id,
          stage,
          data
        }
      })
      
      if (response.data) {
        setSession(response.data)
        
        // Log to interactions for debugging
        await supabase.from('wizard_interactions').insert({
          organization_id: user.app_metadata.organization_id,
          session_id: session.session_id,
          role: 'system',
          stage,
          text: `Autosaved ${stage} data`
        })
      }
    }, 1000),
    [session, user]
  )
  
  return {
    session,
    updateStageData,
    publishEvent: async () => {
      const idempotencyKey = `publish_${session.session_id}_${Date.now()}`
      
      return await supabase.functions.invoke('publish-event', {
        body: {
          sessionId: session.session_id,
          idempotencyKey
        }
      })
    }
  }
}
```

### Stage Implementation

```typescript
// stages/useStageEventSetup.ts
export function useStageEventSetup() {
  const { session, updateStageData } = useWizardState()
  const stage = session?.current_stage
  
  // CopilotKit pattern: stage-specific availability
  useCopilotAdditionalInstructions({
    instructions: "Help create event details",
    available: stage === "eventSetup" ? "enabled" : "disabled"
  })
  
  useCopilotReadable({
    description: "Current event data",
    value: session?.event_data || {},
    available: stage === "eventSetup" ? "enabled" : "disabled"
  })
  
  useCopilotAction({
    name: "saveEventDetails",
    available: stage === "eventSetup" ? "enabled" : "disabled",
    parameters: [
      { name: "title", type: "string", required: true },
      { name: "type", type: "string", required: true },
      { name: "date", type: "string", required: true },
      { name: "startTime", type: "string", required: true }
    ],
    handler: async (params) => {
      // Validate
      const validated = EventSchema.parse(params)
      
      // Autosave triggers here
      await updateStageData('event', validated)
      
      // Move to next stage
      await updateStageData('current_stage', 'ticketSetup')
    }
  })
}
```

## 📋 Implementation Checklist

### Immediate (Day 1)
- [ ] Create 3 core tables with constraints
- [ ] Add indexes and triggers
- [ ] Enable RLS with org scoping
- [ ] Deploy session Edge Function
- [ ] Implement autosave in frontend

### Critical (Day 2)
- [ ] Add idempotency to publish action
- [ ] Set up interaction logging
- [ ] Create cleanup cron job
- [ ] Test stage transitions
- [ ] Verify RLS policies

### Polish (Day 3)
- [ ] Add monitoring dashboards
- [ ] Implement CSAT collection
- [ ] Set up retention policies
- [ ] Load test Edge Functions
- [ ] Document API endpoints

## Key Improvements from Feedback

1. **3 tables instead of 2** - Better analytics and debugging
2. **Organization scoping** - Multi-tenant safety with RLS
3. **Idempotency keys** - Prevent duplicate actions
4. **Separate stage data** - Avoid giant JSON blobs
5. **Retention policies** - GDPR compliance
6. **Interaction logging** - LLM behavior visibility

This implementation is production-ready, maintainable, and follows CopilotKit patterns while adding necessary safety and observability.
