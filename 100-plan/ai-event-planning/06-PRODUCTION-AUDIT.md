# FashionOS Production Readiness Audit

**Date:** January 2025  
**Status:** 🔴 **NOT PRODUCTION READY** (Critical gaps identified)  
**Audited Against:** Lovable AI Cloud best practices, Supabase security, Colombian market requirements

---

## 🚨 Executive Summary

**Overall Assessment: 30% Ready**

**Critical Blockers (Must Fix Before Launch):**
1. ❌ No AI edge functions exist (all are planned but not implemented)
2. ❌ Missing 3 critical database tables (model_castings, runway_schedules, vendor_recommendations)
3. ❌ Incomplete RLS policies (many tables only have SELECT, missing INSERT/UPDATE/DELETE)
4. ❌ No observability/logging system for AI operations
5. ❌ Spanish i18n not implemented (only planning docs are in Spanish)

**Quick Win Path to 80% Ready:** Focus on 1 working AI agent + complete RLS + basic monitoring (2 weeks realistic timeline)

---

## 📊 Category Breakdown

### 1. Database & Security: **40%** 🟠

**What's Good:**
- ✅ Tables exist for events, profiles, organizations, venues, designers
- ✅ Clerk authentication integrated via webhook
- ✅ RLS enabled on most tables
- ✅ `current_profile_id()` function works for JWT validation

**Critical Issues:**
- 🔴 **Missing tables for AI agents:**
  - `model_castings` - No way to track casting status, AI recommendations
  - `runway_schedules` - No timing automation possible
  - `vendor_recommendations` - No vendor coordination
  - `ai_agent_logs` - No observability (service-role only table)

- 🔴 **Incomplete RLS policies:**
  ```sql
  -- Example: events table only has public read
  events_public_read: SELECT using (true)
  -- Missing: INSERT/UPDATE/DELETE for organizers
  
  -- Example: designers table
  designers_public_read: SELECT using (true)
  -- Missing: Who can INSERT/UPDATE designers? Anyone? No one?
  ```

- 🟠 **Missing indexes:** Foreign keys and common queries not indexed
  - `events.organizer_id` - no index
  - `bookings.event_id` - no index
  - `profiles.organization_id` - no index

**Fix Priority:** 🔴 CRITICAL - Block 1-2 days to complete

**Specific Actions:**
1. Create 4 missing tables (see SQL below)
2. Add complete RLS policies for organizers/admins
3. Add indexes on foreign keys
4. Test with real user flows

---

### 2. Lovable AI Integration: **0%** 🔴

**What's Good:**
- ✅ `LOVABLE_API_KEY` secret configured
- ✅ Design plan exists with function calling approach
- ✅ Gemini 2.5 Flash is FREE until Oct 13, 2025 (perfect timing)

**Critical Issues:**
- 🔴 **No edge functions exist** - Zero implementation
- 🔴 **No Zod schemas** - No validation ready
- 🔴 **No function calling setup** - Plans describe it but nothing built
- 🔴 **No rate limit handling** - No 429/402 error UX

**Current Edge Functions:**
```toml
# supabase/config.toml
[functions.copilotkit]
verify_jwt = false  # CopilotKit handles its own auth

[functions.stripe-webhook]
verify_jwt = false  # Stripe signature provides authentication

# Missing: model-casting-agent, runway-timing-agent, etc.
```

**Fix Priority:** 🔴 CRITICAL - Core feature, 3-5 days to implement first agent

**Specific Actions:**
1. Create `model-casting-agent` function (see template below)
2. Implement Gemini function calling with Zod validation
3. Add error handling for rate limits (429) and credits (402)
4. Test with real event data

---

### 3. Authentication & Authorization: **70%** 🟢

**What's Good:**
- ✅ Clerk → Supabase JWT integration working
- ✅ Webhook creates profiles automatically
- ✅ `current_profile_id()` helper function
- ✅ `has_role()` security definer function

**Minor Issues:**
- 🟡 Edge functions will need consistent auth pattern
- 🟡 No documented admin onboarding flow

**Fix Priority:** 🟡 LOW - Working well enough

---

### 4. UI/UX Design: **90%** 🟢

**What's Good:**
- ✅ Breef-inspired design system documented
- ✅ Cream background, orange CTAs, minimal borders defined
- ✅ Mobile-first patterns documented
- ✅ Component examples provided
- ✅ Spanish language considerations included

