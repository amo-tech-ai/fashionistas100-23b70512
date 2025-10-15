# FashionOS AI - Testing Checklist

Comprehensive testing guide before production launch.

---

## Database Tests

### RLS Policies

```sql
-- Test as authenticated organizer
SET request.jwt.claims.sub = 'USER_UUID';

-- ✅ Should succeed: Insert own event casting
INSERT INTO model_castings (event_id, model_name, email, ai_match_score)
VALUES ('YOUR_EVENT_ID', 'Test Model', 'test@example.com', 90);

-- ❌ Should fail: Insert casting for another organizer's event
INSERT INTO model_castings (event_id, model_name, email, ai_match_score)
VALUES ('OTHER_EVENT_ID', 'Test Model', 'test@example.com', 90);

-- ✅ Should succeed: Read own castings
SELECT * FROM model_castings WHERE event_id = 'YOUR_EVENT_ID';

-- ❌ Should fail: Read ai_agent_logs as public user
SELECT * FROM ai_agent_logs; -- Expected: empty result
```

### Indexes Performance

```sql
-- Verify indexes are used (should show "Index Scan")
EXPLAIN ANALYZE 
SELECT * FROM model_castings WHERE event_id = 'YOUR_EVENT_ID';

-- Check query performance (< 10ms expected)
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM ai_agent_logs 
WHERE agent_type = 'model_casting' 
ORDER BY created_at DESC 
LIMIT 20;
```

---

## AI Function Tests

### Functional Tests

**Test Case 1: Valid Input**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/model-casting-agent \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "VALID_UUID",
    "requirements": "Need 5 runway models, 175cm+, professional experience"
  }'
```
**Expected:** 200 OK, 5-8 recommendations with match scores

**Test Case 2: Missing Event ID**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/model-casting-agent \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{ "requirements": "Some requirements" }'
```
**Expected:** 400 Bad Request, validation error

**Test Case 3: Empty Requirements**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/model-casting-agent \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{ "event_id": "VALID_UUID", "requirements": "" }'
```
**Expected:** 400 Bad Request, validation error

**Test Case 4: No Authorization**
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/model-casting-agent \
  -H "Content-Type: application/json" \
  -d '{ "event_id": "VALID_UUID", "requirements": "Test" }'
```
**Expected:** 401 Unauthorized

### Error Handling Tests

**Test Rate Limit (429)**
- Make 10 requests in < 1 minute
- **Expected:** 429 after 5th request, Spanish error message

**Test Credit Exhaustion (402)**
- Exhaust AI credits (contact Lovable support for test mode)
- **Expected:** 402, "Créditos agotados" message

**Test Network Failure**
- Disconnect internet during AI call
- **Expected:** Timeout after 60s, retry suggestion

---

## UI Tests

### Loading States

- [ ] Spinner shows immediately on button click
- [ ] Button disabled during loading
- [ ] Loading text says "Generando..." (Spanish)
- [ ] No layout shift when results appear
- [ ] Loading state clears after success or error

### Result Display

- [ ] Results appear in cards
- [ ] Match scores display correctly (0-100)
- [ ] Priority badges show correct colors
- [ ] Spanish labels are correct
- [ ] Long text doesn't break layout
- [ ] Empty state shows when no results

### Error Handling

- [ ] Rate limit toast appears (Spanish)
- [ ] Credit exhaustion toast appears (Spanish)
- [ ] Generic errors show user-friendly message
- [ ] Error details not exposed to end user
- [ ] Toast auto-dismisses after 5 seconds

### Mobile Tests

**Test on 3 Devices:**
1. iPhone SE (375px)
2. iPad (768px)
3. Desktop (1440px)

**Checklist:**
- [ ] Cards stack vertically on mobile
- [ ] Touch targets ≥ 44px
- [ ] Text readable without zoom
- [ ] Buttons full-width on mobile
- [ ] No horizontal scroll
- [ ] Images/icons scale properly

---

## Performance Tests

### Latency

```sql
-- Check AI response times (p95 should be < 3s)
SELECT 
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY latency_ms) as p50,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) as p95,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY latency_ms) as p99,
  MAX(latency_ms) as max
FROM ai_agent_logs
WHERE agent_type = 'model_casting'
  AND success = true
  AND created_at > NOW() - INTERVAL '24 hours';
```

