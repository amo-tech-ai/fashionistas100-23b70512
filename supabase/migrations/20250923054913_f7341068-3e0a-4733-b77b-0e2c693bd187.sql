-- FashionOS Core Schema Implementation - Fixed Version
-- Complete business schema with security, validation, and performance optimization

-- =====================================
-- 1. ENUMS FOR CONSISTENT STATUS VALUES
-- =====================================

CREATE TYPE public.user_role AS ENUM ('admin', 'organizer', 'designer', 'venue_owner', 'sponsor', 'attendee');
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE public.subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'past_due');
CREATE TYPE public.venue_type AS ENUM ('indoor', 'outdoor', 'hybrid');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.designer_tier AS ENUM ('emerging', 'established', 'luxury');

-- =====================================
-- 2. CORE BUSINESS TABLES
-- =====================================

-- Organizations table for multi-tenancy
CREATE TABLE public.organizations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    website_url TEXT,
    logo_url TEXT,
    subscription_status subscription_status NOT NULL DEFAULT 'inactive',
    max_events INTEGER DEFAULT 10,
    max_users INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT organizations_name_length CHECK (char_length(name) >= 2),
    CONSTRAINT organizations_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'),
    CONSTRAINT organizations_website_url_format CHECK (website_url IS NULL OR website_url ~ '^https?://'),
    UNIQUE(slug)
);

-- Profiles table (Clerk integration)
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE, -- Clerk user ID
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'attendee',
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT profiles_email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT profiles_phone_format CHECK (phone IS NULL OR phone ~ '^\+?[1-9]\d{1,14}$'),
    UNIQUE(organization_id, email)
);

-- Venues table
CREATE TABLE public.venues (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    address JSONB NOT NULL,
    coordinates JSONB,
    venue_type venue_type NOT NULL DEFAULT 'indoor',
    capacity INTEGER NOT NULL,
    hourly_rate DECIMAL(10,2),
    amenities TEXT[],
    images TEXT[],
    availability_calendar JSONB DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT venues_capacity_positive CHECK (capacity > 0),
    CONSTRAINT venues_hourly_rate_positive CHECK (hourly_rate IS NULL OR hourly_rate >= 0),
    CONSTRAINT venues_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'),
    UNIQUE(organization_id, slug)
);

-- Events table
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    status event_status NOT NULL DEFAULT 'draft',
    capacity INTEGER,
    ticket_price DECIMAL(10,2),
    currency TEXT DEFAULT 'COP',
    tags TEXT[],
    images TEXT[],
    metadata JSONB DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT events_datetime_order CHECK (end_datetime > start_datetime),
    CONSTRAINT events_capacity_positive CHECK (capacity IS NULL OR capacity > 0),
    CONSTRAINT events_ticket_price_positive CHECK (ticket_price IS NULL OR ticket_price >= 0),
    CONSTRAINT events_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'),
    UNIQUE(organization_id, slug)
);

-- Designers table
CREATE TABLE public.designers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    brand_name TEXT NOT NULL,
    slug TEXT NOT NULL,
    bio TEXT,
    style_categories TEXT[],
    tier designer_tier NOT NULL DEFAULT 'emerging',
    years_experience INTEGER DEFAULT 0,
    portfolio_url TEXT,
    instagram_handle TEXT,
    website_url TEXT,
    hourly_rate DECIMAL(10,2),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT designers_years_experience_positive CHECK (years_experience >= 0),
    CONSTRAINT designers_hourly_rate_positive CHECK (hourly_rate IS NULL OR hourly_rate >= 0),
    CONSTRAINT designers_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'),
    CONSTRAINT designers_website_url_format CHECK (website_url IS NULL OR website_url ~ '^https?://'),
    CONSTRAINT designers_instagram_handle_format CHECK (instagram_handle IS NULL OR instagram_handle ~ '^[A-Za-z0-9_.]+$'),
    UNIQUE(organization_id, slug),
    UNIQUE(organization_id, brand_name)
);

