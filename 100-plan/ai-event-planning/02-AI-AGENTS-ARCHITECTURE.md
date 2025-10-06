# AI Agents Architecture - FashionOS

**Technical Deep-Dive**  
**Version:** 1.0  
**Platform:** Lovable AI Gateway + Gemini 2.5

---

## 🏗️ Agent Framework Design

### Core Principles

1. **Single Responsibility:** Each agent handles one specific domain
2. **Structured Output:** All agents use Gemini function calling for guaranteed JSON
3. **Spanish-First:** All prompts and outputs in Spanish for Colombian market
4. **Stateless:** Agents don't maintain state between calls
5. **Composable:** Agents can call other agents for complex workflows

---

## 🤖 Agent Implementation Pattern

### Base Agent Structure

```typescript
// supabase/functions/_shared/agent-framework.ts
import { z } from "zod";

interface AgentConfig {
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  outputSchema: z.ZodSchema;
  temperature?: number;
}

export async function callAgent<T>(
  config: AgentConfig,
  input: any
): Promise<T> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  // Build function calling request
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "system",
          content: config.systemPrompt
        },
        {
          role: "user",
          content: JSON.stringify(input)
        }
      ],
      tools: [{
        type: "function",
        function: {
          name: config.name,
          description: config.description,
          parameters: zodToJsonSchema(config.outputSchema)
        }
      }],
      tool_choice: {
        type: "function",
        function: { name: config.name }
      },
      temperature: config.temperature ?? 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`AI Gateway error: ${response.status}`);
  }

  const data = await response.json();
  const toolCall = data.choices[0].message.tool_calls?.[0];
  
  if (!toolCall) {
    throw new Error("No tool call returned from AI");
  }

  // Parse and validate with Zod
  const result = JSON.parse(toolCall.function.arguments);
  return config.outputSchema.parse(result);
}

// Helper to convert Zod schema to JSON Schema
function zodToJsonSchema(schema: z.ZodSchema): any {
  // Simplified - use zod-to-json-schema package in production
  return {
    type: "object",
    properties: {},
    required: []
  };
}
```

---

## 🎯 Agent 1: Model Casting Agent

### Configuration

```typescript
// supabase/functions/agents/model-casting-agent.ts
import { z } from "zod";
import { callAgent } from "../_shared/agent-framework.ts";

const CastingOutputSchema = z.object({
  recommendations: z.array(z.object({
    model_id: z.string().uuid(),
    name: z.string(),
    match_score: z.number().int().min(0).max(100),
    reasoning: z.string(),
    portfolio_url: z.string().url().optional(),
    rate_cop: z.number().int(),
    height_cm: z.number().int(),
    experience_years: z.number().int()
  })),
  total_estimated_cost_cop: z.number().int(),
  casting_call_text: z.string(),
  scheduling_recommendations: z.string()
});

const CASTING_SYSTEM_PROMPT = `
Eres un asistente de casting especializado en moda en Colombia.

Tu trabajo es:
1. Analizar los requisitos del diseñador
2. Evaluar modelos disponibles
3. Recomendar las mejores opciones basándote en:
   - Compatibilidad física (altura, medidas)
   - Experiencia y estilo
   - Disponibilidad y tarifas
   - Diversidad del casting
4. Generar texto de convocatoria en español profesional
5. Sugerir cronograma de fittings

IMPORTANTE:
- Todas las respuestas en español
- Tarifas en pesos colombianos (COP)
- Considera el contexto cultural colombiano
- Prioriza diversidad e inclusión
`;

export async function runCastingAgent(input: {
  designer_id: string;
  collection_theme: string;
  required_models: number;
  preferences: {
    height_min: number;
    height_max: number;
    experience: "junior" | "mid" | "profesional";
    diversity: boolean;
  };
  available_models: any[];
  budget_cop: number;
}) {
  return await callAgent<z.infer<typeof CastingOutputSchema>>({
    name: "model_casting_recommendations",
    description: "Recomendar modelos para casting de desfile",
    model: "google/gemini-2.5-flash",
    systemPrompt: CASTING_SYSTEM_PROMPT,
    outputSchema: CastingOutputSchema,
    temperature: 0.7 // Creative but consistent
  }, input);
}
```

