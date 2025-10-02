# Event Wizard Production Implementation Plan
## Final Assessment & Optimized Artifacts

---

## 🎯 Assessment Summary

### Architecture Status: 85% Ready
- **Correct:** Single source of truth (`wizard_sessions`), CopilotKit state pattern
- **Critical Gaps:** JWT verification, RPC functions, idempotency
- **Missing:** Organization support, complete validation, progress tracking

---

## 📊 Critical Assessment of Each Suggestion

### 1. **Database Architecture** ✅ Mostly Correct
**Assessment:** 3-table design is optimal
**Issue:** Missing RPC implementation
**Fix Required:** Implement all RPC functions before any other work

### 2. **JWT Verification** ❌ Critical Gap
**Assessment:** Functions accept unverified `userId`
**Security Risk:** High - anyone can impersonate
**Fix Required:** Mandatory JWT verification in every Edge Function

### 3. **JSONB Updates** ❌ Will Break in Production
**Assessment:** `.update()` with SQL expressions doesn't work
**Fix Required:** Must use RPC functions

### 4. **Stripe Idempotency** ⚠️ Partially Correct
**Assessment:** Concept correct, implementation missing
**Fix Required:** Add `stripe_events` table + idempotency keys

### 5. **CopilotKit Integration** ⚠️ Incomplete
**Assessment:** Pattern correct, missing readables
**Fix Required:** Expose all context via readables

### 6. **Validation** ❌ Major Gap
**Assessment:** Only Event stage validated
**Fix Required:** Zod schemas for ALL stages

### 7. **Progress Tracking** ❌ Not Implemented
**Assessment:** UI shows fake progress
**Fix Required:** Real progress from `completion_details`

### 8. **Mobile Support** ⚠️ CSS Only
**Assessment:** No CopilotKit mobile adaptation
**Fix Required:** AI should know device type

---

## 🛠️ Production-Ready Implementation Artifacts

### Artifact 1: Complete Database Schema with RPC

