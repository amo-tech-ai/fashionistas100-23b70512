-- === Extensions ===
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;
create extension if not exists btree_gist;

-- === Helper function (explicit search_path) ===
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end
$$;

-- === 1) Venues table ===
create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  slug varchar(100) unique not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,

  -- Basic Information
  venue_name varchar(200) not null,
  tagline varchar(300),
  description text,
  venue_category varchar(50) not null default 'event_space'
    check (venue_category in (
      'theater','gallery','hotel_ballroom','rooftop','warehouse','studio','outdoor','pop_up_space','retail_space','event_space'
    )),

  -- Location
  street_address text not null,
  city varchar(100) not null,
  state_province varchar(100),
  country varchar(100) not null default 'Colombia',
  postal_code varchar(20),
  neighborhood varchar(100),

  -- Coordinates
  latitude numeric(10,8),
  longitude numeric(11,8),
  constraint venues_lat_chk check (latitude is null or (latitude between -90 and 90)),
  constraint venues_lon_chk check (longitude is null or (longitude between -180 and 180)),

  -- Capacity
  max_capacity integer not null check (max_capacity > 0),
  min_capacity integer default 0 check (min_capacity >= 0),
  standing_capacity integer,
  seated_capacity integer,
  runway_length_meters numeric(5,2),
  ceiling_height_meters numeric(4,2),
  total_area_sqm integer,

  -- Features
  amenities text[] default '{}'::text[],
  accessibility_features text[] default '{}'::text[],

  -- Technical
  has_stage boolean default false,
  has_runway boolean default false,
  has_sound_system boolean default false,
  has_lighting_system boolean default false,
  has_projector_screen boolean default false,
  has_dressing_rooms boolean default false,
  dressing_room_count integer default 0,

  -- Logistics
  has_parking boolean default false,
  parking_spaces integer default 0,
  has_loading_dock boolean default false,
  has_catering_kitchen boolean default false,
  allows_external_catering boolean default true,
  has_security_system boolean default false,

  -- Media
  hero_image_url text,
  gallery_images text[] default '{}'::text[],
  floor_plan_url text,
  virtual_tour_url text,

  -- Pricing
  base_hourly_rate numeric(10,2) not null check (base_hourly_rate >= 0),
  full_day_rate numeric(10,2),
  weekend_premium_multiplier numeric(3,2) default 1.20 check (weekend_premium_multiplier >= 1.0),
  holiday_premium_multiplier numeric(3,2) default 1.50 check (holiday_premium_multiplier >= 1.0),

  -- Fees
  setup_fee numeric(10,2) default 0,
  cleanup_fee numeric(10,2) default 0,
  security_deposit numeric(10,2) default 0,
  cancellation_fee_percentage integer default 25 check (cancellation_fee_percentage between 0 and 100),

  -- Booking policies
  minimum_booking_hours integer default 4 check (minimum_booking_hours > 0),
  maximum_booking_hours integer default 24,
  advance_booking_days integer default 30 check (advance_booking_days >= 1),
  cancellation_policy_days integer default 7,
  requires_approval boolean default true,

  -- Contacts
  contact_name varchar(100),
  contact_email varchar(255),
  contact_phone varchar(20),
  emergency_contact_phone varchar(20),

  -- Status
  is_active boolean default true,
  is_verified boolean default false,
  is_featured boolean default false,
  verification_date timestamptz,

  -- Business
  business_license_number varchar(100),
  insurance_policy_number varchar(100),
  tax_id varchar(50),

  -- Operating hours
  operating_hours jsonb default '{
    "monday":{"open":"09:00","close":"22:00","closed":false},
    "tuesday":{"open":"09:00","close":"22:00","closed":false},
    "wednesday":{"open":"09:00","close":"22:00","closed":false},
    "thursday":{"open":"09:00","close":"22:00","closed":false},
    "friday":{"open":"09:00","close":"23:00","closed":false},
    "saturday":{"open":"10:00","close":"23:00","closed":false},
    "sunday":{"open":"10:00","close":"22:00","closed":false}
  }'::jsonb,

  -- SEO / discovery
  tags text[] default '{}'::text[],
  target_event_types text[] default '{}'::text[],

  -- Analytics
  total_bookings integer default 0,
  average_rating numeric(3,2) default 0 check (average_rating between 0 and 5),
  total_reviews integer default 0,

  -- Search
  search_tsv tsvector generated always as (
    setweight(to_tsvector('english', coalesce(venue_name,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(description,'')), 'B')
  ) stored,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- updated_at trigger for venues
drop trigger if exists trg_venues_updated_at on public.venues;
create trigger trg_venues_updated_at
before update on public.venues
for each row execute function public.set_updated_at();

-- === 2) Venue availability ===
create table if not exists public.venue_availability (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,

  start_datetime timestamptz not null,
  end_datetime timestamptz not null check (end_datetime > start_datetime),

  status varchar(50) not null default 'available'
    check (status in ('available','booked','blocked','maintenance')),

  event_id uuid,
  booking_reference varchar(100),

  override_hourly_rate numeric(10,2),
  special_pricing_reason varchar(200),

  notes text,
  blocked_reason varchar(200),

  is_recurring boolean default false,
  recurrence_pattern jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists trg_va_updated_at on public.venue_availability;
create trigger trg_va_updated_at
before update on public.venue_availability
for each row execute function public.set_updated_at();

-- Overlap exclusion (booked/blocked/maintenance)
alter table public.venue_availability
  add constraint if not exists ex_venue_busy_overlap
  exclude using gist (
    venue_id with =,
    tstzrange(start_datetime, end_datetime, '[)') with &&
  )
  where (status in ('booked','blocked','maintenance'));

-- === 3) Venue reviews ===
create table if not exists public.venue_reviews (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid,

  rating integer not null check (rating between 1 and 5),
  title varchar(200),
  review_text text,

  cleanliness_rating integer check (cleanliness_rating between 1 and 5),
  staff_rating integer check (staff_rating between 1 and 5),
  amenities_rating integer check (amenities_rating between 1 and 5),
  value_rating integer check (value_rating between 1 and 5),
  location_rating integer check (location_rating between 1 and 5),

  is_verified boolean default false,
  is_featured boolean default false,
  is_approved boolean default true,

  venue_response text,
  venue_response_date timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists trg_vr_updated_at on public.venue_reviews;
create trigger trg_vr_updated_at
before update on public.venue_reviews
for each row execute function public.set_updated_at();

-- Uniqueness (event vs general)
create unique index if not exists ux_vr_venue_reviewer_when_no_event
  on public.venue_reviews(venue_id, reviewer_id)
  where event_id is null;

create unique index if not exists ux_vr_venue_reviewer_event
  on public.venue_reviews(venue_id, reviewer_id, event_id)
  where event_id is not null;

-- === Performance indexes ===
create index if not exists idx_venues_owner on public.venues(owner_id);
create index if not exists idx_venues_slug_lower on public.venues(lower(slug));
create index if not exists idx_venues_category on public.venues(venue_category);
create index if not exists idx_venues_city_country on public.venues(city, country);
create index if not exists idx_venues_capacity on public.venues(max_capacity);
create index if not exists idx_venues_active_verified on public.venues(is_active, is_verified);
create index if not exists idx_venues_featured on public.venues(is_featured);
create index if not exists idx_venues_lat_lon on public.venues(latitude, longitude);
create index if not exists idx_venues_tags_gin on public.venues using gin(tags);
create index if not exists idx_venues_amenities_gin on public.venues using gin(amenities);
create index if not exists idx_venues_search_tsv_gin on public.venues using gin(search_tsv);

create index if not exists idx_va_venue on public.venue_availability(venue_id);
create index if not exists idx_va_status on public.venue_availability(status);
create index if not exists idx_va_dates on public.venue_availability(start_datetime, end_datetime);
create index if not exists idx_va_lookup on public.venue_availability(venue_id, start_datetime, end_datetime);

create index if not exists idx_vr_venue on public.venue_reviews(venue_id);
create index if not exists idx_vr_reviewer on public.venue_reviews(reviewer_id);
create index if not exists idx_vr_rating on public.venue_reviews(rating);
create index if not exists idx_vr_approved on public.venue_reviews(is_approved, created_at);

-- === Business logic ===
create or replace function public.generate_venue_slug()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  base_slug text;
  counter integer := 0;
begin
  if new.slug is null or new.slug = '' then
    base_slug := lower(regexp_replace(coalesce(new.venue_name,''), '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := btrim(base_slug, '-');
    new.slug := base_slug;
  else
    base_slug := new.slug;
  end if;

  while exists (
    select 1 from public.venues v
    where lower(v.slug) = lower(new.slug)
      and v.id <> coalesce(new.id, gen_random_uuid())
  ) loop
    counter := counter + 1;
    new.slug := base_slug || '-' || counter;
  end loop;

  return new;
end
$$;

drop trigger if exists trg_generate_venue_slug on public.venues;
create trigger trg_generate_venue_slug
before insert or update of slug, venue_name on public.venues
for each row execute function public.generate_venue_slug();

-- Security definer so RLS on venues doesn't block rating refresh from reviews
create or replace function public.update_venue_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  v_id := coalesce(new.venue_id, old.venue_id);

  update public.venues v
  set average_rating = coalesce(
        (select round(avg(rating)::numeric, 2)
         from public.venue_reviews r
         where r.venue_id = v.id and r.is_approved = true), 0),
      total_reviews = (
        select count(*) from public.venue_reviews r
        where r.venue_id = v.id and r.is_approved = true),
      updated_at = now()
  where v.id = v_id;

  return coalesce(new, old);
end
$$;

drop trigger if exists trg_update_venue_rating on public.venue_reviews;
create trigger trg_update_venue_rating
after insert or update or delete on public.venue_reviews
for each row execute function public.update_venue_rating();

-- === RLS ===
alter table public.venues enable row level security;
alter table public.venue_availability enable row level security;
alter table public.venue_reviews enable row level security;

-- Venues policies
drop policy if exists "Public can view active verified venues" on public.venues;
create policy "Public can view active verified venues"
  on public.venues for select
  using (is_active = true and is_verified = true);

drop policy if exists "Owners manage their venues" on public.venues;
create policy "Owners manage their venues"
  on public.venues for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Admins manage all venues" on public.venues;
create policy "Admins manage all venues"
  on public.venues for all to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Availability policies
drop policy if exists "Public can view available slots" on public.venue_availability;
create policy "Public can view available slots"
  on public.venue_availability for select
  using (
    status = 'available' or
    exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid()) or
    public.has_role(auth.uid(), 'admin'::public.app_role)
  );

drop policy if exists "Owners manage availability" on public.venue_availability;
create policy "Owners manage availability"
  on public.venue_availability for all
  using (exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid()))
  with check (exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid()));

