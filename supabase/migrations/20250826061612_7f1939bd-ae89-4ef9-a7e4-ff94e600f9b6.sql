-- Schema extensions and core seed for Fashion app
-- Enable extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure updated_at trigger function exists
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path TO public AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;$$;

-- 1) Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS city VARCHAR(100),
  ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Colombia';

-- 2) Extend orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS customer_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_user_id_check;

-- 3) Event tickets
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
CREATE INDEX IF NOT EXISTS idx_event_tickets_status ON public.event_tickets(status);
ALTER TABLE public.event_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active tickets viewable by all" ON public.event_tickets
FOR SELECT USING (status = 'active');
CREATE POLICY "Organizers manage event tickets" ON public.event_tickets
FOR ALL USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_tickets.event_id AND e.organizer_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_tickets.event_id AND e.organizer_id = auth.uid()));
DROP TRIGGER IF EXISTS trg_event_tickets_updated_at ON public.event_tickets;
CREATE TRIGGER trg_event_tickets_updated_at BEFORE UPDATE ON public.event_tickets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4) Designer profiles
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
CREATE INDEX IF NOT EXISTS idx_designer_profiles_verified ON public.designer_profiles(is_verified);
ALTER TABLE public.designer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verified designers viewable by all" ON public.designer_profiles
FOR SELECT USING (is_verified = TRUE);
CREATE POLICY "Users manage own designer profile" ON public.designer_profiles
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.generate_designer_slug()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path TO public AS $$
BEGIN
  IF NEW.brand_slug IS NULL OR NEW.brand_slug = '' THEN
    NEW.brand_slug := lower(regexp_replace(COALESCE(NEW.brand_name,''), '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.brand_slug := btrim(NEW.brand_slug, '-');
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_generate_designer_slug ON public.designer_profiles;
CREATE TRIGGER trg_generate_designer_slug BEFORE INSERT OR UPDATE ON public.designer_profiles
FOR EACH ROW EXECUTE FUNCTION public.generate_designer_slug();
DROP TRIGGER IF EXISTS trg_designer_profiles_updated_at ON public.designer_profiles;
CREATE TRIGGER trg_designer_profiles_updated_at BEFORE UPDATE ON public.designer_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5) Designer applications
CREATE TYPE IF NOT EXISTS public.application_status AS ENUM ('draft','submitted','under_review','accepted','rejected','withdrawn');
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
CREATE INDEX IF NOT EXISTS idx_designer_applications_designer ON public.designer_applications(designer_id);
ALTER TABLE public.designer_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Designers view own applications" ON public.designer_applications
FOR SELECT USING (auth.uid() = designer_id);
CREATE POLICY "Designers create own applications" ON public.designer_applications
FOR INSERT WITH CHECK (auth.uid() = designer_id);
CREATE POLICY "Organizers view applications for their events" ON public.designer_applications
FOR SELECT USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = designer_applications.event_id AND e.organizer_id = auth.uid()));
DROP TRIGGER IF EXISTS trg_designer_applications_updated_at ON public.designer_applications;
CREATE TRIGGER trg_designer_applications_updated_at BEFORE UPDATE ON public.designer_applications
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6) Saved events
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
CREATE INDEX IF NOT EXISTS idx_saved_events_event ON public.saved_events(event_id);
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own saved events" ON public.saved_events
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
DROP TRIGGER IF EXISTS trg_saved_events_updated_at ON public.saved_events;
CREATE TRIGGER trg_saved_events_updated_at BEFORE UPDATE ON public.saved_events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7) User sessions: add columns (table already exists)
ALTER TABLE public.user_sessions
  ADD COLUMN IF NOT EXISTS token_hash VARCHAR(128),
  ADD COLUMN IF NOT EXISTS device_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON public.user_sessions(is_active, last_activity);

-- 8) Activity logs: add page_url and index
ALTER TABLE public.activity_logs
  ADD COLUMN IF NOT EXISTS page_url TEXT;
