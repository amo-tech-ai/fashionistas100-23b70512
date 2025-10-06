import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VendorRequest {
  event_id: string;
  vendor_types: string[]; // e.g., ["catering", "sound", "lighting"]
  budget_cop?: number; // total budget in COP
  event_date?: string;
  guest_count?: number;
}

interface VendorRecommendation {
  vendor_name: string;
  vendor_type: string;
  contact_name: string;
  email: string;
  phone: string;
  website?: string;
  match_score: number;
  reasoning: string;
  estimated_cost_min: number; // COP
  estimated_cost_max: number; // COP
  services_offered: string[];
  portfolio_images?: string[];
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

    const { event_id, vendor_types, budget_cop, event_date, guest_count } = await req.json() as VendorRequest;

    if (!event_id || !vendor_types || vendor_types.length === 0) {
      throw new Error("event_id and vendor_types array are required");
    }

    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, title, start_datetime, description, capacity")
      .eq("id", event_id)
      .single();

    if (eventError || !event) {
      throw new Error(`Event not found: ${eventError?.message}`);
    }

    const effectiveGuestCount = guest_count || event.capacity || 100;
    const effectiveBudget = budget_cop || 5000000; // Default 5M COP

    // Build AI prompt
    const prompt = `You are a professional vendor coordinator for Colombian fashion events.

EVENT: ${event.title}
DATE: ${event_date || event.start_datetime}
GUEST COUNT: ${effectiveGuestCount}
TOTAL BUDGET: $${(effectiveBudget / 100).toLocaleString()} COP
VENDOR TYPES NEEDED: ${vendor_types.join(", ")}

Recommend vendors for each type that:
1. Are located in Colombia (Bogotá, Medellín, or Cali)
2. Have experience with fashion events
3. Fit within the budget allocation
4. Can handle the guest count
5. Are professional and reliable

For each vendor provide:
- Contact information
- Cost estimates in COP
- Services they offer
- Match reasoning

Budget allocation guidelines:
- Catering: 40% of budget
- Photography/Videography: 15-20% each
- Sound/Lighting: 10-15% each
- Other services: 5-10% each`;

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
          { role: "system", content: "You are an expert vendor coordinator for fashion events in Colombia. Respond using the provided tool." },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "recommend_vendors",
              description: "Generate vendor recommendations for fashion event services",
              parameters: {
                type: "object",
                properties: {
                  vendors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        vendor_name: { type: "string", description: "Business name" },
                        vendor_type: { 
                          type: "string",
                          enum: ["catering", "photography", "videography", "sound", "lighting", "security", "transportation", "decoration", "makeup", "hair", "printing", "other"]
                        },
                        contact_name: { type: "string", description: "Contact person name" },
                        email: { type: "string", format: "email" },
                        phone: { type: "string", description: "Colombian phone format" },
                        website: { type: "string", description: "Optional website URL" },
                        match_score: { 
                          type: "integer",
                          minimum: 0,
                          maximum: 100,
                          description: "How well they match requirements" 
                        },
                        reasoning: { 
                          type: "string",
                          description: "Why this vendor is recommended" 
                        },
                        estimated_cost_min: { 
                          type: "integer",
                          description: "Minimum cost estimate in COP" 
                        },
                        estimated_cost_max: { 
                          type: "integer",
                          description: "Maximum cost estimate in COP" 
                        },
                        services_offered: {
                          type: "array",
                          items: { type: "string" },
                          description: "List of specific services"
                        },
                        portfolio_images: {
                          type: "array",
                          items: { type: "string" },
                          description: "Optional portfolio image URLs"
                        }
                      },
                      required: ["vendor_name", "vendor_type", "contact_name", "email", "phone", "match_score", "reasoning", "estimated_cost_min", "estimated_cost_max", "services_offered"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["vendors"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "recommend_vendors" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      
      if (aiResponse.status === 429) {
        await logAgentOperation(supabase, event_id, "vendor_coordinator", false, "Rate limit exceeded", Date.now() - startTime);
        return new Response(
          JSON.stringify({ error: "rate_limit", message: "Límite de solicitudes excedido. Intenta de nuevo en unos minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (aiResponse.status === 402) {
        await logAgentOperation(supabase, event_id, "vendor_coordinator", false, "Credits exhausted", Date.now() - startTime);
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

    const vendorsData = JSON.parse(toolCall.function.arguments);

    // Insert vendor recommendations into database
    const vendorInserts = vendorsData.vendors.map((vendor: VendorRecommendation) => ({
      event_id,
      vendor_name: vendor.vendor_name,
      vendor_type: vendor.vendor_type,
      contact_name: vendor.contact_name,
      email: vendor.email,
      phone: vendor.phone,
      website: vendor.website || null,
      ai_match_score: vendor.match_score,
      ai_reasoning: vendor.reasoning,
      estimated_cost_min: vendor.estimated_cost_min * 100, // Convert to cents
      estimated_cost_max: vendor.estimated_cost_max * 100, // Convert to cents
      services_offered: vendor.services_offered,
      portfolio_images: vendor.portfolio_images || [],
      status: "recommended"
    }));

    const { data: vendors, error: insertError } = await supabase
      .from("vendor_recommendations")
      .insert(vendorInserts)
      .select();

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    // Log success
    const tokensUsed = aiData.usage?.total_tokens || 0;
    await logAgentOperation(
      supabase,
      event_id,
      "vendor_coordinator",
      true,
      null,
      Date.now() - startTime,
      tokensUsed,
      { vendor_count: vendors.length }
    );

    return new Response(
      JSON.stringify({
        success: true,
        vendors,
        count: vendors.length,
        tokens_used: tokensUsed
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in vendor-coordinator-agent:", error);
    
    await logAgentOperation(
      supabase,
      null,
      "vendor_coordinator",
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
    operation: "recommend_vendors",
    model: "google/gemini-2.5-flash",
    success,
    error_message,
    latency_ms,
    tokens_used,
    output_data
  });
}