-- Designer Profiles (extended designer information)
CREATE TABLE public.designer_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    designer_id UUID NOT NULL REFERENCES public.designers(id) ON DELETE CASCADE,
    showcase_images TEXT[],
    collections JSONB DEFAULT '[]',
    achievements TEXT[],
    press_mentions JSONB DEFAULT '[]',
    certifications TEXT[],
    preferred_materials TEXT[],
    size_ranges TEXT[],
    lead_time_days INTEGER,
    minimum_order_quantity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT designer_profiles_lead_time_positive CHECK (lead_time_days IS NULL OR lead_time_days > 0),
    CONSTRAINT designer_profiles_moq_positive CHECK (minimum_order_quantity IS NULL OR minimum_order_quantity > 0),
    UNIQUE(designer_id)
);

-- Event Bookings
CREATE TABLE public.event_bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    attendee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    ticket_quantity INTEGER NOT NULL DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    payment_intent_id TEXT,
    booking_reference TEXT NOT NULL,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT event_bookings_quantity_positive CHECK (ticket_quantity > 0),
    CONSTRAINT event_bookings_amount_positive CHECK (total_amount >= 0),
    UNIQUE(booking_reference)
);

-- Venue Bookings (without problematic exclusion constraint)
CREATE TABLE public.venue_bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT venue_bookings_time_order CHECK (end_time > start_time),
    CONSTRAINT venue_bookings_amount_positive CHECK (total_amount >= 0)
);

-- Create unique index to prevent venue booking overlaps manually
CREATE UNIQUE INDEX idx_venue_bookings_no_overlap 
ON public.venue_bookings (venue_id, booking_date, start_time, end_time) 
WHERE status != 'cancelled';

-- =====================================
-- 3. UTILITY FUNCTIONS
-- =====================================

-- Function to get current user's organization ID from JWT claims
CREATE OR REPLACE FUNCTION public.requesting_org_id()
RETURNS UUID AS $$
BEGIN
    RETURN (current_setting('request.jwt.claims', true)::json->>'org_id')::uuid;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to get current user ID from JWT claims
CREATE OR REPLACE FUNCTION public.requesting_user_id()
RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('request.jwt.claims', true)::json->>'sub';
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================================
-- 4. TRIGGERS FOR UPDATED_AT
-- =====================================

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_venues_updated_at
    BEFORE UPDATE ON public.venues
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_designers_updated_at
    BEFORE UPDATE ON public.designers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_designer_profiles_updated_at
    BEFORE UPDATE ON public.designer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_bookings_updated_at
    BEFORE UPDATE ON public.event_bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_venue_bookings_updated_at
    BEFORE UPDATE ON public.venue_bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_bookings ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Organizations: Users can view their own organization"
    ON public.organizations FOR SELECT
    USING (id = requesting_org_id());

CREATE POLICY "Organizations: Users can update their own organization"
    ON public.organizations FOR UPDATE
    USING (id = requesting_org_id());

-- Profiles policies
CREATE POLICY "Profiles: Users can view profiles in their organization"
    ON public.profiles FOR SELECT
    USING (organization_id = requesting_org_id());

CREATE POLICY "Profiles: Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (user_id = requesting_user_id() AND organization_id = requesting_org_id());

CREATE POLICY "Profiles: Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (user_id = requesting_user_id() AND organization_id = requesting_org_id());

-- Venues policies
CREATE POLICY "Venues: Users can view venues in their organization"
    ON public.venues FOR SELECT
    USING (organization_id = requesting_org_id());

CREATE POLICY "Venues: Users can insert venues in their organization"
    ON public.venues FOR INSERT
    WITH CHECK (organization_id = requesting_org_id());

