-- PHASE 2B: EVENTS MANAGEMENT (Production-Ready)
-- Notes:
-- - Fixes smart quotes
-- - Uses existing public.has_role(uuid, app_role)
-- - Adds proper casts for JSONB and arrays
-- - Idempotent and safe to re-run

-- 1) Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2) Reusable timestamp function (kept same signature)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

-- IMPORTANT: Do NOT redefine has_role here. It already exists as:
-- public.has_role(_user_id uuid, _role app_role) RETURNS boolean SECURITY DEFINER

-- 3) EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  -- Primary Identifiers
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(150) UNIQUE NOT NULL,
  organizer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,

  -- Event Basic Information
  event_name varchar(200) NOT NULL,
  event_type varchar(50) NOT NULL
    CHECK (event_type IN ('runway_show','fashion_week','pop_up','exhibition','networking','workshop','gala','trunk_show','sample_sale')),
  event_category varchar(50) DEFAULT 'fashion'
    CHECK (event_category IN ('fashion','luxury','sustainable','emerging','couture','streetwear','accessories')),

  -- Descriptions & Content
  description text NOT NULL,
  short_description varchar(500) NOT NULL,
  highlights text[] DEFAULT '{}'::text[],
  what_to_expect text,
  special_notes text,

  -- Date & Time Management
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  timezone varchar(50) DEFAULT 'America/Bogota',
  doors_open_time time,
  show_start_time time,
  vip_early_access_time time,

  -- Registration & Deadlines
  registration_opens_at timestamptz DEFAULT now(),
  registration_deadline timestamptz,
  early_bird_deadline timestamptz,
  last_minute_sales boolean DEFAULT true,

  -- Capacity Management
  max_attendees integer NOT NULL CHECK (max_attendees > 0),
  current_attendees integer DEFAULT 0,
  vip_capacity integer DEFAULT 0,
  press_capacity integer DEFAULT 0,
  waitlist_enabled boolean DEFAULT true,
  waitlist_count integer DEFAULT 0,

  -- Event Status & Visibility
  status varchar(50) DEFAULT 'draft'
    CHECK (status IN ('draft','review','published','registration_open','sold_out','in_progress','completed','cancelled','postponed')),
  visibility varchar(50) DEFAULT 'public'
    CHECK (visibility IN ('public','private','invite_only','members_only')),
  is_featured boolean DEFAULT false,
  is_virtual boolean DEFAULT false,
  is_hybrid boolean DEFAULT false,

  -- Virtual Event Details
  virtual_platform varchar(50),
  virtual_link text,
  virtual_password varchar(50),
  streaming_start_time time,
  replay_available boolean DEFAULT false,

  -- Financial Information
  base_ticket_price numeric(10,2) NOT NULL DEFAULT 0,
  vip_ticket_price numeric(10,2),
  early_bird_price numeric(10,2),
  student_price numeric(10,2),
  group_discount_threshold integer DEFAULT 5,
  group_discount_percentage numeric(4,2) DEFAULT 10.0 CHECK (group_discount_percentage BETWEEN 0 AND 100),

  -- Media & Marketing Assets
  hero_image_url text,
  gallery_images text[] DEFAULT '{}'::text[],
  promotional_video_url text,
  livestream_thumbnail_url text,
  event_poster_url text,

  -- Social Media Integration
  instagram_hashtag varchar(100),
  social_media_handles jsonb DEFAULT '{}'::jsonb,
  enable_social_sharing boolean DEFAULT true,

  -- SEO & Discovery
  tags text[] DEFAULT '{}'::text[],
  target_audience text[] DEFAULT '{}'::text[],
  age_demographic varchar(50),
  keywords text[] DEFAULT '{}'::text[],

  -- Event Logistics & Requirements
  dress_code varchar(100),
  theme varchar(100),
  language varchar(20) DEFAULT 'es',
  accessibility_accommodations text[] DEFAULT '{}'::text[],
  parking_instructions text,
  public_transport_info text,

  -- Policies & Rules
  refund_policy text,
  cancellation_policy text,
  terms_and_conditions text,
  covid_requirements text,
  photography_allowed boolean DEFAULT true,
  recording_allowed boolean DEFAULT false,

  -- Contact & Support
  contact_email varchar(255),
  contact_phone varchar(20),
  customer_support_hours text,
  emergency_contact varchar(100),

  -- Performance & Analytics
  view_count integer DEFAULT 0,
  interest_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  rating numeric(3,2) CHECK (rating >= 0 AND rating <= 5.0),
  review_count integer DEFAULT 0,

  -- SEO Meta Tags
  meta_title varchar(160),
  meta_description varchar(320),
  canonical_url text,

  -- Administrative
  admin_notes text,
  moderator_approved boolean DEFAULT false,
  featured_until timestamptz,

  -- Generated search column
  search_tsv tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('spanish', coalesce(event_name,'')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(description,'')), 'B')
  ) STORED,

  -- Timestamps & Audit
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,

  -- Business Rules Constraints
  CONSTRAINT valid_datetime_range CHECK (end_datetime > start_datetime),
  CONSTRAINT valid_capacity CHECK ((vip_capacity + press_capacity) <= max_attendees),
  CONSTRAINT valid_early_bird CHECK (early_bird_deadline IS NULL OR registration_deadline IS NULL OR early_bird_deadline <= registration_deadline),
  CONSTRAINT valid_pricing CHECK (base_ticket_price >= 0)
);

