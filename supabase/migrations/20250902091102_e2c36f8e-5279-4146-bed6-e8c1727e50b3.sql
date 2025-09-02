-- Create announcements table for admin content management (if not exists)
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create storage buckets for admin functionality
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('admin-uploads', 'admin-uploads', false),
  ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Admin policies for storage
CREATE POLICY IF NOT EXISTS "Admins can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'admin-uploads' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY IF NOT EXISTS "Event images are publicly viewable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'event-images');

CREATE POLICY IF NOT EXISTS "Admins can manage event images"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'event-images' AND 
  has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  bucket_id = 'event-images' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Admin policies for existing tables
CREATE POLICY IF NOT EXISTS "Admins can manage all events"
ON public.events
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY IF NOT EXISTS "Admins can manage all event tickets"
ON public.event_tickets
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY IF NOT EXISTS "Admins can view all contact forms"
ON public.contact_forms
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));