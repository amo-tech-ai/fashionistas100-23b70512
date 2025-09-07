-- FASHIONOS MISSING INFRASTRUCTURE FIX
-- Run this in Supabase SQL Editor to complete the setup

-- ============================================
-- 1. CREATE MISSING TABLES
-- ============================================

-- Designer Bookings Table
CREATE TABLE IF NOT EXISTS designer_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID REFERENCES designer_profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  organizer_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Designer Reviews Table
CREATE TABLE IF NOT EXISTS designer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID REFERENCES designer_profiles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id),
  event_id UUID REFERENCES events(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Model Bookings Table
CREATE TABLE IF NOT EXISTS model_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES model_profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  designer_id UUID REFERENCES designer_profiles(id),
  payment_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_date DATE NOT NULL,
  call_time TIME,
  duration_hours INTEGER DEFAULT 4,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Casting Applications Table
CREATE TABLE IF NOT EXISTS casting_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES model_profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  designer_id UUID REFERENCES designer_profiles(id),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'invited', 'accepted', 'rejected', 'withdrawn')),
  response_time INTERVAL,
  application_text TEXT,
  portfolio_links JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsor Leads Table
CREATE TABLE IF NOT EXISTS sponsor_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsorship_id UUID REFERENCES sponsorships(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  interest_level TEXT CHECK (interest_level IN ('hot', 'warm', 'cold')),
  value DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform Fees Table
CREATE TABLE IF NOT EXISTS platform_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('booking', 'venue', 'sponsor', 'ticket')),
  amount DECIMAL(10,2) NOT NULL,
  fee_percentage DECIMAL(5,2) DEFAULT 10.0,
  fee_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Analytics Table
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  action TEXT NOT NULL,
  page_views INTEGER DEFAULT 0,
  session_duration INTEGER,
  clicks INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Model Availability Table (bonus)
CREATE TABLE IF NOT EXISTS model_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES model_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model_id, date)
);

-- ============================================
-- 2. ENABLE RLS ON ALL NEW TABLES
-- ============================================

ALTER TABLE designer_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE designer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE casting_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_availability ENABLE ROW LEVEL SECURITY;

-- Enable RLS on existing tables that don't have it
ALTER TABLE venue_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREATE RLS POLICIES
-- ============================================