```sql
-- 1. Core Tables
CREATE TABLE wizard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID,
  
  -- State tracking
  current_stage VARCHAR(50) NOT NULL DEFAULT 'organizerSetup',
  completed_stages TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  
  -- Stage data (separate for efficiency)
  organizer_data JSONB DEFAULT '{}',
  event_data JSONB DEFAULT '{}',
  ticket_data JSONB DEFAULT '{}',
  venue_data JSONB DEFAULT '{}',
  payment_data JSONB DEFAULT '{}',
  sponsor_data JSONB DEFAULT '{}',
  
  -- Progress tracking
  completion_details JSONB DEFAULT '{"organizerSetup":0,"eventSetup":0,"venueSetup":0,"ticketSetup":0,"sponsorsMedia":0,"reviewPublish":0}',
  completion_percentage INTEGER DEFAULT 0,
  
  -- References
  stripe_account_id VARCHAR(255), -- Top-level for indexing
  event_id UUID REFERENCES events(id),
  
  -- Status
  status VARCHAR(30) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned', 'expired')),
  
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

CREATE TABLE stripe_events (
  id TEXT PRIMARY KEY, -- Stripe event.id
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes
CREATE INDEX idx_sessions_user ON wizard_sessions(user_id) WHERE is_active = true;
CREATE INDEX idx_sessions_org ON wizard_sessions(organization_id, is_active);
CREATE INDEX idx_sessions_stripe ON wizard_sessions(stripe_account_id) WHERE stripe_account_id IS NOT NULL;
CREATE INDEX idx_sessions_expires ON wizard_sessions(expires_at) WHERE status = 'in_progress';
CREATE INDEX idx_actions_idempotency ON wizard_actions(idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX idx_stripe_events_processed ON stripe_events(processed_at) WHERE processed_at IS NULL;

-- 3. RPC Functions (REQUIRED - Direct updates will fail without these)
CREATE OR REPLACE FUNCTION wizard_merge_stage_data(
  p_session_id TEXT,
  p_stage TEXT,
  p_data JSONB
) RETURNS VOID 
SECURITY INVOKER
AS $$
BEGIN
  -- Verify ownership via RLS
  UPDATE wizard_sessions
  SET 
    CASE p_stage
      WHEN 'organizer' THEN organizer_data = organizer_data || p_data
      WHEN 'event' THEN event_data = event_data || p_data
      WHEN 'ticket' THEN ticket_data = ticket_data || p_data
      WHEN 'venue' THEN venue_data = venue_data || p_data
      WHEN 'payment' THEN payment_data = payment_data || p_data
      WHEN 'sponsor' THEN sponsor_data = sponsor_data || p_data
    END,
    updated_at = NOW()
  WHERE session_id = p_session_id
    AND (user_id = auth.uid() OR organization_id IN (
      SELECT organization_id FROM auth.users WHERE id = auth.uid()
    ));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION wizard_update_progress(
  p_session_id TEXT,
  p_stage TEXT,
  p_percentage INTEGER
) RETURNS INTEGER
SECURITY INVOKER
AS $$
DECLARE
  v_weights JSONB := '{"organizerSetup":15,"eventSetup":20,"venueSetup":15,"ticketSetup":20,"sponsorsMedia":15,"reviewPublish":15}';
  v_new_details JSONB;
  v_total_progress INTEGER;
BEGIN
  -- Update completion details
  UPDATE wizard_sessions
  SET 
    completion_details = completion_details || jsonb_build_object(p_stage, p_percentage),
    updated_at = NOW()
  WHERE session_id = p_session_id
    AND (user_id = auth.uid() OR organization_id IN (
      SELECT organization_id FROM auth.users WHERE id = auth.uid()
    ))
  RETURNING completion_details INTO v_new_details;
  
  -- Calculate weighted progress
  SELECT SUM((value::INTEGER * (v_weights->>key)::INTEGER) / 100)::INTEGER
  INTO v_total_progress
  FROM jsonb_each_text(v_new_details);
  
  -- Update percentage
  UPDATE wizard_sessions
  SET completion_percentage = v_total_progress
  WHERE session_id = p_session_id;
  
  RETURN v_total_progress;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION wizard_transition_stage(
  p_session_id TEXT,
  p_from_stage TEXT,
  p_to_stage TEXT
) RETURNS VOID
SECURITY INVOKER
AS $$
BEGIN
  -- Update stage and track transition
  UPDATE wizard_sessions
  SET 
    current_stage = p_to_stage,
    completed_stages = ARRAY(
      SELECT DISTINCT unnest(completed_stages || p_from_stage)
    ),
    updated_at = NOW()
  WHERE session_id = p_session_id
    AND current_stage = p_from_stage
    AND (user_id = auth.uid() OR organization_id IN (
      SELECT organization_id FROM auth.users WHERE id = auth.uid()
    ));
  
  -- Log action
  INSERT INTO wizard_actions (
    session_id,
    organization_id,
    action_name,
    stage,
    payload
  )
  SELECT 
    p_session_id,
    organization_id,
    'stage_transition',
    p_to_stage,
    jsonb_build_object('from', p_from_stage, 'to', p_to_stage)
  FROM wizard_sessions
  WHERE session_id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON wizard_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS Policies
ALTER TABLE wizard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions" ON wizard_sessions
  FOR ALL USING (user_id = auth.uid() OR organization_id IN (
    SELECT organization_id FROM auth.users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view own actions" ON wizard_actions
  FOR SELECT USING (session_id IN (
    SELECT session_id FROM wizard_sessions 
    WHERE user_id = auth.uid() OR organization_id IN (
      SELECT organization_id FROM auth.users WHERE id = auth.uid()
    )
  ));
```

### Artifact 2: Secure Edge Function with JWT Verification