**Minor Issues:**
- 🟡 Components not built yet (only documented)
- 🟡 No actual dashboard pages exist

**Fix Priority:** 🟡 MEDIUM - Can build after AI functions work

---

### 5. Observability & Monitoring: **5%** 🔴

**What's Good:**
- ✅ Audit logs table exists (for user actions)

**Critical Issues:**
- 🔴 **No AI operations logging** - Can't debug failures
- 🔴 **No performance metrics** - Don't know p95 latency
- 🔴 **No error tracking** - Can't see rate limits or validation failures
- 🔴 **No health check endpoint** - Can't monitor uptime

**Fix Priority:** 🔴 CRITICAL - Need immediately for AI features

**Specific Actions:**
1. Create `ai_agent_logs` table (service-role only)
2. Log every AI operation (model, tokens, latency, success/error)
3. Create `/health` endpoint
4. Add simple dashboard query: `SELECT COUNT(*) FROM ai_agent_logs WHERE created_at > NOW() - INTERVAL '1 hour' AND error IS NOT NULL`

---

### 6. Production Infrastructure: **20%** 🔴

**What's Good:**
- ✅ Supabase project configured
- ✅ Secrets management setup
- ✅ Stripe webhook working

**Critical Issues:**
- 🔴 **No rate limiting** - Users can spam AI calls
- 🔴 **No cost monitoring** - Could get expensive bill
- 🔴 **CORS not configured** - Edge functions will be wide open
- 🔴 **No staging environment** - Deploy straight to prod

**Fix Priority:** 🟠 HIGH - Before launch

---

## 🎯 Critical Path to MVP (Realistic 2 Weeks)

### Week 1: Foundation + First AI Agent

**Day 1-2: Database Foundation**
```sql
-- Create missing tables
CREATE TABLE model_castings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) NOT NULL,
  model_name TEXT NOT NULL,
  agency TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'confirmed', 'declined', 'backup')),
  ai_match_score INTEGER CHECK (ai_match_score BETWEEN 0 AND 100),
  ai_reasoning TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL, -- 'model_casting', 'runway_timing', etc.
  event_id UUID REFERENCES events(id),
  operation TEXT NOT NULL,
  model TEXT NOT NULL, -- 'google/gemini-2.5-flash'
  input_data JSONB,
  output_data JSONB,
  tokens_used INTEGER,
  latency_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS on ai_agent_logs - service role only
ALTER TABLE ai_agent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON ai_agent_logs
  FOR ALL USING (false); -- Block all public access

-- Add complete RLS for model_castings
ALTER TABLE model_castings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "organizers_manage_castings" ON model_castings
  FOR ALL 
  USING (event_id IN (
    SELECT id FROM events WHERE organizer_id = current_profile_id()
  ));

CREATE POLICY "admins_view_all_castings" ON model_castings
  FOR SELECT
  USING (has_role('admin'));

-- Add indexes
CREATE INDEX idx_model_castings_event_id ON model_castings(event_id);
CREATE INDEX idx_model_castings_status ON model_castings(status);
CREATE INDEX idx_ai_agent_logs_event_id ON ai_agent_logs(event_id);
CREATE INDEX idx_ai_agent_logs_created_at ON ai_agent_logs(created_at DESC);
```