-- Designer Bookings Policies
CREATE POLICY "Designers view own bookings" ON designer_bookings
  FOR SELECT USING (designer_id IN (
    SELECT id FROM designer_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Organizers manage bookings" ON designer_bookings
  FOR ALL USING (organizer_id = auth.uid());

-- Model Bookings Policies
CREATE POLICY "Models view own bookings" ON model_bookings
  FOR SELECT USING (model_id IN (
    SELECT id FROM model_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Models update own bookings" ON model_bookings
  FOR UPDATE USING (model_id IN (
    SELECT id FROM model_profiles WHERE user_id = auth.uid()
  ));

-- Venue Bookings Policies
CREATE POLICY "Public can view confirmed venue bookings" ON venue_bookings
  FOR SELECT USING (status = 'confirmed');

CREATE POLICY "Venue owners manage bookings" ON venue_bookings
  FOR ALL USING (venue_id IN (
    SELECT id FROM venues WHERE owner_id = auth.uid()
  ));

-- Sponsorships Policies
CREATE POLICY "Public can view active sponsorships" ON sponsorships
  FOR SELECT USING (status = 'active');

CREATE POLICY "Sponsors manage own sponsorships" ON sponsorships
  FOR ALL USING (sponsor_id IN (
    SELECT id FROM sponsors WHERE contact_email = auth.email()
  ));

-- ============================================
-- 4. CREATE PERFORMANCE INDEXES
-- ============================================

-- Designer Bookings Indexes
CREATE INDEX idx_designer_bookings_designer_id ON designer_bookings(designer_id);
CREATE INDEX idx_designer_bookings_event_id ON designer_bookings(event_id);
CREATE INDEX idx_designer_bookings_status ON designer_bookings(status);

-- Model Bookings Indexes
CREATE INDEX idx_model_bookings_model_id ON model_bookings(model_id);
CREATE INDEX idx_model_bookings_event_id ON model_bookings(event_id);
CREATE INDEX idx_model_bookings_status ON model_bookings(status);

-- Sponsorships Indexes
CREATE INDEX idx_sponsorships_sponsor_id ON sponsorships(sponsor_id);
CREATE INDEX idx_sponsorships_event_id ON sponsorships(event_id);
CREATE INDEX idx_sponsorships_amount ON sponsorships(amount);

-- Venue Bookings Indexes
CREATE INDEX idx_venue_bookings_venue_id ON venue_bookings(venue_id);
CREATE INDEX idx_venue_bookings_event_id ON venue_bookings(event_id);
CREATE INDEX idx_venue_bookings_booking_date ON venue_bookings(booking_date);

-- ============================================
-- 5. CREATE UPDATE TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_designer_bookings_updated_at BEFORE UPDATE ON designer_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_designer_reviews_updated_at BEFORE UPDATE ON designer_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_model_bookings_updated_at BEFORE UPDATE ON model_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_casting_applications_updated_at BEFORE UPDATE ON casting_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsor_leads_updated_at BEFORE UPDATE ON sponsor_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. CREATE DASHBOARD FUNCTIONS
-- ============================================

-- Calculate Total Revenue Function
CREATE OR REPLACE FUNCTION calculate_total_revenue(
  p_event_id UUID DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(
  booking_revenue NUMERIC,
  venue_revenue NUMERIC,
  sponsor_revenue NUMERIC,
  ticket_revenue NUMERIC,
  total_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(b.total_amount), 0) as booking_revenue,
    COALESCE(SUM(vb.total_amount), 0) as venue_revenue,
    COALESCE(SUM(s.amount), 0) as sponsor_revenue,
    COALESCE(SUM(t.price * COALESCE(t.quantity, 1)), 0) as ticket_revenue,
    COALESCE(SUM(b.total_amount), 0) + 
    COALESCE(SUM(vb.total_amount), 0) + 
    COALESCE(SUM(s.amount), 0) + 
    COALESCE(SUM(t.price * COALESCE(t.quantity, 1)), 0) as total_revenue
  FROM events e
  LEFT JOIN bookings b ON e.id = b.event_id
    AND (p_start_date IS NULL OR b.created_at >= p_start_date)
    AND (p_end_date IS NULL OR b.created_at <= p_end_date)
  LEFT JOIN venue_bookings vb ON e.id = vb.event_id
    AND (p_start_date IS NULL OR vb.created_at >= p_start_date)
    AND (p_end_date IS NULL OR vb.created_at <= p_end_date)
  LEFT JOIN sponsorships s ON e.id = s.event_id
    AND (p_start_date IS NULL OR s.created_at >= p_start_date)
    AND (p_end_date IS NULL OR s.created_at <= p_end_date)
  LEFT JOIN tickets t ON e.id = t.event_id
  WHERE (p_event_id IS NULL OR e.id = p_event_id);
END;
$$ LANGUAGE plpgsql;

-- Get Dashboard Metrics Function
CREATE OR REPLACE FUNCTION get_dashboard_metrics(
  p_user_role TEXT,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  CASE p_user_role
    WHEN 'organizer' THEN
      SELECT jsonb_build_object(
        'total_events', COUNT(DISTINCT e.id),
        'total_revenue', COALESCE(SUM(b.total_amount), 0) + COALESCE(SUM(vb.total_amount), 0),
        'total_attendees', COUNT(DISTINCT er.user_id),
        'upcoming_events', COUNT(DISTINCT e.id) FILTER (WHERE e.date > CURRENT_DATE),
        'avg_capacity_utilization', AVG(
          CASE WHEN e.capacity > 0 
          THEN (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id)::NUMERIC / e.capacity * 100
          ELSE 0 END
        )
      ) INTO result
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      LEFT JOIN venue_bookings vb ON e.id = vb.event_id
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.organizer_id = p_user_id;
      
    WHEN 'designer' THEN
      SELECT jsonb_build_object(
        'total_bookings', COUNT(DISTINCT db.id),
        'total_revenue', COALESCE(SUM(db.amount), 0),
        'events_participated', COUNT(DISTINCT ed.event_id),
        'avg_rating', AVG(dr.rating),
        'upcoming_shows', COUNT(DISTINCT e.id) FILTER (WHERE e.date > CURRENT_DATE)
      ) INTO result
      FROM designer_profiles dp
      LEFT JOIN designer_bookings db ON dp.id = db.designer_id
      LEFT JOIN event_designers ed ON dp.id = ed.designer_id
      LEFT JOIN designer_reviews dr ON dp.id = dr.designer_id
      LEFT JOIN events e ON ed.event_id = e.id
      WHERE dp.user_id = p_user_id;
      
    WHEN 'model' THEN
      SELECT jsonb_build_object(
        'total_bookings', COUNT(DISTINCT mb.id),
        'total_earnings', COALESCE(SUM(mb.payment_amount), 0),
        'casting_calls', COUNT(DISTINCT ca.id),
        'upcoming_shows', COUNT(DISTINCT e.id) FILTER (WHERE e.date > CURRENT_DATE),
        'avg_rating', AVG(mb.rating)
      ) INTO result
      FROM model_profiles mp
      LEFT JOIN model_bookings mb ON mp.id = mb.model_id
      LEFT JOIN casting_applications ca ON mp.id = ca.model_id
      LEFT JOIN events e ON mb.event_id = e.id
      WHERE mp.user_id = p_user_id;
      
    WHEN 'venue' THEN
      SELECT jsonb_build_object(
        'total_bookings', COUNT(DISTINCT vb.id),
        'total_revenue', COALESCE(SUM(vb.total_amount), 0),
        'occupancy_rate', AVG(
          CASE WHEN v.operating_hours > 0 
          THEN EXTRACT(EPOCH FROM (vb.end_time - vb.start_time))/3600 / v.operating_hours * 100
          ELSE 0 END
        ),
        'upcoming_bookings', COUNT(DISTINCT vb.id) FILTER (WHERE vb.booking_date > CURRENT_DATE),
        'cancellation_rate', 
          COUNT(DISTINCT vb.id) FILTER (WHERE vb.status = 'cancelled')::NUMERIC / 
          NULLIF(COUNT(DISTINCT vb.id), 0) * 100
      ) INTO result
      FROM venues v
      LEFT JOIN venue_bookings vb ON v.id = vb.venue_id
      WHERE v.owner_id = p_user_id;
      
    WHEN 'sponsor' THEN
      SELECT jsonb_build_object(
        'total_investment', COALESCE(SUM(sp.amount), 0),
        'events_sponsored', COUNT(DISTINCT sp.event_id),
        'leads_generated', COUNT(DISTINCT sl.id),
        'avg_roi', AVG(COALESCE((sp.amount * 1.5) / NULLIF(sp.amount, 0), 0) * 100),
        'active_sponsorships', COUNT(DISTINCT sp.id) FILTER (WHERE sp.status = 'active')
      ) INTO result
      FROM sponsors s
      LEFT JOIN sponsorships sp ON s.id = sp.sponsor_id
      LEFT JOIN sponsor_leads sl ON sp.id = sl.sponsorship_id
      WHERE s.contact_email = auth.email();
      
    ELSE
      result := '{}'::jsonb;
  END CASE;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Check Venue Availability Function
CREATE OR REPLACE FUNCTION check_venue_availability(
  p_venue_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
  is_available BOOLEAN;
BEGIN
  SELECT NOT EXISTS (
    SELECT 1 
    FROM venue_bookings vb
    WHERE vb.venue_id = p_venue_id
    AND vb.booking_date = p_date
    AND vb.status IN ('confirmed', 'pending')
    AND (
      (p_start_time >= vb.start_time AND p_start_time < vb.end_time)
      OR (p_end_time > vb.start_time AND p_end_time <= vb.end_time)
      OR (p_start_time <= vb.start_time AND p_end_time >= vb.end_time)
    )
  ) INTO is_available;
  
  RETURN is_available;
END;
$$ LANGUAGE plpgsql;

-- Calculate Engagement Score Function
CREATE OR REPLACE FUNCTION calculate_engagement_score(
  p_user_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
  engagement_score NUMERIC;
  events_attended INTEGER;
  events_booked INTEGER;
  reviews_left INTEGER;
  avg_session_time INTEGER;
  total_interactions INTEGER;
BEGIN
  -- Get user metrics
  SELECT 
    COUNT(DISTINCT t.event_id) FILTER (WHERE t.checked_in_at IS NOT NULL),
    COUNT(DISTINCT b.event_id),
    COUNT(DISTINCT r.id),
    AVG(ua.session_duration),
    SUM(ua.clicks + ua.shares + ua.likes + ua.saves)
  INTO 
    events_attended,
    events_booked,
    reviews_left,
    avg_session_time,
    total_interactions
  FROM profiles p
  LEFT JOIN tickets t ON p.id = t.buyer_id
  LEFT JOIN bookings b ON p.id = b.user_id
  LEFT JOIN reviews r ON p.id = r.user_id
  LEFT JOIN user_analytics ua ON p.id = ua.user_id
  WHERE p.id = p_user_id;
  
  -- Calculate weighted score
  engagement_score := (
    COALESCE(events_attended::NUMERIC / NULLIF(events_booked, 0), 0) * 0.3 +
    COALESCE(reviews_left::NUMERIC / NULLIF(events_attended, 0), 0) * 0.2 +
    LEAST(COALESCE(avg_session_time, 0) / 600.0, 1) * 0.15 +
    LEAST(COALESCE(total_interactions, 0) / 100.0, 1) * 0.35
  ) * 100;
  
  RETURN ROUND(engagement_score, 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. INSERT SAMPLE DATA
-- ============================================

-- Sample Designer Bookings
INSERT INTO designer_bookings (designer_id, event_id, amount, status, booking_date)
SELECT 
  dp.id,
  e.id,
  CASE 
    WHEN random() < 0.3 THEN 15000
    WHEN random() < 0.6 THEN 10000
    ELSE 5000
  END,
  'confirmed',
  CURRENT_DATE + (random() * 30)::INTEGER
FROM designer_profiles dp
CROSS JOIN (SELECT id FROM events LIMIT 2) e
ON CONFLICT DO NOTHING;

-- Sample Model Bookings
INSERT INTO model_bookings (model_id, event_id, payment_amount, status, booking_date)
SELECT 
  mp.id,
  e.id,
  CASE 
    WHEN random() < 0.3 THEN 2500
    WHEN random() < 0.6 THEN 1500
    ELSE 1000
  END,
  'confirmed',
  CURRENT_DATE + (random() * 30)::INTEGER
FROM model_profiles mp
CROSS JOIN (SELECT id FROM events LIMIT 2) e
ON CONFLICT DO NOTHING;

-- Sample Platform Fees
INSERT INTO platform_fees (transaction_id, transaction_type, amount, fee_percentage, fee_amount)
SELECT 
  b.id,
  'booking',
  b.total_amount,
  10.0,
  b.total_amount * 0.10
FROM bookings b
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. VERIFICATION QUERIES
-- ============================================

-- Verify all tables exist
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = t.table_name) as exists
FROM (
  VALUES 
    ('designer_bookings'),
    ('designer_reviews'),
    ('model_bookings'),
    ('casting_applications'),
    ('sponsor_leads'),
    ('platform_fees'),
    ('user_analytics'),
    ('model_availability')
) AS t(table_name);

-- Test revenue calculation
SELECT * FROM calculate_total_revenue();

-- Test dashboard metrics
SELECT get_dashboard_metrics('organizer');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('venue_bookings', 'sponsorships', 'designer_bookings', 'model_bookings');

COMMENT ON SCHEMA public IS 'FashionOS Production Database - All infrastructure configured';