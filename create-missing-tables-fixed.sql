-- Create missing tables for designers and models (fixed for UUID references)
CREATE TABLE IF NOT EXISTS public.designers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  designer_id UUID REFERENCES designers(id),
  event_id UUID REFERENCES events(id),
  amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.model_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES models(id),
  event_id UUID REFERENCES events(id),
  amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.casting_calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  event_id UUID REFERENCES events(id),
  applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.designer_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  designer_id UUID REFERENCES designers(id),
  title VARCHAR(255),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sponsor_impressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sponsor_id UUID,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.venue_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Add sample data
INSERT INTO public.designers (brand_name, bio, style_categories, verified, portfolio_url, years_experience)
VALUES 
  ('Avant Garde Studios', 'Pushing boundaries in sustainable fashion', ARRAY['Sustainable', 'Avant-garde', 'Luxury'], true, 'https://avantgarde.fashion', 8),
  ('Urban Threads', 'Contemporary streetwear meets high fashion', ARRAY['Streetwear', 'Contemporary', 'Urban'], true, 'https://urbanthreads.com', 5),
  ('Ethereal Couture', 'Timeless elegance with modern innovation', ARRAY['Couture', 'Bridal', 'Evening Wear'], true, 'https://ethereal.fashion', 12)
ON CONFLICT (brand_name) DO NOTHING;

INSERT INTO public.models (name, agency, height, measurements, hourly_rate, experience_years, portfolio)
VALUES 
  ('Alexandra Chen', 'Elite Model Management', '5''10"', '{"bust": 34, "waist": 26, "hips": 36}', 500, 3, ARRAY['runway', 'editorial', 'commercial']),
  ('Marcus Williams', 'IMG Models', '6''2"', '{"chest": 40, "waist": 32, "hips": 38}', 450, 5, ARRAY['runway', 'fitness', 'commercial']),
  ('Sofia Martinez', 'Next Models', '5''9"', '{"bust": 35, "waist": 27, "hips": 37}', 600, 7, ARRAY['haute couture', 'editorial', 'runway'])
ON CONFLICT (name) DO NOTHING;
