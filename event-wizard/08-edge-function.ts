# 8. Secure Edge Function Implementation

```typescript
// supabase/functions/wizard-session/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Extract JWT from header (CRITICAL - never trust client-provided user ID)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }), 
        { status: 401, headers: corsHeaders }
      )
    }

    const jwt = authHeader.replace('Bearer ', '')

    // 2. Create auth-bound client (respects RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      }
    })

    // 3. Verify user from JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }), 
        { status: 401, headers: corsHeaders }
      )
    }

    // 4. Parse request body
    const body = await req.json()
    const { op, sessionId, data } = body

    // 5. Execute operation based on 'op' parameter
    switch (op) {
      case 'create': {
        // Get or create session
        const { data: session, error } = await supabase.rpc(
          'wizard_get_or_create_session',
          {
            p_session_id: sessionId || crypto.randomUUID(),
            p_user_id: user.id,
            p_org_id: user.app_metadata?.organization_id
          }
        )

        if (error) {
          console.error('Session creation error:', error)
          return new Response(
            JSON.stringify({ ok: false, error: error.message }), 
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ ok: true, session }), 
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update_stage_data': {
        const { stage, stageData } = data

        // Validate stage name
        const validStages = ['organizer', 'event', 'venue', 'ticket', 'payment', 'sponsor']
        if (!validStages.includes(stage)) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Invalid stage' }), 
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Use RPC to safely merge JSONB
        const { error: mergeError } = await supabase.rpc('wizard_merge_stage_data', {
          p_session_id: sessionId,
          p_stage: stage,
          p_data: stageData
        })

        if (mergeError) {
          console.error('Merge error:', mergeError)
          return new Response(
            JSON.stringify({ ok: false, error: mergeError.message }), 
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Update progress
        const stageMap = {
          organizer: 'organizerSetup',
          event: 'eventSetup',
          venue: 'venueSetup',
          ticket: 'ticketSetup',
          payment: 'sponsorsMedia',
          sponsor: 'sponsorsMedia'
        }

        const { data: progress, error: progressError } = await supabase.rpc(
          'wizard_update_progress',
          {
            p_session_id: sessionId,
            p_stage: stageMap[stage as keyof typeof stageMap],
            p_percentage: 100
          }
        )

        if (progressError) {
          console.error('Progress error:', progressError)
        }

        // Log interaction
        await supabase.from('wizard_interactions').insert({
          session_id: sessionId,
          role: 'system',
          stage: stage,
          message: `Updated ${stage} data`
        })

        return new Response(
          JSON.stringify({ ok: true, progress: progress || 0 }), 
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'transition': {
        const { fromStage, toStage } = data

        const { error } = await supabase.rpc('wizard_transition_stage', {
          p_session_id: sessionId,
          p_from_stage: fromStage,
          p_to_stage: toStage
        })

        if (error) {
          console.error('Transition error:', error)
          return new Response(
            JSON.stringify({ ok: false, error: error.message }), 
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ ok: true }), 
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get': {
        // Get session data
        const { data: session, error } = await supabase
          .from('wizard_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single()

        if (error || !session) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Session not found' }), 
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ ok: true, session }), 
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'publish': {
        // DETERMINISTIC idempotency key (not timestamp!)
        const idempotencyKey = `publish:${sessionId}`

        // Check if already published
        const { data: existingAction } = await supabase
          .from('wizard_actions')
          .select('*')
          .eq('idempotency_key', idempotencyKey)
          .single()

        if (existingAction) {
          return new Response(
            JSON.stringify({
              ok: true,
              event: existingAction.result,
              message: 'Event already published'
            }), 
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get session
        const { data: session, error: sessionError } = await supabase
          .from('wizard_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single()

        if (sessionError || !session) {
          return new Response(
            JSON.stringify({ ok: false, error: 'Session not found' }), 
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Validate required data
        const requiredFields = ['event_data', 'venue_data', 'ticket_data']
        for (const field of requiredFields) {
          if (!session[field] || Object.keys(session[field]).length === 0) {
            return new Response(
              JSON.stringify({ 
                ok: false, 
                error: `Incomplete data: ${field} is required` 
              }), 
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        // Create event
        const { data: event, error: eventError } = await supabase
          .from('events')
          .insert({
            user_id: user.id,
            organization_id: session.organization_id,
            title: session.event_data.title,
            type: session.event_data.type,
            description: session.event_data.description,
            event_date: session.event_data.date,
            start_time: session.event_data.startTime,
            end_time: session.event_data.endTime,
            timezone: session.event_data.timezone || 'UTC',
            venue_mode: session.venue_data.mode,
            venue_data: session.venue_data,
            ticket_tiers: session.ticket_data.tiers || [],
            total_capacity: session.ticket_data.totalCapacity,
            stripe_account_id: session.stripe_account_id,
            status: 'published',
            published_at: new Date().toISOString()
          })
          .select()
          .single()

        if (eventError) {
          console.error('Event creation error:', eventError)
          return new Response(
            JSON.stringify({ ok: false, error: eventError.message }), 
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Record action with idempotency
        await supabase.from('wizard_actions').insert({
          session_id: sessionId,
          organization_id: session.organization_id,
          action_name: 'publish_event',
          idempotency_key: idempotencyKey,
          stage: 'reviewPublish',
          result: event
        })

        // Update session
        await supabase
          .from('wizard_sessions')
          .update({
            event_id: event.id,
            status: 'completed',
            is_active: false
          })
          .eq('session_id', sessionId)

        return new Response(
          JSON.stringify({ ok: true, event }), 
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ ok: false, error: 'Invalid operation' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```