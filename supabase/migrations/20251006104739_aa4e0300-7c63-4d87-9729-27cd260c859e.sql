-- Phase 4: Vendor Coordination Agent Database Foundation

-- Create vendor_recommendations table
CREATE TABLE public.vendor_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  
  -- Vendor details
  vendor_name TEXT NOT NULL,
  vendor_type TEXT NOT NULL CHECK (vendor_type IN ('catering', 'photography', 'videography', 'sound', 'lighting', 'security', 'transportation', 'decoration', 'makeup', 'hair', 'printing', 'other')),
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  
  -- Recommendation metadata
  ai_match_score INTEGER CHECK (ai_match_score >= 0 AND ai_match_score <= 100),
  ai_reasoning TEXT,
  estimated_cost_min INTEGER, -- in COP cents
  estimated_cost_max INTEGER, -- in COP cents
  
  -- Vendor capabilities
  services_offered JSONB DEFAULT '[]'::jsonb,
  -- Structure: ["service1", "service2", ...]
  
  portfolio_images JSONB DEFAULT '[]'::jsonb,
  -- Structure: ["url1", "url2", ...]
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'recommended' CHECK (status IN ('recommended', 'contacted', 'quoted', 'booked', 'confirmed', 'declined')),
  
  -- Contact tracking
  contacted_at TIMESTAMP WITH TIME ZONE,
  quote_received_at TIMESTAMP WITH TIME ZONE,
  quote_amount INTEGER, -- actual quote in COP cents
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.vendor_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Organizers can manage their event vendor recommendations
CREATE POLICY "vendor_recommendations_select_organizer"
  ON public.vendor_recommendations
  FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events 
      WHERE organizer_id = public.current_profile_id()
    )
  );

CREATE POLICY "vendor_recommendations_select_admin"
  ON public.vendor_recommendations
  FOR SELECT
  USING (public.has_role('admin'::public.app_role));

CREATE POLICY "vendor_recommendations_insert_organizer"
  ON public.vendor_recommendations
  FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT id FROM public.events 
      WHERE organizer_id = public.current_profile_id()
    )
  );

CREATE POLICY "vendor_recommendations_update_organizer"
  ON public.vendor_recommendations
  FOR UPDATE
  USING (
    event_id IN (
      SELECT id FROM public.events 
      WHERE organizer_id = public.current_profile_id()
    )
  );

CREATE POLICY "vendor_recommendations_delete_organizer"
  ON public.vendor_recommendations
  FOR DELETE
  USING (
    event_id IN (
      SELECT id FROM public.events 
      WHERE organizer_id = public.current_profile_id()
    )
  );

-- Indexes for performance
CREATE INDEX idx_vendor_recommendations_event_id ON public.vendor_recommendations(event_id);
CREATE INDEX idx_vendor_recommendations_vendor_type ON public.vendor_recommendations(vendor_type);
CREATE INDEX idx_vendor_recommendations_status ON public.vendor_recommendations(status);
CREATE INDEX idx_vendor_recommendations_created_at ON public.vendor_recommendations(created_at DESC);