CREATE INDEX IF NOT EXISTS idx_activity_logs_type_created_at ON public.activity_logs(activity_type, created_at);

-- 9) Search queries
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
CREATE POLICY "Users view own searches" ON public.search_queries
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can log searches (self or anonymous)" ON public.search_queries
FOR INSERT WITH CHECK ((user_id IS NULL) OR (auth.uid() = user_id));

-- 10) User preference details
CREATE TABLE IF NOT EXISTS public.user_preference_details (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  preferred_event_types TEXT[] DEFAULT '{}'::text[],
  preferred_locations TEXT[] DEFAULT '{}'::text[],
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.user_preference_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own preference details" ON public.user_preference_details
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
DROP TRIGGER IF EXISTS trg_user_preference_details_updated_at ON public.user_preference_details;
CREATE TRIGGER trg_user_preference_details_updated_at BEFORE UPDATE ON public.user_preference_details
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 11) Venues slug trigger to satisfy NOT NULL slug
DROP TRIGGER IF EXISTS trg_generate_venue_slug ON public.venues;
CREATE TRIGGER trg_generate_venue_slug BEFORE INSERT OR UPDATE ON public.venues
FOR EACH ROW EXECUTE FUNCTION public.generate_venue_slug();

-- =============================
-- Seed Data (core, adjusted to existing schema)
-- =============================
-- Profiles
INSERT INTO public.profiles (id, email, full_name, avatar_url, bio, phone, city, country) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'sofia.martinez@gmail.com', 'Sofia Martinez', 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150', 'Fashion enthusiast and event organizer from Medellín', '+57 300 123 4567', 'Medellín', 'Colombia'),
('550e8400-e29b-41d4-a716-446655440002', 'carlos.designer@email.com', 'Carlos Mendoza', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'Sustainable fashion designer specializing in Colombian textiles', '+57 301 234 5678', 'Bogotá', 'Colombia'),
('550e8400-e29b-41d4-a716-446655440003', 'ana.model@fashionos.com', 'Ana Gutierrez', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'Professional model and fashion blogger', '+57 302 345 6789', 'Cali', 'Colombia'),
('550e8400-e29b-41d4-a716-446655440004', 'miguel.venue@gmail.com', 'Miguel Rodriguez', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Venue manager at luxury hotels and event spaces', '+57 303 456 7890', 'Cartagena', 'Colombia'),
('550e8400-e29b-41d4-a716-446655440005', 'laura.buyer@email.com', 'Laura Fernandez', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'Fashion buyer for premium boutiques', '+57 304 567 8901', 'Medellín', 'Colombia')
ON CONFLICT (id) DO NOTHING;

-- Venues
INSERT INTO public.venues (id, venue_name, address, city, country, max_capacity, description, venue_type, amenities, status) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Hotel Intercontinental Medellín', 'Calle 16 #28-51, El Poblado', 'Medellín', 'Colombia', 300, 'Luxury hotel ballroom with elegant interiors and city views', 'hotel', ARRAY['parking','wifi','catering','av_equipment','valet_service'], 'active'),
('660e8400-e29b-41d4-a716-446655440002', 'Centro de Convenciones Plaza Mayor', 'Calle 41 #55-80', 'Medellín', 'Colombia', 1000, 'Modern convention center with multiple halls and exhibition spaces', 'convention_center', ARRAY['parking','wifi','catering','av_equipment','security'], 'active'),
('660e8400-e29b-41d4-a716-446655440003', 'Museo de Arte Moderno', 'Carrera 44 #19A-100', 'Medellín', 'Colombia', 250, 'Contemporary art museum with versatile event spaces', 'gallery', ARRAY['wifi','security','climate_control'], 'active'),
('660e8400-e29b-41d4-a716-446655440004', 'Rooftop Charlee Hotel', 'Calle 9A #37-16, El Poblado', 'Medellín', 'Colombia', 150, 'Exclusive rooftop venue with panoramic city views', 'outdoor', ARRAY['bar','city_views','wifi','sound_system'], 'active'),
('660e8400-e29b-41d4-a716-446655440005', 'Teatro Metropolitano', 'Calle 41 #57-30', 'Medellín', 'Colombia', 800, 'Historic theater perfect for runway shows and galas', 'theater', ARRAY['stage_lighting','sound_system','dressing_rooms','wifi'], 'active')
ON CONFLICT (id) DO NOTHING;

-- Events
INSERT INTO public.events (id, organizer_id, venue_id, event_name, description, start_datetime, end_datetime, status) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Medellín Fashion Week 2025', 'The premier fashion event showcasing Colombian and international designers', '2025-03-15 19:00:00+00', '2025-03-15 23:00:00+00', 'published'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Sustainable Fashion Gala', 'Celebrating eco-friendly fashion and sustainable design practices', '2025-02-28 20:00:00+00', '2025-03-01 01:00:00+00', 'published'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 'Emerging Designers Showcase', 'Platform for new talent in Colombian fashion scene', '2025-02-20 18:00:00+00', '2025-02-20 22:00:00+00', 'published'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 'Luxury Brands Pop-Up', 'Exclusive shopping experience with international luxury brands', '2025-03-10 16:00:00+00', '2025-03-10 21:00:00+00', 'published'),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440005', 'Colombian Textile Heritage', 'Celebrating traditional craftsmanship and modern innovation', '2025-04-05 17:00:00+00', '2025-04-05 21:00:00+00', 'draft')
ON CONFLICT (id) DO NOTHING;

