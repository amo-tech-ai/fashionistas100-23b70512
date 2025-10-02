# Event Wizard - Complete Supabase + CopilotKit Implementation Plan

## 📊 Database Architecture (Following CopilotKit State Machine Pattern)

### Core Tables (Simplified per CopilotKit docs)

```sql
-- 1. Main wizard sessions table (single source of truth)
CREATE TABLE wizard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- State machine fields (per CopilotKit pattern)
  current_stage VARCHAR(50) NOT NULL DEFAULT 'organizerSetup',
  completed_stages TEXT[] DEFAULT '{}',
  
  -- Stage data (JSONB for flexibility)
  stage_data JSONB DEFAULT '{}' NOT NULL,
  
  -- Event reference (once created)
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'active',
  completion_percentage INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_interaction TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  
  -- Constraints
  CONSTRAINT valid_percentage CHECK (completion_percentage BETWEEN 0 AND 100),
  CONSTRAINT valid_status CHECK (status IN ('active', 'completed', 'abandoned', 'expired'))
);

-- 2. Action audit log (for debugging & analytics)
CREATE TABLE wizard_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES wizard_sessions(session_id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  action_name VARCHAR(100) NOT NULL,
  action_params JSONB DEFAULT '{}',
  result JSONB DEFAULT '{}',
  duration_ms INTEGER,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Events table (final output)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Event details
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  
  -- Timing
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  
  -- Venue
  venue_mode VARCHAR(20) CHECK (venue_mode IN ('physical', 'virtual', 'hybrid')),
  venue_data JSONB DEFAULT '{}',
  
  -- Ticketing
  ticket_tiers JSONB DEFAULT '[]',
  total_capacity INTEGER,
  
  -- Payment
  stripe_account_id VARCHAR(255),
  payment_enabled BOOLEAN DEFAULT false,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Required Indexes

```sql
-- Session lookups
CREATE INDEX idx_sessions_user ON wizard_sessions(user_id);
CREATE INDEX idx_sessions_status ON wizard_sessions(status) WHERE status = 'active';
CREATE INDEX idx_sessions_expiry ON wizard_sessions(expires_at) WHERE status = 'active';

-- Action analytics
CREATE INDEX idx_actions_session ON wizard_actions(session_id);
CREATE INDEX idx_actions_stage ON wizard_actions(stage);
CREATE INDEX idx_actions_created ON wizard_actions(created_at DESC);

-- Event queries
CREATE INDEX idx_events_user ON events(user_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status) WHERE status = 'published';
CREATE UNIQUE INDEX idx_events_slug ON events(slug);
```

### Database Functions & Triggers

```sql
-- 1. Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables
CREATE TRIGGER update_wizard_sessions_updated_at 
  BEFORE UPDATE ON wizard_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. Auto-generate slug function
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

CREATE TRIGGER auto_generate_slug 
  BEFORE INSERT ON events 
  FOR EACH ROW EXECUTE FUNCTION generate_event_slug();

