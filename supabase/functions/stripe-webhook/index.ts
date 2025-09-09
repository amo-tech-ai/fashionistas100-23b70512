// Supabase Edge Function for Stripe Webhook
// Deploy this to: supabase/functions/stripe-webhook/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Get the signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('No signature', { status: 400 })
    }

    // Get the raw body
    const body = await req.text()
    
    // Verify the webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('💰 Payment received:', paymentIntent.id)
        
        // Update purchased_tickets table
        const { error } = await supabase
          .from('purchased_tickets')
          .update({ 
            status: 'confirmed',
            payment_status: 'paid',
            stripe_payment_intent_id: paymentIntent.id,
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntent.id)
        
        if (error) {
          console.error('Error updating ticket:', error)
        }
        
        // Log to payment_logs
        await supabase.from('payment_logs').insert({
          payment_intent_id: paymentIntent.id,
          event_type: event.type,
          status: 'succeeded',
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata,
          created_at: new Date().toISOString()
        })
        
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ Payment failed:', paymentIntent.id)
        
        // Update ticket status
        await supabase
          .from('purchased_tickets')
          .update({ 
            status: 'failed',
            payment_status: 'failed'
          })
          .eq('payment_intent_id', paymentIntent.id)
        
        // Log failure
        await supabase.from('payment_logs').insert({
          payment_intent_id: paymentIntent.id,
          event_type: event.type,
          status: 'failed',
          error_message: paymentIntent.last_payment_error?.message,
          created_at: new Date().toISOString()
        })
        
        break
      }
      
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge
        console.log('💳 Charge succeeded:', charge.id)
        break
      }
      
      case 'customer.created':
      case 'customer.updated': {
        const customer = event.data.object as Stripe.Customer
        
        // Sync customer to database
        await supabase
          .from('stripe_customers')
          .upsert({
            stripe_customer_id: customer.id,
            email: customer.email,
            name: customer.name,
            metadata: customer.metadata,
            updated_at: new Date().toISOString()
          })
        
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})