**Day 3-5: First AI Function (Model Casting Agent)**
```typescript
// supabase/functions/model-casting-agent/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Zod schema for validation
const ModelCastingSchema = z.object({
  recommendations: z.array(z.object({
    model_name: z.string(),
    agency: z.string().optional(),
    match_score: z.number().int().min(0).max(100),
    reasoning: z.string(),
    contact_priority: z.enum(['high', 'medium', 'low'])
  }))
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { event_id, requirements } = await req.json();
    const startTime = Date.now();

    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('title, description, start_datetime, venue_id')
      .eq('id', event_id)
      .single();

    if (eventError) throw new Error('Event not found');

    // Call Lovable AI with function calling
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash', // FREE until Oct 13, 2025
        messages: [
          {
            role: 'system',
            content: 'You are a fashion show casting director AI. Recommend models based on event requirements and Colombian fashion industry standards.'
          },
          {
            role: 'user',
            content: `Event: ${event.title}\nRequirements: ${requirements}\n\nRecommend 5-8 models with match scores and reasoning.`
          }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'recommend_models',
            description: 'Recommend models for fashion show casting',
            parameters: {
              type: 'object',
              properties: {
                recommendations: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      model_name: { type: 'string' },
                      agency: { type: 'string' },
                      match_score: { type: 'integer', minimum: 0, maximum: 100 },
                      reasoning: { type: 'string' },
                      contact_priority: { type: 'string', enum: ['high', 'medium', 'low'] }
                    },
                    required: ['model_name', 'match_score', 'reasoning', 'contact_priority']
                  }
                }
              },
              required: ['recommendations']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'recommend_models' } }
      })
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait a minute and try again.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits exhausted. Please add credits to continue.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices[0].message.tool_calls?.[0];
    if (!toolCall) throw new Error('No tool call returned');

    // Validate with Zod
    const result = ModelCastingSchema.parse(
      JSON.parse(toolCall.function.arguments)
    );

    const latency = Date.now() - startTime;

    // Log to ai_agent_logs (service role)
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabaseServiceRole.from('ai_agent_logs').insert({
      agent_type: 'model_casting',
      event_id,
      operation: 'recommend_models',
      model: 'google/gemini-2.5-flash',
      input_data: { requirements },
      output_data: result,
      tokens_used: aiData.usage?.total_tokens || 0,
      latency_ms: latency,
      success: true
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Model casting error:', error);

    // Log error
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabaseServiceRole.from('ai_agent_logs').insert({
      agent_type: 'model_casting',
      operation: 'recommend_models',
      model: 'google/gemini-2.5-flash',
      success: false,
      error_message: error.message
    });

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

**Update config.toml:**
```toml
[functions.model-casting-agent]
verify_jwt = true  # Require authenticated users
```

### Week 2: Dashboard Integration + Polish

**Day 1-3: Build Dashboard UI**
- Model casting panel with "Generate Recommendations" button
- Loading states (spinner while AI works)
- Error toasts for rate limits
- Spanish i18n for key labels

**Day 4-5: Testing & Hardening**
- Test with real events
- Verify RLS blocks unauthorized access
- Load test AI function (100 concurrent calls)
- Monitor logs for errors

---

## 🚫 What NOT to Do (Avoid Over-Engineering)

### 1. ❌ Don't Use CopilotKit for This Use Case

**Current Setup:**
```toml
[functions.copilotkit]
verify_jwt = false  # CopilotKit handles its own auth
```

**Issue:** CopilotKit is for conversational AI assistants (chatbots), not backend automation.

**This Use Case:** 
- Fashion show automation is **event-driven** (organizer clicks "Generate" → AI runs → Result displayed)
- Not conversational (no back-and-forth chat)
- State is in database, not chat session

**Recommendation:** ❌ Remove CopilotKit dependency to simplify architecture

---

### 2. ❌ Don't Build 6 Agents at Once

**Plan Says:** Implement Model Casting, Runway Timing, Vendor Coordination, Event Health, Email Generation, WhatsApp Automation

**Reality:** Build 1 agent end-to-end first, then clone the pattern

**Why:** 
- Easier to debug
- Faster to production
- Learn from real usage before building more

---

### 3. ❌ Don't Overcomplicate Cron Security

**User Suggestion:** "Short-lived signed tokens for cron jobs"

**Better Approach:** Supabase pg_cron calls functions internally (no HTTP)
```sql
-- This is INTERNAL, not HTTP
SELECT cron.schedule(
  'daily-event-health-check',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project.supabase.co/functions/v1/event-health-check',
    headers := '{"Authorization": "Bearer SERVICE_KEY"}'::jsonb
  );
  $$
);
```

**Or:** Use `verify_jwt = false` + validate a shared secret in function:
```typescript
const CRON_SECRET = Deno.env.get('CRON_SECRET');
const secret = req.headers.get('X-Cron-Secret');
if (secret !== CRON_SECRET) {
  return new Response('Unauthorized', { status: 401 });
}
```

---

### 4. ❌ Don't Normalize JSONB Yet

**User Suggestion:** "Normalize high-traffic JSON"

**Reality:** Premature optimization. Use indexes + CHECKs first:
```sql
-- Good enough for MVP
CREATE INDEX idx_events_metadata_gin ON events USING GIN(metadata);

