# Event Wizard - Final Production Implementation with Critical Fixes

## Assessment of Latest Suggestions

### 1. ✅ CORRECT: Don't Bypass RLS in Edge Functions
**Critical Fix Required:** Using service role key for user operations bypasses all security
**Solution:** Use auth-bound client with anon key + JWT for user operations

### 2. ✅ CORRECT: JSONB RPC CASE Syntax is Invalid
**Critical Fix Required:** The CASE statement in SET clause won't compile
**Solution:** Use column-wise CASE assignments

### 3. ✅ CORRECT: Idempotency Keys Must Be Deterministic
**Critical Fix Required:** `Date.now()` defeats idempotency purpose
**Solution:** Use stable keys like `publish_${sessionId}`

### 4. ✅ CORRECT: JWT Org Claims
**Critical Fix Required:** Supabase doesn't store organization_id in auth.users
**Solution:** Read from JWT claims directly

### 5. ✅ CORRECT: Validation Missing
**Critical Fix Required:** Only 1/6 stages has validation
**Solution:** Zod schemas for ALL stages

### 6. ✅ CORRECT: Progress From Database
**Critical Fix Required:** UI shows fake progress
**Solution:** Calculate from completion_details via RPC

---

## Corrected Implementation Artifacts

### Artifact 1: Fixed Database Schema with Working RPCs