-- EVENT SCHEDULES TABLE
CREATE TABLE IF NOT EXISTS public.event_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Schedule Item Details
  schedule_name varchar(200) NOT NULL,
  description text,
  schedule_type varchar(50) NOT NULL
    CHECK (schedule_type IN ('registration','doors_open','show_start','intermission','show_end','cocktail','networking','awards','afterparty')),

  -- Timing
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  duration_minutes integer,

  -- Location & Details
  location varchar(200),
  venue_area varchar(100),
  presenter_name varchar(200),
  required_attendees text[] DEFAULT '{}'::text[],
  capacity_limit integer,

  -- Status
  is_public boolean DEFAULT true,
  is_confirmed boolean DEFAULT false,
  is_cancelled boolean DEFAULT false,
  cancellation_reason text,
  display_order integer DEFAULT 0,
  is_mandatory boolean DEFAULT false,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- PERFORMANCE INDEXES
-- Events table
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_venue ON public.events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_events_featured_true ON public.events(is_featured) WHERE is_featured;
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(status, published_at) WHERE status IN ('published','registration_open');
CREATE INDEX IF NOT EXISTS idx_events_capacity ON public.events(max_attendees, current_attendees);
CREATE INDEX IF NOT EXISTS idx_events_date_range ON public.events(start_datetime, end_datetime);
CREATE INDEX IF NOT EXISTS idx_events_search_tsv ON public.events USING GIN (search_tsv);

-- Case-insensitive unique slug index
CREATE UNIQUE INDEX IF NOT EXISTS ux_events_slug_lower ON public.events (LOWER(slug));

-- Schedules indexes
CREATE INDEX IF NOT EXISTS idx_event_schedules_event ON public.event_schedules(event_id);
CREATE INDEX IF NOT EXISTS idx_event_schedules_time ON public.event_schedules(start_time);
CREATE INDEX IF NOT EXISTS idx_event_schedules_type ON public.event_schedules(schedule_type);
CREATE INDEX IF NOT EXISTS idx_event_schedules_order ON public.event_schedules(event_id, display_order);

-- RLS POLICIES
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_schedules ENABLE ROW LEVEL SECURITY;

-- Events policies
DROP POLICY IF EXISTS "Published events viewable by everyone" ON public.events;
CREATE POLICY "Published events viewable by everyone"
ON public.events FOR SELECT TO authenticated, anon
USING (status IN ('published','registration_open','sold_out','in_progress','completed'));

