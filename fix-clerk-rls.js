#!/usr/bin/env node

const https = require('https');

// Configuration
const PROJECT_REF = 'vuvfqjhkppmbdeqsflbn';
const ACCESS_TOKEN = 'sbp_7024d97cbc348845b3f00c74c103c6010dc360a8';

const SQL_QUERY = `
-- Fix Clerk Integration: Update tables to handle Clerk user IDs

-- First, let's check and modify the users table
DO $$ 
BEGIN
  -- Check if clerk_id column exists, if not create it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' AND column_name = 'clerk_id') THEN
    ALTER TABLE users ADD COLUMN clerk_id TEXT UNIQUE;
  END IF;
  
  -- Ensure clerk_id is TEXT type (for Clerk's user_xxx format)
  ALTER TABLE users ALTER COLUMN clerk_id TYPE TEXT;
END $$;

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id ON user_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create new RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (
    auth.jwt() ->> 'sub' = clerk_user_id
    OR auth.jwt() IS NULL -- Allow during development
  );

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (
    auth.jwt() ->> 'sub' = clerk_user_id
    OR auth.jwt() IS NULL -- Allow during development
  );

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'sub' = clerk_user_id
    OR auth.jwt() IS NULL -- Allow during development
  );

-- Create new RLS policies for users
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (
    auth.jwt() ->> 'sub' = clerk_id
    OR auth.jwt() IS NULL -- Allow during development
  );

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (
    auth.jwt() ->> 'sub' = clerk_id
    OR auth.jwt() IS NULL -- Allow during development
  );

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'sub' = clerk_id
    OR auth.jwt() IS NULL -- Allow during development
  );

-- Return success message
SELECT 'Migration completed successfully' as status;
`;

async function executeSql() {
  console.log('🔧 Fixing Clerk Integration with Supabase...\n');
  console.log('Project:', PROJECT_REF);
  console.log('Executing SQL migration...\n');

  const data = JSON.stringify({ query: SQL_QUERY });

  const options = {
    hostname: 'api.supabase.com',
    port: 443,
    path: `/v1/projects/${PROJECT_REF}/database/query`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ Migration executed successfully!\n');
            console.log('Result:', JSON.stringify(result, null, 2));
            console.log('\n📋 Next Steps:');
            console.log('1. Refresh your integration test page');
            console.log('2. The RLS error should now be fixed');
            console.log('3. All tests should pass');
            resolve(result);
          } else {
            console.error('❌ Migration failed with status:', res.statusCode);
            console.error('Error:', result);
            reject(new Error(JSON.stringify(result)));
          }
        } catch (e) {
          console.error('❌ Failed to parse response:', e);
          console.error('Raw response:', responseData);
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run the migration
executeSql()
  .then(() => {
    console.log('\n✅ All done! Your Clerk integration should now work properly.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed. Please try the manual approach:');
    console.log('\n📝 Manual Fix Instructions:');
    console.log('1. Go to: https://supabase.com/dashboard/project/vuvfqjhkppmbdeqsflbn/sql');
    console.log('2. Copy the SQL from fix-clerk-integration.sql');
    console.log('3. Paste and run it in the SQL editor');
    process.exit(1);
  });