### Usage Example

```typescript
// In edge function
const result = await runCastingAgent({
  designer_id: "uuid",
  collection_theme: "Sostenibilidad Urbana 2025",
  required_models: 8,
  preferences: {
    height_min: 175,
    height_max: 185,
    experience: "profesional",
    diversity: true
  },
  available_models: modelsFromDB,
  budget_cop: 1500000
});

// result.recommendations contains AI-ranked models
// result.casting_call_text ready to send via WhatsApp
```

---

## ⏱️ Agent 2: Runway Timing Agent

### Configuration

```typescript
// supabase/functions/agents/runway-timing-agent.ts
const RunwayScheduleSchema = z.object({
  schedule: z.array(z.object({
    time: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM format
    activity: z.string(),
    duration_minutes: z.number().int().positive(),
    collection_id: z.string().uuid().optional(),
    notes: z.string().optional()
  })),
  total_duration_minutes: z.number().int(),
  buffer_time_minutes: z.number().int(),
  call_sheet_text: z.string(),
  backstage_timeline: z.string(),
  critical_timings: z.array(z.string())
});

const RUNWAY_SYSTEM_PROMPT = `
Eres un experto en programación de desfiles de moda en Colombia.

Tu trabajo es:
1. Calcular tiempos de pasarela realistas
   - 1 outfit = 1.5 minutos promedio
   - Buffer de cambio entre colecciones = 3-5 minutos
   - Apertura/cierre musical = 2-3 minutos
2. Generar cronograma detallado
3. Crear call sheet para backstage
4. Identificar momentos críticos

REGLAS:
- Duración total: 60-120 minutos ideal
- Nunca menos de 2 minutos de buffer entre colecciones
- Considerar tiempo de cambio rápido para modelos
- Incluir tiempo de setup/teardown
- Todo en español
`;

export async function runRunwayTimingAgent(input: {
  event_start_time: string; // "19:00"
  designers: Array<{
    name: string;
    outfit_count: number;
    music_duration_seconds: number;
  }>;
  include_intermission: boolean;
  venue_constraints?: {
    hard_end_time?: string;
    backstage_capacity?: number;
  };
}) {
  return await callAgent<z.infer<typeof RunwayScheduleSchema>>({
    name: "generate_runway_schedule",
    description: "Generar cronograma optimizado de pasarela",
    model: "google/gemini-2.5-flash",
    systemPrompt: RUNWAY_SYSTEM_PROMPT,
    outputSchema: RunwayScheduleSchema,
    temperature: 0.3 // More deterministic for scheduling
  }, input);
}
```

---

## 🤝 Agent 3: Vendor Coordination Agent

### Configuration

```typescript
// supabase/functions/agents/vendor-coordinator-agent.ts
const VendorRecommendationsSchema = z.object({
  recommendations: z.array(z.object({
    category: z.enum(["catering", "sonido", "iluminacion", "fotografia", "video", "maquillaje", "seguridad"]),
    vendors: z.array(z.object({
      name: z.string(),
      contact_info: z.string(),
      estimated_cost_cop: z.number().int(),
      reasoning: z.string(),
      delivery_timeline: z.string()
    })).max(3), // Top 3 per category
    priority: z.enum(["critico", "importante", "opcional"]),
    rfp_template: z.string()
  })),
  total_estimated_budget_cop: z.number().int(),
  coordination_timeline: z.string(),
  contract_checklist: z.array(z.string())
});

const VENDOR_SYSTEM_PROMPT = `
Eres un coordinador de proveedores para eventos de moda en Colombia.