DROP POLICY IF EXISTS "Organizers view own events" ON public.events;
CREATE POLICY "Organizers view own events"
ON public.events FOR SELECT TO authenticated
USING (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers manage own events" ON public.events;
CREATE POLICY "Organizers manage own events"
ON public.events FOR ALL TO authenticated
USING (auth.uid() = organizer_id)
WITH CHECK (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Admins manage all events" ON public.events;
CREATE POLICY "Admins manage all events"
ON public.events FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Event schedules policies
DROP POLICY IF EXISTS "Event schedules follow event visibility" ON public.event_schedules;
CREATE POLICY "Event schedules follow event visibility"
ON public.event_schedules FOR SELECT TO authenticated, anon
USING (
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = event_schedules.event_id
      AND (
        events.status IN ('published','registration_open','sold_out','in_progress','completed')
        OR events.organizer_id = auth.uid()
      )
  )
);

DROP POLICY IF EXISTS "Organizers manage event schedules" ON public.event_schedules;
CREATE POLICY "Organizers manage event schedules"
ON public.event_schedules FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = event_schedules.event_id
      AND events.organizer_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = event_schedules.event_id
      AND events.organizer_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins manage all schedules" ON public.event_schedules;
CREATE POLICY "Admins manage all schedules"
ON public.event_schedules FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- TRIGGERS
DROP TRIGGER IF EXISTS trg_events_updated_at ON public.events;
CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_event_schedules_updated_at ON public.event_schedules;
CREATE TRIGGER trg_event_schedules_updated_at
BEFORE UPDATE ON public.event_schedules
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Slug generation function for events
CREATE OR REPLACE FUNCTION public.generate_event_slug()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  base text;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base := lower(regexp_replace(coalesce(NEW.event_name,''), '[^a-zA-Z0-9]+', '-', 'g'));
    base := btrim(base, '-');
    NEW.slug := base || '-' || to_char(NEW.start_datetime, 'YYYY-MM-DD');
  END IF;

  -- Ensure uniqueness with loop
  WHILE EXISTS (
    SELECT 1 FROM public.events e
    WHERE lower(e.slug) = lower(NEW.slug)
      AND e.id <> coalesce(NEW.id, gen_random_uuid())
  ) LOOP
    NEW.slug := NEW.slug || '-' || extract(epoch FROM now())::int;
  END LOOP;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_generate_event_slug ON public.events;
CREATE TRIGGER trg_generate_event_slug
BEFORE INSERT OR UPDATE OF slug, event_name, start_datetime ON public.events
FOR EACH ROW EXECUTE FUNCTION public.generate_event_slug();

-- Status timestamp function
CREATE OR REPLACE FUNCTION public.set_event_status_timestamps()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    IF NEW.status IN ('published','registration_open') THEN
      NEW.published_at := coalesce(NEW.published_at, now());
    END IF;
    IF NEW.status = 'completed' THEN
      NEW.completed_at := coalesce(NEW.completed_at, now());
    END IF;
    IF NEW.status = 'cancelled' THEN
      NEW.cancelled_at := coalesce(NEW.cancelled_at, now());
    END IF;
    RETURN NEW;
  END IF;

  -- Handle UPDATE - only set on status transitions
  IF (OLD.status NOT IN ('published','registration_open') AND NEW.status IN ('published','registration_open')) THEN
    NEW.published_at := now();
  END IF;
  IF (OLD.status <> 'completed' AND NEW.status = 'completed') THEN
    NEW.completed_at := now();
  END IF;
  IF (OLD.status <> 'cancelled' AND NEW.status = 'cancelled') THEN
    NEW.cancelled_at := now();
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_event_status_timestamps ON public.events;
CREATE TRIGGER trg_event_status_timestamps
BEFORE INSERT OR UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_event_status_timestamps();

-- Realtime configuration (optional but safe)
ALTER TABLE public.events REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
  END IF;
END $$;