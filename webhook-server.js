import express from 'express';
import cors from 'cors';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://vuvfqjhkppmbdeqsflbn.supabase.co',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || ''
);

// Middleware
app.use(cors());
app.use(express.raw({ type: 'application/json' })); // Important for webhook signature verification

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Clerk webhook endpoint
app.post('/api/webhooks/clerk', async (req, res) => {
  // Get the headers
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing svix headers' });
  }

  // Get the body
  const payload = req.body;

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const wh = new Webhook(webhookSecret);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  // Handle the webhook events
  const eventType = evt.type;
  console.log(`Received webhook event: ${eventType}`);
  
  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, username, image_url } = evt.data;
      
      // Sync user to Supabase users table
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          clerk_id: id,
          email: email_addresses[0]?.email_address,
          first_name,
          last_name,
          username,
          avatar_url: image_url,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'clerk_id'
        });

      if (userError) {
        console.error('Error syncing user to Supabase:', userError);
        return res.status(500).json({ error: 'Error syncing user' });
      }

      // Also sync to user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          clerk_user_id: id,
          email: email_addresses[0]?.email_address,
          full_name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
          role: 'user',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'clerk_user_id'
        });

      if (profileError) {
        console.error('Error syncing user profile:', profileError);
      }

      console.log(`User ${id} synced successfully`);
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      
      // Delete user from Supabase
      await supabase.from('users').delete().eq('clerk_id', id);
      await supabase.from('user_profiles').delete().eq('clerk_user_id', id);
      
      console.log(`User ${id} deleted successfully`);
    }

    if (eventType === 'session.created') {
      const { user_id } = evt.data;
      
      // Update last_seen
      await supabase
        .from('users')
        .update({ last_seen: new Date().toISOString() })
        .eq('clerk_id', user_id);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Error processing webhook' });
  }

  return res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/api/webhooks/clerk`);
});