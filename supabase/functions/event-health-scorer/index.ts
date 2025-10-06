import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventId } = await req.json();
    
    if (!eventId) {
      throw new Error("Event ID is required");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch event data with related information
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select(`
        *,
        event_tickets(*),
        vendor_recommendations(*),
        model_castings(*)
      `)
      .eq("id", eventId)
      .single();

    if (eventError) throw eventError;
    if (!event) throw new Error("Event not found");

    // Calculate metrics
    const now = new Date();
    const eventStart = new Date(event.start_datetime);
    const daysUntilEvent = Math.ceil((eventStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Ticket sales metrics
    const totalTickets = event.event_tickets?.reduce((sum: number, t: any) => sum + t.quantity, 0) || 0;
    const soldTickets = event.event_tickets?.reduce((sum: number, t: any) => sum + t.quantity_sold, 0) || 0;
    const ticketSalesRate = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;

    // Vendor readiness
    const totalVendors = event.vendor_recommendations?.length || 0;
    const confirmedVendors = event.vendor_recommendations?.filter((v: any) => v.status === "confirmed").length || 0;
    const vendorReadinessRate = totalVendors > 0 ? (confirmedVendors / totalVendors) * 100 : 0;

    // Model casting
    const totalModels = event.model_castings?.length || 0;
    const confirmedModels = event.model_castings?.filter((m: any) => m.status === "confirmed").length || 0;
    const modelReadinessRate = totalModels > 0 ? (confirmedModels / totalModels) * 100 : 0;

    // Build AI prompt for health assessment
    const prompt = `Analyze this fashion event and provide a health assessment:

Event: ${event.title}
Days until event: ${daysUntilEvent}
Status: ${event.status}

METRICS:
- Ticket Sales: ${soldTickets}/${totalTickets} sold (${ticketSalesRate.toFixed(1)}%)
- Vendor Readiness: ${confirmedVendors}/${totalVendors} confirmed (${vendorReadinessRate.toFixed(1)}%)
- Model Casting: ${confirmedModels}/${totalModels} confirmed (${modelReadinessRate.toFixed(1)}%)

Generate a comprehensive health score (0-100) and detailed analysis including:
1. Overall health status (excellent/good/warning/critical)
2. Individual scores for: ticket sales, timeline, vendor readiness, model casting
3. 3-5 actionable recommendations
4. Key risk factors if any

Format as JSON with structure: { overall_score, ticket_sales_score, timeline_score, vendor_readiness_score, model_casting_score, health_status, recommendations: [string], risk_factors: [string], reasoning: string }`;

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an AI event health analyst for fashion events. Always respond with valid JSON." },
          { role: "user", content: prompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "analyze_event_health",
            description: "Analyze event health and return structured assessment",
            parameters: {
              type: "object",
              properties: {
                overall_score: { type: "integer", minimum: 0, maximum: 100 },
                ticket_sales_score: { type: "integer", minimum: 0, maximum: 100 },
                timeline_score: { type: "integer", minimum: 0, maximum: 100 },
                vendor_readiness_score: { type: "integer", minimum: 0, maximum: 100 },
                model_casting_score: { type: "integer", minimum: 0, maximum: 100 },
                health_status: { type: "string", enum: ["excellent", "good", "warning", "critical"] },
                recommendations: { type: "array", items: { type: "string" } },
                risk_factors: { type: "array", items: { type: "string" } },
                reasoning: { type: "string" }
              },
              required: ["overall_score", "ticket_sales_score", "timeline_score", "vendor_readiness_score", "model_casting_score", "health_status", "recommendations", "risk_factors", "reasoning"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "analyze_event_health" } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI Response:", JSON.stringify(aiData, null, 2));

    // Extract structured data from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("AI did not return structured tool call");
    }

    const analysis = typeof toolCall.function.arguments === "string" 
      ? JSON.parse(toolCall.function.arguments)
      : toolCall.function.arguments;

    // Store health score in database
    const { data: healthScore, error: insertError } = await supabase
      .from("event_health_scores")
      .insert({
        event_id: eventId,
        organization_id: event.organization_id,
        overall_score: analysis.overall_score,
        ticket_sales_score: analysis.ticket_sales_score,
        timeline_score: analysis.timeline_score,
        vendor_readiness_score: analysis.vendor_readiness_score,
        model_casting_score: analysis.model_casting_score,
        health_status: analysis.health_status,
        ai_reasoning: analysis.reasoning,
        recommendations: analysis.recommendations,
        risk_factors: analysis.risk_factors,
        ai_model: "google/gemini-2.5-flash",
        confidence_score: 0.88
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Log to ai_agent_logs
    await supabase.from("ai_agent_logs").insert({
      agent_type: "event_health_scorer",
      operation: "analyze_event_health",
      event_id: eventId,
      model: "google/gemini-2.5-flash",
      input_data: { eventId, metrics: { ticketSalesRate, vendorReadinessRate, modelReadinessRate, daysUntilEvent } },
      output_data: analysis,
      success: true,
      tokens_used: aiData.usage?.total_tokens || 0,
      latency_ms: 0
    });

    return new Response(JSON.stringify({
      success: true,
      healthScore,
      analysis
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Event Health Scorer error:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