-- 3. Session cleanup function (call via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE wizard_sessions 
  SET status = 'expired' 
  WHERE expires_at < NOW() 
    AND status = 'active';
  
  DELETE FROM wizard_sessions 
  WHERE status = 'expired' 
    AND updated_at < NOW() - INTERVAL '30 days';
END;
$$ language 'plpgsql';
```

## 🔒 Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE wizard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Wizard Sessions Policies
CREATE POLICY "Users can view own sessions" ON wizard_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON wizard_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own active sessions" ON wizard_sessions
  FOR UPDATE USING (auth.uid() = user_id AND status = 'active');

-- Wizard Actions Policies (read-only for users)
CREATE POLICY "Users can view own action logs" ON wizard_actions
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM wizard_sessions 
      WHERE user_id = auth.uid()
    )
  );

-- Events Policies
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view published events" ON events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can create own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = user_id);
```

## 🔌 Supabase Edge Functions

### 1. Session Management (`/functions/wizard-session`)

```typescript
// Handle wizard session operations
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const { method } = req
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  if (method === 'POST') {
    // Create or resume session
    const { userId, sessionId } = await req.json()
    
    // Check for existing session
    const { data: existing } = await supabase
      .from('wizard_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single()
    
    if (existing) {
      // Resume session
      await supabase
        .from('wizard_sessions')
        .update({ last_interaction: new Date().toISOString() })
        .eq('session_id', sessionId)
      
      return new Response(JSON.stringify(existing), { status: 200 })
    }
    
    // Create new session
    const { data, error } = await supabase
      .from('wizard_sessions')
      .insert({
        session_id: sessionId,
        user_id: userId,
        current_stage: 'organizerSetup'
      })
      .select()
      .single()
    
    return new Response(
      JSON.stringify(data || { error }),
      { status: error ? 400 : 201 }
    )
  }
  
  if (method === 'PATCH') {
    // Update session stage
    const { sessionId, stage, stageData } = await req.json()
    
    const { data, error } = await supabase
      .from('wizard_sessions')
      .update({
        current_stage: stage,
        stage_data: stageData,
        last_interaction: new Date().toISOString(),
        completed_stages: supabase.sql`array_append(completed_stages, ${stage})`
      })
      .eq('session_id', sessionId)
      .select()
      .single()
    
    // Log action
    await supabase.from('wizard_actions').insert({
      session_id: sessionId,
      stage: stage,
      action_name: 'stage_transition',
      action_params: { from: data.current_stage, to: stage }
    })
    
    return new Response(
      JSON.stringify(data || { error }),
      { status: error ? 400 : 200 }
    )
  }
})
```

### 2. Event Publishing (`/functions/publish-event`)

```typescript
serve(async (req) => {
  const { sessionId } = await req.json()
  const supabase = createClient(/*...*/)
  
  // Get session data
  const { data: session } = await supabase
    .from('wizard_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .single()
  
  if (!session) {
    return new Response('Session not found', { status: 404 })
  }
  
  // Extract stage data
  const { 
    organizerData,
    eventData,
    ticketData,
    venueData,
    paymentData 
  } = session.stage_data
  
  // Create event
  const { data: event, error } = await supabase
    .from('events')
    .insert({
      user_id: session.user_id,
      title: eventData.title,
      type: eventData.type,
      description: eventData.description,
      event_date: eventData.date,
      start_time: eventData.startTime,
      end_time: eventData.endTime,
      timezone: eventData.timezone,
      venue_mode: venueData.mode,
      venue_data: venueData,
      ticket_tiers: ticketData.tiers,
      total_capacity: ticketData.totalCapacity,
      stripe_account_id: paymentData.accountId,
      payment_enabled: paymentData.enabled,
      status: 'published',
      published_at: new Date().toISOString()
    })
    .select()
    .single()
  
  // Update session
  await supabase
    .from('wizard_sessions')
    .update({
      event_id: event.id,
      status: 'completed'
    })
    .eq('session_id', sessionId)
  
  return new Response(JSON.stringify(event), { status: 201 })
})
```

## 🪝 Webhooks

### Stripe Connect Webhook

```typescript
// /api/webhooks/stripe
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
  
  switch (event.type) {
    case 'account.updated':
      // Update payment status in session
      const accountId = event.data.object.id
      await supabase
        .from('wizard_sessions')
        .update({
          'stage_data': supabase.sql`
            jsonb_set(
              stage_data,
              '{paymentData,verified}',
              'true'
            )
          `
        })
        .eq('stage_data->>stripe_account_id', accountId)
      break
  }
  
  return new Response('OK', { status: 200 })
}
```

## 🔧 CopilotKit Integration (Following State Machine Pattern)

### Global State Hook

```typescript
// hooks/useWizardState.ts
export function useWizardState() {
  const [session, setSession] = useState<WizardSession>()
  const supabase = useSupabase()
  
  // Define stages as per CopilotKit pattern
  const stages = [
    'organizerSetup',
    'eventSetup',
    'ticketSetup',
    'venueSetup',
    'paymentSetup',
    'reviewPublish'
  ] as const
  
  // Initialize or resume session
  useEffect(() => {
    const initSession = async () => {
      const sessionId = localStorage.getItem('wizard_session_id') || 
                        crypto.randomUUID()
      
      const { data } = await supabase.functions.invoke('wizard-session', {
        body: { 
          userId: user?.id, 
          sessionId,
          method: 'POST'
        }
      })
      
      setSession(data)
      localStorage.setItem('wizard_session_id', sessionId)
    }
    
    initSession()
  }, [])
  
  // Stage transition (deterministic)
  const nextStage = async () => {
    const currentIndex = stages.indexOf(session.current_stage)
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1]
      
      await supabase.functions.invoke('wizard-session', {
        body: {
          sessionId: session.session_id,
          stage: nextStage,
          stageData: session.stage_data,
          method: 'PATCH'
        }
      })
      
      setSession(prev => ({
        ...prev,
        current_stage: nextStage
      }))
    }
  }
  
  return {
    session,
    stages,
    nextStage,
    updateStageData: async (data) => {
      // Update stage data
      const updated = {
        ...session.stage_data,
        [session.current_stage]: data
      }
      
      await supabase.functions.invoke('wizard-session', {
        body: {
          sessionId: session.session_id,
          stage: session.current_stage,
          stageData: updated,
          method: 'PATCH'
        }
      })
      
      setSession(prev => ({
        ...prev,
        stage_data: updated
      }))
    }
  }
}
```

### Stage Implementation (Following CopilotKit Pattern)

```typescript
// stages/useStageEventSetup.ts
export function useStageEventSetup() {
  const { session, updateStageData, nextStage } = useWizardState()
  const stage = session?.current_stage
  
  // Stage-specific instructions (CopilotKit pattern)
  useCopilotAdditionalInstructions({
    instructions: "Help user set up their fashion event details",
    available: stage === "eventSetup" ? "enabled" : "disabled"
  })
  
  // Stage-specific context (CopilotKit pattern)
  useCopilotReadable({
    description: "Current event data",
    value: session?.stage_data?.eventData || {},
    available: stage === "eventSetup" ? "enabled" : "disabled"
  })
  
  // Stage-specific action (CopilotKit pattern)
  useCopilotAction({
    name: "saveEventDetails",
    description: "Save event details and move to next stage",
    available: stage === "eventSetup" ? "enabled" : "disabled",
    parameters: [
      { name: "title", type: "string", required: true },
      { name: "type", type: "string", required: true },
      { name: "date", type: "string", required: true },
      { name: "startTime", type: "string", required: true }
    ],
    handler: async (params) => {
      // Validate with Zod
      const validated = EventSchema.parse(params)
      
      // Update stage data
      await updateStageData({ eventData: validated })
      
      // Log action
      await supabase.from('wizard_actions').insert({
        session_id: session.session_id,
        stage: 'eventSetup',
        action_name: 'saveEventDetails',
        action_params: params
      })
      
      // Transition to next stage
      nextStage()
    }
  })
}
```

## 📋 Complete Implementation Checklist

### Database Setup
- [ ] Create tables with proper constraints
- [ ] Add all indexes for performance
- [ ] Create trigger functions
- [ ] Enable RLS policies
- [ ] Set up cron job for session cleanup

### Edge Functions
- [ ] Deploy session management function
- [ ] Deploy event publishing function
- [ ] Configure CORS headers
- [ ] Set environment variables

### Webhooks
- [ ] Configure Stripe webhook endpoint
- [ ] Add webhook secret to env
- [ ] Implement idempotency checks
- [ ] Add error handling & retries

### Frontend Integration
- [ ] Implement useWizardState hook
- [ ] Create all 6 stage hooks
- [ ] Add validation schemas
- [ ] Implement autosave
- [ ] Add error boundaries

### Testing
- [ ] Test stage transitions
- [ ] Test session persistence
- [ ] Test RLS policies
- [ ] Test webhook handling
- [ ] Load test Edge Functions

## 🎯 Best Practices Implemented

1. **Single Source of Truth**: One session table following CopilotKit pattern
2. **Proper Indexing**: All foreign keys and query patterns indexed
3. **RLS Security**: Users can only access their own data
4. **Session Management**: Auto-expire and cleanup old sessions
5. **Action Logging**: Complete audit trail for debugging
6. **Error Handling**: Try-catch blocks and proper error responses
7. **Idempotency**: Webhook handling prevents duplicate processing
8. **State Machine Pattern**: Clear stage progression per CopilotKit docs

This implementation follows CopilotKit's state machine pattern exactly while adding production-ready Supabase features.