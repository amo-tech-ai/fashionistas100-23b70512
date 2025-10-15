# FashionOS AI - Common Mistakes to Avoid

Quick reference guide to prevent common pitfalls during implementation.

---

## ❌ Mistake 1: Building All Agents at Once

**Why It's Wrong:**
- Increases complexity 10x
- Harder to debug
- Longer time to first value
- Higher risk of failure

**✅ Correct Approach:**
```
Week 1: Ship Model Casting Agent
Week 2: Validate with real users
Week 3: Iterate based on feedback
Week 4: Ship next agent (if validated)
```

**Key Principle:** Ship 1, validate, iterate. Don't build all 6 agents speculatively.

---

## ❌ Mistake 2: Using CopilotKit for Event Automation

**Why It's Wrong:**
- CopilotKit is for chatbots, not event-driven automation
- Adds unnecessary complexity
- Increases bundle size
- Requires client-side API keys

**✅ Correct Approach:**
```
Use edge functions for event-driven automation:
- Trigger: User clicks "Generar Recomendaciones"
- Action: Edge function calls Lovable AI Gateway
- Result: Structured recommendations returned
```

**Key Principle:** CopilotKit for chat, edge functions for automation.

---

## ❌ Mistake 3: Overcomplicating Cron Security

**Why It's Wrong:**
- Internal edge functions don't need JWT verification
- Adds authentication complexity
- Slows down scheduled tasks
- Unnecessary for non-user-facing functions

**✅ Correct Approach:**
```toml
# User-facing functions (require JWT)
[functions.model-casting-agent]
verify_jwt = true

# Internal cron jobs (no JWT needed)
[functions.daily-event-health-check]
verify_jwt = false  # Only callable from Supabase scheduler
```

**Key Principle:** Only verify JWT for user-facing endpoints.

---

## ❌ Mistake 4: Normalizing JSONB Prematurely

**Why It's Wrong:**
- JSONB is flexible and performant
- Early normalization adds complexity
- Can optimize later when needed
- GIN indexes solve most performance issues

**✅ Correct Approach:**
```sql
-- Start with JSONB (flexible)
CREATE TABLE ai_agent_logs (
  output_data JSONB, -- Store any structure
  input_data JSONB
);

-- Add GIN index for queries
CREATE INDEX idx_ai_logs_output ON ai_agent_logs USING GIN(output_data);

-- Query efficiently
SELECT * FROM ai_agent_logs 
WHERE output_data @> '{"recommendations": [{"match_score": 90}]}';
```

**Key Principle:** Start with JSONB, add indexes, normalize only if needed.

---

## ❌ Mistake 5: Skipping RLS

**Why It's Wrong:**
- **CRITICAL SECURITY RISK**
- Users can access other users' data
- No multi-tenant isolation
- Violates data privacy regulations

**✅ Correct Approach:**
```sql
-- ALWAYS enable RLS on new tables
CREATE TABLE model_castings (...);
ALTER TABLE model_castings ENABLE ROW LEVEL SECURITY;

-- ALWAYS add policies
CREATE POLICY "organizers_own_data" ON model_castings
  FOR ALL USING (event_id IN (
    SELECT id FROM events WHERE organizer_id = current_profile_id()
  ));
```

**Key Principle:** No table goes to production without RLS + policies.

---

## ❌ Mistake 6: Skipping Logging

**Why It's Wrong:**
- Can't debug production issues
- No visibility into AI performance
- Can't track token usage
- No way to identify patterns in failures

**✅ Correct Approach:**
```typescript
// ALWAYS log to ai_agent_logs (even on success)
await supabaseAdmin.from("ai_agent_logs").insert({
  agent_type: "model_casting",
  event_id: eventId,
  operation: "generate_recommendations",
  model: MODEL,
  input_data: { requirements },
  output_data: validated,
  tokens_used: aiResponse.usage?.total_tokens || 0,
  latency_ms: Date.now() - startTime,
  success: true, // or false on error
  error_message: error?.message || null,
});
```

**Key Principle:** Log everything. You'll need it for debugging.

---

## ❌ Mistake 7: Skipping Spanish i18n

**Why It's Wrong:**
- Colombian market is Spanish-first
- English-only UI alienates 95% of users
- Reduces conversion and adoption
- Unprofessional for target market

**✅ Correct Approach:**
```json
// ALWAYS provide Spanish translations
{
  "ai": {
    "modelCasting": {
      "title": "Asistente IA - Casting",
      "generate": "Generar Recomendaciones",
      "generating": "Generando...",
      "success": "Recomendaciones generadas",
      "rateLimitError": "Límite alcanzado. Espera un minuto.",
      "creditError": "Créditos agotados. Agrega créditos."
    }
  }
}
```

**Key Principle:** Colombian Spanish (es-CO) is the default, English is secondary.

---

## ❌ Mistake 8: Hardcoding AI Gateway URL

**Why It's Wrong:**
- Can't switch AI providers easily
- Harder to test locally
- Environment-specific URLs scattered across code

**✅ Correct Approach:**
```typescript
// Use environment variable
const AI_GATEWAY = Deno.env.get("AI_GATEWAY_URL") || 
  "https://ai.gateway.lovable.dev/v1/chat/completions";

// Or centralize in config
const config = {
  ai: {
    gateway: "https://ai.gateway.lovable.dev/v1/chat/completions",
    model: "google/gemini-2.5-flash",
    timeout: 60000,
  }
};
```

