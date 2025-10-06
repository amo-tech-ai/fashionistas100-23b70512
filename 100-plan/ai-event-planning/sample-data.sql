-- ============================================
-- SAMPLE DATA - AI Event Planning Testing
-- Colombian Fashion Show Events & Model Castings
-- ============================================

-- Note: Run this AFTER the main migration
-- This is test data only - safe to delete in production

-- 1. Sample Events (if not already exists)
INSERT INTO public.events (
  id,
  title,
  slug,
  description,
  start_datetime,
  end_datetime,
  status,
  capacity,
  organization_id,
  organizer_id,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Colombia Fashion Week 2025 - Pasarela Principal',
  'colombia-fashion-week-2025-pasarela-principal',
  'El evento más importante de moda en Colombia. Presentando las colecciones de primavera-verano de diseñadores emergentes y establecidos.',
  '2025-03-15 19:00:00+00'::timestamptz,
  '2025-03-15 23:00:00+00'::timestamptz,
  'published',
  500,
  (SELECT id FROM public.organizations LIMIT 1),
  (SELECT id FROM public.profiles WHERE role = 'organizer' LIMIT 1),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Medellín Fashion Night - Sostenibilidad',
  'medellin-fashion-night-sostenibilidad',
  'Desfile de moda sostenible presentando diseñadores colombianos comprometidos con el medio ambiente.',
  '2025-04-20 20:00:00+00'::timestamptz,
  '2025-04-20 23:30:00+00'::timestamptz,
  'draft',
  300,
  (SELECT id FROM public.organizations LIMIT 1),
  (SELECT id FROM public.profiles WHERE role = 'organizer' LIMIT 1),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Bogotá Bridal Week 2025',
  'bogota-bridal-week-2025',
  'Exhibición de vestidos de novia y trajes de gala por diseñadores colombianos de alta costura.',
  '2025-05-10 18:00:00+00'::timestamptz,
  '2025-05-10 22:00:00+00'::timestamptz,
  'published',
  200,
  (SELECT id FROM public.organizations LIMIT 1),
  (SELECT id FROM public.profiles WHERE role = 'organizer' LIMIT 1),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Sample Model Castings - Colombia Fashion Week
INSERT INTO public.model_castings (
  id,
  event_id,
  model_name,
  agency,
  email,
  phone,
  status,
  ai_match_score,
  ai_reasoning,
  created_at
) VALUES
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'María Fernanda Rodríguez',
  'Elite Model Management Colombia',
  'maria.rodriguez@elitemodels.co',
  '+57 300 123 4567',
  'confirmed',
  95,
  'Modelo profesional con 6 años de experiencia en pasarelas internacionales. Altura 178cm. Ha trabajado con diseñadores colombianos como Hernán Zajar y Silvia Tcherassi. Excelente presencia en pasarela y profesionalismo reconocido.',
  NOW() - INTERVAL '2 days'
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Valentina Acosta García',
  'Agency Models Colombia',
  'valentina.acosta@agencymodels.co',
  '+57 301 234 5678',
  'confirmed',
  92,
  'Modelo emergente con gran potencial. Altura 180cm. Ha participado en Colombiamoda 2024 y tiene experiencia en editoriales para revistas de moda colombianas. Su versatilidad la hace ideal para diversos estilos.',
  NOW() - INTERVAL '2 days'
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Camila Torres Mendoza',
  'Stock Models Bogotá',
  'camila.torres@stockmodels.co',
  '+57 302 345 6789',
  'invited',
  88,
  'Modelo con 4 años de experiencia. Altura 177cm. Especializada en moda urbana y contemporánea. Ha trabajado en campañas para marcas colombianas reconocidas. Disponibilidad confirmada para la fecha del evento.',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Isabella Ramírez Cruz',
  'New Icon Models',
  'isabella.ramirez@newiconmodels.co',
  '+57 303 456 7890',
  'invited',
  85,
  'Modelo nueva con entrenamiento profesional en pasarela. Altura 179cm. Participó en el Fashion Week Medellín 2024. Su look fresco y energía en pasarela son ideales para colecciones contemporáneas.',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Sofía Martínez López',
  'Elite Model Management Colombia',
  'sofia.martinez@elitemodels.co',
  '+57 304 567 8901',
  'declined',
  90,
  'Modelo experimentada con presencia internacional. Altura 176cm. Tiene conflicto de fechas con otro evento, pero se recomienda como backup para futuros shows.',
  NOW() - INTERVAL '3 days'
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'Daniela Gómez Herrera',
  'Agency Models Colombia',
  'daniela.gomez@agencymodels.co',
  '+57 305 678 9012',
  'backup',
  87,
  'Modelo confiable con buena experiencia. Altura 175cm. Disponible como backup en caso de cancelaciones. Ha trabajado en múltiples eventos de moda en Bogotá y Medellín.',
  NOW() - INTERVAL '2 days'
);

