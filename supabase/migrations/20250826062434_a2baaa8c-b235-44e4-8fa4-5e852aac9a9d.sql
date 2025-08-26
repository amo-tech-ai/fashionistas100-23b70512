-- Schema extensions with proper constraints and seed data
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Extend profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Colombia';

-- 2) Extend orders table  
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS customer_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);

-- 3) Event tickets table
CREATE TABLE IF NOT EXISTS public.event_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_name VARCHAR(150) NOT NULL,
  ticket_type VARCHAR(50) NOT NULL CHECK (ticket_type IN ('general','vip','premium','student')),
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  currency VARCHAR(3) DEFAULT 'COP',
  total_quantity INTEGER NOT NULL CHECK (total_quantity >= 0),
  sold_quantity INTEGER DEFAULT 0 CHECK (sold_quantity >= 0),
  available_quantity INTEGER GENERATED ALWAYS AS (total_quantity - sold_quantity) STORED,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active','sold_out','paused')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event ON public.event_tickets(event_id);
ALTER TABLE public.event_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Active tickets viewable by all" ON public.event_tickets;
CREATE POLICY "Active tickets viewable by all" ON public.event_tickets
FOR SELECT USING (status = 'active');
DROP TRIGGER IF EXISTS trg_event_tickets_updated_at ON public.event_tickets;
CREATE TRIGGER trg_event_tickets_updated_at BEFORE UPDATE ON public.event_tickets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4) Designer profiles table
CREATE TABLE IF NOT EXISTS public.designer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_slug VARCHAR(100) NOT NULL UNIQUE,
  brand_name VARCHAR(200) NOT NULL,
  bio TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  portfolio_urls TEXT[] DEFAULT '{}'::text[],
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_designer_profiles_user ON public.designer_profiles(user_id);
ALTER TABLE public.designer_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Verified designers viewable by all" ON public.designer_profiles;
CREATE POLICY "Verified designers viewable by all" ON public.designer_profiles
FOR SELECT USING (is_verified = TRUE);
DROP POLICY IF EXISTS "Users manage own designer profile" ON public.designer_profiles;
CREATE POLICY "Users manage own designer profile" ON public.designer_profiles
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Auto-generate slug function
CREATE OR REPLACE FUNCTION public.generate_designer_slug()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path TO public AS $$
BEGIN
  IF NEW.brand_slug IS NULL OR NEW.brand_slug = '' THEN
    NEW.brand_slug := lower(regexp_replace(COALESCE(NEW.brand_name,''), '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.brand_slug := btrim(NEW.brand_slug, '-');
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM public.designer_profiles WHERE brand_slug = NEW.brand_slug AND id <> COALESCE(NEW.id, gen_random_uuid())) LOOP
      NEW.brand_slug := NEW.brand_slug || '-' || extract(epoch FROM now())::int;
    END LOOP;
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_generate_designer_slug ON public.designer_profiles;
CREATE TRIGGER trg_generate_designer_slug BEFORE INSERT OR UPDATE ON public.designer_profiles
FOR EACH ROW EXECUTE FUNCTION public.generate_designer_slug();
DROP TRIGGER IF EXISTS trg_designer_profiles_updated_at ON public.designer_profiles;
CREATE TRIGGER trg_designer_profiles_updated_at BEFORE UPDATE ON public.designer_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5) Application status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE public.application_status AS ENUM ('draft','submitted','under_review','accepted','rejected','withdrawn');
  END IF;
END $$;

