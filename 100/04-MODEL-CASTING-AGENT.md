# FashionOS AI - Model Casting Agent

Complete implementation guide for the Model Casting AI Agent.

---

## Overview

**Purpose:** Generate AI-powered model recommendations for fashion events based on requirements.

**Tech Stack:**
- Lovable AI Gateway (google/gemini-2.5-flash)
- Supabase Edge Function
- TypeScript + Zod validation
- Spanish i18n support

---

## Edge Function Implementation

### File Location

```
supabase/functions/model-casting-agent/index.ts
```

### Complete Code

See **100-plan/ai-event-planning/06-PRODUCTION-AUDIT.md** (lines 234-462) for the complete edge function code.

**Key Features:**
- ✅ JWT authentication (`verify_jwt = true`)
- ✅ Function calling with structured output
- ✅ Zod validation for type safety
- ✅ Comprehensive error handling (429, 402, 500)
- ✅ Logging to `ai_agent_logs` table
- ✅ Spanish error messages

---

## System Prompt

```typescript
const systemPrompt = `You are an expert fashion event model casting agent for Colombia.

Your task is to recommend models based on:
- Event type (runway, editorial, commercial)
- Physical requirements (height, measurements, age range)
- Experience level needed
- Budget constraints
- Timeline urgency

Provide 5-8 recommendations with:
- Match score (0-100) based on fit
- Clear reasoning for each recommendation
- Contact priority (high/medium/low)
- Agency information when relevant

Consider Colombian fashion market specifics:
- Local agencies (Stock Models, Elite Colombia, etc.)
- Regional diversity
- Spanish language communication
- WhatsApp as primary contact method`;
```

---

## Input Schema

```typescript
const inputSchema = z.object({
  event_id: z.string().uuid(),
  requirements: z.string().min(10).max(2000),
});
```

**Example Request:**

```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "requirements": "Need 5 runway models, 175cm+, professional experience, available Dec 15-20"
}
```

---

## Output Schema

```typescript
const outputSchema = z.object({
  recommendations: z.array(
    z.object({
      model_name: z.string(),
      agency: z.string().optional(),
      match_score: z.number().min(0).max(100),
      reasoning: z.string(),
      contact_priority: z.enum(["high", "medium", "low"]),
    })
  ),
});
```

**Example Response:**

```json
{
  "recommendations": [
    {
      "model_name": "María González",
      "agency": "Stock Models Colombia",
      "match_score": 95,
      "reasoning": "Experienced runway model, 178cm, perfect fit for luxury fashion show. Available on requested dates.",
      "contact_priority": "high"
    },
    {
      "model_name": "Andrea Martínez",
      "agency": "Elite Model Management",
      "match_score": 88,
      "reasoning": "Strong editorial background, meets height requirement (176cm). Consider for opening or closing looks.",
      "contact_priority": "high"
    }
  ]
}
```

---

## UI Component

### Component Location

```
src/components/events/AIModelCastingPanel.tsx
```

### Key Features

```typescript
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
  
  const generateRecommendations = async () => {
    const { data, error } = await supabase.functions.invoke('model-casting-agent', {
      body: { event_id: eventId, requirements: '...' }
    });
    
    // Handle rate limits and credit exhaustion
    if (error?.message?.includes('Rate limit')) {
      toast({ title: 'Límite de Uso Alcanzado', ... });
    }
    if (error?.message?.includes('credits')) {
      toast({ title: 'Créditos de IA Agotados', ... });
    }
  };
  
  // ... rest of component
}
```

---

## Integration Steps

### 1. Add to Event Detail Page

```tsx
// src/pages/EventDetail.tsx
import { AIModelCastingPanel } from '@/components/events/AIModelCastingPanel';

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <aside className="lg:col-span-1">
    <AIModelCastingPanel eventId={eventId} />
  </aside>
  
  <main className="lg:col-span-2">
    {/* Existing event details */}
  </main>
</div>
```

### 2. Spanish Translations

Add to `src/i18n/locales/es-CO.json`:

```json
{
  "ai": {
    "modelCasting": {
      "title": "Asistente IA - Casting",
      "generate": "Generar Recomendaciones",
      "generating": "Generando...",
      "rateLimitError": "Límite de uso alcanzado. Espera un minuto.",
      "creditError": "Créditos de IA agotados. Agrega créditos.",
      "success": "Recomendaciones generadas",
      "error": "No se pudo generar recomendaciones"
    }
  }
}
```

---

## Testing Checklist

### Functional Tests
- [ ] Can generate recommendations with valid input
- [ ] Handles missing event_id gracefully
- [ ] Handles empty requirements string
- [ ] Returns 5-8 recommendations
- [ ] Match scores are 0-100
- [ ] Contact priority is high/medium/low

### Error Handling Tests
- [ ] Rate limit (429) shows Spanish error message
- [ ] Credit exhaustion (402) shows Spanish error message
- [ ] Invalid UUID shows validation error
- [ ] Network failure shows retry option

### UI Tests
- [ ] Loading spinner shows during AI call
- [ ] Results display in cards
- [ ] Mobile view works correctly
- [ ] Spanish labels are correct
- [ ] Toast notifications appear

### Performance Tests
- [ ] Response time < 3 seconds (p95)
- [ ] Multiple concurrent calls work
- [ ] Logs appear in ai_agent_logs table

---

## Monitoring Queries

### Recent Operations

```sql
SELECT 
  created_at,
  operation,
  success,
  latency_ms,
  tokens_used,
  error_message
FROM ai_agent_logs
WHERE agent_type = 'model_casting'
ORDER BY created_at DESC
LIMIT 20;
```

### Success Rate (Last 24h)

```sql
SELECT 
  COUNT(*) FILTER (WHERE success = true) as successes,
  COUNT(*) FILTER (WHERE success = false) as failures,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE success = true) / COUNT(*),
    2
  ) as success_rate
FROM ai_agent_logs
WHERE agent_type = 'model_casting'
  AND created_at > NOW() - INTERVAL '24 hours';
```

### Average Latency

```sql
SELECT 
  AVG(latency_ms) as avg_latency,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) as p95_latency,
  MAX(latency_ms) as max_latency
FROM ai_agent_logs
WHERE agent_type = 'model_casting'
  AND success = true
  AND created_at > NOW() - INTERVAL '24 hours';
```

---

## Common Issues

### Issue: Rate Limit Hit Too Often

**Symptoms:** Users see 429 errors frequently  
**Solution:** Implement client-side debouncing (1 call per minute per user)

### Issue: Low Match Scores

**Symptoms:** All recommendations < 70% match  
**Solution:** Refine system prompt with more specific criteria

### Issue: Generic Recommendations

**Symptoms:** Same models suggested for different events  
**Solution:** Add event context to prompt (type, budget, location)

---

**Version:** 1.0  
**Last Updated:** January 2025
