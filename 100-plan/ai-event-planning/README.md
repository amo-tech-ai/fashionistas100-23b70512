# FashionOS AI Event Planning - Implementation Guide

**Status:** 🟢 **Phase 1 & 2 Complete** - Model Casting + Runway Timing Agents Live  
**Next Action:** Observability Dashboard + Spanish i18n  
**Timeline:** Week 3 - Observability & Vendor Coordination  
**Last Updated:** January 2025

---

## Current Phase

**Week 6**: Spanish i18n + Enhanced Features 🚧

### ✅ Completed Phases

**Phase 1: Model Casting Agent** - [See PHASE-1-COMPLETE.md](./PHASE-1-COMPLETE.md)
- ✅ `model_castings` table with RLS
- ✅ `ai_agent_logs` for observability
- ✅ Model Casting AI Agent edge function
- ✅ UI component with Spanish i18n
- ✅ Rate limit & credit handling

**Phase 2: Runway Timing Agent** - [See PHASE-2-COMPLETE.md](./PHASE-2-COMPLETE.md)
- ✅ `runway_schedules` table with RLS
- ✅ Runway Timing AI Agent edge function
- ✅ Timeline visualization UI
- ✅ Designer slot optimization
- ✅ Backstage call scheduling

**Phase 3: Observability Dashboard** - [See PHASE-3-COMPLETE.md](./PHASE-3-COMPLETE.md)
- ✅ Health monitoring endpoint
- ✅ Real-time metrics dashboard
- ✅ Error rate tracking & alerting
- ✅ Agent-specific health cards
- ✅ Live log streaming

**Phase 4: Vendor Coordination Agent** - [See PHASE-4-COMPLETE.md](./PHASE-4-COMPLETE.md)
- ✅ `vendor_recommendations` table with RLS
- ✅ Vendor Coordination AI Agent edge function
- ✅ Multi-vendor type recommendations
- ✅ Budget allocation optimization
- ✅ WhatsApp/Email integration

**Phase 5: Event Health Scorer** - [See PHASE-5-COMPLETE.md](./PHASE-5-COMPLETE.md)
- ✅ `event_health_scores` table with RLS
- ✅ Event Health Scorer AI Agent edge function
- ✅ Multi-dimensional scoring (tickets, timeline, vendors, models)
- ✅ Recommendations & risk factor detection
- ✅ Visual health dashboard UI

### 🚧 Current Phase: Week 6

**Priority 1: Spanish i18n System (CRITICAL)**
- Extract all hardcoded UI strings
- Create comprehensive `es-CO.json`
- Implement react-i18next provider
- Update all components with translation keys
- Add language switcher (es-CO / en-US)
- Verify 100% Spanish coverage

**Priority 2: Event Health Scorer**
- Aggregate health scoring algorithm
- Dashboard widget for event preparedness
- Score categories (casting, timing, vendors, overall)
- Recommendation engine for improvements
- Timeline-based milestone tracking

**Priority 3: Production Polish**
- Fix any remaining security issues
- Performance optimization
- Final UX polish
- Comprehensive testing
- Pilot user onboarding

---

## 📁 Documentation Files

### Planning Documents (Read in Order)

1. **📊 06-PRODUCTION-AUDIT.md** ← **START HERE**
   - Reality check of current state
   - Critical gaps identified
   - What NOT to do (avoid over-engineering)
   - Specific SQL + code templates

2. **🎯 01-FASHION-SHOW-AI-MASTER-PLAN.md**
   - High-level vision (aspirational)
   - 6 AI agents described
   - ⚠️ CORRECTED: Build 1 agent first, not all 6

3. **🏗️ 02-AI-AGENTS-ARCHITECTURE.md**
   - Technical implementation details
   - Lovable AI Gateway integration
   - Function calling + Zod validation
   - ✅ Use as reference when building functions

4. **👤 03-FASHION-WORKFLOWS.md**
   - User journeys
   - Before/after time comparisons
   - WhatsApp integration flows
   - ✅ Good for understanding user needs

5. **🎨 04-DASHBOARD-DESIGN-PRODUCTION.md**
   - Breef-inspired design system
   - Component examples
   - Mobile-first patterns
   - ✅ Ready to implement UI

6. **📝 05-BREEF-DESIGN-SUMMARY.md**
   - Quick reference for design
   - Color tokens, typography
   - Code snippets
   - ✅ Use when building components

---

## 🚀 Implementation Steps (This Week)

### Day 1-2: Database Foundation

**Create 2 Critical Tables:**