-- Designer applications table
CREATE TABLE IF NOT EXISTS public.designer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  designer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.application_status DEFAULT 'submitted',
  cover_note TEXT,
  lookbook_url TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, designer_id)
);
CREATE INDEX IF NOT EXISTS idx_designer_applications_event ON public.designer_applications(event_id);
ALTER TABLE public.designer_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Designers view own applications" ON public.designer_applications;
CREATE POLICY "Designers view own applications" ON public.designer_applications
FOR SELECT USING (auth.uid() = designer_id);
DROP POLICY IF EXISTS "Designers create own applications" ON public.designer_applications;
CREATE POLICY "Designers create own applications" ON public.designer_applications
FOR INSERT WITH CHECK (auth.uid() = designer_id);
DROP TRIGGER IF EXISTS trg_designer_applications_updated_at ON public.designer_applications;
CREATE TRIGGER trg_designer_applications_updated_at BEFORE UPDATE ON public.designer_applications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6) Saved events table
CREATE TABLE IF NOT EXISTS public.saved_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  notes TEXT,
  reminder_set BOOLEAN DEFAULT FALSE,
  reminder_datetime TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, event_id)
);
CREATE INDEX IF NOT EXISTS idx_saved_events_user ON public.saved_events(user_id);
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own saved events" ON public.saved_events;
CREATE POLICY "Users manage own saved events" ON public.saved_events
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
DROP TRIGGER IF EXISTS trg_saved_events_updated_at ON public.saved_events;
CREATE TRIGGER trg_saved_events_updated_at BEFORE UPDATE ON public.saved_events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7) Extend user sessions with additional columns
ALTER TABLE public.user_sessions
  ADD COLUMN IF NOT EXISTS token_hash VARCHAR(128),
  ADD COLUMN IF NOT EXISTS device_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active, last_activity);

-- 8) Add page_url to activity logs
ALTER TABLE public.activity_logs
  ADD COLUMN IF NOT EXISTS page_url TEXT;
CREATE INDEX IF NOT EXISTS idx_activity_logs_type_date ON public.activity_logs(activity_type, created_at);

-- 9) Search queries table
CREATE TABLE IF NOT EXISTS public.search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  search_term VARCHAR(500) NOT NULL,
  search_type VARCHAR(50) DEFAULT 'events',
  results_count INTEGER DEFAULT 0,
  clicked_result_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_search_queries_user ON public.search_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_term ON public.search_queries(search_term);
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users view own searches" ON public.search_queries;
CREATE POLICY "Users view own searches" ON public.search_queries
FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anyone can log searches" ON public.search_queries;
CREATE POLICY "Anyone can log searches" ON public.search_queries
FOR INSERT WITH CHECK ((user_id IS NULL) OR (auth.uid() = user_id));

-- 10) User preference details table
CREATE TABLE IF NOT EXISTS public.user_preference_details (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  preferred_event_types TEXT[] DEFAULT '{}'::text[],
  preferred_locations TEXT[] DEFAULT '{}'::text[],
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.user_preference_details ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own preference details" ON public.user_preference_details;
CREATE POLICY "Users manage own preference details" ON public.user_preference_details
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
DROP TRIGGER IF EXISTS trg_user_preference_details_updated_at ON public.user_preference_details;
CREATE TRIGGER trg_user_preference_details_updated_at BEFORE UPDATE ON public.user_preference_details
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed basic venues and events (without profile dependencies)
INSERT INTO public.venues (id, venue_name, address, city, country, max_capacity, description, venue_type, amenities, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Hotel Intercontinental Medellín', 'Calle 16 #28-51, El Poblado', 'Medellín', 'Colombia', 300, 'Luxury hotel ballroom with elegant interiors and city views', 'hotel', ARRAY['parking','wifi','catering','av_equipment','valet_service'], 'active'),
('660e8400-e29b-41d4-a716-446655440002', 'Centro de Convenciones Plaza Mayor', 'Calle 41 #55-80', 'Medellín', 'Colombia', 1000, 'Modern convention center with multiple halls and exhibition spaces', 'convention_center', ARRAY['parking','wifi','catering','av_equipment','security'], 'active'),
('660e8400-e29b-41d4-a716-446655440003', 'Museo de Arte Moderno', 'Carrera 44 #19A-100', 'Medellín', 'Colombia', 250, 'Contemporary art museum with versatile event spaces', 'gallery', ARRAY['wifi','security','climate_control'], 'active'),
('660e8400-e29b-41d4-a716-446655440004', 'Rooftop Charlee Hotel', 'Calle 9A #37-16, El Poblado', 'Medellín', 'Colombia', 150, 'Exclusive rooftop venue with panoramic city views', 'outdoor', ARRAY['bar','city_views','wifi','sound_system'], 'active'),
('660e8400-e29b-41d4-a716-446655440005', 'Teatro Metropolitano', 'Calle 41 #57-30', 'Medellín', 'Colombia', 800, 'Historic theater perfect for runway shows and galas', 'theater', ARRAY['stage_lighting','sound_system','dressing_rooms','wifi'], 'active')
ON CONFLICT (id) DO NOTHING;

-- Schema extensions complete - profiles will need to be seeded via auth system