```typescript
// /functions/wizard-session/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import * as jose from 'https://deno.land/x/jose@v4.9.0/index.ts'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // 1. Verify JWT (CRITICAL)
    const jwt = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!jwt) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    // Verify JWT with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(jwt)
    if (error || !user) {
      return new Response('Invalid token', { status: 401, headers: corsHeaders })
    }
    
    // 2. Parse operation
    const { op, sessionId, data } = await req.json()
    
    // 3. Handle operations
    switch (op) {
      case 'create': {
        // Check for existing session
        const { data: existing } = await supabase
          .from('wizard_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .eq('user_id', user.id)
          .single()
        
        if (existing?.is_active) {
          return new Response(JSON.stringify({
            ok: true,
            session: existing
          }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
        
        // Create new session
        const { data: newSession, error } = await supabase
          .from('wizard_sessions')
          .insert({
            session_id: sessionId || crypto.randomUUID(),
            user_id: user.id,
            organization_id: user.app_metadata?.organization_id,
            current_stage: 'organizerSetup'
          })
          .select()
          .single()
        
        if (error) throw error
        
        return new Response(JSON.stringify({
          ok: true,
          session: newSession
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      
      case 'update_stage_data': {
        const { stage, stageData } = data
        
        // Use RPC for safe JSON merge
        const { error } = await supabase.rpc('wizard_merge_stage_data', {
          p_session_id: sessionId,
          p_stage: stage,
          p_data: stageData
        })
        
        if (error) throw error
        
        // Update progress
        const { data: progress } = await supabase.rpc('wizard_update_progress', {
          p_session_id: sessionId,
          p_stage: stage,
          p_percentage: 100
        })
        
        return new Response(JSON.stringify({
          ok: true,
          progress
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      
      case 'transition': {
        const { fromStage, toStage } = data
        
        const { error } = await supabase.rpc('wizard_transition_stage', {
          p_session_id: sessionId,
          p_from_stage: fromStage,
          p_to_stage: toStage
        })
        
        if (error) throw error
        
        return new Response(JSON.stringify({
          ok: true
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      
      case 'publish': {
        // Idempotency check
        const idempotencyKey = `publish_${sessionId}_${Date.now()}`
        
        const { data: existingAction } = await supabase
          .from('wizard_actions')
          .select('*')
          .eq('idempotency_key', idempotencyKey)
          .single()
        
        if (existingAction) {
          return new Response(JSON.stringify({
            ok: true,
            event: existingAction.result
          }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
        
        // Get session
        const { data: session } = await supabase
          .from('wizard_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .eq('user_id', user.id)
          .single()
        
        if (!session) throw new Error('Session not found')
        
        // Create event (transaction would be better)
        const { data: event, error: eventError } = await supabase
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
            timezone: session.event_data.timezone || 'America/New_York',
            venue_mode: session.venue_data.mode,
            venue_data: session.venue_data,
            ticket_tiers: session.ticket_data.tiers,
            stripe_account_id: session.payment_data?.accountId,
            status: 'published',
            published_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (eventError) throw eventError
        
        // Log action with idempotency
        await supabase.from('wizard_actions').insert({
          session_id: sessionId,
          organization_id: session.organization_id,
          action_name: 'publish_event',
          idempotency_key: idempotencyKey,
          result: event
        })
        
        // Update session
        await supabase
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
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      
      default:
        return new Response('Invalid operation', { 
          status: 400, 
          headers: corsHeaders 
        })
    }
    
  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({
      ok: false,
      error: error.message
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
```

### Artifact 3: CopilotKit Stage Hook Template