-- 3. Sample Model Castings - Medellín Fashion Night
INSERT INTO public.model_castings (
  id,
  event_id,
  model_name,
  agency,
  email,
  phone,
  status,
  ai_match_score,
  ai_reasoning,
  created_at
) VALUES
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Luna Restrepo Arias',
  'Eco Models Agency',
  'luna.restrepo@ecomodels.co',
  '+57 310 111 2222',
  'invited',
  94,
  'Modelo especializada en moda sostenible y consciente. Altura 178cm. Activista ambiental y vocera de marcas eco-friendly. Perfecta para este evento con temática de sostenibilidad. Ha trabajado en campañas de moda ética.',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'Catalina Ospina Mejía',
  'Stock Models Medellín',
  'catalina.ospina@stockmodels.co',
  '+57 311 222 3333',
  'invited',
  91,
  'Modelo con enfoque en moda sostenible. Altura 180cm. Nativa de Medellín con conocimiento profundo de la escena de moda local. Ha participado en pasarelas de diseñadores emergentes sostenibles.',
  NOW() - INTERVAL '1 day'
);

-- 4. Sample Model Castings - Bogotá Bridal Week
INSERT INTO public.model_castings (
  id,
  event_id,
  model_name,
  agency,
  email,
  phone,
  status,
  ai_match_score,
  ai_reasoning,
  created_at
) VALUES
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Mariana Vargas Parra',
  'Bridal Models Elite',
  'mariana.vargas@bridalmodels.co',
  '+57 315 333 4444',
  'confirmed',
  96,
  'Modelo especializada en vestidos de novia y alta costura. Altura 177cm. 8 años de experiencia en desfiles de novias. Porte elegante y experiencia en manejo de vestidos complejos. Recomendación premium.',
  NOW() - INTERVAL '3 days'
),
(
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'Andrea Carolina Sánchez',
  'Elite Model Management Colombia',
  'andrea.sanchez@elitemodels.co',
  '+57 316 444 5555',
  'confirmed',
  93,
  'Modelo de alta costura con experiencia en pasarelas de gala. Altura 179cm. Ha trabajado con diseñadores de vestidos de novia de renombre internacional. Su elegancia y profesionalismo son ideales para este evento.',
  NOW() - INTERVAL '3 days'
);

-- 5. Sample AI Agent Logs (requires service role to insert, shown for reference)
-- Note: In production, these are inserted by the edge function
/*
INSERT INTO public.ai_agent_logs (
  agent_type,
  event_id,
  operation,
  model,
  input_data,
  output_data,
  tokens_used,
  latency_ms,
  success,
  created_at
) VALUES
(
  'model_casting',
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  'generate_recommendations',
  'google/gemini-2.5-flash',
  '{"requirements": "Need 5-8 runway models, 175cm+, professional experience preferred"}'::jsonb,
  '{"recommendations_count": 6, "avg_match_score": 89}'::jsonb,
  1850,
  2340,
  true,
  NOW() - INTERVAL '2 days'
),
(
  'model_casting',
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'generate_recommendations',
  'google/gemini-2.5-flash',
  '{"requirements": "Sustainable fashion models, eco-conscious, experience with ethical brands"}'::jsonb,
  '{"recommendations_count": 2, "avg_match_score": 92}'::jsonb,
  1420,
  1980,
  true,
  NOW() - INTERVAL '1 day'
),
(
  'model_casting',
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'generate_recommendations',
  'google/gemini-2.5-flash',
  '{"requirements": "Bridal models, haute couture experience, elegant presentation"}'::jsonb,
  '{"recommendations_count": 2, "avg_match_score": 94}'::jsonb,
  1620,
  2150,
  true,
  NOW() - INTERVAL '3 days'
);
*/

-- Verification Queries
-- Run these to verify the sample data was inserted correctly

-- Check events
-- SELECT id, title, status, start_datetime FROM events WHERE id IN (
--   '550e8400-e29b-41d4-a716-446655440001',
--   '550e8400-e29b-41d4-a716-446655440002',
--   '550e8400-e29b-41d4-a716-446655440003'
-- );

-- Check model castings by event
-- SELECT 
--   e.title as event_name,
--   mc.model_name,
--   mc.agency,
--   mc.status,
--   mc.ai_match_score
-- FROM model_castings mc
-- JOIN events e ON mc.event_id = e.id
-- ORDER BY e.start_datetime, mc.ai_match_score DESC;

-- Check casting status distribution
-- SELECT 
--   event_id,
--   status,
--   COUNT(*) as count,
--   AVG(ai_match_score) as avg_score
-- FROM model_castings
-- GROUP BY event_id, status
-- ORDER BY event_id, status;