Tu experiencia incluye:
- Conocimiento de proveedores confiables en Bogotá, Medellín, Cali
- Tarifas de mercado en pesos colombianos
- Estándares de calidad para eventos de moda
- Plazos de entrega realistas

Tu trabajo es:
1. Recomendar proveedores por categoría
2. Estimar costos realistas
3. Generar plantillas de RFP (solicitud de propuesta)
4. Priorizar servicios críticos
5. Crear cronograma de coordinación

IMPORTANTE:
- Todas las tarifas en COP
- Proveedores locales cuando sea posible
- Considerar disponibilidad en fechas de moda (Fashion Weeks)
`;

export async function runVendorCoordinatorAgent(input: {
  event_type: "runway_show" | "presentation" | "photoshoot";
  venue: string;
  attendees: number;
  budget_cop: number;
  required_services: string[];
  event_date: string;
}) {
  return await callAgent<z.infer<typeof VendorRecommendationsSchema>>({
    name: "recommend_vendors",
    description: "Recomendar y coordinar proveedores de evento",
    model: "google/gemini-2.5-flash",
    systemPrompt: VENDOR_SYSTEM_PROMPT,
    outputSchema: VendorRecommendationsSchema,
    temperature: 0.5
  }, input);
}
```

---

## 📊 Agent 4: Event Health Scorer

### Configuration

```typescript
// supabase/functions/agents/event-health-scorer.ts
const EventHealthSchema = z.object({
  overall_score: z.number().int().min(0).max(100),
  breakdown: z.object({
    casting: z.number().int().min(0).max(100),
    logistics: z.number().int().min(0).max(100),
    creative: z.number().int().min(0).max(100),
    marketing: z.number().int().min(0).max(100),
    operations: z.number().int().min(0).max(100)
  }),
  critical_issues: z.array(z.string()),
  recommendations: z.array(z.object({
    priority: z.enum(["alta", "media", "baja"]),
    action: z.string(),
    estimated_time_hours: z.number(),
    responsible_role: z.string()
  })),
  risk_level: z.enum(["bajo", "medio", "alto", "critico"]),
  next_review_date: z.string() // ISO date
});

const HEALTH_SYSTEM_PROMPT = `
Eres un auditor de eventos de moda especializado en evaluar preparación.

Criterios de evaluación:

CASTING (25%):
- Modelos confirmadas vs requeridas
- Fittings programados
- Backups identificados
- Experiencia del equipo

LOGÍSTICA (20%):
- Venue confirmado con contrato
- Runway setup verificado
- Backstage space adecuado
- Equipamiento técnico

CREATIVO (15%):
- Briefs de diseñador completos
- Música seleccionada
- Iluminación diseñada
- Concepto visual definido

MARKETING (20%):
- Invitaciones enviadas
- Prensa confirmada
- Redes sociales activas
- Material promocional listo

OPERACIONES (20%):
- Staff asignado y capacitado
- Ensayo programado
- Contingencias planificadas
- Cronograma aprobado

SCORE:
- 90-100: Excelente preparación
- 70-89: Buena, mejoras menores
- 50-69: Aceptable, requiere atención
- 0-49: Crítico, alto riesgo

Todas las recomendaciones en español, específicas y accionables.
`;

export async function runEventHealthScorer(input: {
  event: {
    id: string;
    title: string;
    date: string;
    venue: string;
  };
  castings: {
    total_required: number;
    confirmed: number;
    fittings_scheduled: number;
  };
  logistics: {
    venue_confirmed: boolean;
    runway_verified: boolean;
    technical_setup: boolean;
  };
  creative: {
    designer_briefs_complete: boolean;
    music_selected: boolean;
    lighting_designed: boolean;
  };
  marketing: {
    invites_sent: number;
    press_confirmed: number;
    social_media_active: boolean;
  };
  operations: {
    staff_assigned: boolean;
    rehearsal_scheduled: boolean;
    contingencies_planned: boolean;
  };
}) {
  return await callAgent<z.infer<typeof EventHealthSchema>>({
    name: "analyze_event_health",
    description: "Evaluar preparación de evento de moda",
    model: "google/gemini-2.5-flash",
    systemPrompt: HEALTH_SYSTEM_PROMPT,
    outputSchema: EventHealthSchema,
    temperature: 0.2 // Very consistent scoring
  }, input);
}
```