```sql
-- 1. Model Castings (track AI recommendations)
CREATE TABLE model_castings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) NOT NULL,
  model_name TEXT NOT NULL,
  agency TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'invited' 
    CHECK (status IN ('invited', 'confirmed', 'declined', 'backup')),
  ai_match_score INTEGER CHECK (ai_match_score BETWEEN 0 AND 100),
  ai_reasoning TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AI Agent Logs (service-role only - observability)
CREATE TABLE ai_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL,
  event_id UUID REFERENCES events(id),
  operation TEXT NOT NULL,
  model TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  tokens_used INTEGER,
  latency_ms INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Setup
ALTER TABLE model_castings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_logs ENABLE ROW LEVEL SECURITY;

-- Organizers manage their event castings
CREATE POLICY "organizers_manage_castings" ON model_castings
  FOR ALL 
  USING (event_id IN (
    SELECT id FROM events WHERE organizer_id = current_profile_id()
  ));

-- Admins view all castings
CREATE POLICY "admins_view_all_castings" ON model_castings
  FOR SELECT
  USING (has_role('admin'));

-- Service role only for logs (blocks all public access)
CREATE POLICY "service_role_only" ON ai_agent_logs
  FOR ALL USING (false);

-- Add indexes
CREATE INDEX idx_model_castings_event_id ON model_castings(event_id);
CREATE INDEX idx_model_castings_status ON model_castings(status);
CREATE INDEX idx_ai_agent_logs_event_id ON ai_agent_logs(event_id);
CREATE INDEX idx_ai_agent_logs_created_at ON ai_agent_logs(created_at DESC);
```

**Fix Incomplete RLS on Existing Tables:**

```sql
-- Events table (currently only has public SELECT)
CREATE POLICY "organizers_insert_events" ON events
  FOR INSERT
  WITH CHECK (organizer_id = current_profile_id());

CREATE POLICY "organizers_update_own_events" ON events
  FOR UPDATE
  USING (organizer_id = current_profile_id());

CREATE POLICY "organizers_delete_own_events" ON events
  FOR DELETE
  USING (organizer_id = current_profile_id());

CREATE POLICY "admins_manage_all_events" ON events
  FOR ALL
  USING (has_role('admin'));

-- Add indexes on foreign keys
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
```

### Day 3-5: Model Casting Agent

**1. Create Edge Function:**

```bash
# File: supabase/functions/model-casting-agent/index.ts
```

See **06-PRODUCTION-AUDIT.md** for complete function code (lines 234-462).

**Key Points:**
- ✅ Uses `verify_jwt = true` (requires authenticated users)
- ✅ Calls Lovable AI Gateway with function calling (NOT freeform JSON)
- ✅ Validates output with Zod
- ✅ Logs to `ai_agent_logs` (service-role)
- ✅ Handles rate limits (429) and credit exhaustion (402)

**2. Update config.toml:**

```toml
# Add after existing functions
[functions.model-casting-agent]
verify_jwt = true  # Require authenticated users
```

**3. Test Locally:**

```bash
# Start functions
supabase functions serve model-casting-agent

# Test with curl (replace YOUR_JWT with actual token)
curl -X POST http://localhost:54321/functions/v1/model-casting-agent \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "EVENT_UUID",
    "requirements": "Need 5 runway models, 175cm+, professional experience"
  }'
```

### Day 6-7: Dashboard Integration

**1. Create AI Panel Component:**

```tsx
// src/components/events/AIModelCastingPanel.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2 } from 'lucide-react';

interface ModelRecommendation {
  model_name: string;
  agency?: string;
  match_score: number;
  reasoning: string;
  contact_priority: 'high' | 'medium' | 'low';
}

export function AIModelCastingPanel({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ModelRecommendation[]>([]);
  const { toast } = useToast();

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('model-casting-agent', {
        body: {
          event_id: eventId,
          requirements: 'Need 5-8 runway models, professional experience preferred'
        }
      });

      if (error) {
        if (error.message?.includes('Rate limit')) {
          toast({
            title: 'Límite de Uso Alcanzado',
            description: 'Por favor espera un minuto e intenta nuevamente.',
            variant: 'destructive'
          });
          return;
        }
        if (error.message?.includes('credits')) {
          toast({
            title: 'Créditos de IA Agotados',
            description: 'Por favor agrega créditos para continuar.',
            variant: 'destructive'
          });
          return;
        }
        throw error;
      }

      setResults(data.recommendations);
      toast({
        title: 'Recomendaciones Generadas',
        description: `${data.recommendations.length} modelos sugeridas`
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo generar recomendaciones',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Asistente IA - Casting</h3>
      </div>
      
      <Button 
        onClick={generateRecommendations}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generando...
          </>
        ) : (
          'Generar Recomendaciones'
        )}
      </Button>

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          {results.map((model, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-lg border border-border bg-card"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{model.model_name}</h4>
                  {model.agency && (
                    <p className="text-sm text-muted-foreground">{model.agency}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {model.match_score}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {model.contact_priority === 'high' ? 'Alta Prioridad' : 
                     model.contact_priority === 'medium' ? 'Media Prioridad' : 
                     'Baja Prioridad'}
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground">{model.reasoning}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
```