**Expected Results:**
- p50: < 1500ms
- p95: < 3000ms
- p99: < 5000ms
- max: < 10000ms

### Concurrency

```bash
# Use Apache Bench or similar
ab -n 100 -c 10 -H "Authorization: Bearer YOUR_JWT" \
  -p request.json -T application/json \
  https://YOUR_PROJECT.supabase.co/functions/v1/model-casting-agent
```

**Expected:**
- No 500 errors
- All requests complete within 10s
- No database deadlocks

---

## Accessibility Tests

### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Enter key activates buttons
- [ ] Focus indicators visible
- [ ] Skip to content link works
- [ ] No keyboard traps

### Screen Reader Tests

**Test with VoiceOver (macOS) or NVDA (Windows):**

- [ ] Page title announced correctly
- [ ] Headings in logical order (h1, h2, h3)
- [ ] Button purposes clear
- [ ] Loading states announced
- [ ] Error messages announced
- [ ] Results announced with count

### Color Contrast

```bash
# Use axe DevTools or WAVE
# All text should pass WCAG 2.1 AA
```

**Required Ratios:**
- Normal text: ≥ 4.5:1
- Large text: ≥ 3:1
- Interactive elements: ≥ 3:1

---

## Security Tests

### Authentication

- [ ] Unauthenticated requests rejected (401)
- [ ] Expired JWT rejected (401)
- [ ] Wrong JWT signature rejected (401)
- [ ] Service role key NOT exposed to client
- [ ] CORS not set to `*` in production

### Authorization

- [ ] Users can only access their own events
- [ ] Admins can access all events
- [ ] ai_agent_logs not readable by public
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized

### Data Validation

- [ ] UUID validation works
- [ ] String length limits enforced
- [ ] Enum values validated
- [ ] JSONB structure validated
- [ ] Zod schemas catch malformed data

---

## Integration Tests

### End-to-End User Flow

**Organizer Creates Event & Gets AI Recommendations:**

1. Sign in as organizer
2. Create new event
3. Navigate to event detail page
4. Click "Generar Recomendaciones" in AI panel
5. Wait for AI response (< 3s)
6. Verify results display correctly
7. Click "Contactar" on a recommendation
8. Verify WhatsApp/Email action works

**Expected:** No errors, smooth flow, Spanish UI

---

## Monitoring Tests

### Log Verification

```sql
-- Verify all operations logged
SELECT COUNT(*) 
FROM ai_agent_logs 
WHERE created_at > NOW() - INTERVAL '1 hour';

-- Should have entries for recent tests
```

### Error Rate

```sql
-- Error rate should be < 5%
SELECT 
  COUNT(*) FILTER (WHERE success = false) * 100.0 / COUNT(*) as error_rate
FROM ai_agent_logs
WHERE created_at > NOW() - INTERVAL '24 hours';
```

**Expected:** < 5% error rate

---

## Rollback Plan

### If Critical Issues Found

1. **Revert edge function deployment:**
   ```bash
   supabase functions deploy model-casting-agent --version PREVIOUS_VERSION
   ```

2. **Disable feature in UI:**
   ```tsx
   // Add feature flag
   const AI_FEATURES_ENABLED = false;
   
   {AI_FEATURES_ENABLED && <AIModelCastingPanel />}
   ```

3. **Disable table writes:**
   ```sql
   -- Block all writes to model_castings
   DROP POLICY "organizers_manage_castings" ON model_castings;
   CREATE POLICY "readonly" ON model_castings FOR SELECT USING (true);
   ```

---

## Pre-Launch Checklist

### Must Pass Before Production

- [ ] All database RLS policies tested
- [ ] All AI functions return valid output
- [ ] Error handling tested (429, 402, 500)
- [ ] Mobile UI tested on 3 devices
- [ ] Spanish i18n complete and correct
- [ ] Loading states work everywhere
- [ ] Accessibility audit passed (axe/WAVE)
- [ ] Performance: p95 latency < 3s
- [ ] Security: No exposed secrets
- [ ] Monitoring: Logs queryable
- [ ] Rollback plan documented
- [ ] Support team trained on error messages

---

**Version:** 1.0  
**Last Updated:** January 2025
