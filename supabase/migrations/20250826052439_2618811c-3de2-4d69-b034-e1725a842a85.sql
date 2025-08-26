-- ================================================================
-- Fashion Event MVP: Minimal events + 5 critical tables (corrected, enums via DO blocks)
-- Idempotent, safe to re-run
-- ================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper (idempotent)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- ================================================================
-- Minimal Events table (dependency for several FKs)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,

  -- Core fields only
  event_name VARCHAR(200) NOT NULL,
  description TEXT,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,

  -- Status
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft','published','cancelled')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic constraints
  CONSTRAINT valid_datetime_range CHECK (end_datetime > start_datetime)
);

-- RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published events viewable by all" ON public.events;
CREATE POLICY "Published events viewable by all" ON public.events
FOR SELECT TO authenticated, anon
USING (status = 'published');

DROP POLICY IF EXISTS "Organizers manage own events" ON public.events;
CREATE POLICY "Organizers manage own events" ON public.events
FOR ALL TO authenticated
USING (auth.uid() = organizer_id)
WITH CHECK (auth.uid() = organizer_id);

-- Indexes for events
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_datetime);

-- Trigger for events
DROP TRIGGER IF EXISTS trg_events_updated_at ON public.events;
CREATE TRIGGER trg_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.events IS 'Minimal events table - will be expanded later';

-- ================================================================
-- 1) EVENT_REGISTRATIONS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Registration details
  registration_type VARCHAR(50) DEFAULT 'general' CHECK (registration_type IN ('general','vip','press','industry')),
  status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','cancelled','waitlist')),

  -- Check-in tracking
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,

  -- Contact preferences
  email_notifications BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own registrations" ON public.event_registrations;
CREATE POLICY "Users view own registrations" ON public.event_registrations
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own registrations" ON public.event_registrations;
CREATE POLICY "Users create own registrations" ON public.event_registrations
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Organizers view event registrations" ON public.event_registrations;
CREATE POLICY "Organizers view event registrations" ON public.event_registrations
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.organizer_id = auth.uid()));

DROP POLICY IF EXISTS "Organizers update event registrations" ON public.event_registrations;
CREATE POLICY "Organizers update event registrations" ON public.event_registrations
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.organizer_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.organizer_id = auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_registrations_event ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.event_registrations(status);

-- Trigger
DROP TRIGGER IF EXISTS trg_event_registrations_updated_at ON public.event_registrations;
CREATE TRIGGER trg_event_registrations_updated_at
BEFORE UPDATE ON public.event_registrations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.event_registrations IS 'User registrations for events';

-- ================================================================
-- 2) NOTIFICATIONS (enum via DO block for compatibility)
-- ================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'notification_type' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.notification_type AS ENUM (
      'event_reminder','registration_confirmed','event_cancelled',
      'application_status','new_message','system_update'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Notification content
  type public.notification_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,

  -- Related entities
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,

  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

COMMENT ON TABLE public.notifications IS 'System notifications for users';

-- ================================================================
-- 3) EVENT_IMAGES
-- ================================================================
CREATE TABLE IF NOT EXISTS public.event_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Image details
  image_url TEXT NOT NULL,
  alt_text VARCHAR(200),
  caption TEXT,

  -- Image metadata
  image_type VARCHAR(50) DEFAULT 'gallery' CHECK (image_type IN ('hero','gallery','thumbnail','poster')),
  display_order INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  -- Attribution
  photographer_credit VARCHAR(200),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.event_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active images viewable by all" ON public.event_images;
CREATE POLICY "Active images viewable by all" ON public.event_images
FOR SELECT TO authenticated, anon
USING (is_active = TRUE);

DROP POLICY IF EXISTS "Organizers manage event images" ON public.event_images;
CREATE POLICY "Organizers manage event images" ON public.event_images
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.organizer_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.organizer_id = auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_event_images_event ON public.event_images(event_id);
CREATE INDEX IF NOT EXISTS idx_event_images_type ON public.event_images(image_type, display_order);

-- Trigger
DROP TRIGGER IF EXISTS trg_event_images_updated_at ON public.event_images;
CREATE TRIGGER trg_event_images_updated_at
BEFORE UPDATE ON public.event_images
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.event_images IS 'Photo galleries for events';

-- ================================================================
-- 4) REVIEWS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  review_text TEXT,

  -- Status
  is_published BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(event_id, user_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published reviews viewable by all" ON public.reviews;
CREATE POLICY "Published reviews viewable by all" ON public.reviews
FOR SELECT TO authenticated, anon
USING (is_published = TRUE);

DROP POLICY IF EXISTS "Users manage own reviews" ON public.reviews;
CREATE POLICY "Users manage own reviews" ON public.reviews
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_event ON public.reviews(event_id);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON public.reviews(is_published, created_at) WHERE is_published = TRUE;

-- Trigger
DROP TRIGGER IF EXISTS trg_reviews_updated_at ON public.reviews;
CREATE TRIGGER trg_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.reviews IS 'User reviews and ratings for events';

-- ================================================================
-- 5) CONTACT_FORMS (enum via DO block)
-- ================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'inquiry_type' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.inquiry_type AS ENUM (
      'general','event_inquiry','partnership','media','technical_support','billing','feedback'
    );
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.contact_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact details
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),

  -- Inquiry details
  inquiry_type public.inquiry_type NOT NULL DEFAULT 'general',
  subject VARCHAR(300) NOT NULL,
  message TEXT NOT NULL,

  -- Related entities
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Status tracking
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved','closed')),

  -- Response tracking
  assigned_to UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_forms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own contact forms" ON public.contact_forms;
CREATE POLICY "Users view own contact forms" ON public.contact_forms
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_forms;
CREATE POLICY "Anyone can submit contact forms" ON public.contact_forms
FOR INSERT TO authenticated, anon
WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_forms_status ON public.contact_forms(status, created_at);

-- Trigger
DROP TRIGGER IF EXISTS trg_contact_forms_updated_at ON public.contact_forms;
CREATE TRIGGER trg_contact_forms_updated_at
BEFORE UPDATE ON public.contact_forms
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.contact_forms IS 'Contact form submissions and support tickets';
