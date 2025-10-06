import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ModelRecommendation {
  model_name: string;
  agency?: string;
  email: string;
  phone?: string;
  match_score: number;
  reasoning: string;
  contact_priority: 'high' | 'medium' | 'low';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const { event_id, requirements } = await req.json();

    if (!event_id) {
      throw new Error('event_id is required');
    }

    // Get event details
    const { data: event, error: eventError } = await supabaseClient
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single();

    if (eventError) throw eventError;

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
            content: 'You are a professional fashion show casting director for Colombian events. Provide realistic model recommendations with Colombian names, agencies, and contact details.'
          },
          {
            role: 'user',
            content: `Event: ${event.title}\nDate: ${event.start_datetime}\nRequirements: ${requirements || 'Professional runway models'}\n\nGenerate 5-8 model recommendations with match scores, reasoning, and contact priority.`
          }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'recommend_models',
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
                      match_score: { type: 'number', minimum: 0, maximum: 100 },
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
        }],
        tool_choice: { type: 'function', function: { name: 'recommend_models' } }
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a minute.');
      }
      if (aiResponse.status === 402) {
        throw new Error('AI credits exhausted. Please add credits to continue.');
      }
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const recommendations: ModelRecommendation[] = JSON.parse(toolCall?.function?.arguments || '{"recommendations":[]}').recommendations;

    // Save recommendations to database
    const castings = recommendations.map(rec => ({
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
      .insert(castings);

    if (insertError) {
      console.error('Insert error:', insertError);
    }

    // Log operation
    const latencyMs = Date.now() - startTime;
    await supabaseClient.from('ai_agent_logs').insert({
      agent_type: 'model_casting',
      event_id,
      operation: 'generate_recommendations',
      model: 'google/gemini-2.5-flash',
      input_data: { requirements },
      output_data: { recommendations_count: recommendations.length },
      latency_ms: latencyMs,
      success: true
    });

    return new Response(
      JSON.stringify({ success: true, recommendations, count: recommendations.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error:', error);
    
    // Log error
    const latencyMs = Date.now() - startTime;
    await supabaseClient.from('ai_agent_logs').insert({
      agent_type: 'model_casting',
      operation: 'generate_recommendations',
      model: 'google/gemini-2.5-flash',
      latency_ms: latencyMs,
      success: false,
      error_message: error.message
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: error.message.includes('Rate limit') ? 429 : 
                error.message.includes('credits') ? 402 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
