-- Insert Medellín September 2025 fashion events without fake user profiles

-- 1) Venues
INSERT INTO public.venues (venue_name, address, city, country, max_capacity, description, venue_type, status, slug)
VALUES
('Centro de Convenciones Plaza Mayor', 'Calle 41 #55-80, Medellín', 'Medellín', 'Colombia', 2000, 'Centro de convenciones con sistema de iluminación profesional, audio de alta calidad, áreas de backstage amplias, lounges VIP y estacionamiento para 500 vehículos.', 'event_space', 'active', 'centro-convenciones-plaza-mayor'),
('Hotel Intercontinental Medellín', 'Carrera 43A #7-50, El Poblado', 'Medellín', 'Colombia', 400, 'Hotel de lujo en El Poblado con salón de baile, terraza panorámica, servicio de valet y suites VIP para diseñadores.', 'event_space', 'active', 'hotel-intercontinental-medellin'),
('Ruta N - Centro de Innovación', 'Calle 67 #52-20, Medellín', 'Medellín', 'Colombia', 500, 'Centro de innovación tecnológica perfecto para conferencias y summits de sostenibilidad en la moda.', 'event_space', 'active', 'ruta-n-centro-innovacion'),
('Parque El Poblado', 'Carrera 43A con Calle 7, El Poblado', 'Medellín', 'Colombia', 1000, 'Espacio al aire libre en El Poblado ideal para festivales de moda urbana y eventos comunitarios.', 'event_space', 'active', 'parque-el-poblado'),
('Museo Casa de la Memoria', 'Carrera 51 #36-66, Buenos Aires', 'Medellín', 'Colombia', 250, 'Espacio cultural elegante perfecto para showcases de moda nupcial y eventos íntimos de alta costura.', 'event_space', 'active', 'museo-casa-memoria');

-- 2) Events (without organizer_id to allow public viewing)
-- First we need to temporarily disable RLS on events to insert without auth
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;

INSERT INTO public.events (event_name, description, start_datetime, end_datetime, venue_id, status)
VALUES
('Medellín Fashion Week Otoño 2025', 'La semana de la moda más prestigiosa de Colombia presenta colecciones de otoño/invierno 2026 con 45+ diseñadores colombianos e internacionales enfocados en moda sostenible y herencia cultural.', '2025-09-18 18:00:00+00', '2025-09-25 23:00:00+00', (SELECT id FROM venues WHERE slug = 'centro-convenciones-plaza-mayor'), 'published'),
('Noches de Alta Costura Paisa', 'Gala exclusiva de alta costura celebrando el talento colombiano con diseñadores emergentes y establecidos, presentando colecciones de lujo inspiradas en la cultura antioqueña.', '2025-09-12 19:00:00+00', '2025-09-12 23:30:00+00', (SELECT id FROM venues WHERE slug = 'hotel-intercontinental-medellin'), 'published'),
('Cumbre de Moda Sostenible Medellín', 'Cumbre de dos días enfocada en innovación sostenible en la industria de la moda, presentando tecnologías eco-amigables, textiles orgánicos y prácticas de producción responsable.', '2025-09-05 09:00:00+00', '2025-09-06 18:00:00+00', (SELECT id FROM venues WHERE slug = 'ruta-n-centro-innovacion'), 'published'),
('Festival de Moda Urbana El Poblado', 'Festival de fin de semana celebrando la moda urbana paisa con marcas emergentes, vintage local, y colaboraciones de street art. Incluye talleres de upcycling y música en vivo.', '2025-09-28 10:00:00+00', '2025-09-29 22:00:00+00', (SELECT id FROM venues WHERE slug = 'parque-el-poblado'), 'published'),
('Medellín Bridal Fashion Experience', 'Presentación exclusiva de colecciones nupciales y vestidos de gala de diseñadores colombianos, con enfoques en tradiciones regionales y elegancia contemporánea.', '2025-09-14 15:00:00+00', '2025-09-15 20:00:00+00', (SELECT id FROM venues WHERE slug = 'museo-casa-memoria'), 'published');

-- Re-enable RLS on events  
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 3) Tickets
INSERT INTO public.event_tickets (event_id, ticket_name, ticket_type, description, price, currency, total_quantity, sold_quantity, available_quantity, status) VALUES
-- Fashion Week tickets
((SELECT id FROM events WHERE event_name = 'Medellín Fashion Week Otoño 2025'), 'General Access', 'basic', 'Acceso a todos los desfiles, app del evento, welcome drink y programa digital', 140.00, 'USD', 800, 120, 680, 'active'),
((SELECT id FROM events WHERE event_name = 'Medellín Fashion Week Otoño 2025'), 'VIP Experience', 'premium', 'Asientos preferenciales, encuentro con diseñadores, acceso a lounge VIP, bolsa de regalo y after-party', 280.00, 'USD', 200, 45, 155, 'active'),
((SELECT id FROM events WHERE event_name = 'Medellín Fashion Week Otoño 2025'), 'Platinum Elite', 'vip', 'Primera fila, acceso backstage, styling personalizada, concierge, NFT exclusiva y todas las experiencias VIP', 500.00, 'USD', 50, 8, 42, 'active'),

