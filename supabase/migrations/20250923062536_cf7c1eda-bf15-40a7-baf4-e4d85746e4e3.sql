-- Fix GIST index issue and complete critical production fixes

-- =====================================
-- 1. FIX VENUE BOOKING OVERLAP CONSTRAINT (PROPER UUID HANDLING)
-- =====================================

-- Drop the problematic constraint
ALTER TABLE public.venue_bookings 
DROP CONSTRAINT IF EXISTS no_venue_double_booking;

-- Create a proper overlap exclusion constraint using btree for UUID and date/time ranges
ALTER TABLE public.venue_bookings 
ADD CONSTRAINT no_venue_double_booking 
EXCLUDE USING gist (
    venue_id WITH =, 
    tsrange(
        (booking_date + start_time)::timestamp, 
        (booking_date + end_time)::timestamp
    ) WITH &&
) WHERE (status IN ('confirmed', 'pending'));

-- =====================================
-- 2. ADD MISSING DELETE RLS POLICIES
-- =====================================

-- Delete policies for events
CREATE POLICY "Events: Event organizers and admins can delete events"
ON public.events FOR DELETE 
USING (
    organization_id = requesting_org_id() AND 
    (organizer_id = (SELECT id FROM profiles WHERE user_id = requesting_user_id()) OR
     EXISTS (SELECT 1 FROM profiles WHERE user_id = requesting_user_id() AND role IN ('admin', 'organizer')))
);

-- Delete policies for designers  
CREATE POLICY "Designers: Designer owners and admins can delete designers"
ON public.designers FOR DELETE
USING (
    organization_id = requesting_org_id() AND 
    (profile_id = (SELECT id FROM profiles WHERE user_id = requesting_user_id()) OR
     EXISTS (SELECT 1 FROM profiles WHERE user_id = requesting_user_id() AND role IN ('admin', 'organizer')))
);

-- Delete policies for venues
CREATE POLICY "Venues: Venue owners and admins can delete venues"
ON public.venues FOR DELETE
USING (
    organization_id = requesting_org_id() AND 
    (owner_id = (SELECT id FROM profiles WHERE user_id = requesting_user_id()) OR
     EXISTS (SELECT 1 FROM profiles WHERE user_id = requesting_user_id() AND role IN ('admin', 'organizer')))
);

-- Delete policies for event bookings
CREATE POLICY "Event bookings: Attendees and organizers can delete bookings"
ON public.event_bookings FOR DELETE
USING (
    organization_id = requesting_org_id() AND 
    (attendee_id = (SELECT id FROM profiles WHERE user_id = requesting_user_id()) OR
     EXISTS (SELECT 1 FROM profiles WHERE user_id = requesting_user_id() AND role IN ('admin', 'organizer')))
);

-- Delete policies for venue bookings
CREATE POLICY "Venue bookings: Organizers and venue owners can delete bookings"
ON public.venue_bookings FOR DELETE
USING (
    organization_id = requesting_org_id() AND 
    (organizer_id = (SELECT id FROM profiles WHERE user_id = requesting_user_id()) OR
     EXISTS (SELECT 1 FROM venues v WHERE v.id = venue_bookings.venue_id AND v.owner_id = (SELECT id FROM profiles WHERE user_id = requesting_user_id())))
);

-- Delete policies for designer profiles
CREATE POLICY "Designer profiles: Designer owners and admins can delete profiles"
ON public.designer_profiles FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM designers d 
        JOIN profiles p ON d.profile_id = p.id 
        WHERE d.id = designer_profiles.designer_id 
        AND p.user_id = requesting_user_id() 
        AND d.organization_id = requesting_org_id()
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE user_id = requesting_user_id() AND role IN ('admin', 'organizer'))
);

-- =====================================
-- 3. ADD PERFORMANCE INDEXES FOR RLS
-- =====================================

-- Support indexes for RLS policy performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id_role ON public.profiles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_designers_profile_id_org ON public.designers(profile_id, organization_id);
CREATE INDEX IF NOT EXISTS idx_venues_owner_id_org ON public.venues(owner_id, organization_id);

-- =====================================
-- 4. ADD SAMPLE DATA FOR TESTING
-- =====================================

-- Sample organizations
INSERT INTO public.organizations (name, slug, description, website_url, subscription_status)
VALUES 
    ('Tanaka Studios', 'tanaka-studios', 'Innovative fashion design studio', 'https://tanakastudios.jp', 'active'),
    ('Chic Couture', 'chic-couture', 'Luxury evening wear and bridal', 'https://chiccouture.com', 'active'),
    ('Urban Streetwear', 'urban-streetwear', 'Contemporary streetwear brand', 'https://urbanstreetwear.com', 'active')
ON CONFLICT (slug) DO NOTHING;

