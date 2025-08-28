-- Create audit log table for tracking admin actions
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'approve', etc.
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view all audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can insert audit logs (for system tracking)
CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create announcements table for admin content management
CREATE TABLE public.announcements (
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

-- Everyone can view active announcements
CREATE POLICY "Active announcements viewable by all"
ON public.announcements
FOR SELECT
USING (is_active = true AND (start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

-- Admins can manage all announcements
CREATE POLICY "Admins manage announcements"
ON public.announcements
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger to announcements
CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Create storage bucket for admin uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('admin-uploads', 'admin-uploads', false),
  ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for admin uploads
CREATE POLICY "Admins can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'admin-uploads' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can view admin uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'admin-uploads' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Storage policies for event images
CREATE POLICY "Admins can upload event images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'event-images' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Event images are publicly viewable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'event-images');

CREATE POLICY "Admins can update/delete event images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'event-images' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete event images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-images' AND 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Update events table to allow admin management
CREATE POLICY "Admins can manage all events"
ON public.events
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update event_tickets table to allow admin management
CREATE POLICY "Admins can manage all event tickets"
ON public.event_tickets
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update designer_profiles to allow admin management
CREATE POLICY "Admins can manage all designer profiles"
ON public.designer_profiles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Update venues to allow admin management  
CREATE POLICY "Admins can manage all venues"
ON public.venues
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policy for contact forms
CREATE POLICY "Admins can view all contact forms"
ON public.contact_forms
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact forms"
ON public.contact_forms
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));