-- Add validation if needed
ALTER TABLE events ADD CONSTRAINT check_metadata_keys 
  CHECK (metadata ? 'last_booking_update');
```

---

## 🟢 What to Do RIGHT NOW (This Sprint)

### Priority 1: Database Migration (4 hours)
- [ ] Create `model_castings` table
- [ ] Create `ai_agent_logs` table (service-role only)
- [ ] Add complete RLS policies for events/designers (INSERT/UPDATE/DELETE for organizers)
- [ ] Add indexes on foreign keys
- [ ] Test with sample data

### Priority 2: First AI Function (2 days)
- [ ] Implement `model-casting-agent` (copy template above)
- [ ] Test with real event
- [ ] Verify Zod validation works
- [ ] Confirm logging to `ai_agent_logs`

### Priority 3: Dashboard Integration (1 day)
- [ ] Add "Generate Recommendations" button to event page
- [ ] Show loading spinner while AI runs
- [ ] Display results in cards
- [ ] Handle rate limit errors with toast

### Priority 4: Spanish i18n (4 hours)
- [ ] Add translation keys for AI panel
- [ ] Test on mobile (Spanish language)

---

## 📏 Production Gate Checklist

**Before Launch, ALL Must Be ✅:**

### Security
- [ ] RLS enabled on ALL tables
- [ ] Complete policies (SELECT + INSERT + UPDATE + DELETE)
- [ ] `verify_jwt = true` on all user-facing functions
- [ ] No service-role keys in client code
- [ ] CORS configured for specific domains (not `*`)

### Functionality
- [ ] At least 1 AI agent working end-to-end
- [ ] Zod validation on all AI outputs
- [ ] Rate limits handled gracefully (429 → user-friendly message)
- [ ] Error logging to `ai_agent_logs`

### Performance
- [ ] AI p95 latency < 3 seconds
- [ ] Indexes on foreign keys
- [ ] No N+1 queries in dashboard

### UX
- [ ] Spanish i18n 100% complete for MVP flows
- [ ] Mobile tested on 3 devices
- [ ] Loading states on all AI operations
- [ ] Error messages are helpful (not "Error 500")

### Observability
- [ ] Health check endpoint (`/functions/v1/health`)
- [ ] Can query `ai_agent_logs` for last 24h errors
- [ ] Alert if error rate > 5% (manual check OK for MVP)

---

## 🎯 Success Metrics (First 30 Days)

1. **AI Agent Reliability:** > 95% success rate
2. **Performance:** p95 < 3s for AI operations
3. **User Adoption:** 50% of organizers use AI features
4. **Cost:** < $50/month on Lovable AI (Gemini is FREE until Oct 13)
5. **Mobile Usage:** > 70% of traffic from mobile

---

## 🔧 Tools & Resources

**Lovable AI Gateway:**
- Endpoint: `https://ai.gateway.lovable.dev/v1/chat/completions`
- Model: `google/gemini-2.5-flash` (FREE until Oct 13, 2025)
- Docs: https://docs.lovable.dev/features/ai

**Supabase:**
- RLS Docs: https://supabase.com/docs/guides/auth/row-level-security
- Edge Functions: https://supabase.com/docs/guides/functions

**Testing:**
- Supabase Function Logs: https://supabase.com/dashboard/project/qydcfiufcoztzymedtbo/functions/model-casting-agent/logs

---

## 📝 Final Assessment

**Can Ship in 2 Weeks?** ✅ **YES** - If focused on 1 agent + complete RLS + basic monitoring

**Current Plan Issues:**
- ❌ Too ambitious (6 agents)
- ❌ CopilotKit not needed
- ❌ Over-engineered security for cron
- ❌ Premature optimization (JSONB normalization)

**Corrected Plan:**
- ✅ Ship 1 working agent (model casting)
- ✅ Complete RLS policies
- ✅ Basic observability (`ai_agent_logs`)
- ✅ Spanish i18n for core flows
- ✅ Mobile-tested

**Next Steps:**
1. Run database migration (1 day)
2. Implement `model-casting-agent` (2 days)
3. Build dashboard integration (1 day)
4. Test end-to-end (1 day)
5. Ship to staging → production

---

**Status:** 🟠 Ready to Build  
**Confidence:** 🟢 High (if we follow simplified plan)  
**Version:** 1.0  
**Last Updated:** January 2025