**2. Add to Event Detail Page:**

```tsx
// Update src/pages/EventDetail.tsx (or similar)
import { AIModelCastingPanel } from '@/components/events/AIModelCastingPanel';

// In the render:
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <aside className="lg:col-span-1">
    <AIModelCastingPanel eventId={eventId} />
  </aside>
  
  <main className="lg:col-span-2">
    {/* Existing event details */}
  </main>
</div>
```

---

## 🧪 Testing Checklist

### Day 7-8: Testing & Verification

**Database Tests:**
- [ ] Can insert model_castings as organizer
- [ ] Cannot insert model_castings for other's events
- [ ] Admin can view all castings
- [ ] Service role can write to ai_agent_logs
- [ ] Public cannot read ai_agent_logs

**AI Function Tests:**
- [ ] Returns valid JSON structure
- [ ] Zod validation catches malformed outputs
- [ ] Logs operation to ai_agent_logs
- [ ] Rate limit (429) shows user-friendly error
- [ ] Credit exhaustion (402) shows user-friendly error

**UI Tests:**
- [ ] Loading spinner shows while AI runs
- [ ] Results display in cards
- [ ] Spanish labels correct
- [ ] Mobile view works (test on 3 devices)
- [ ] Toast messages clear and helpful

**Performance Tests:**
- [ ] AI response < 3 seconds (p95)
- [ ] 100 concurrent calls don't crash
- [ ] Logs queryable in Supabase dashboard

---

## ✅ Production Gate (Must Pass Before Launch)

**Security:**
- [ ] RLS enabled on ALL tables
- [ ] Complete policies (SELECT + INSERT + UPDATE + DELETE)
- [ ] `verify_jwt = true` on model-casting-agent
- [ ] CORS configured (not `*`)

**Functionality:**
- [ ] Model Casting Agent working end-to-end
- [ ] Zod validation on all outputs
- [ ] Error handling graceful

**UX:**
- [ ] Spanish i18n for casting flow
- [ ] Mobile tested on 3 devices
- [ ] Loading states everywhere
- [ ] Error messages helpful

**Observability:**
- [ ] Can query ai_agent_logs
- [ ] Health check endpoint exists
- [ ] Manual error check: < 5% failure rate

---

## 📚 Key Resources

**Lovable AI:**
- Gateway: `https://ai.gateway.lovable.dev/v1/chat/completions`
- Model: `google/gemini-2.5-flash` (FREE until Oct 13, 2025)
- Docs: https://docs.lovable.dev/features/ai

**Supabase:**
- Project: https://supabase.com/dashboard/project/qydcfiufcoztzymedtbo
- Functions: https://supabase.com/dashboard/project/qydcfiufcoztzymedtbo/functions
- Logs: https://supabase.com/dashboard/project/qydcfiufcoztzymedtbo/functions/model-casting-agent/logs

**Testing:**
- Use Supabase SQL Editor for database tests
- Use function logs for debugging AI calls
- Use browser DevTools for UI testing

---

## 🚫 Common Mistakes to Avoid

1. ❌ **Don't build 6 agents at once** - Ship 1, validate, iterate
2. ❌ **Don't use CopilotKit** - Not needed for event-driven automation
3. ❌ **Don't overcomplicate cron security** - Internal calls are fine
4. ❌ **Don't normalize JSONB prematurely** - Indexes first
5. ❌ **Don't skip RLS** - Critical for multi-tenant security
6. ❌ **Don't skip logging** - You'll need it for debugging
7. ❌ **Don't skip Spanish i18n** - Colombian market requirement

---

## 📞 Need Help?

**If stuck, check:**
1. Supabase function logs (shows AI errors)
2. Browser console (shows client errors)
3. `ai_agent_logs` table (shows operation history)
4. **06-PRODUCTION-AUDIT.md** (detailed troubleshooting)

**Next Steps After MVP:**
- Clone pattern for Runway Timing Agent (2 days)
- Clone pattern for Vendor Coordination Agent (2 days)
- Add Event Health Scorer (1 day)
- Launch to pilot users

---

**Status:** 🟠 Ready to Build  
**Version:** 1.0  
**Last Updated:** January 2025