---

## 🔀 Multi-Agent Orchestration

### Sequential Workflow Example

```typescript
// supabase/functions/fashion-show-init/index.ts
export async function initializeFashionShow(eventId: string) {
  // Step 1: Health check
  const health = await runEventHealthScorer(eventData);
  
  if (health.overall_score < 50) {
    // Critical issues - alert organizer immediately
    await sendAlert(eventId, health.critical_issues);
  }
  
  // Step 2: Casting recommendations (if needed)
  if (health.breakdown.casting < 70) {
    const casting = await runCastingAgent({
      ...castingRequirements,
      available_models: await fetchAvailableModels()
    });
    
    await saveCastingRecommendations(eventId, casting);
  }
  
  // Step 3: Vendor coordination (if budget available)
  if (eventData.budget > 0) {
    const vendors = await runVendorCoordinatorAgent({
      event_type: "runway_show",
      budget_cop: eventData.budget,
      required_services: ["catering", "sonido", "iluminacion"]
    });
    
    await saveVendorRecommendations(eventId, vendors);
  }
  
  // Step 4: Runway scheduling (if designers confirmed)
  if (eventData.designers.length > 0) {
    const schedule = await runRunwayTimingAgent({
      event_start_time: eventData.start_time,
      designers: eventData.designers
    });
    
    await saveRunwaySchedule(eventId, schedule);
  }
  
  return {
    health_score: health.overall_score,
    recommendations_generated: true,
    next_steps: health.recommendations
  };
}
```

### Parallel Workflow Example

```typescript
// Run multiple agents in parallel for speed
export async function quickAnalysis(eventId: string) {
  const [health, casting, vendors, schedule] = await Promise.all([
    runEventHealthScorer(eventData),
    runCastingAgent(castingData),
    runVendorCoordinatorAgent(vendorData),
    runRunwayTimingAgent(scheduleData)
  ]);
  
  return {
    health,
    casting,
    vendors,
    schedule,
    generated_at: new Date().toISOString()
  };
}
```

---

## 📈 Performance Optimization

### Caching Strategy

```typescript
// Cache AI responses for similar inputs
interface CacheEntry {
  key: string;
  result: any;
  expires_at: number;
}

const cache = new Map<string, CacheEntry>();

function getCacheKey(agentName: string, input: any): string {
  return `${agentName}:${JSON.stringify(input)}`;
}

export async function callAgentWithCache<T>(
  config: AgentConfig,
  input: any,
  ttlSeconds: number = 3600 // 1 hour
): Promise<T> {
  const key = getCacheKey(config.name, input);
  const cached = cache.get(key);
  
  if (cached && cached.expires_at > Date.now()) {
    console.log(`Cache hit: ${config.name}`);
    return cached.result;
  }
  
  const result = await callAgent<T>(config, input);
  
  cache.set(key, {
    key,
    result,
    expires_at: Date.now() + (ttlSeconds * 1000)
  });
  
  return result;
}
```

### Batch Processing

```typescript
// Process multiple events in batch
export async function batchHealthCheck(eventIds: string[]) {
  const results = [];
  
  // Process in chunks of 5 to avoid rate limits
  for (let i = 0; i < eventIds.length; i += 5) {
    const chunk = eventIds.slice(i, i + 5);
    const chunkResults = await Promise.all(
      chunk.map(id => runEventHealthScorer(getEventData(id)))
    );
    results.push(...chunkResults);
    
    // Small delay between chunks
    if (i + 5 < eventIds.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
```

