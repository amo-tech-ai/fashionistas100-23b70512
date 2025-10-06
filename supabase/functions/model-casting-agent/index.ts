import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CastingRequest {
  event_id: string;
  requirements: string;
}

interface ModelRecommendation {
  model_name: string;
  agency?: string;
  email: string;
  phone?: string;
  match_score: number;
  reasoning: string;
  contact_priority: 'high' | 'medium' | 'low';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const { event_id, requirements } = await req.json() as CastingRequest;

    if (!event_id || !requirements) {
      return new Response(
        JSON.stringify({ error: 'event_id and requirements are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get event details
    const { data: event, error: eventError } = await supabaseClient
      .from('events')
      .select('title, description, start_datetime, metadata')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      throw new Error('Event not found');
    }

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an AI fashion show casting assistant. Generate model recommendations based on event requirements. Always respond with valid JSON matching the schema.`
          },
          {
            role: 'user',
            content: `Event: ${event.title}\nRequirements: ${requirements}\n\nGenerate 5-8 model recommendations for this Colombian fashion show.`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_model_recommendations',
              description: 'Generate model casting recommendations',
              parameters: {
                type: 'object',
                properties: {
                  recommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        model_name: { type: 'string' },
                        agency: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        match_score: { type: 'integer', minimum: 0, maximum: 100 },
                        reasoning: { type: 'string' },
                        contact_priority: { type: 'string', enum: ['high', 'medium', 'low'] }
                      },
                      required: ['model_name', 'email', 'match_score', 'reasoning', 'contact_priority']
                    }
                  }
                },
                required: ['recommendations']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'generate_model_recommendations' } }
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API error: ${aiResponse.status} ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const recommendations: ModelRecommendation[] = JSON.parse(toolCall.function.arguments).recommendations;

    // Save to model_castings table
    const castingsToInsert = recommendations.map(rec => ({
      event_id,
      model_name: rec.model_name,
      agency: rec.agency,
      email: rec.email,
      phone: rec.phone,
      status: 'invited',
      ai_match_score: rec.match_score,
      ai_reasoning: rec.reasoning
    }));

    const { error: insertError } = await supabaseClient
      .from('model_castings')
      .insert(castingsToInsert);

    if (insertError) {
      console.error('Insert error:', insertError);
    }

    // Log to ai_agent_logs (service role only)
    const latency = Date.now() - startTime;
    await supabaseClient.from('ai_agent_logs').insert({
      agent_type: 'model_casting',
      event_id,
      operation: 'generate_recommendations',
      model: 'google/gemini-2.5-flash',
      input_data: { requirements },
      output_data: { recommendations },
      tokens_used: aiData.usage?.total_tokens || 0,
      latency_ms: latency,
      success: true
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        recommendations,
        count: recommendations.length 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error:', error);

    // Log failure
    await supabaseClient.from('ai_agent_logs').insert({
      agent_type: 'model_casting',
      event_id: null,
      operation: 'generate_recommendations',
      model: 'google/gemini-2.5-flash',
      input_data: null,
      output_data: null,
      latency_ms: Date.now() - startTime,
      success: false,
      error_message: error.message
    });

    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