-- Event tickets
INSERT INTO public.event_tickets (event_id, ticket_name, ticket_type, price, total_quantity, description) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'General Admission', 'general', 150.00, 200, 'Access to main event and networking reception'),
('770e8400-e29b-41d4-a716-446655440001', 'VIP Experience', 'vip', 350.00, 50, 'Premium seating, welcome cocktail, and meet & greet'),
('770e8400-e29b-41d4-a716-446655440002', 'Gala Ticket', 'general', 200.00, 150, 'Includes dinner and fashion show'),
('770e8400-e29b-41d4-a716-446655440002', 'Sustainability Patron', 'premium', 500.00, 25, 'VIP access plus private sustainability workshop'),
('770e8400-e29b-41d4-a716-446655440003', 'Student Special', 'student', 75.00, 100, 'Discounted entry for students with valid ID'),
('770e8400-e29b-41d4-a716-446655440003', 'Industry Professional', 'premium', 120.00, 80, 'Networking session and designer meet & greet'),
('770e8400-e29b-41d4-a716-446655440004', 'Shopping Pass', 'general', 100.00, 75, 'Access to exclusive shopping and trunk shows'),
('770e8400-e29b-41d4-a716-446655440004', 'Luxury Membership', 'vip', 300.00, 30, 'Private shopping session and personal styling');

-- Orders (simplified to existing columns)
INSERT INTO public.orders (id, user_id, event_id, customer_email, customer_name, total_amount, order_status) VALUES
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'ana.model@fashionos.com', 'Ana Gutierrez', 350.00, 'confirmed'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'laura.buyer@email.com', 'Laura Fernandez', 500.00, 'confirmed'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', 'ana.model@fashionos.com', 'Ana Gutierrez', 120.00, 'confirmed'),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440004', 'laura.buyer@email.com', 'Laura Fernandez', 300.00, 'pending')
ON CONFLICT (id) DO NOTHING;

-- Event registrations
INSERT INTO public.event_registrations (event_id, user_id, registration_type, status) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'vip', 'confirmed'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 'general', 'confirmed'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'premium', 'confirmed'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'general', 'confirmed'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'vip', 'waitlist');

