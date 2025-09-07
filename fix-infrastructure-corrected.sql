-- FASHIONOS MISSING INFRASTRUCTURE FIX (CORRECTED)
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
    SELECT id FROM sponsors WHERE contact_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  ));

-- User Analytics Policies
CREATE POLICY "Users view own analytics" ON user_analytics
  FOR SELECT USING (user_id = auth.uid());

-- Platform Fees Policies (admin only)
CREATE POLICY "Service role access platform fees" ON platform_fees
  FOR ALL USING (auth.role() = 'service_role');
-- ============================================
-- 4. CREATE PERFORMANCE INDEXES
-- ============================================

-- Designer Bookings Indexes
CREATE INDEX IF NOT EXISTS idx_designer_bookings_designer_id ON designer_bookings(designer_id);
CREATE INDEX IF NOT EXISTS idx_designer_bookings_event_id ON designer_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_designer_bookings_status ON designer_bookings(status);

-- Model Bookings Indexes
CREATE INDEX IF NOT EXISTS idx_model_bookings_model_id ON model_bookings(model_id);
CREATE INDEX IF NOT EXISTS idx_model_bookings_event_id ON model_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_model_bookings_status ON model_bookings(status);

-- Sponsorships Indexes
CREATE INDEX IF NOT EXISTS idx_sponsorships_sponsor_id ON sponsorships(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_event_id ON sponsorships(event_id);
CREATE INDEX IF NOT EXISTS idx_sponsorships_amount ON sponsorships(amount);

-- Venue Bookings Indexes
CREATE INDEX IF NOT EXISTS idx_venue_bookings_venue_id ON venue_bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_event_id ON venue_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_booking_date ON venue_bookings(booking_date);

-- User Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_id ON user_analytics(event_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_action ON user_analytics(action);

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
