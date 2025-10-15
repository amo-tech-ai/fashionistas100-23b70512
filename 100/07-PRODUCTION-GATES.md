# FashionOS AI - Production Launch Gates

Critical requirements that MUST be met before deploying to production.

---

## Security Gates (CRITICAL)

### ✅ Row Level Security (RLS)

**Requirement:** All tables have RLS enabled with complete policies.

```sql
-- Verify RLS is ON for all critical tables
SELECT 
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('events', 'model_castings', 'ai_agent_logs')
  AND rowsecurity = false; -- Should return 0 rows
```

**✅ Pass Criteria:** Zero tables without RLS enabled

---

### ✅ Complete RLS Policies

**Requirement:** All tables have policies for SELECT, INSERT, UPDATE, DELETE.

```sql
-- Check all policies exist
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('events', 'model_castings')
GROUP BY tablename;
```

**✅ Pass Criteria:** 
- `events`: ≥ 4 policies (organizers + admins)
- `model_castings`: ≥ 2 policies (organizers + admins)

---

### ✅ JWT Verification

**Requirement:** All edge functions require authentication.

```toml
# supabase/config.toml
[functions.model-casting-agent]
verify_jwt = true  # ✅ MUST be true

[functions.runway-timing-agent]
verify_jwt = true  # ✅ MUST be true

[functions.vendor-coordinator-agent]
verify_jwt = true  # ✅ MUST be true

[functions.event-health-scorer]
verify_jwt = true  # ✅ MUST be true
```

**✅ Pass Criteria:** All AI functions have `verify_jwt = true`

---

### ✅ No Exposed Secrets

**Requirement:** Service role keys never sent to client.

```typescript
// ❌ NEVER DO THIS
const response = await fetch("...", {
  headers: {
    "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") // BAD!
  }
});

// ✅ CORRECT (edge functions auto-inject auth)
const response = await fetch(LOVABLE_AI_GATEWAY, {
  headers: {
    "Authorization": `Bearer ${req.headers.get("authorization")?.replace("Bearer ", "")}`
  }
});
```

**✅ Pass Criteria:** Code review confirms no service role keys sent to client

---

### ✅ CORS Configuration

**Requirement:** CORS not set to wildcard (`*`) in production.

```typescript
// ❌ NOT FOR PRODUCTION
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Too permissive!
};

// ✅ PRODUCTION-READY
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://fashionistas100.lovable.app",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

**✅ Pass Criteria:** CORS set to specific domain(s) only

---

## Functionality Gates

### ✅ End-to-End AI Workflow

**Test Flow:**
1. Sign in as organizer
2. Create or select an event
3. Click "Generar Recomendaciones" in Model Casting panel
4. Wait for AI response
5. Verify recommendations appear with match scores
6. Check `ai_agent_logs` table has entry

**✅ Pass Criteria:** Complete workflow works without errors

---

### ✅ Zod Validation

**Requirement:** All AI outputs validated with Zod schemas.

```typescript
// ✅ All functions must have this pattern
const outputSchema = z.object({
  recommendations: z.array(z.object({
    model_name: z.string(),
    match_score: z.number().min(0).max(100),
    // ... other fields
  }))
});

try {
  const validated = outputSchema.parse(aiResponse);
} catch (error) {
  // Handle validation failure
}
```

**✅ Pass Criteria:** All edge functions use Zod validation

---

### ✅ Error Handling

**Requirement:** All error codes handled gracefully.

**Test Cases:**
- [ ] 401 Unauthorized → "Inicia sesión para continuar"
- [ ] 429 Rate Limit → "Límite alcanzado. Espera un minuto."
- [ ] 402 No Credits → "Créditos agotados. Agrega créditos."
- [ ] 500 Server Error → "Error temporal. Intenta nuevamente."

**✅ Pass Criteria:** All error codes show Spanish user-friendly messages

---

## UX Gates

### ✅ Spanish i18n

**Requirement:** All user-facing text in Colombian Spanish.

```json
// Verify all keys exist in es-CO.json
{
  "ai": {
    "modelCasting": { "title": "...", "generate": "..." },
    "runwayTiming": { "title": "...", "generate": "..." },
    "vendorCoordinator": { "title": "...", "generate": "..." },
    "eventHealth": { "title": "...", "generate": "..." }
  }
}
```

**✅ Pass Criteria:** No hardcoded English text in UI components

---

### ✅ Mobile Responsiveness

**Test Devices:**
- iPhone SE (375px) - Small mobile
- iPad (768px) - Tablet
- Desktop (1440px) - Large screen

**Checklist:**
- [ ] Cards stack vertically on mobile
- [ ] Buttons full-width on mobile
- [ ] Text readable without zoom
- [ ] Touch targets ≥ 44px
- [ ] No horizontal scroll

**✅ Pass Criteria:** Works perfectly on all 3 device sizes

---

### ✅ Loading States

**Requirement:** Loading indicators on all async operations.

```tsx
// ✅ All AI panels must show loading state
{loading ? (
  <>
    <Loader2 className="animate-spin" />
    <span>Generando...</span>
  </>
) : (
  'Generar'
)}
```

**✅ Pass Criteria:** No operation without loading indicator

---

### ✅ Error Messages

**Requirement:** All errors show helpful Spanish messages.

```tsx
// ✅ User-friendly error handling
toast({
  title: 'Error al Generar',
  description: 'No se pudo conectar con el servicio de IA. Intenta nuevamente en un momento.',
  variant: 'destructive'
});

