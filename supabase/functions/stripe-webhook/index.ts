// Supabase Edge Function for Stripe Webhook
// Handles payment_intent events and updates bookings/payments tables

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, stripe-signature',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      })
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
        const bookingId = paymentIntent.metadata.booking_id
        
        console.log('💰 Payment succeeded:', paymentIntent.id, 'Booking:', bookingId)
        
        if (bookingId) {
          // Update or create payment record
          const { error: paymentError } = await supabase
            .from('payments')
            .upsert({
              booking_id: bookingId,
              stripe_payment_intent_id: paymentIntent.id,
              amount_cents: paymentIntent.amount,
              currency: paymentIntent.currency,
              status: 'succeeded',
              payment_method: 'card',
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'stripe_payment_intent_id'
            })
          
          if (paymentError) {
            console.error('❌ Payment update error:', paymentError)
            throw paymentError
          }

          // Update booking status to confirmed
          const { error: bookingError } = await supabase
            .from('bookings')
            .update({ 
              status: 'confirmed',
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
          
          if (bookingError) {
            console.error('❌ Booking update error:', bookingError)
            throw bookingError
          }

          console.log('✅ Payment and booking updated successfully')
        } else {
          console.warn('⚠️ No booking_id in payment metadata')
        }
        
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const bookingId = paymentIntent.metadata.booking_id
        
        console.log('❌ Payment failed:', paymentIntent.id)
        
        if (bookingId) {
          // Update payment status
          const { error } = await supabase
            .from('payments')
            .update({ 
              status: 'failed',
              failure_reason: paymentIntent.last_payment_error?.message,
              updated_at: new Date().toISOString()
            })
            .eq('stripe_payment_intent_id', paymentIntent.id)
          
          if (error) {
            console.error('❌ Payment failure update error:', error)
          }

          // Update booking status
          await supabase
            .from('bookings')
            .update({ 
              status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
        }
        
        break
      }
      
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('✅ Checkout completed:', session.id)
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
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'stripe_customer_id'
          })
        
        break
      }
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
    
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})