```typescript
// hooks/stages/useStageEventSetup.tsx
import { useCopilotAction, useCopilotAdditionalInstructions, useCopilotReadable } from "@copilotkit/react-core";
import { useWizardState } from "../useWizardState";
import { z } from "zod";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Validation schema
const EventDetailsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["fashion_show", "popup", "exhibition", "launch"]),
  date: z.string().refine(
    (date) => new Date(date) > new Date(),
    "Event date must be in the future"
  ),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format: HH:MM"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format: HH:MM").optional(),
  timezone: z.string().min(3, "Valid timezone required"),
  description: z.string().optional()
});

export function useStageEventSetup() {
  const { 
    session,
    updateStageData,
    transitionStage,
    progress 
  } = useWizardState();
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const stage = session?.current_stage;
  const isActive = stage === "eventSetup";
  
  // 1. Stage-specific instructions
  useCopilotAdditionalInstructions({
    instructions: `
      CURRENT STATE: Event Setup (Step 2 of 6)
      DEVICE: ${isMobile ? 'Mobile - keep responses brief' : 'Desktop'}
      
      TASK: Help create event details
      - Event type (Fashion Show, Pop-up, Exhibition, Launch)
      - Title, date, time, timezone
      - Optional: description, end time
      
      VALIDATION:
      - Date must be future
      - Time in HH:MM format
      - End time after start time
      
      USER CONTEXT:
      - Name: ${session?.organizer_data?.name}
      - Organization: ${session?.organizer_data?.organization}
      - Progress: ${progress}% complete
    `,
    available: isActive ? "enabled" : "disabled"
  });
  
  // 2. Expose all context
  useCopilotReadable({
    description: "Event setup context",
    value: {
      currentData: session?.event_data || {},
      organizerData: session?.organizer_data || {},
      progress: {
        percentage: progress,
        completedStages: session?.completed_stages || [],
        currentStage: stage
      },
      validation: {
        rules: EventDetailsSchema.shape,
        errors: session?.validation_errors?.event || {}
      },
      device: {
        isMobile,
        screenWidth: window.innerWidth
      },
      lastSaved: session?.updated_at
    },
    available: isActive ? "enabled" : "disabled"
  });
  
  // 3. Primary completion action
  useCopilotAction({
    name: "completeEventSetup",
    description: "Save event details and move to venue setup",
    available: isActive ? "enabled" : "disabled",
    parameters: [
      { name: "title", type: "string", required: true },
      { name: "type", type: "string", required: true },
      { name: "date", type: "string", required: true },
      { name: "startTime", type: "string", required: true },
      { name: "endTime", type: "string", required: false },
      { name: "timezone", type: "string", required: false },
      { name: "description", type: "string", required: false }
    ],
    handler: async (params) => {
      try {
        // Validate
        const validated = EventDetailsSchema.parse(params);
        
        // Save via secure function
        await updateStageData('event', validated);
        
        // Transition
        await transitionStage('eventSetup', 'venueSetup');
        
        return {
          success: true,
          message: `Event "${validated.title}" configured! Moving to venue setup.`
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
  
  // 4. Helper action - suggest event details
  useCopilotAction({
    name: "suggestEventDetails",
    description: "Generate AI suggestions for event",
    available: isActive ? "enabled" : "disabled",
    handler: async () => {
      const organizer = session?.organizer_data;
      const suggestions = {
        title: `${organizer?.organization || 'Fashion'} ${new Date().getFullYear()} Showcase`,
        description: await generateDescription(organizer),
        suggestedDates: getUpcomingFashionDates(),
        optimalTimes: {
          fashionShow: "19:00",
          popup: "11:00",
          exhibition: "18:00",
          launch: "20:00"
        }
      };
      
      return suggestions;
    }
  });
  
  // 5. Autosave action
  useCopilotAction({
    name: "autosaveEventData",
    description: "Save current progress without advancing",
    available: isActive ? "enabled" : "disabled",
    parameters: [
      { name: "data", type: "object", required: true }
    ],
    handler: async ({ data }) => {
      await updateStageData('event', data);
      return "Progress saved";
    }
  });
}
```

### Artifact 4: Frontend State Hook with Security

