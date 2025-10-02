-- ============================================
-- Seed Data for Testing
-- Version: 1.0.0
-- Date: October 2, 2025
-- ============================================

-- Test users (passwords handled by Clerk)
INSERT INTO users (clerk_id, email, role, profile_data) VALUES
  ('clerk_test_organizer_001', 'test@fashionos.com', 'organizer', 
   '{"name": "Test Organizer", "organization": "FashionOS Events", "phone": "+1234567890"}'::jsonb),
  
  ('clerk_test_designer_001', 'designer@fashionos.com', 'designer',
   '{"name": "Test Designer", "brand": "Avant Garde Studios", "portfolio": "https://portfolio.example.com"}'::jsonb),
  
  ('clerk_test_venue_001', 'venue@fashionos.com', 'venue',
   '{"name": "Test Venue Manager", "venue": "Grand Fashion Hall", "capacity": 500}'::jsonb),
  
  ('clerk_test_sponsor_001', 'sponsor@fashionos.com', 'sponsor',
   '{"name": "Test Sponsor", "company": "Luxury Brands Inc", "budget": 50000}'::jsonb)
ON CONFLICT (clerk_id) DO NOTHING;

-- Test events
INSERT INTO events (
  title,
  slug,
  description,
  event_type,
  status,
  organizer_id,
  start_date,
  end_date,
  capacity,
  ticket_tiers,
  featured_image,
  metadata
) VALUES
  (
    'Paris Fashion Week 2025',
    'paris-fashion-week-2025',
    'The most anticipated fashion event of the year featuring top designers from around the world.',
    'Fashion Show',
    'published',
    (SELECT id FROM users WHERE email = 'test@fashionos.com'),
    '2025-10-15 10:00:00+00',
    '2025-10-22 22:00:00+00',
    1000,
    '[
      {"name": "General Admission", "price": 150, "quantity": 500, "benefits": ["Show access", "Welcome gift"]},
      {"name": "VIP", "price": 500, "quantity": 200, "benefits": ["Front row seats", "Backstage access", "After party"]},
      {"name": "Press", "price": 0, "quantity": 100, "benefits": ["Press area access", "Photo permissions"]}
    ]'::jsonb,
    'https://images.unsplash.com/photo-fashion-week',
    '{"tags": ["fashion", "runway", "haute-couture"], "sponsors": ["Luxury Brands Inc", "Fashion Magazine"]}'::jsonb
  ),
  
  (
    'Sustainable Fashion Summit',
    'sustainable-fashion-summit-2025',
    'A conference dedicated to sustainable and ethical fashion practices.',
    'Conference',
    'published',
    (SELECT id FROM users WHERE email = 'test@fashionos.com'),
    '2025-11-05 09:00:00+00',
    '2025-11-07 18:00:00+00',
    300,
    '[
      {"name": "Standard", "price": 250, "quantity": 200, "benefits": ["All sessions", "Lunch included"]},
      {"name": "Premium", "price": 450, "quantity": 50, "benefits": ["All sessions", "Workshops", "Networking dinner"]}
    ]'::jsonb,
    'https://images.unsplash.com/photo-sustainable-fashion',
    '{"tags": ["sustainability", "eco-fashion", "ethics"], "speakers": ["Jane Doe", "John Smith"]}'::jsonb
  ),
  
  (
    'Emerging Designers Showcase',
    'emerging-designers-showcase-2025',
    'Platform for new talent to present their collections to industry professionals.',
    'Fashion Show',
    'draft',
    (SELECT id FROM users WHERE email = 'test@fashionos.com'),
    '2025-12-01 19:00:00+00',
    '2025-12-01 23:00:00+00',
    250,
    '[
      {"name": "General", "price": 75, "quantity": 150, "benefits": ["Show access"]},
      {"name": "Industry", "price": 125, "quantity": 50, "benefits": ["Show access", "Designer meet & greet"]}
    ]'::jsonb,
    'https://images.unsplash.com/photo-emerging-designers',
    '{"tags": ["emerging", "new-talent", "discovery"]}'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

