// Fix RLS Policy with correct column name
async function fixRLSPolicyCorrect() {
  try {
    console.log('🔧 Fixing RLS policy for user_profiles with correct column name...');
    
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
          DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
          DROP POLICY IF EXISTS "Enable select for users based on user_id" ON user_profiles;
          DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;
          
          -- Create new working policies using clerk_user_id
          CREATE POLICY "Enable insert for authenticated users" ON user_profiles
          FOR INSERT WITH CHECK (
            auth.uid() IS NOT NULL AND
            (auth.jwt() ->> 'sub') = clerk_user_id
          );
          
          CREATE POLICY "Enable select for own profile" ON user_profiles
          FOR SELECT USING (
            auth.uid() IS NOT NULL AND
            (auth.jwt() ->> 'sub') = clerk_user_id
          );
          
          CREATE POLICY "Enable update for own profile" ON user_profiles
          FOR UPDATE USING (
            auth.uid() IS NOT NULL AND
            (auth.jwt() ->> 'sub') = clerk_user_id
          )
          WITH CHECK (
            auth.uid() IS NOT NULL AND
            (auth.jwt() ->> 'sub') = clerk_user_id
          );
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

fixRLSPolicyCorrect();
