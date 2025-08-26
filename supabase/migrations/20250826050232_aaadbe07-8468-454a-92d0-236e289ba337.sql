-- VENUES TABLE - Core dependency for Events (MVP)
-- Idempotent, fixed quotes, proper casts, triggers using EXECUTE FUNCTION

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Minimal venues table
CREATE TABLE IF NOT EXISTS public.venues (
  -- Primary Identifiers
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_name varchar(200) NOT NULL,
  slug varchar(150) UNIQUE NOT NULL,

  -- Location
  address text NOT NULL,
  city varchar(100) NOT NULL,
  country varchar(100) DEFAULT 'Colombia',
  postal_code varchar(20),

  -- Contact
  phone varchar(20),
  email varchar(255),
  website varchar(255),

  -- Capacity
  max_capacity integer NOT NULL CHECK (max_capacity > 0),

  -- Basic Info
  description text,
  venue_type varchar(50) DEFAULT 'event_space'
    CHECK (venue_type IN ('event_space','hotel','convention_center','outdoor','theater','gallery')),

  -- Features
  amenities text[] DEFAULT '{}'::text[],
  accessibility_features text[] DEFAULT '{}'::text[],

  -- Media
  hero_image_url text,
  gallery_images text[] DEFAULT '{}'::text[],

  -- Status
  status varchar(50) DEFAULT 'active'
    CHECK (status IN ('active','inactive','maintenance')),
  is_featured boolean DEFAULT false,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Slug generation function
CREATE OR REPLACE FUNCTION public.generate_venue_slug()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(COALESCE(NEW.venue_name,''), '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := btrim(NEW.slug, '-');

    -- Ensure uniqueness
    WHILE EXISTS (
      SELECT 1 FROM public.venues WHERE slug = NEW.slug AND id <> COALESCE(NEW.id, gen_random_uuid())
    ) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch FROM now())::int;
    END LOOP;
  END IF;
  RETURN NEW;
END $$;

-- Triggers
DROP TRIGGER IF EXISTS trg_generate_venue_slug ON public.venues;
CREATE TRIGGER trg_generate_venue_slug
BEFORE INSERT OR UPDATE ON public.venues
FOR EACH ROW EXECUTE FUNCTION public.generate_venue_slug();

DROP TRIGGER IF EXISTS trg_venues_updated_at ON public.venues;
CREATE TRIGGER trg_venues_updated_at
BEFORE UPDATE ON public.venues
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_venues_slug ON public.venues(slug);
CREATE INDEX IF NOT EXISTS idx_venues_city ON public.venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_status ON public.venues(status);
CREATE INDEX IF NOT EXISTS idx_venues_capacity ON public.venues(max_capacity);

-- RLS
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Venues are viewable by everyone" ON public.venues;
CREATE POLICY "Venues are viewable by everyone" ON public.venues
FOR SELECT TO authenticated, anon
USING (status = 'active');

DROP POLICY IF EXISTS "Authenticated users can manage venues" ON public.venues;
CREATE POLICY "Authenticated users can manage venues" ON public.venues
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Sample data (idempotent via ON CONFLICT on slug)
INSERT INTO public.venues (venue_name, address, city, max_capacity, description)
VALUES
  ('Plaza Mayor Medellín', 'Calle 44 #52-165, El Poblado', 'Medellín', 500, 'Premium event space in the heart of El Poblado with modern facilities and city views.'),
  ('Centro de Convenciones', 'Carrera 65 #8-95', 'Medellín', 1000, 'Large convention center perfect for fashion weeks and major events.'),
  ('Hotel Intercontinental', 'Calle 16 #28-51, El Poblado', 'Medellín', 300, 'Luxury hotel ballroom with elegant interiors and professional service.')
ON CONFLICT (slug) DO NOTHING;