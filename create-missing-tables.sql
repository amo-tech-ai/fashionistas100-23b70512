-- Create missing tables for designers and models
CREATE TABLE IF NOT EXISTS public.designers (
  id BIGSERIAL PRIMARY KEY,
  brand_name VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  style_categories TEXT[],
  verified BOOLEAN DEFAULT false,
  portfolio_url VARCHAR(500),
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.models (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  agency VARCHAR(255),
  height VARCHAR(50),
  measurements JSONB,
  hourly_rate DECIMAL(10,2),
  experience_years INTEGER DEFAULT 0,
  portfolio TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.designer_bookings (
  id BIGSERIAL PRIMARY KEY,
  designer_id BIGINT REFERENCES designers(id),
  event_id BIGINT REFERENCES events(id),
  amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.model_bookings (
  id BIGSERIAL PRIMARY KEY,
  model_id BIGINT REFERENCES models(id),
  event_id BIGINT REFERENCES events(id),
  amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.casting_calls (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  event_id BIGINT REFERENCES events(id),
  applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.designer_collections (
  id BIGSERIAL PRIMARY KEY,
  designer_id BIGINT REFERENCES designers(id),
  title VARCHAR(255),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sponsor_impressions (
  id BIGSERIAL PRIMARY KEY,
  sponsor_id BIGINT,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.venue_inquiries (
  id BIGSERIAL PRIMARY KEY,
  venue_id BIGINT REFERENCES venues(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.designers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designer_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casting_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designer_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow all for now - you can restrict later)
CREATE POLICY "Enable all access for designers" ON public.designers FOR ALL USING (true);
CREATE POLICY "Enable all access for models" ON public.models FOR ALL USING (true);
CREATE POLICY "Enable all access for designer_bookings" ON public.designer_bookings FOR ALL USING (true);
CREATE POLICY "Enable all access for model_bookings" ON public.model_bookings FOR ALL USING (true);
CREATE POLICY "Enable all access for casting_calls" ON public.casting_calls FOR ALL USING (true);
CREATE POLICY "Enable all access for designer_collections" ON public.designer_collections FOR ALL USING (true);
CREATE POLICY "Enable all access for sponsor_impressions" ON public.sponsor_impressions FOR ALL USING (true);
CREATE POLICY "Enable all access for venue_inquiries" ON public.venue_inquiries FOR ALL USING (true);
CREATE POLICY "Enable all access for payments" ON public.payments FOR ALL USING (true);
