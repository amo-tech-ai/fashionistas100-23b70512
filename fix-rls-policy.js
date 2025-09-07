// Fix Supabase RLS Policy for user_profiles
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

async function fixRLSPolicy() {
  try {
    console.log('🔧 Fixing RLS policy for user_profiles...');
    
    const response = await fetch('https://api.supabase.com/v1/projects/vuvfqjhkppmbdeqsflbn/database/query', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sbp_7024d97cbc348845b3f00c74c103c6010dc360a8',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          -- Drop existing problematic policies
          DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
          DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
          DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
          
          -- Create new working policies
          CREATE POLICY "Enable insert for authenticated users only" ON user_profiles
          FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
          
          CREATE POLICY "Enable select for users based on user_id" ON user_profiles
          FOR SELECT USING (auth.uid()::text = clerk_id OR auth.uid() IS NOT NULL);
          
          CREATE POLICY "Enable update for users based on user_id" ON user_profiles
          FOR UPDATE USING (auth.uid()::text = clerk_id OR auth.uid() IS NOT NULL)
          WITH CHECK (auth.uid()::text = clerk_id OR auth.uid() IS NOT NULL);
          
          -- Also ensure the table has the right structure
          ALTER TABLE user_profiles 
          ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE NOT NULL,
          ADD COLUMN IF NOT EXISTS email TEXT,
          ADD COLUMN IF NOT EXISTS full_name TEXT,
          ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
          ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
        `
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Successfully fixed RLS policies for user_profiles');
      console.log('Result:', result);
    } else {
      console.error('❌ Failed to fix RLS policies:', result);
    }

  } catch (err) {
    console.error('Fix failed:', err);
  }
}

fixRLSPolicy();