// ❌ NOT user-friendly
toast({
  title: 'Error',
  description: error.message, // Could be technical gibberish
});
```

**✅ Pass Criteria:** All errors explain what happened and next steps

---

## Observability Gates

### ✅ Logging to ai_agent_logs

**Requirement:** All AI operations logged to database.

```sql
-- Verify recent operations logged
SELECT COUNT(*) 
FROM ai_agent_logs 
WHERE created_at > NOW() - INTERVAL '1 hour';
```

**✅ Pass Criteria:** Logs appear for all test AI operations

---

### ✅ Health Check Endpoint

**Requirement:** Can monitor AI function health.

```bash
# Health check should return 200 OK
curl https://YOUR_PROJECT.supabase.co/functions/v1/health-check
```

**✅ Pass Criteria:** Health endpoint returns current status of all agents

---

### ✅ Error Rate Monitoring

**Requirement:** Can query error rates.

```sql
-- Error rate should be < 5%
SELECT 
  agent_type,
  COUNT(*) FILTER (WHERE success = false) * 100.0 / COUNT(*) as error_rate
FROM ai_agent_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY agent_type;
```

**✅ Pass Criteria:** All agents have < 5% error rate in last 24h

---

## Performance Gates

### ✅ Latency Requirements

**Requirement:** p95 latency < 3 seconds.

```sql
-- Check p95 latency
SELECT 
  agent_type,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) as p95_latency
FROM ai_agent_logs
WHERE success = true
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY agent_type;
```

**✅ Pass Criteria:** All agents p95 < 3000ms

---

### ✅ Concurrency Testing

**Requirement:** Handles 10 concurrent requests without errors.

```bash
# Load test with Apache Bench
ab -n 100 -c 10 -H "Authorization: Bearer JWT" \
  -p request.json -T application/json \
  https://YOUR_PROJECT.supabase.co/functions/v1/model-casting-agent
```

**✅ Pass Criteria:** 
- 0% error rate
- All requests complete within 10s
- No database deadlocks

---

## Accessibility Gates

### ✅ WCAG 2.1 AA Compliance

**Test with axe DevTools or WAVE:**

- [ ] Color contrast ≥ 4.5:1 for normal text
- [ ] Color contrast ≥ 3:1 for large text
- [ ] All images have alt text
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Form labels associated with inputs
- [ ] Focus indicators visible
- [ ] Keyboard navigation works

**✅ Pass Criteria:** Zero critical accessibility issues

---

### ✅ Screen Reader Support

**Test with VoiceOver (macOS) or NVDA (Windows):**

- [ ] Page title announced
- [ ] Headings announced correctly
- [ ] Button purposes clear
- [ ] Loading states announced
- [ ] Error messages announced
- [ ] Results announced with count

**✅ Pass Criteria:** All key actions navigable by screen reader

---

## Documentation Gates

### ✅ User Guide

**Requirement:** Guide explaining how to use AI features.

**Must Include:**
- What each AI agent does
- How to generate recommendations
- How to interpret results
- What to do if errors occur
- How to contact support

**✅ Pass Criteria:** User guide complete and in Spanish

---

### ✅ Support Training

**Requirement:** Support team trained on common issues.

**Training Checklist:**
- [ ] How to check ai_agent_logs for debugging
- [ ] How to interpret error codes (429, 402, 500)
- [ ] How to verify RLS policies
- [ ] How to check function logs in Supabase
- [ ] Escalation path for critical issues

**✅ Pass Criteria:** Support team completed training checklist

---

## Rollback Plan Gate

### ✅ Rollback Procedure Documented

**Requirement:** Clear steps to revert changes if critical issues found.

**Rollback Steps:**
1. Revert edge function to previous version
2. Disable feature flag in UI
3. Restore previous database policies (if changed)
4. Notify users of temporary downtime
5. Investigate and fix issue
6. Re-deploy with fix

**✅ Pass Criteria:** Rollback plan tested in staging

---

## Final Launch Checklist

### Before Deploying to Production

- [ ] **Security:** All 5 security gates passed
- [ ] **Functionality:** All 3 functionality gates passed
- [ ] **UX:** All 4 UX gates passed
- [ ] **Observability:** All 3 observability gates passed
- [ ] **Performance:** All 2 performance gates passed
- [ ] **Accessibility:** All 2 accessibility gates passed
- [ ] **Documentation:** All 2 documentation gates passed
- [ ] **Rollback Plan:** Rollback procedure tested

**Total Gates:** 22 must pass ✅

---

## Post-Launch Monitoring (First 48 Hours)

### Critical Metrics to Watch

1. **Error Rate:** Should stay < 5%
   ```sql
   SELECT COUNT(*) FILTER (WHERE success = false) * 100.0 / COUNT(*)
   FROM ai_agent_logs 
   WHERE created_at > NOW() - INTERVAL '1 hour';
   ```

2. **Latency:** p95 should stay < 3s
   ```sql
   SELECT PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms)
   FROM ai_agent_logs 
   WHERE success = true AND created_at > NOW() - INTERVAL '1 hour';
   ```

3. **User Adoption:** Track usage
   ```sql
   SELECT COUNT(DISTINCT event_id) as unique_events_using_ai
   FROM ai_agent_logs 
   WHERE created_at > NOW() - INTERVAL '24 hours';
   ```

---

**Version:** 1.0  
**Last Updated:** January 2025
