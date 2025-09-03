import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0'
import { Webhook } from 'https://esm.sh/svix@1.15.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const clerkWebhookSecret = Deno.env.get('CLERK_WEBHOOK_SECRET')!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const webhook = new Webhook(clerkWebhookSecret)
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    const evt = webhook.verify(payload, headers)
    
    console.log('Received webhook:', evt.type)
    
    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url, unsafe_metadata } = evt.data
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          clerk_user_id: id,
          clerk_email: email_addresses[0]?.email_address,
          clerk_first_name: first_name,
          clerk_last_name: last_name,
          clerk_image_url: image_url,
          full_name: `${first_name || ''} ${last_name || ''}`.trim() || email_addresses[0]?.email_address?.split('@')[0],
          email: email_addresses[0]?.email_address,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'clerk_user_id'
        })
      
      if (error) {
        console.error('Error syncing user to Supabase:', error)
        return new Response('Database error', { status: 500 })
      }
      
      // Set user role if provided in unsafe_metadata
      if (unsafe_metadata?.role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            clerk_user_id: id,
            role: unsafe_metadata.role
          }, {
            onConflict: 'clerk_user_id'
          })
        
        if (roleError) {
          console.error('Error setting user role:', roleError)
        }
      }
      
      console.log('User synced successfully:', id)
    }
    
    if (evt.type === 'user.deleted') {
      const { id } = evt.data
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('clerk_user_id', id)
      
      if (error) {
        console.error('Error deleting user from Supabase:', error)
        return new Response('Database error', { status: 500 })
      }
      
      console.log('User deleted successfully:', id)
    }
    
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 400 })
  }
})