CREATE POLICY "Venues: Venue owners and admins can update venues"
    ON public.venues FOR UPDATE
    USING (organization_id = requesting_org_id() AND (
        owner_id = (SELECT id FROM public.profiles WHERE user_id = requesting_user_id()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = requesting_user_id() AND role IN ('admin', 'organizer'))
    ));

-- Events policies
CREATE POLICY "Events: Users can view events in their organization"
    ON public.events FOR SELECT
    USING (organization_id = requesting_org_id());

CREATE POLICY "Events: Users can insert events in their organization"
    ON public.events FOR INSERT
    WITH CHECK (organization_id = requesting_org_id());

CREATE POLICY "Events: Event organizers and admins can update events"
    ON public.events FOR UPDATE
    USING (organization_id = requesting_org_id() AND (
        organizer_id = (SELECT id FROM public.profiles WHERE user_id = requesting_user_id()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = requesting_user_id() AND role IN ('admin', 'organizer'))
    ));

-- Designers policies
CREATE POLICY "Designers: Users can view designers in their organization"
    ON public.designers FOR SELECT
    USING (organization_id = requesting_org_id());

CREATE POLICY "Designers: Users can insert designers in their organization"
    ON public.designers FOR INSERT
    WITH CHECK (organization_id = requesting_org_id());

CREATE POLICY "Designers: Designer owners and admins can update designers"
    ON public.designers FOR UPDATE
    USING (organization_id = requesting_org_id() AND (
        profile_id = (SELECT id FROM public.profiles WHERE user_id = requesting_user_id()) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = requesting_user_id() AND role IN ('admin', 'organizer'))
    ));

-- Designer profiles policies
CREATE POLICY "Designer profiles: Users can view designer profiles in their organization"
    ON public.designer_profiles FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.designers WHERE id = designer_id AND organization_id = requesting_org_id()));

CREATE POLICY "Designer profiles: Designer owners can manage their profiles"
    ON public.designer_profiles FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.designers d 
        JOIN public.profiles p ON d.profile_id = p.id 
        WHERE d.id = designer_id AND p.user_id = requesting_user_id() AND d.organization_id = requesting_org_id()
    ));

-- Event bookings policies
CREATE POLICY "Event bookings: Users can view bookings in their organization"
    ON public.event_bookings FOR SELECT
    USING (organization_id = requesting_org_id());

CREATE POLICY "Event bookings: Users can create bookings in their organization"
    ON public.event_bookings FOR INSERT
    WITH CHECK (organization_id = requesting_org_id());

CREATE POLICY "Event bookings: Attendees can update their own bookings"
    ON public.event_bookings FOR UPDATE
    USING (organization_id = requesting_org_id() AND 
           attendee_id = (SELECT id FROM public.profiles WHERE user_id = requesting_user_id()));

-- Venue bookings policies
CREATE POLICY "Venue bookings: Users can view bookings in their organization"
    ON public.venue_bookings FOR SELECT
    USING (organization_id = requesting_org_id());

CREATE POLICY "Venue bookings: Users can create bookings in their organization"
    ON public.venue_bookings FOR INSERT
    WITH CHECK (organization_id = requesting_org_id());

CREATE POLICY "Venue bookings: Organizers and venue owners can update bookings"
    ON public.venue_bookings FOR UPDATE
    USING (organization_id = requesting_org_id() AND (
        organizer_id = (SELECT id FROM public.profiles WHERE user_id = requesting_user_id()) OR
        EXISTS (SELECT 1 FROM public.venues v WHERE v.id = venue_id AND v.owner_id = (SELECT id FROM public.profiles WHERE user_id = requesting_user_id()))
    ));

-- =====================================
-- 6. PERFORMANCE INDEXES
-- =====================================