**Key Principle:** Centralize configuration, don't hardcode URLs.

---

## ❌ Mistake 9: Not Handling Rate Limits

**Why It's Wrong:**
- Users see cryptic errors
- No guidance on what to do next
- Bad UX during high usage

**✅ Correct Approach:**
```typescript
// ALWAYS check for rate limit (429)
if (response.status === 429) {
  return new Response(
    JSON.stringify({ 
      error: "Has alcanzado el límite de uso. Por favor espera un minuto e intenta nuevamente.",
      retry_after: 60, // Seconds
    }),
    { 
      status: 429, 
      headers: { 
        ...corsHeaders,
        "Retry-After": "60" // Standard header
      } 
    }
  );
}

// Client-side debouncing
const [lastCallTime, setLastCallTime] = useState(0);

const handleGenerate = () => {
  const now = Date.now();
  if (now - lastCallTime < 60000) { // 1 minute
    toast({ 
      title: 'Espera un momento',
      description: 'Puedes generar nuevamente en un minuto.'
    });
    return;
  }
  setLastCallTime(now);
  // Proceed with AI call
};
```

**Key Principle:** Handle rate limits gracefully with clear messaging.

---

## ❌ Mistake 10: No Loading States

**Why It's Wrong:**
- Users don't know if something is happening
- Multiple clicks lead to duplicate calls
- Feels broken or slow

**✅ Correct Approach:**
```tsx
// ALWAYS show loading state
const [loading, setLoading] = useState(false);

<Button 
  onClick={handleGenerate}
  disabled={loading} // Prevent duplicate clicks
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
```

**Key Principle:** Every async operation needs a loading indicator.

---

## ❌ Mistake 11: Not Validating AI Output

**Why It's Wrong:**
- AI can return malformed JSON
- Missing required fields break UI
- Type errors at runtime
- Hard to debug in production

**✅ Correct Approach:**
```typescript
// ALWAYS validate with Zod
const outputSchema = z.object({
  recommendations: z.array(
    z.object({
      model_name: z.string(),
      match_score: z.number().min(0).max(100),
      reasoning: z.string(),
      contact_priority: z.enum(["high", "medium", "low"]),
    })
  ).min(1).max(10), // Reasonable limits
});

try {
  const validated = outputSchema.parse(aiResponse);
  // Safe to use validated data
} catch (error) {
  console.error("Invalid AI output:", error);
  // Return fallback or error
}
```

**Key Principle:** Never trust AI output without validation.

---

## ❌ Mistake 12: Exposing Service Role Key

**Why It's Wrong:**
- **CRITICAL SECURITY RISK**
- Anyone can bypass RLS
- Full database access from client
- Irreversible damage possible

**✅ Correct Approach:**
```typescript
// ❌ NEVER DO THIS
const supabase = createClient(
  SUPABASE_URL,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") // Sent to client = BAD!
);

// ✅ CORRECT (service role stays on server)
// Edge functions use service role internally
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Server-side only
);

// Client uses anon key (RLS enforced)
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY // Safe for client
);
```

**Key Principle:** Service role = server only. Anon key = client safe.

---

## ❌ Mistake 13: Not Testing on Mobile

**Why It's Wrong:**
- 70%+ of Colombian users are on mobile
- Desktop-only UI alienates majority
- Responsive issues found too late

**✅ Correct Approach:**
```tsx
// ALWAYS design mobile-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Stacks on mobile (1 col), 2 on tablet, 3 on desktop */}
</div>

// Touch targets ≥ 44px
<Button className="h-14 w-full md:w-auto">
  Generar
</Button>

// Test on real devices
// - iPhone SE (375px)
// - iPad (768px)
// - Desktop (1440px)
```

**Key Principle:** Mobile-first, test on real devices.

---

## ❌ Mistake 14: Ignoring Accessibility

**Why It's Wrong:**
- Excludes users with disabilities
- Violates WCAG 2.1 AA standards
- Poor SEO ranking
- Legal liability in some markets

**✅ Correct Approach:**
```tsx
// ALWAYS add alt text
<img src="..." alt="Runway model casting recommendations" />

// ALWAYS use semantic HTML
<h1>Event Details</h1> {/* Not <div className="text-2xl"> */}
<h2>AI Recommendations</h2>

// ALWAYS ensure color contrast
// text-foreground/background = 4.5:1+ contrast

// ALWAYS support keyboard navigation
<Button 
  onClick={handleAction}
  onKeyDown={(e) => e.key === 'Enter' && handleAction()}
  aria-label="Generate AI model recommendations"
>
  Generar
</Button>
```

**Key Principle:** Accessibility is a requirement, not a nice-to-have.

---

## Quick Reference: Do's and Don'ts

### ✅ DO:
1. Ship one agent at a time
2. Enable RLS on all tables
3. Validate AI output with Zod
4. Log all operations to ai_agent_logs
5. Provide Spanish translations
6. Show loading states
7. Handle rate limits gracefully
8. Test on mobile devices
9. Support keyboard navigation
10. Keep service role keys server-side

### ❌ DON'T:
1. Build all 6 agents at once
2. Skip RLS policies
3. Trust AI output without validation
4. Skip logging (you'll regret it)
5. Use English-only UI
6. Show no loading indicators
7. Ignore 429 rate limit errors
8. Design desktop-only
9. Expose service role key to client
10. Skip accessibility testing

---

**Version:** 1.0  
**Last Updated:** January 2025
