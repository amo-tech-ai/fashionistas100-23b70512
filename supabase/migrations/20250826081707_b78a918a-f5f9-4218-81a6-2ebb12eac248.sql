-- FashionOS Seed - Option A: Adapt to existing schema
-- This migration inserts sample data into existing tables and adds helper indexes.
-- Idempotent via fixed UUIDs and ON CONFLICT DO NOTHING where applicable.

-- 1) Venues
INSERT INTO public.venues (
  id, venue_name, slug, address, city, country, max_capacity, status,
  website, description, is_featured, created_at, updated_at
) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Dulcinea Medellín', 'dulcinea-medellin', 'Cl. 44 #69-96, Laureles', 'Medellín', 'Colombia', 200, 'active',
   'https://dulcineamedellin.com', 'Premium venue in Laureles offering elegant atmosphere for exclusive fashion events with full catering and event services.', true,
   '2024-11-15 13:20:00+00', '2024-11-15 13:20:00+00'),
  ('10000000-0000-0000-0000-000000000002', 'Centro de Convenciones Ágora', 'centro-de-convenciones-agora', 'Cra. 40 #22A-09', 'Bogotá', 'Colombia', 800, 'active',
   'https://agorabogota.com', 'Modern convention center in Bogotá perfect for large-scale fashion events with multiple halls and professional facilities.', true,
   '2024-10-22 16:45:00+00', '2024-10-22 16:45:00+00')
ON CONFLICT (id) DO NOTHING;

-- 2) Events (published so they are publicly viewable by RLS)
INSERT INTO public.events (
  id, event_name, description, status, organizer_id, venue_id, start_datetime, end_datetime, created_at, updated_at
) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Dulcinea Swimwear Fashion Show',
   'An exclusive emerging designer swimwear showcase featuring runway models, sponsor activations, and VIP experiences at Dulcinea Medellín.',
   'published', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001',
   '2025-07-29 19:00:00+00', '2025-07-29 21:00:00+00', '2025-01-15 10:00:00+00', '2025-01-26 14:30:00+00'),
  ('20000000-0000-0000-0000-000000000002', 'Colombia Fashion Week 2025',
   'The premier fashion event in Colombia showcasing established and emerging designers from across Latin America.',
   'published', '22222222-2222-2222-2222-222222222222', '10000000-0000-0000-0000-000000000002',
   '2025-03-15 18:00:00+00', '2025-03-18 22:00:00+00', '2024-12-01 09:00:00+00', '2025-01-20 16:45:00+00'),
  ('20000000-0000-0000-0000-000000000003', 'Silvia Tcherassi Spring Trunk Show',
   'Exclusive presentation of Silvia Tcherassi''s Spring 2025 collection in the historic walls of Cartagena.',
   'published', '11111111-1111-1111-1111-111111111111', NULL,
   '2025-02-14 20:00:00+00', '2025-02-14 23:00:00+00', '2024-11-20 14:00:00+00', '2025-01-18 11:20:00+00'),
  ('20000000-0000-0000-0000-000000000004', 'Sustainable Fashion Summit 2025',
   'Industry leaders reimagining fashion''s environmental impact through technology and innovation.',
   'published', '22222222-2222-2222-2222-222222222222', '10000000-0000-0000-0000-000000000001',
   '2025-04-08 09:00:00+00', '2025-04-10 18:00:00+00', '2024-10-15 08:30:00+00', '2025-01-22 09:15:00+00'),
  ('20000000-0000-0000-0000-000000000005', 'NEXT: Emerging Voices 2025',
   'Discover tomorrow''s fashion icons as 20 breakthrough designers debut AI-collaborative collections.',
   'published', '11111111-1111-1111-1111-111111111111', NULL,
   '2025-05-02 19:30:00+00', '2025-05-02 22:00:00+00', '2024-12-10 16:00:00+00', '2025-01-19 13:40:00+00')
ON CONFLICT (id) DO NOTHING;

