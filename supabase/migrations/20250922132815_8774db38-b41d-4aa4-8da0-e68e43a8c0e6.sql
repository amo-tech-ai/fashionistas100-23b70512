-- Fix security warnings by adding missing RLS policies

-- Add RLS policies for sponsors table
CREATE POLICY "Public can view sponsors" ON sponsors
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert sponsors" ON sponsors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update sponsors" ON sponsors
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Add RLS policies for designer_profiles table  
CREATE POLICY "Public can view designer profiles" ON designer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Designers can manage their profiles" ON designer_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM designers 
      WHERE designers.id = designer_profiles.designer_id 
      AND designers.user_id::text = auth.uid()::text
    )
  );

-- Update function to fix search path security warning
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;