-- Foreign key indexes
CREATE INDEX idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_venues_organization_id ON public.venues(organization_id);
CREATE INDEX idx_venues_owner_id ON public.venues(owner_id);
CREATE INDEX idx_events_organization_id ON public.events(organization_id);
CREATE INDEX idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX idx_events_venue_id ON public.events(venue_id);
CREATE INDEX idx_designers_organization_id ON public.designers(organization_id);
CREATE INDEX idx_designers_profile_id ON public.designers(profile_id);
CREATE INDEX idx_designer_profiles_designer_id ON public.designer_profiles(designer_id);
CREATE INDEX idx_event_bookings_organization_id ON public.event_bookings(organization_id);
CREATE INDEX idx_event_bookings_event_id ON public.event_bookings(event_id);
CREATE INDEX idx_event_bookings_attendee_id ON public.event_bookings(attendee_id);
CREATE INDEX idx_venue_bookings_organization_id ON public.venue_bookings(organization_id);
CREATE INDEX idx_venue_bookings_venue_id ON public.venue_bookings(venue_id);
CREATE INDEX idx_venue_bookings_organizer_id ON public.venue_bookings(organizer_id);

-- Composite indexes for common queries
CREATE INDEX idx_events_org_status_datetime ON public.events(organization_id, status, start_datetime);
CREATE INDEX idx_venues_org_active_type ON public.venues(organization_id, is_active, venue_type);
CREATE INDEX idx_designers_org_available_tier ON public.designers(organization_id, is_available, tier);
CREATE INDEX idx_bookings_org_status_date ON public.event_bookings(organization_id, status, created_at);

-- Partial indexes for filtered queries
CREATE INDEX idx_events_published_featured ON public.events(organization_id, start_datetime) 
    WHERE status = 'published' AND is_featured = true;
CREATE INDEX idx_venues_active_available ON public.venues(organization_id, capacity) 
    WHERE is_active = true;
CREATE INDEX idx_designers_verified_available ON public.designers(organization_id, tier) 
    WHERE is_verified = true AND is_available = true;

-- GIN indexes for JSONB and array fields
CREATE INDEX idx_venues_amenities_gin ON public.venues USING GIN(amenities);
CREATE INDEX idx_events_tags_gin ON public.events USING GIN(tags);
CREATE INDEX idx_events_metadata_gin ON public.events USING GIN(metadata);
CREATE INDEX idx_venues_address_gin ON public.venues USING GIN(address);
CREATE INDEX idx_designer_profiles_collections_gin ON public.designer_profiles USING GIN(collections);

-- =====================================
-- 7. COMPATIBILITY VIEW
-- =====================================

-- Create a view that maps to users for compatibility
CREATE VIEW public.users AS
SELECT 
    id,
    user_id,
    email,
    first_name,
    last_name,
    avatar_url,
    role,
    created_at,
    updated_at
FROM public.profiles;

-- =====================================
-- 8. TABLE COMMENTS FOR DOCUMENTATION
-- =====================================

COMMENT ON TABLE public.organizations IS 'Multi-tenant organizations for the FashionOS platform';
COMMENT ON TABLE public.profiles IS 'User profiles integrated with Clerk authentication';
COMMENT ON TABLE public.venues IS 'Fashion event venues with booking capabilities';
COMMENT ON TABLE public.events IS 'Fashion events and shows';
COMMENT ON TABLE public.designers IS 'Fashion designers and brands';
COMMENT ON TABLE public.designer_profiles IS 'Extended designer information and portfolios';
COMMENT ON TABLE public.event_bookings IS 'Event ticket bookings and registrations';
COMMENT ON TABLE public.venue_bookings IS 'Venue rental bookings';

COMMENT ON COLUMN public.organizations.slug IS 'URL-safe organization identifier';
COMMENT ON COLUMN public.profiles.user_id IS 'Clerk user ID for authentication';
COMMENT ON COLUMN public.venues.coordinates IS 'Geolocation coordinates as {lat, lng}';
COMMENT ON COLUMN public.events.metadata IS 'Flexible event metadata and custom fields';
COMMENT ON COLUMN public.designer_profiles.collections IS 'Designer collections with images and details';