-- 3) Event Tickets (map ticket tiers)
INSERT INTO public.event_tickets (
  id, event_id, ticket_name, ticket_type, price, total_quantity, sold_quantity, available_quantity, currency, status, created_at, updated_at
) VALUES
  -- Dulcinea tiers
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Early Bird Special', 'general', 50.00, 50, 31, 19, 'USD', 'active', '2025-01-15 10:00:00+00', '2025-01-15 10:00:00+00'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'General Admission', 'general', 75.00, 100, 12, 88, 'USD', 'active', '2025-01-15 10:00:00+00', '2025-01-15 10:00:00+00'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'VIP Experience', 'vip', 150.00, 50, 4, 46, 'USD', 'active', '2025-01-15 10:00:00+00', '2025-01-15 10:00:00+00'),
  -- CFW tiers
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'General Access', 'general', 99.00, 400, 134, 266, 'USD', 'active', '2024-12-01 09:00:00+00', '2024-12-01 09:00:00+00'),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', 'VIP Experience', 'vip', 249.00, 200, 67, 133, 'USD', 'active', '2024-12-01 09:00:00+00', '2024-12-01 09:00:00+00'),
  ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', 'Platinum Elite', 'platinum', 499.00, 100, 33, 67, 'USD', 'active', '2024-12-01 09:00:00+00', '2024-12-01 09:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- 4) Event Images