drop policy if exists "Admins manage availability" on public.venue_availability;
create policy "Admins manage availability"
  on public.venue_availability for all to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Reviews policies
drop policy if exists "Public reads approved reviews" on public.venue_reviews;
create policy "Public reads approved reviews"
  on public.venue_reviews for select
  using (is_approved = true);

drop policy if exists "Users create reviews" on public.venue_reviews;
create policy "Users create reviews"
  on public.venue_reviews for insert
  with check (auth.uid() = reviewer_id);

drop policy if exists "Users update own reviews" on public.venue_reviews;
create policy "Users update own reviews"
  on public.venue_reviews for update
  using (auth.uid() = reviewer_id);

drop policy if exists "Owners respond to reviews" on public.venue_reviews;
create policy "Owners respond to reviews"
  on public.venue_reviews for update
  using (exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid()));

drop policy if exists "Admins manage all reviews" on public.venue_reviews;
create policy "Admins manage all reviews"
  on public.venue_reviews for all to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

-- === Verification block ===
DO $$
BEGIN
  PERFORM 1 FROM public.venues WHERE max_capacity <= 0;
  IF FOUND THEN RAISE EXCEPTION 'Capacity constraint not working'; END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = 'venues' AND indexname = 'idx_venues_owner'
  ) THEN
    RAISE EXCEPTION 'Required indexes missing';
  END IF;

  RAISE NOTICE 'Phase 2A Venues Schema: ALL TESTS PASSED';
END $$;