```sql
-- 1. Core Tables (unchanged structure, better constraints)
CREATE TABLE wizard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID, -- From JWT claims, not auth.users
  
  -- State tracking
  current_stage VARCHAR(50) NOT NULL DEFAULT 'organizerSetup',
  completed_stages TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  
  -- Stage data (separate columns for efficiency)
  organizer_data JSONB DEFAULT '{}' NOT NULL,
  event_data JSONB DEFAULT '{}' NOT NULL,
  ticket_data JSONB DEFAULT '{}' NOT NULL,
  venue_data JSONB DEFAULT '{}' NOT NULL,
  payment_data JSONB DEFAULT '{}' NOT NULL,
  sponsor_data JSONB DEFAULT '{}' NOT NULL,
  
  -- Progress tracking
  completion_details JSONB DEFAULT '{"organizerSetup":0,"eventSetup":0,"venueSetup":0,"ticketSetup":0,"sponsorsMedia":0,"reviewPublish":0}'::JSONB NOT NULL,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  
  -- Top-level for indexing
  stripe_account_id VARCHAR(255),
  event_id UUID REFERENCES events(id),
  
  -- Status
  status VARCHAR(30) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned', 'expired')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  
  CONSTRAINT valid_stage CHECK (current_stage IN ('organizerSetup', 'eventSetup', 'venueSetup', 'ticketSetup', 'sponsorsMedia', 'reviewPublish'))
);

CREATE TABLE wizard_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES wizard_sessions(session_id) ON DELETE CASCADE,
  organization_id UUID,
  
  action_name VARCHAR(100) NOT NULL,
  idempotency_key TEXT UNIQUE, -- Must be deterministic
  stage VARCHAR(50),
  
  payload JSONB DEFAULT '{}',
  result JSONB DEFAULT '{}',
  error_message TEXT,
  execution_time_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stripe_events (
  id TEXT PRIMARY KEY, -- Stripe's event.id
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes
CREATE INDEX idx_sessions_user_active ON wizard_sessions(user_id) WHERE is_active = true;
CREATE INDEX idx_sessions_org_active ON wizard_sessions(organization_id) WHERE is_active = true;
CREATE INDEX idx_sessions_stripe ON wizard_sessions(stripe_account_id) WHERE stripe_account_id IS NOT NULL;
CREATE INDEX idx_actions_idempotency ON wizard_actions(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- 3. JWT Helper Function
CREATE OR REPLACE FUNCTION auth.jwt_claim(claim TEXT) 
RETURNS TEXT 
LANGUAGE SQL STABLE
AS $$
  SELECT 
    COALESCE(
      NULLIF(current_setting('request.jwt.claims', true), '')::json->claim,
      NULLIF(current_setting('request.jwt.claim.' || claim, true), '')
    )::TEXT;
$$;

CREATE OR REPLACE FUNCTION auth.jwt_org_id() 
RETURNS UUID 
LANGUAGE SQL STABLE
AS $$
  SELECT NULLIF(auth.jwt_claim('organization_id'), '')::UUID;
$$;

-- 4. FIXED RPC Functions

-- Fixed JSONB merge with proper CASE syntax
CREATE OR REPLACE FUNCTION wizard_merge_stage_data(
  p_session_id TEXT,
  p_stage TEXT,
  p_data JSONB
) RETURNS VOID 
SECURITY INVOKER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE wizard_sessions
  SET
    organizer_data = CASE WHEN p_stage = 'organizer' THEN organizer_data || p_data ELSE organizer_data END,
    event_data     = CASE WHEN p_stage = 'event'     THEN event_data || p_data     ELSE event_data END,
    ticket_data    = CASE WHEN p_stage = 'ticket'    THEN ticket_data || p_data    ELSE ticket_data END,
    venue_data     = CASE WHEN p_stage = 'venue'     THEN venue_data || p_data     ELSE venue_data END,
    payment_data   = CASE WHEN p_stage = 'payment'   THEN payment_data || p_data   ELSE payment_data END,
    sponsor_data   = CASE WHEN p_stage = 'sponsor'   THEN sponsor_data || p_data   ELSE sponsor_data END,
    updated_at = NOW()
  WHERE session_id = p_session_id
    AND (user_id = auth.uid() OR organization_id = auth.jwt_org_id());
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found or access denied';
  END IF;
END;
$$;

-- Fixed progress calculation
CREATE OR REPLACE FUNCTION wizard_update_progress(
  p_session_id TEXT,
  p_stage TEXT,
  p_percentage INTEGER
) RETURNS INTEGER
SECURITY INVOKER
LANGUAGE plpgsql
AS $$
DECLARE
  v_details JSONB;
  v_total INTEGER := 0;
BEGIN
  -- Update completion for specific stage
  UPDATE wizard_sessions
  SET 
    completion_details = completion_details || jsonb_build_object(p_stage, p_percentage),
    updated_at = NOW()
  WHERE session_id = p_session_id
    AND (user_id = auth.uid() OR organization_id = auth.jwt_org_id())
  RETURNING completion_details INTO v_details;
  
  IF v_details IS NULL THEN
    RAISE EXCEPTION 'Session not found or access denied';
  END IF;
  
  -- Calculate weighted total (weights sum to 100)
  v_total := (
    COALESCE((v_details->>'organizerSetup')::INT, 0) * 15 +
    COALESCE((v_details->>'eventSetup')::INT, 0) * 20 +
    COALESCE((v_details->>'venueSetup')::INT, 0) * 15 +
    COALESCE((v_details->>'ticketSetup')::INT, 0) * 20 +
    COALESCE((v_details->>'sponsorsMedia')::INT, 0) * 15 +
    COALESCE((v_details->>'reviewPublish')::INT, 0) * 15
  ) / 100;
  
  -- Update total percentage
  UPDATE wizard_sessions
  SET completion_percentage = v_total
  WHERE session_id = p_session_id;
  
  RETURN v_total;
END;
$$;

-- 5. RLS Policies using JWT claims
ALTER TABLE wizard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_actions ENABLE ROW LEVEL SECURITY;

-- Sessions policies
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

-- Actions policies (read-only)
CREATE POLICY actions_user_read ON wizard_actions
  FOR SELECT 
  USING (
    session_id IN (
      SELECT session_id FROM wizard_sessions 
      WHERE user_id = auth.uid() OR organization_id = auth.jwt_org_id()
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON wizard_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Artifact 2: Secure Edge Function with Proper Clients

```typescript
// /functions/wizard-session/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGINS') || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // 1. Get JWT from header
    const jwt = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!jwt) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: corsHeaders 
      })
    }
    
    // 2. Create auth-bound client (respects RLS)
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!, // NOT service role
      {
        global: { 
          headers: { 
            Authorization: `Bearer ${jwt}` 
          } 
        }
      }
    )
    
    // 3. Verify user from JWT
    const { data: { user }, error: authError } = await userClient.auth.getUser(jwt)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { 
        status: 401, 
        headers: corsHeaders 
      })
    }
    
    // 4. Parse operation
    const body = await req.json()
    const { op, sessionId, data } = body
    
    // 5. Execute operations with RLS protection
    switch (op) {
      case 'create': {
        // Check existing
        const { data: existing } = await userClient
          .from('wizard_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single()
        
        if (existing?.is_active) {
          return new Response(JSON.stringify({
            ok: true,
            session: existing
          }), { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          })
        }
        
        // Create new session
        const newSessionId = sessionId || crypto.randomUUID()
        const { data: newSession, error } = await userClient
          .from('wizard_sessions')
          .insert({
            session_id: newSessionId,
            user_id: user.id,
            organization_id: user.app_metadata?.organization_id || null,
            current_stage: 'organizerSetup'
          })
          .select()
          .single()
        
        if (error) {
          console.error('Create session error:', error)
          return new Response(JSON.stringify({ 
            ok: false, 
            error: error.message 
          }), { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          })
        }
        
        return new Response(JSON.stringify({
          ok: true,
          session: newSession
        }), { 
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }
      
      case 'update_stage_data': {
        const { stage, stageData } = data
        
        // Validate stage name
        const validStages = ['organizer', 'event', 'ticket', 'venue', 'payment', 'sponsor']
        if (!validStages.includes(stage)) {
          return new Response(JSON.stringify({ 
            ok: false, 
            error: 'Invalid stage' 
          }), { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          })
        }
        
        // Use RPC for safe merge (RLS protected)
        const { error: mergeError } = await userClient.rpc('wizard_merge_stage_data', {
          p_session_id: sessionId,
          p_stage: stage,
          p_data: stageData
        })
        
        if (mergeError) {
          console.error('Merge error:', mergeError)
          return new Response(JSON.stringify({ 
            ok: false, 
            error: mergeError.message 
          }), { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          })
        }
        
        // Update progress
        const { data: progress, error: progressError } = await userClient.rpc('wizard_update_progress', {
          p_session_id: sessionId,
          p_stage: stage + 'Setup', // Convert to full stage name
          p_percentage: 100
        })
        
        return new Response(JSON.stringify({
          ok: true,
          progress: progress || 0
        }), { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }
      
      case 'publish': {
        // DETERMINISTIC idempotency key
        const idempotencyKey = `publish:${sessionId}`
        
        // Check if already published
        const { data: existingAction } = await userClient
          .from('wizard_actions')
          .select('*')
          .eq('idempotency_key', idempotencyKey)
          .single()
        
        if (existingAction) {
          return new Response(JSON.stringify({
            ok: true,
            event: existingAction.result,
            message: 'Already published'
          }), { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          })
        }
        
        // Get session
        const { data: session, error: sessionError } = await userClient
          .from('wizard_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single()
        
        if (sessionError || !session) {
          return new Response(JSON.stringify({ 
            ok: false, 
            error: 'Session not found' 
          }), { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          })
        }
        
        // Validate all required data exists
        const requiredData = ['event_data', 'venue_data', 'ticket_data']
        for (const field of requiredData) {
          if (!session[field] || Object.keys(session[field]).length === 0) {
            return new Response(JSON.stringify({ 
              ok: false, 
              error: `Incomplete data: ${field} is required` 
            }), { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            })
          }
        }
        
        // Create event
        const { data: event, error: eventError } = await userClient
          .from('events')
          .insert({
            user_id: user.id,
            organization_id: session.organization_id,
            title: session.event_data.title,
            type: session.event_data.type,
            description: session.event_data.description,
            event_date: session.event_data.date,
            start_time: session.event_data.startTime,
            end_time: session.event_data.endTime,
            timezone: session.event_data.timezone || 'UTC',
            venue_mode: session.venue_data.mode,
            venue_data: session.venue_data,
            ticket_tiers: session.ticket_data.tiers || [],
            stripe_account_id: session.stripe_account_id,
            status: 'published',
            published_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (eventError) {
          console.error('Event creation error:', eventError)
          return new Response(JSON.stringify({ 
            ok: false, 
            error: eventError.message 
          }), { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          })
        }
        
        // Record action with idempotency
        await userClient.from('wizard_actions').insert({
          session_id: sessionId,
          organization_id: session.organization_id,
          action_name: 'publish_event',
          idempotency_key: idempotencyKey,
          stage: 'reviewPublish',
          result: event,
          execution_time_ms: 0
        })
        
        // Mark session complete
        await userClient
          .from('wizard_sessions')
          .update({
            event_id: event.id,
            status: 'completed',
            is_active: false
          })
          .eq('session_id', sessionId)
        
        return new Response(JSON.stringify({
          ok: true,
          event
        }), { 
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }
      
      default:
        return new Response(JSON.stringify({ 
          ok: false, 
          error: 'Invalid operation' 
        }), { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
    }
    
  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({
      ok: false,
      error: error.message || 'Internal server error'
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
```

### Artifact 3: Complete Validation Schemas for All Stages

```typescript
// validation/schemas.ts
import { z } from 'zod';

// Stage 1: Organizer
export const OrganizerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  organization: z.string().optional(),
  role: z.enum(["event_organizer", "fashion_designer", "brand_representative", "agency"])
});

// Stage 2: Event
export const EventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["fashion_show", "popup", "exhibition", "launch"]),
  date: z.string().refine(
    (date) => new Date(date) > new Date(),
    "Event date must be in the future"
  ),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format: HH:MM"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format: HH:MM").optional(),
  timezone: z.string().min(3, "Valid timezone required"),
  description: z.string().max(500).optional()
}).refine(
  (data) => !data.endTime || data.endTime > data.startTime,
  { message: "End time must be after start time", path: ["endTime"] }
);

// Stage 3: Venue
export const VenueSchema = z.object({
  mode: z.enum(["physical", "virtual", "hybrid"]),
  name: z.string().min(2).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  capacity: z.number().min(1).max(10000).optional(),
  streamingUrl: z.string().url().optional()
}).refine(
  (data) => {
    if (data.mode === "physical" || data.mode === "hybrid") {
      return data.address && data.city && data.capacity;
    }
    if (data.mode === "virtual") {
      return data.streamingUrl;
    }
    return true;
  },
  { message: "Required venue details missing" }
);

// Stage 4: Tickets
export const TicketSchema = z.object({
  tiers: z.array(z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    quantity: z.number().min(1),
    description: z.string().optional(),
    earlyBird: z.boolean().optional()
  })).min(1, "At least one ticket tier required"),
  totalCapacity: z.number().min(1),
  salesStartDate: z.string().optional(),
  salesEndDate: z.string().optional()
});

// Stage 5: Sponsors/Media
export const SponsorsSchema = z.object({
  sponsors: z.array(z.object({
    name: z.string(),
    tier: z.enum(["title", "gold", "silver", "bronze"]),
    logoUrl: z.string().url().optional()
  })).optional(),
  mediaPartners: z.array(z.string()).optional(),
  pressRelease: z.string().max(1000).optional()
});

// Stage 6: Review (no validation, just confirmation)
export const ReviewSchema = z.object({
  confirmed: z.boolean().refine(val => val === true, "Must confirm before publishing"),
  termsAccepted: z.boolean().refine(val => val === true, "Must accept terms")
});
```

### Artifact 4: CopilotKit Stage Hook with All Validations

```typescript
// hooks/useStageWithValidation.ts
import { useCopilotAction, useCopilotReadable, useCopilotAdditionalInstructions } from "@copilotkit/react-core";
import { z } from 'zod';
import { useWizardState } from './useWizardState';

// Generic stage hook factory
export function createStageHook<T extends z.ZodSchema>(
  stageName: string,
  stageTitle: string,
  schema: T,
  nextStageName: string
) {
  return function useStage() {
    const { session, updateStageData, transitionStage, progress } = useWizardState();
    const isActive = session?.current_stage === stageName;
    
    // Instructions for AI
    useCopilotAdditionalInstructions({
      instructions: `
        CURRENT STATE: ${stageTitle} (Stage ${stageName})
        PROGRESS: ${progress}% complete
        
        TASK: Help complete ${stageName} data
        VALIDATION: ${JSON.stringify(schema.shape)}
        
        IMPORTANT: Validate all inputs before proceeding
      `,
      available: isActive ? "enabled" : "disabled"
    });
    
    // Context for AI
    useCopilotReadable({
      description: `${stageName} context`,
      value: {
        currentData: session?.[`${stageName}_data`] || {},
        progress,
        completedStages: session?.completed_stages || [],
        validationSchema: schema.shape
      },
      available: isActive ? "enabled" : "disabled"
    });
    
    // Primary action with validation
    useCopilotAction({
      name: `complete${stageName}`,
      description: `Complete ${stageName} and proceed`,
      available: isActive ? "enabled" : "disabled",
      parameters: Object.entries(schema.shape).map(([key, value]) => ({
        name: key,
        type: typeof value,
        required: !value.isOptional()
      })),
      handler: async (params) => {
        try {
          // Validate with Zod
          const validated = schema.parse(params);
          
          // Save data
          await updateStageData(stageName, validated);
          
          // Update progress
          await updateProgress(stageName, 100);
          
          // Transition
          if (nextStageName) {
            await transitionStage(stageName, nextStageName);
          }
          
          return {
            success: true,
            message: `${stageTitle} completed successfully!`
          };
          
        } catch (error) {
          if (error instanceof z.ZodError) {
            return {
              success: false,
              errors: error.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message
              }))
            };
          }
          throw error;
        }
      }
    });
  };
}

// Create hooks for all stages
export const useStageOrganizer = createStageHook(
  'organizerSetup', 
  'Organizer Setup', 
  OrganizerSchema, 
  'eventSetup'
);

export const useStageEvent = createStageHook(
  'eventSetup',
  'Event Details',
  EventSchema,
  'venueSetup'
);

export const useStageVenue = createStageHook(
  'venueSetup',
  'Venue Configuration',
  VenueSchema,
  'ticketSetup'
);

export const useStageTickets = createStageHook(
  'ticketSetup',
  'Ticket Setup',
  TicketSchema,
  'sponsorsMedia'
);

export const useStageSponsors = createStageHook(
  'sponsorsMedia',
  'Sponsors & Media',
  SponsorsSchema,
  'reviewPublish'
);

export const useStageReview = createStageHook(
  'reviewPublish',
  'Review & Publish',
  ReviewSchema,
  null // Last stage
);
```

---

## Critical Production Checklist

### Security (MUST DO)
- [ ] Use auth-bound client (anon key + JWT) for user operations
- [ ] Only use service role for Stripe webhooks
- [ ] Verify JWT in every Edge Function
- [ ] Read org from JWT claims, not auth.users

### Data Integrity (MUST DO)
- [ ] All JSONB updates via RPC only
- [ ] Deterministic idempotency keys (no timestamps)
- [ ] Stripe events deduplication table
- [ ] Top-level stripe_account_id column

### Validation (MUST DO)
- [ ] Zod schemas for ALL 6 stages
- [ ] Block transitions on validation failure
- [ ] Show inline errors immediately
- [ ] Validate on both client and server

### Progress (MUST DO)
- [ ] Calculate from completion_details via RPC
- [ ] Update on every stage completion
- [ ] Show real percentage, not fake
- [ ] Persist across sessions

---

## Production Timeline

**Day 1: Database**
- Deploy corrected RPCs
- Add JWT helper functions
- Configure RLS policies
- Test with sample data

**Day 2: Edge Functions**
- Deploy with auth-bound client
- Test JWT verification
- Verify idempotency works
- Add error logging

**Day 3: Validation**
- Implement all 6 schemas
- Wire up to CopilotKit
- Test error handling
- Add inline feedback

**Day 4: Integration**
- Connect all stages
- Test full flow
- Verify progress tracking
- Test session recovery

**Day 5: Production**
- Security audit
- Load testing
- Deploy to production
- Monitor for 24 hours

---

## Bottom Line

The architecture is sound, but these 6 critical fixes are mandatory:
1. **Don't bypass RLS** - Use auth-bound client
2. **Fix CASE syntax** - Current RPC won't compile
3. **Deterministic idempotency** - No timestamps in keys
4. **JWT claims for org** - Not from auth.users
5. **Complete validation** - All 6 stages need Zod
6. **Real progress** - From database, not guessed

With these fixes, you'll have a production-ready, secure, and maintainable Event Wizard.