-- Sample profiles (using mock user IDs for development)
INSERT INTO public.profiles (user_id, email, first_name, last_name, role, organization_id)
VALUES 
    ('clerk_org001', 'alex.morgan@fashionos.com', 'Alex', 'Morgan', 'organizer', (SELECT id FROM organizations WHERE slug = 'tanaka-studios')),
    ('clerk_des001', 'sarah.johnson@designer.com', 'Sarah', 'Johnson', 'designer', (SELECT id FROM organizations WHERE slug = 'chic-couture')),
    ('clerk_mod001', 'sophia.martinez@model.com', 'Sophia', 'Martinez', 'attendee', (SELECT id FROM organizations WHERE slug = 'urban-streetwear'))
ON CONFLICT (user_id) DO NOTHING;

-- Sample venues
INSERT INTO public.venues (name, slug, description, capacity, venue_type, organization_id, address, hourly_rate)
VALUES 
    ('Main Runway Hall', 'main-runway-hall', 'Premier fashion venue in Miami', 500, 'indoor', (SELECT id FROM organizations WHERE slug = 'tanaka-studios'), '{"street": "123 Fashion Ave", "city": "Miami", "state": "FL", "country": "USA"}', 350.00),
    ('The Charlee Rooftop', 'charlee-rooftop', 'Luxury rooftop venue in Medellín', 150, 'outdoor', (SELECT id FROM organizations WHERE slug = 'chic-couture'), '{"street": "Carrera 43A #7-50", "city": "Medellín", "state": "Antioquia", "country": "Colombia"}', 200.00),
    ('Plaza Mayor Medellín', 'plaza-mayor-medellin', 'Iconic convention center', 5000, 'hybrid', (SELECT id FROM organizations WHERE slug = 'urban-streetwear'), '{"street": "Cl. 41 #55-80", "city": "Medellín", "state": "Antioquia", "country": "Colombia"}', 500.00)
ON CONFLICT (slug) DO NOTHING;

-- Sample designers
INSERT INTO public.designers (brand_name, slug, bio, portfolio_url, tier, is_verified, organization_id, profile_id)
VALUES 
    ('Chic Couture', 'chic-couture-designer', 'Luxury fashion house specializing in evening wear', 'https://chiccouture.com/portfolio', 'luxury', true, (SELECT id FROM organizations WHERE slug = 'chic-couture'), (SELECT id FROM profiles WHERE user_id = 'clerk_des001')),
    ('Urban Streetwear', 'urban-streetwear-designer', 'Contemporary streetwear brand', 'https://urbanstreetwear.com/lookbook', 'emerging', true, (SELECT id FROM organizations WHERE slug = 'urban-streetwear'), (SELECT id FROM profiles WHERE user_id = 'clerk_org001')),
    ('Rossi Atelier', 'rossi-atelier', 'Independent atelier specializing in sustainable fashion', 'https://rossiatelier.com', 'established', false, (SELECT id FROM organizations WHERE slug = 'tanaka-studios'), (SELECT id FROM profiles WHERE user_id = 'clerk_mod001'))
ON CONFLICT (slug) DO NOTHING;

-- Sample events
INSERT INTO public.events (title, slug, description, start_datetime, end_datetime, status, capacity, ticket_price, currency, organization_id, organizer_id, venue_id)
VALUES 
    ('Urban Streetwear Launch Party', 'urban-streetwear-launch', 'Launch event for sustainable collection', '2025-02-25 19:00:00+00', '2025-02-25 23:00:00+00', 'published', 200, 25.00, 'USD', (SELECT id FROM organizations WHERE slug = 'urban-streetwear'), (SELECT id FROM profiles WHERE user_id = 'clerk_org001'), (SELECT id FROM venues WHERE slug = 'charlee-rooftop')),
    ('Fall/Winter 2025 Fashion Week', 'fw-2025-fashion-week', 'Premier international fashion showcase', '2025-03-15 18:00:00+00', '2025-03-15 23:00:00+00', 'published', 1000, 150.00, 'USD', (SELECT id FROM organizations WHERE slug = 'tanaka-studios'), (SELECT id FROM profiles WHERE user_id = 'clerk_org001'), (SELECT id FROM venues WHERE slug = 'main-runway-hall')),
    ('Colombiamoda Fall/Winter 2025', 'colombiamoda-fw-2025', 'Latin America''s largest fashion trade show', '2025-07-22 10:00:00+00', '2025-07-24 22:00:00+00', 'published', 5000, 50.00, 'COP', (SELECT id FROM organizations WHERE slug = 'chic-couture'), (SELECT id FROM profiles WHERE user_id = 'clerk_des001'), (SELECT id FROM venues WHERE slug = 'plaza-mayor-medellin'))
ON CONFLICT (slug) DO NOTHING;