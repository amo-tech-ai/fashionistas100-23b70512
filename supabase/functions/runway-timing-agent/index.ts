import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TimingRequest {
  event_id: string;
  designers: Array<{
    name: string;
    looks_count: number;
    time_per_look?: number; // seconds
  }>;
  buffer_time?: number; // minutes between designers
}

interface DesignerSlot {
  designer_name: string;
  slot_start: string; // HH:MM format
  slot_end: string;
  looks_count: number;
  backstage_time: string;
}

interface Transition {
  from_designer: string;
  to_designer: string;
  duration_minutes: number;
  type: string;
}

interface BackstageCall {
  designer: string;
  call_time: string;
  notes: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const { event_id, designers, buffer_time = 5 } = await req.json() as TimingRequest;

    if (!event_id || !designers || designers.length === 0) {
      throw new Error("event_id and designers array are required");
    }

    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, title, start_datetime, end_datetime, description")
      .eq("id", event_id)
      .single();

    if (eventError || !event) {
      throw new Error(`Event not found: ${eventError?.message}`);
    }

    // Build AI prompt
    const prompt = `You are a professional runway show timing coordinator for Colombian fashion events.

EVENT: ${event.title}
START TIME: ${event.start_datetime}
DESIGNERS: ${designers.map(d => `${d.name} (${d.looks_count} looks)`).join(", ")}
BUFFER TIME: ${buffer_time} minutes between designers
TIME PER LOOK: ~45-60 seconds runway walk

Create an optimized runway schedule that:
1. Allows proper backstage preparation time (30 min before show)
2. Includes buffer time for transitions
3. Maintains show momentum (no long gaps)
4. Provides backstage call times (when models/designers should arrive)
5. Accounts for setup and finale

Provide reasoning for your optimization choices.`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an expert runway show timing coordinator. Respond using the provided tool." },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_runway_schedule",
              description: "Generate optimized runway schedule with designer slots, transitions, and backstage calls",
              parameters: {
                type: "object",
                properties: {
                  schedule_name: {
                    type: "string",
                    description: "Name for this schedule (e.g., 'Main Show Schedule')"
                  },
                  total_duration_minutes: {
                    type: "integer",
                    description: "Total show duration in minutes"
                  },
                  designers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        designer_name: { type: "string" },
                        slot_start: { type: "string", description: "HH:MM format" },
                        slot_end: { type: "string", description: "HH:MM format" },
                        looks_count: { type: "integer" },
                        backstage_time: { type: "string", description: "HH:MM format" }
                      },
                      required: ["designer_name", "slot_start", "slot_end", "looks_count", "backstage_time"],
                      additionalProperties: false
                    }
                  },
                  transitions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        from_designer: { type: "string" },
                        to_designer: { type: "string" },
                        duration_minutes: { type: "integer" },
                        type: { type: "string", description: "e.g., 'music_change', 'lighting_setup'" }
                      },
                      required: ["from_designer", "to_designer", "duration_minutes", "type"],
                      additionalProperties: false
                    }
                  },
                  backstage_calls: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        designer: { type: "string" },
                        call_time: { type: "string", description: "HH:MM format" },
                        notes: { type: "string" }
                      },
                      required: ["designer", "call_time", "notes"],
                      additionalProperties: false
                    }
                  },
                  optimization_score: {
                    type: "integer",
                    description: "Score 0-100 for schedule efficiency",
                    minimum: 0,
                    maximum: 100
                  },
                  reasoning: {
                    type: "string",
                    description: "Explanation of timing choices and optimizations"
                  }
                },
                required: ["schedule_name", "total_duration_minutes", "designers", "transitions", "backstage_calls", "optimization_score", "reasoning"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_runway_schedule" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      
      if (aiResponse.status === 429) {
        await logAgentOperation(supabase, event_id, "runway_timing", false, "Rate limit exceeded", Date.now() - startTime);
        return new Response(
          JSON.stringify({ error: "rate_limit", message: "Límite de solicitudes excedido. Intenta de nuevo en unos minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (aiResponse.status === 402) {
        await logAgentOperation(supabase, event_id, "runway_timing", false, "Credits exhausted", Date.now() - startTime);
        return new Response(
          JSON.stringify({ error: "credits_exhausted", message: "Créditos AI agotados. Por favor recarga tu cuenta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${aiResponse.status} - ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const scheduleData = JSON.parse(toolCall.function.arguments);

    // Insert schedule into database
    const { data: schedule, error: insertError } = await supabase
      .from("runway_schedules")
      .insert({
        event_id,
        schedule_name: scheduleData.schedule_name,
        total_duration_minutes: scheduleData.total_duration_minutes,
        designers: scheduleData.designers,
        transitions: scheduleData.transitions,
        backstage_calls: scheduleData.backstage_calls,
        ai_optimization_score: scheduleData.optimization_score,
        ai_reasoning: scheduleData.reasoning,
        status: "draft"
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    // Log success
    const tokensUsed = aiData.usage?.total_tokens || 0;
    await logAgentOperation(
      supabase,
      event_id,
      "runway_timing",
      true,
      null,
      Date.now() - startTime,
      tokensUsed,
      { schedule_id: schedule.id }
    );

    return new Response(
      JSON.stringify({
        success: true,
        schedule,
        tokens_used: tokensUsed
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in runway-timing-agent:", error);
    
    await logAgentOperation(
      supabase,
      null,
      "runway_timing",
      false,
      error instanceof Error ? error.message : "Unknown error",
      Date.now() - startTime
    );

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function logAgentOperation(
  supabase: any,
  event_id: string | null,
  agent_type: string,
  success: boolean,
  error_message: string | null,
  latency_ms: number,
  tokens_used: number = 0,
  output_data: any = null
) {
  await supabase.from("ai_agent_logs").insert({
    agent_type,
    event_id,
    operation: "generate_schedule",
    model: "google/gemini-2.5-flash",
    success,
    error_message,
    latency_ms,
    tokens_used,
    output_data
  });
}