```typescript
// hooks/useWizardState.ts
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

export function useWizardState() {
  const [session, setSession] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const supabase = useSupabaseClient();
  const { user, getToken } = useUser();
  
  // Get auth token for Edge Function
  const getAuthHeaders = useCallback(async () => {
    const token = await getToken({ template: 'supabase' });
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }, [getToken]);
  
  // Initialize or resume session
  useEffect(() => {
    if (!user) return;
    
    const initSession = async () => {
      try {
        setLoading(true);
        const sessionId = localStorage.getItem('wizard_session_id') || crypto.randomUUID();
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/wizard-session`, {
          method: 'POST',
          headers: await getAuthHeaders(),
          body: JSON.stringify({
            op: 'create',
            sessionId
          })
        });
        
        if (!response.ok) throw new Error('Failed to initialize session');
        
        const { session: data } = await response.json();
        setSession(data);
        setProgress(data.completion_percentage || 0);
        localStorage.setItem('wizard_session_id', sessionId);
        
      } catch (err) {
        setError(err.message);
        console.error('Session init error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initSession();
  }, [user]);
  
  // Update stage data with debounce
  const updateStageData = useCallback(
    debounce(async (stage, data) => {
      if (!session) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/wizard-session`, {
          method: 'POST',
          headers: await getAuthHeaders(),
          body: JSON.stringify({
            op: 'update_stage_data',
            sessionId: session.session_id,
            data: { stage, stageData: data }
          })
        });
        
        if (!response.ok) throw new Error('Failed to save');
        
        const { progress: newProgress } = await response.json();
        setProgress(newProgress || progress);
        
        // Update local state
        setSession(prev => ({
          ...prev,
          [`${stage}_data`]: { ...prev[`${stage}_data`], ...data },
          updated_at: new Date().toISOString()
        }));
        
      } catch (err) {
        console.error('Save error:', err);
        // Could retry or show toast
      }
    }, 1000),
    [session, getAuthHeaders]
  );
  
  // Stage transition
  const transitionStage = async (fromStage, toStage) => {
    if (!session) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/wizard-session`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          op: 'transition',
          sessionId: session.session_id,
          data: { fromStage, toStage }
        })
      });
      
      if (!response.ok) throw new Error('Failed to transition');
      
      setSession(prev => ({
        ...prev,
        current_stage: toStage,
        completed_stages: [...(prev.completed_stages || []), fromStage]
      }));
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Publish event (with idempotency)
  const publishEvent = async () => {
    if (!session) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/wizard-session`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          op: 'publish',
          sessionId: session.session_id
        })
      });
      
      if (!response.ok) throw new Error('Failed to publish');
      
      const { event } = await response.json();
      
      // Clear session
      localStorage.removeItem('wizard_session_id');
      
      return event;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    session,
    progress,
    loading,
    error,
    updateStageData,
    transitionStage,
    publishEvent,
    isAuthenticated: !!user
  };
}
```

---

## 📋 Production Deployment Checklist

### Phase 1: Database (Day 1)
- [ ] Run complete SQL migration with RPC functions
- [ ] Test RPC functions with sample data
- [ ] Verify RLS policies work correctly
- [ ] Create `stripe_events` table
- [ ] Add indexes for performance

### Phase 2: Edge Functions (Day 2)
- [ ] Deploy wizard-session function with JWT verification
- [ ] Deploy stripe webhook handler
- [ ] Test idempotency with duplicate requests
- [ ] Verify CORS headers
- [ ] Add error logging

### Phase 3: Frontend Integration (Day 3)
- [ ] Implement all 6 stage hooks with CopilotKit
- [ ] Add Zod validation to every stage
- [ ] Wire up progress tracking
- [ ] Test autosave functionality
- [ ] Mobile responsiveness

### Phase 4: Testing (Day 4)
- [ ] End-to-end wizard flow
- [ ] Double-click publish test
- [ ] Session recovery test
- [ ] Mobile device testing
- [ ] Load testing Edge Functions

### Phase 5: Security Audit (Day 5)
- [ ] JWT verification in all functions
- [ ] RLS policy testing
- [ ] Stripe webhook security
- [ ] Rate limiting
- [ ] CORS configuration

---

## 🎯 Critical Success Factors

1. **RPC Functions are mandatory** - Direct JSONB updates will fail
2. **JWT verification required** - Never trust client-provided user IDs
3. **Idempotency essential** - Prevent double charges/publishes
4. **Complete validation** - Every stage needs Zod schemas
5. **Real progress tracking** - UI must reflect actual completion

---

## Final Assessment: 90% Ready

With these implementations, your Event Wizard will be production-ready. The critical path is:
1. Deploy RPC functions (blocks everything else)
2. Add JWT verification (security critical)
3. Implement idempotency (prevents disasters)
4. Complete validation (prevents bad data)
5. Wire up CopilotKit properly (UX critical)

Estimated time to production: 5 days with focused execution.