# FashionOS AI - Edge Functions Guide

Step-by-step guide to create, test, and deploy AI-powered edge functions.

---

## Overview

All AI agents follow this pattern:
1. **Authenticate** user with JWT
2. **Validate** input with Zod
3. **Call** Lovable AI Gateway with function calling
4. **Parse** structured output
5. **Log** operation to ai_agent_logs
6. **Return** formatted response

---

## Configuration

### Update config.toml

Add each new edge function to `supabase/config.toml`:

```toml
[functions.model-casting-agent]
verify_jwt = true  # Require authenticated users

[functions.runway-timing-agent]
verify_jwt = true

[functions.vendor-coordinator-agent]
verify_jwt = true

[functions.event-health-scorer]
verify_jwt = true
```

### Environment Variables

Edge functions have access to:
- `SUPABASE_URL` (auto-injected)
- `SUPABASE_ANON_KEY` (auto-injected)
- `SUPABASE_SERVICE_ROLE_KEY` (auto-injected)

---

## Lovable AI Integration

### Gateway Details

```typescript
const LOVABLE_AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash"; // FREE until Oct 13, 2025
```

### Request Format (with Function Calling)

```typescript
const response = await fetch(LOVABLE_AI_GATEWAY, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${req.headers.get("authorization")?.replace("Bearer ", "")}`,
  },
  body: JSON.stringify({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: "You are an expert fashion event model casting agent..."
      },
      {
        role: "user",
        content: `Event requirements: ${requirements}`
      }
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "generate_model_recommendations",
          description: "Generate AI-powered model casting recommendations",
          parameters: {
            type: "object",
            properties: {
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    model_name: { type: "string" },
                    agency: { type: "string" },
                    match_score: { type: "number" },
                    reasoning: { type: "string" },
                    contact_priority: { type: "string", enum: ["high", "medium", "low"] }
                  },
                  required: ["model_name", "match_score", "reasoning", "contact_priority"]
                }
              }
            },
            required: ["recommendations"]
          }
        }
      }
    ],
    tool_choice: { type: "function", function: { name: "generate_model_recommendations" } }
  })
});
```

### Response Parsing

```typescript
const aiResponse = await response.json();

// Extract function call arguments
const toolCall = aiResponse.choices[0].message.tool_calls[0];
const result = JSON.parse(toolCall.function.arguments);

// Validate with Zod
const validated = outputSchema.parse(result);
```

---

## Error Handling

### Common Error Codes

```typescript
// Rate limit exceeded
if (response.status === 429) {
  return new Response(
    JSON.stringify({ 
      error: "Rate limit exceeded. Please wait a minute." 
    }),
    { status: 429, headers: corsHeaders }
  );
}

// Insufficient credits
if (response.status === 402) {
  return new Response(
    JSON.stringify({ 
      error: "Insufficient AI credits. Please add credits to continue." 
    }),
    { status: 402, headers: corsHeaders }
  );
}

// AI Gateway error
if (!response.ok) {
  throw new Error(`AI Gateway error: ${response.status}`);
}
```

### User-Friendly Messages

```typescript
try {
  // AI call logic
} catch (error: any) {
  console.error("Error:", error);
  
  return new Response(
    JSON.stringify({ 
      error: "No se pudo generar recomendaciones. Intenta nuevamente.",
      details: error.message 
    }),
    { status: 500, headers: corsHeaders }
  );
}
```

---

## Logging to ai_agent_logs

### Success Log

```typescript
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, // Service role for logging
);

await supabaseAdmin.from("ai_agent_logs").insert({
  agent_type: "model_casting",
  event_id: eventId,
  operation: "generate_recommendations",
  model: MODEL,
  input_data: { requirements },
  output_data: validated,
  tokens_used: aiResponse.usage?.total_tokens || 0,
  latency_ms: Date.now() - startTime,
  success: true,
});
```

### Error Log

```typescript
await supabaseAdmin.from("ai_agent_logs").insert({
  agent_type: "model_casting",
  event_id: eventId,
  operation: "generate_recommendations",
  model: MODEL,
  input_data: { requirements },
  output_data: null,
  tokens_used: 0,
  latency_ms: Date.now() - startTime,
  success: false,
  error_message: error.message,
});
```

---

## Testing

### Local Testing

```bash
# Start Supabase locally
supabase start

# Serve the function
supabase functions serve model-casting-agent --no-verify-jwt

# In another terminal, test with curl
curl -X POST http://localhost:54321/functions/v1/model-casting-agent \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": "uuid-here",
    "requirements": "Need 5 runway models, 175cm+, professional experience"
  }'
```

### Get JWT Token

```typescript
// In browser console on your app
const { data: { session } } = await supabase.auth.getSession();
console.log(session?.access_token);
```

---

## Deployment

### Deploy Single Function

```bash
supabase functions deploy model-casting-agent
```

### Deploy All Functions

```bash
supabase functions deploy
```

### Verify Deployment

```bash
# Check function logs
supabase functions logs model-casting-agent

# Or view in Supabase Dashboard:
# https://supabase.com/dashboard/project/YOUR_PROJECT/functions
```

---

## CORS Configuration

### Standard Headers

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle OPTIONS request
if (req.method === "OPTIONS") {
  return new Response(null, { status: 204, headers: corsHeaders });
}
```

---

## Performance Optimization

### Tips

1. **Use streaming responses** for long-running operations
2. **Cache frequently used data** in function memory
3. **Batch database writes** when possible
4. **Use indexes** on queried columns
5. **Set reasonable timeouts** (default: 60s)

### Monitoring

```sql
-- Check average latency by agent
SELECT 
  agent_type,
  AVG(latency_ms) as avg_latency,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) as p95_latency,
  COUNT(*) as total_calls
FROM ai_agent_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
  AND success = true
GROUP BY agent_type
ORDER BY avg_latency DESC;
```

---

## Security Checklist

- [ ] `verify_jwt = true` in config.toml
- [ ] Input validation with Zod
- [ ] Use service role only for logging
- [ ] No sensitive data in error messages
- [ ] Rate limiting configured
- [ ] CORS not set to `*` in production

---

**Version:** 1.0  
**Last Updated:** January 2025