INSERT INTO public.event_images (
  id, event_id, image_url, alt_text, caption, display_order, image_type, is_active, created_at, updated_at
) VALUES
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'https://res.cloudinary.com/fashionos/image/upload/v1/fashion/events/dulcinea-swimwear-hero.jpg', 'Dulcinea Swimwear Hero', 'Hero image', 1, 'hero', true, now(), now()),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'https://res.cloudinary.com/fashionos/image/upload/v1/fashion/events/dulcinea-gallery-1.jpg', 'Dulcinea Gallery 1', 'Runway moment', 2, 'gallery', true, now(), now()),
  ('40000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'https://res.cloudinary.com/fashionos/image/upload/v1/fashion/events/dulcinea-gallery-2.jpg', 'Dulcinea Gallery 2', 'Backstage', 3, 'gallery', true, now(), now()),
  ('40000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 'https://res.cloudinary.com/fashionos/image/upload/v1/fashion/events/cfw-hero.jpg', 'CFW Hero', 'Main stage', 1, 'hero', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- 5) Designer Profiles (use designer user_id to align with policies)
INSERT INTO public.designer_profiles (
  id, user_id, brand_name, brand_slug, bio, website_url, social_links, is_verified, created_at, updated_at
) VALUES
  ('50000000-0000-0000-0000-000000000001', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Vásquez Couture', 'vasquez-couture',
   'Neo-couture pioneer combining traditional Colombian craftsmanship with cutting-edge technology to create geometric, futuristic designs.',
   'https://vasquezcouture.com', '{"instagram":"@vasquez.couture"}', true, '2024-09-15 11:20:00+00', '2024-09-15 11:20:00+00'),
  ('50000000-0000-0000-0000-000000000002', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Digital Textile Studio', 'digital-textile-studio',
   'Digital textile innovator working with holographic fabrics and smart materials to create fluid, tech-integrated fashion pieces.',
   'https://digitaltextilestudio.com', '{"instagram":"@digital.textile.studio"}', true, '2024-08-22 09:45:00+00', '2024-08-22 09:45:00+00'),
  ('50000000-0000-0000-0000-000000000003', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Terra Sustainable', 'terra-sustainable',
   'Sustainable luxury advocate creating ethereal, earth-toned pieces using botanical dyes and organic materials sourced from Colombian biodiversity.',
   'https://terrasustainable.co', '{"instagram":"@terra.sustainable"}', true, '2024-10-03 14:15:00+00', '2024-10-03 14:15:00+00'),
  ('50000000-0000-0000-0000-000000000004', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Silvia Tcherassi', 'silvia-tcherassi',
   'Internationally acclaimed Colombian designer known for vibrant prints, luxurious fabrics, and sophisticated silhouettes.',
   'https://silviat.com', '{"instagram":"@silviatcherassi"}', true, '2024-07-10 16:30:00+00', '2024-07-10 16:30:00+00')
ON CONFLICT (id) DO NOTHING;

-- 6) Designer Applications (link designers to events)
INSERT INTO public.designer_applications (
  id, designer_id, event_id, status, cover_note, lookbook_url, submitted_at, created_at, updated_at
) VALUES
  ('60000000-0000-0000-0000-000000000001', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '20000000-0000-0000-0000-000000000002', 'submitted', 'Excited to showcase new neo-couture line.', 'https://vasquezcouture.com/lookbook', '2025-01-05 12:00:00+00', now(), now()),
  ('60000000-0000-0000-0000-000000000002', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', '20000000-0000-0000-0000-000000000004', 'under_review', 'Sustainability focused collection with botanical dyes.', 'https://terrasustainable.co/lookbook', '2025-01-06 10:00:00+00', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 7) Event Registrations (sample attendees)
INSERT INTO public.event_registrations (
  id, user_id, event_id, registration_type, status, email_notifications, checked_in, created_at, updated_at
) VALUES
  ('70000000-0000-0000-0000-000000000001', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', '20000000-0000-0000-0000-000000000001', 'general', 'confirmed', true, false, '2025-01-18 15:30:00+00', '2025-01-18 15:30:00+00'),
  ('70000000-0000-0000-0000-000000000002', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', '20000000-0000-0000-0000-000000000001', 'vip', 'confirmed', true, false, '2025-01-20 09:15:00+00', '2025-01-20 09:15:00+00'),
  ('70000000-0000-0000-0000-000000000003', 'a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a7a7', '20000000-0000-0000-0000-000000000002', 'vip', 'confirmed', false, false, '2025-01-22 11:20:00+00', '2025-01-22 11:20:00+00')
ON CONFLICT (id) DO NOTHING;

-- 8) Orders (map to registrations/tickets logically)
INSERT INTO public.orders (
  id, user_id, event_id, total_amount, currency, order_status, customer_name, customer_email, customer_phone, created_at, updated_at
) VALUES
  ('80000000-0000-0000-0000-000000000001', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', '20000000-0000-0000-0000-000000000001', 100.00, 'USD', 'confirmed', 'Ana María González', 'anamaria.gonzalez@gmail.com', '+57 304 567 8901', '2025-01-18 15:30:00+00', '2025-01-18 15:30:00+00'),
  ('80000000-0000-0000-0000-000000000002', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', '20000000-0000-0000-0000-000000000001', 150.00, 'USD', 'confirmed', 'Jennifer Smith', 'jennifer.smith@email.com', '+1 555 123 4567', '2025-01-20 09:15:00+00', '2025-01-20 09:15:00+00'),
  ('80000000-0000-0000-0000-000000000003', 'a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a7a7', '20000000-0000-0000-0000-000000000002', 249.00, 'USD', 'confirmed', 'Ricardo Medina', 'ricardo.medina@empresa.com', '+57 301 789 0123', '2025-01-22 11:20:00+00', '2025-01-22 11:20:00+00')
ON CONFLICT (id) DO NOTHING;

-- 9) Reviews
INSERT INTO public.reviews (
  id, user_id, event_id, rating, title, review_text, is_published, created_at, updated_at
) VALUES
  ('90000000-0000-0000-0000-000000000001', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', '20000000-0000-0000-0000-000000000001', 5, 'Amazing show', 'Loved the swimwear designs and production quality!', true, now(), now()),
  ('90000000-0000-0000-0000-000000000002', 'a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a7a7', '20000000-0000-0000-0000-000000000002', 4, 'Great week', 'Fantastic designers and organization at CFW.', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- 10) Saved Events
INSERT INTO public.saved_events (
  id, user_id, event_id, reminder_set, reminder_datetime, notes, created_at, updated_at
) VALUES
  ('91000000-0000-0000-0000-000000000001', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', '20000000-0000-0000-0000-000000000002', true, '2025-03-15 09:00:00+00', 'Don\'t miss opening night', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 11) Search Queries
INSERT INTO public.search_queries (
  id, user_id, search_term, results_count, search_type, created_at
) VALUES
  ('92000000-0000-0000-0000-000000000001', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'swimwear', 12, 'events', now()),
  ('92000000-0000-0000-0000-000000000002', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'vip tickets', 6, 'events', now())
ON CONFLICT (id) DO NOTHING;

-- 12) Activity Logs
INSERT INTO public.activity_logs (
  id, user_id, entity_id, activity_type, entity_type, page_url, metadata, created_at
) VALUES
  ('93000000-0000-0000-0000-000000000001', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', '20000000-0000-0000-0000-000000000001', 'view_event', 'event', '/events/dulcinea-swimwear', '{"referrer":"home","utm":"spring_launch"}', now()),
  ('93000000-0000-0000-0000-000000000002', 'a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a7a7', '20000000-0000-0000-0000-000000000002', 'view_event', 'event', '/events/cfw-2025', '{"referrer":"newsletter","utm":"vip"}', now())
ON CONFLICT (id) DO NOTHING;

-- 13) Helpful Indexes
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_datetime ON public.events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON public.event_tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_event_id ON public.orders(event_id);
CREATE INDEX IF NOT EXISTS idx_event_images_event_id ON public.event_images(event_id);
