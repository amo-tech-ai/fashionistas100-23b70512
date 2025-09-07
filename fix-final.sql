-- FASHIONOS MISSING INFRASTRUCTURE FIX (DATA TYPE CORRECTED)
-- Matches existing schema data types

-- ============================================
-- 1. CREATE MISSING TABLES WITH CORRECT DATA TYPES
-- ============================================

-- Users table (if missing) - matches Clerk integration
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('organizer', 'designer', 'model', 'venue', 'vendor', 'sponsor', 'media', 'buyer')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Designer Bookings Table
CREATE TABLE IF NOT EXISTS designer_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  designer_id UUID REFERENCES designer_profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  organizer_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
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
  booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
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

-- Enable RLS on existing tables that don't have it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'venue_bookings' AND rowsecurity = true) THEN
    ALTER TABLE venue_bookings ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'sponsorships' AND rowsecurity = true) THEN
    ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;
-- ============================================
-- 3. CREATE PERFORMANCE INDEXES
-- ============================================

-- Designer Bookings Indexes
CREATE INDEX IF NOT EXISTS idx_designer_bookings_designer_id ON designer_bookings(designer_id);
CREATE INDEX IF NOT EXISTS idx_designer_bookings_event_id ON designer_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_designer_bookings_status ON designer_bookings(status);
CREATE INDEX IF NOT EXISTS idx_designer_bookings_date ON designer_bookings(booking_date);

-- Model Bookings Indexes
CREATE INDEX IF NOT EXISTS idx_model_bookings_model_id ON model_bookings(model_id);
CREATE INDEX IF NOT EXISTS idx_model_bookings_event_id ON model_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_model_bookings_status ON model_bookings(status);

-- Sponsorship Indexes (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_sponsorships_sponsor_id ON sponsorships(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_event_id ON sponsorships(event_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_amount ON sponsorships(amount);

-- Venue Booking Indexes (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_venue_bookings_venue_id ON venue_bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_event_id ON venue_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_date ON venue_bookings(booking_date);

-- User Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_id ON user_analytics(event_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_action ON user_analytics(action);

-- ============================================
-- 4. CREATE ESSENTIAL DASHBOARD FUNCTIONS
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
  total_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(b.total_amount), 0) as booking_revenue,
    COALESCE(SUM(vb.total_amount), 0) as venue_revenue,
    COALESCE(SUM(s.amount), 0) as sponsor_revenue,
    COALESCE(SUM(b.total_amount), 0) + 
    COALESCE(SUM(vb.total_amount), 0) + 
    COALESCE(SUM(s.amount), 0) as total_revenue
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
  WHERE (p_event_id IS NULL OR e.id = p_event_id);
END;
$$ LANGUAGE plpgsql;