-- Alta Costura Gala tickets
((SELECT id FROM events WHERE event_name = 'Noches de Alta Costura Paisa'), 'Premium Gala', 'premium', 'Cena de 4 tiempos, cóctel de bienvenida, meet & greet con diseñadores y bolsa de regalo de lujo', 220.00, 'USD', 250, 89, 161, 'active'),
((SELECT id FROM events WHERE event_name = 'Noches de Alta Costura Paisa'), 'Diamond Experience', 'vip', 'Todas las experiencias premium más acceso exclusivo a after-party y consulta de styling', 400.00, 'USD', 50, 12, 38, 'active'),

-- Sustainable Fashion Summit tickets  
((SELECT id FROM events WHERE event_name = 'Cumbre de Moda Sostenible Medellín'), 'Professional Pass', 'basic', 'Acceso completo a conferencias, materiales digitales y coffee breaks', 85.00, 'USD', 350, 76, 274, 'active'),
((SELECT id FROM events WHERE event_name = 'Cumbre de Moda Sostenible Medellín'), 'Student Pass', 'basic', 'Acceso completo con descuento estudiantil', 45.00, 'USD', 100, 34, 66, 'active'),
((SELECT id FROM events WHERE event_name = 'Cumbre de Moda Sostenible Medellín'), 'VIP Networking', 'premium', 'Acceso completo más almuerzo exclusivo, networking session y certificate', 150.00, 'USD', 50, 18, 32, 'active'),

-- Urban Fashion Festival (free entry, but VIP packages available)
((SELECT id FROM events WHERE event_name = 'Festival de Moda Urbana El Poblado'), 'General Entry', 'basic', 'Entrada gratuita al festival con acceso a todos los stands y actividades', 0.00, 'USD', 2000, 234, 1766, 'active'),
((SELECT id FROM events WHERE event_name = 'Festival de Moda Urbana El Poblado'), 'VIP Package', 'premium', 'Área VIP, comida gourmet, meet & greet con artistas y acceso prioritario a talleres', 35.00, 'USD', 100, 23, 77, 'active'),

-- Bridal Fashion Experience tickets
((SELECT id FROM events WHERE event_name = 'Medellín Bridal Fashion Experience'), 'General Access', 'basic', 'Acceso a desfiles nupciales, exhibición de joyería y degustación de postres', 90.00, 'USD', 200, 67, 133, 'active'),
((SELECT id FROM events WHERE event_name = 'Medellín Bridal Fashion Experience'), 'VIP Bridal', 'premium', 'Consultas de styling personalizadas, sesión fotográfica profesional y acceso a experiencias exclusivas', 180.00, 'USD', 50, 15, 35, 'active');

-- 4) Hero Images
INSERT INTO public.event_images (event_id, image_url, image_type, alt_text, caption, is_active, display_order) VALUES
((SELECT id FROM events WHERE event_name = 'Medellín Fashion Week Otoño 2025'), '/src/assets/hero-runway-new.jpg', 'hero', 'Medellín Fashion Week runway show with models and audience', 'Medellín Fashion Week Otoño 2025 - Raíces Modernas', true, 1),
((SELECT id FROM events WHERE event_name = 'Noches de Alta Costura Paisa'), '/src/assets/event-poster.jpg', 'hero', 'Elegant haute couture gala evening event', 'Noches de Alta Costura Paisa - Elegancia y tradición', true, 1),
((SELECT id FROM events WHERE event_name = 'Cumbre de Moda Sostenible Medellín'), '/src/assets/designer-studio.jpg', 'hero', 'Sustainable fashion design studio workspace', 'Cumbre de Moda Sostenible - Innovación responsable', true, 1),
((SELECT id FROM events WHERE event_name = 'Festival de Moda Urbana El Poblado'), '/src/assets/runway-6.jpg', 'hero', 'Urban street fashion festival with young designers', 'Festival de Moda Urbana - Creatividad paisa', true, 1),
((SELECT id FROM events WHERE event_name = 'Medellín Bridal Fashion Experience'), '/src/assets/runway-5.jpg', 'hero', 'Elegant bridal fashion showcase with wedding dresses', 'Medellín Bridal Fashion Experience - Tradiciones nupciales', true, 1);