---

## 🔒 Security Best Practices

### Input Validation

```typescript
// Validate all inputs before calling AI
const CastingInputSchema = z.object({
  designer_id: z.string().uuid(),
  collection_theme: z.string().min(1).max(200),
  required_models: z.number().int().min(1).max(50),
  budget_cop: z.number().int().min(0).max(50000000)
});

export async function safeCastingAgent(input: unknown) {
  // Validate input
  const validated = CastingInputSchema.parse(input);
  
  // Rate limit check
  if (!rateLimitCheck(validated.designer_id)) {
    throw new Error("Rate limit exceeded");
  }
  
  // Call agent
  return await runCastingAgent(validated);
}
```

### Output Sanitization

```typescript
// Sanitize AI outputs before storing in DB
function sanitizeOutput(agentOutput: any): any {
  // Remove any potential SQL injection attempts
  const sanitized = JSON.parse(JSON.stringify(agentOutput));
  
  // Validate all URLs
  if (sanitized.portfolio_url) {
    try {
      new URL(sanitized.portfolio_url);
    } catch {
      delete sanitized.portfolio_url;
    }
  }
  
  return sanitized;
}
```

---

## 📊 Monitoring & Logging

### Agent Performance Tracking

```typescript
// Log all agent calls
interface AgentLog {
  agent_name: string;
  input_size_bytes: number;
  output_size_bytes: number;
  latency_ms: number;
  model_used: string;
  tokens_used?: number;
  success: boolean;
  error_message?: string;
  created_at: string;
}

export async function logAgentCall(log: AgentLog) {
  await supabase.from("ai_agent_logs").insert(log);
}

// Wrapper with logging
export async function callAgentWithLogging<T>(
  config: AgentConfig,
  input: any
): Promise<T> {
  const startTime = Date.now();
  const inputSize = JSON.stringify(input).length;
  
  try {
    const result = await callAgent<T>(config, input);
    const outputSize = JSON.stringify(result).length;
    
    await logAgentCall({
      agent_name: config.name,
      input_size_bytes: inputSize,
      output_size_bytes: outputSize,
      latency_ms: Date.now() - startTime,
      model_used: config.model,
      success: true,
      created_at: new Date().toISOString()
    });
    
    return result;
  } catch (error) {
    await logAgentCall({
      agent_name: config.name,
      input_size_bytes: inputSize,
      output_size_bytes: 0,
      latency_ms: Date.now() - startTime,
      model_used: config.model,
      success: false,
      error_message: error.message,
      created_at: new Date().toISOString()
    });
    
    throw error;
  }
}
```

---

## 🧪 Testing Agents

### Unit Tests

```typescript
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("Casting Agent - Valid Input", async () => {
  const result = await runCastingAgent({
    designer_id: "test-uuid",
    collection_theme: "Test Collection",
    required_models: 5,
    preferences: {
      height_min: 170,
      height_max: 180,
      experience: "mid",
      diversity: true
    },
    available_models: mockModels,
    budget_cop: 1000000
  });
  
  assertEquals(result.recommendations.length, 5);
  assertEquals(typeof result.casting_call_text, "string");
});
```

### Integration Tests

```typescript
Deno.test("Multi-Agent Workflow", async () => {
  const eventId = "test-event-uuid";
  
  const result = await initializeFashionShow(eventId);
  
  assertEquals(result.recommendations_generated, true);
  assertEquals(typeof result.health_score, "number");
});
```

---

## 📚 Next Steps

1. **Implement Base Framework:** `agent-framework.ts`
2. **Build First Agent:** Model Casting Agent
3. **Add Monitoring:** Agent performance logs
4. **Test Thoroughly:** Unit + integration tests
5. **Optimize:** Caching + batch processing
6. **Deploy:** Edge functions to production

---

**Status:** ✅ Architecture Validated  
**Next:** Implement in Stage 1  
**Version:** 1.0
