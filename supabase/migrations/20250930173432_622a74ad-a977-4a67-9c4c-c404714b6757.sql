-- Fix profiles RLS policies to allow user self-service

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;

-- Allow anyone to read profiles
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  TO authenticated, anon
  USING (true);

-- Allow users to insert their own profile
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (clerk_id = (auth.jwt() ->> 'sub'::text));

-- Allow users to update their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  TO authenticated
  USING (clerk_id = (auth.jwt() ->> 'sub'::text))
  WITH CHECK (clerk_id = (auth.jwt() ->> 'sub'::text));

-- Allow users to delete their own profile (optional, for cleanup)
CREATE POLICY "profiles_delete_own"
  ON profiles FOR DELETE
  TO authenticated
  USING (clerk_id = (auth.jwt() ->> 'sub'::text));