-- Designer profiles
INSERT INTO public.designer_profiles (user_id, brand_name, bio, website_url, social_links, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Mendoza Atelier', 'Sustainable fashion designer focused on Colombian heritage and eco-friendly materials', 'https://mendozaatelier.com', '{"instagram":"@mendozaatelier","facebook":"MendozaAtelierOfficial"}'::jsonb, TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- Designer applications (designer_id references profiles.id)
INSERT INTO public.designer_applications (event_id, designer_id, status, cover_note, submitted_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'accepted', 'I would love to showcase my sustainable collection at Medellín Fashion Week. My pieces celebrate Colombian craftsmanship while promoting environmental consciousness.', NOW() - INTERVAL '10 days')
ON CONFLICT (event_id, designer_id) DO NOTHING;

-- Event images
INSERT INTO public.event_images (event_id, image_url, alt_text, image_type, display_order) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800', 'Fashion Week runway show', 'hero', 1),
('770e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600', 'Models backstage preparation', 'gallery', 2),
('770e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', 'Sustainable fashion showcase', 'hero', 1),
('770e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 'Emerging designers exhibition', 'hero', 1)
ON CONFLICT DO NOTHING;

-- Reviews
INSERT INTO public.reviews (event_id, user_id, rating, title, review_text) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 5, 'Incredible Fashion Week Experience', 'The organization was flawless and the designer collections were absolutely stunning. The VIP experience was worth every peso!'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 4, 'Great Focus on Sustainability', 'Loved the environmental message and the quality of the sustainable pieces shown. The venue and catering were excellent too.')
ON CONFLICT (event_id, user_id) DO NOTHING;

-- Saved events
INSERT INTO public.saved_events (user_id, event_id, notes, reminder_set, reminder_datetime) VALUES
('550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440004', 'Interested in the luxury brands showcase', TRUE, '2025-03-09 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', 'Want to learn about Colombian textiles', FALSE, NULL)
ON CONFLICT (user_id, event_id) DO NOTHING;

-- Activity logs
INSERT INTO public.activity_logs (user_id, activity_type, entity_type, entity_id, page_url) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'view_event', 'event', '770e8400-e29b-41d4-a716-446655440001', '/events/770e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', 'register_event', 'event', '770e8400-e29b-41d4-a716-446655440001', '/events/770e8400-e29b-41d4-a716-446655440001/register'),
('550e8400-e29b-41d4-a716-446655440005', 'view_event', 'event', '770e8400-e29b-41d4-a716-446655440002', '/events/770e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440002', 'submit_application', 'application', (SELECT id FROM public.designer_applications LIMIT 1), '/designer/apply')
ON CONFLICT DO NOTHING;

-- Search queries
INSERT INTO public.search_queries (user_id, search_term, search_type, results_count, clicked_result_id) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'fashion week medellin', 'events', 3, '770e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440005', 'sustainable fashion', 'events', 2, '770e8400-e29b-41d4-a716-446655440002'),
(NULL, 'emerging designers showcase', 'events', 1, '770e8400-e29b-41d4-a716-446655440003')
ON CONFLICT DO NOTHING;

-- User sessions
INSERT INTO public.user_sessions (user_id, token_hash, device_type, user_agent, is_active, last_activity, expires_at) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', 'desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', TRUE, NOW(), NOW() + INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440005', 'z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1', 'mobile', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)', TRUE, NOW(), NOW() + INTERVAL '7 days')
ON CONFLICT (token_hash) DO NOTHING;

-- User preference details
INSERT INTO public.user_preference_details (user_id, preferred_event_types, preferred_locations, preferred_language) VALUES
('550e8400-e29b-41d4-a716-446655440003', ARRAY['runway_show','gala'], ARRAY['Medellín','Bogotá'], 'es'),
('550e8400-e29b-41d4-a716-446655440005', ARRAY['exhibition','workshop'], ARRAY['Medellín'], 'es')
ON CONFLICT (user_id) DO NOTHING;

-- End of migration and seed