-- Test wizard sessions
INSERT INTO wizard_sessions (
  user_id,
  current_stage,
  status,
  completion_percentage,
  data,
  event_id
) VALUES
  (
    (SELECT id FROM users WHERE email = 'test@fashionos.com'),
    'reviewPublish',
    'completed',
    100,
    '{
      "organizerSetup": {
        "name": "Test Organizer",
        "email": "test@fashionos.com",
        "organization": "FashionOS Events",
        "role": "event_organizer"
      },
      "eventSetup": {
        "title": "Paris Fashion Week 2025",
        "slug": "paris-fashion-week-2025",
        "eventType": "Fashion Show",
        "description": "The most anticipated fashion event",
        "startDate": "2025-10-15T10:00:00Z",
        "endDate": "2025-10-22T22:00:00Z"
      },
      "venueSetup": {
        "venueName": "Grand Palais",
        "venueId": null,
        "address": "3 Avenue du Général Eisenhower, Paris",
        "capacity": 1000
      },
      "ticketSetup": {
        "tiers": [
          {"name": "General", "price": 150, "quantity": 500},
          {"name": "VIP", "price": 500, "quantity": 200}
        ]
      },
      "sponsorSetup": {
        "sponsors": ["Luxury Brands Inc", "Fashion Magazine"],
        "targetAmount": 100000
      }
    }'::jsonb,
    (SELECT id FROM events WHERE slug = 'paris-fashion-week-2025')
  ),
  
  (
    (SELECT id FROM users WHERE email = 'designer@fashionos.com'),
    'venueSetup',
    'active',
    35,
    '{
      "organizerSetup": {
        "name": "Test Designer",
        "email": "designer@fashionos.com",
        "organization": "Avant Garde Studios",
        "role": "fashion_designer"
      },
      "eventSetup": {
        "title": "Spring Collection Launch",
        "eventType": "Fashion Show",
        "description": "Unveiling our latest spring collection",
        "startDate": "2025-03-20T19:00:00Z",
        "endDate": "2025-03-20T22:00:00Z"
      }
    }'::jsonb,
    NULL
  )
ON CONFLICT DO NOTHING;

-- Test wizard actions (audit log)
INSERT INTO wizard_actions (
  session_id,
  action_name,
  stage,
  params,
  result,
  success,
  duration_ms
) VALUES
  (
    (SELECT session_id FROM wizard_sessions LIMIT 1),
    'completeOrganizerSetup',
    'organizerSetup',
    '{"name": "Test Organizer", "email": "test@fashionos.com"}'::jsonb,
    '{"success": true, "message": "Organizer setup completed"}'::jsonb,
    true,
    245
  ),
  (
    (SELECT session_id FROM wizard_sessions LIMIT 1),
    'completeEventSetup',
    'eventSetup',
    '{"title": "Paris Fashion Week 2025"}'::jsonb,
    '{"success": true, "slug": "paris-fashion-week-2025"}'::jsonb,
    true,
    312
  ),
  (
    (SELECT session_id FROM wizard_sessions LIMIT 1),
    'searchVenues',
    'venueSetup',
    '{"location": "Paris", "capacity": 1000}'::jsonb,
    '{"venues": [{"name": "Grand Palais", "capacity": 1200}]}'::jsonb,
    true,
    567
  )
ON CONFLICT DO NOTHING;

-- Test AI interactions
INSERT INTO wizard_interactions (
  session_id,
  interaction_type,
  stage,
  user_message,
  ai_response,
  metadata
) VALUES
  (
    (SELECT session_id FROM wizard_sessions LIMIT 1),
    'suggestion',
    'eventSetup',
    'Can you help me write a description for a fashion week event?',
    'I''ll help you create an engaging description for your fashion week event. Here''s a professional description that highlights the key aspects...',
    '{"model": "gpt-4", "tokens": 150}'::jsonb
  ),
  (
    (SELECT session_id FROM wizard_sessions LIMIT 1),
    'validation',
    'ticketSetup',
    'Is $500 too much for VIP tickets?',
    'For a Fashion Week event in Paris, $500 for VIP tickets is within the standard range. Similar events typically charge $400-800 for VIP access...',
    '{"model": "gpt-4", "tokens": 120}'::jsonb
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check data was inserted
DO $$
DECLARE
  v_users_count INTEGER;
  v_events_count INTEGER;
  v_sessions_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_users_count FROM users;
  SELECT COUNT(*) INTO v_events_count FROM events;
  SELECT COUNT(*) INTO v_sessions_count FROM wizard_sessions;
  
  RAISE NOTICE 'Seed data loaded:';
  RAISE NOTICE '  Users: %', v_users_count;
  RAISE NOTICE '  Events: %', v_events_count;
  RAISE NOTICE '  Sessions: %', v_sessions_count;
END $$;
