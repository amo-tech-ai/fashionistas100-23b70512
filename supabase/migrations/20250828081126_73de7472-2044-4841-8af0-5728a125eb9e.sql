-- Fix designer_profiles FK, add triggers, enforce unique slug, and seed sample data
-- 1) Drop existing FK (likely pointing to auth.users), then point to public.profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_name = 'designer_profiles_user_id_fkey'
      AND tc.table_schema = 'public'
      AND tc.table_name = 'designer_profiles'
  ) THEN
    ALTER TABLE public.designer_profiles DROP CONSTRAINT designer_profiles_user_id_fkey;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    WHERE tc.table_schema = 'public'
      AND tc.table_name = 'designer_profiles'
      AND tc.constraint_type = 'FOREIGN KEY'
  ) THEN
    ALTER TABLE public.designer_profiles
      ADD CONSTRAINT designer_profiles_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE CASCADE;
  END IF;
END$$;

-- 2) Ensure unique brand_slug
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'designer_profiles_brand_slug_key'
  ) THEN
    ALTER TABLE public.designer_profiles
      ADD CONSTRAINT designer_profiles_brand_slug_key UNIQUE (brand_slug);
  END IF;
END$$;

-- 3) Add triggers for slug generation and updated_at
-- set_updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'set_updated_at_designer_profiles'
      AND c.relname = 'designer_profiles' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER set_updated_at_designer_profiles
      BEFORE UPDATE ON public.designer_profiles
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

-- generate_designer_slug trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'generate_designer_slug_trigger'
      AND c.relname = 'designer_profiles' AND n.nspname = 'public'
  ) THEN
    CREATE TRIGGER generate_designer_slug_trigger
      BEFORE INSERT OR UPDATE ON public.designer_profiles
      FOR EACH ROW EXECUTE FUNCTION public.generate_designer_slug();
  END IF;
END$$;

-- 4) Seed three profiles and matching designer_profiles rows
WITH seed AS (
  SELECT 
    gen_random_uuid() AS user_id,
    'Rossi Couture' AS brand_name,
    'rossi-couture' AS brand_slug,
    'Italian haute couture with timeless silhouettes crafted with precision and luxury fabrics. Over 15 years of experience creating pieces for global elite.' AS bio,
    'https://rossicouture.com' AS website_url,
    ARRAY[
      'https://images.unsplash.com/photo-1542718610-a1d656d1884b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510678960173-b2f28be1d00d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&auto=format&fit=crop'
    ]::text[] AS portfolio_urls,
    '{"instagram":"https://instagram.com/rossicouture","website":"https://rossicouture.com"}'::jsonb AS social_links
  UNION ALL
  SELECT 
    gen_random_uuid(),
    'Chen Studios',
    'chen-studios',
    'Sustainable fashion with innovative materials and ethical production methods. Revolutionizing the industry with eco-friendly designs.',
    'https://chenstudios.com',
    ARRAY[
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1537832816519-689ad163238b?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop'
    ]::text[],
    '{"instagram":"https://instagram.com/chenstudios","website":"https://chenstudios.com"}'::jsonb
  UNION ALL
  SELECT 
    gen_random_uuid(),
    'Laurent Paris',
    'laurent-paris',
    'Parisian elegance in modern ready-to-wear for the contemporary woman. Sophisticated pieces with timeless appeal.',
    'https://laurentparis.com',
    ARRAY[
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548426166-5f32dba0d7b3?w=800&auto=format&fit=crop'
    ]::text[],
    '{"instagram":"https://instagram.com/laurentparis","website":"https://laurentparis.com"}'::jsonb
)
-- Insert profiles for the generated user_ids if profile does not exist
, created_profiles AS (
  INSERT INTO public.profiles (id, email, full_name)
  SELECT s.user_id, NULL, s.brand_name
  FROM seed s
  ON CONFLICT (id) DO NOTHING
  RETURNING id
)
-- Insert designers if not present
INSERT INTO public.designer_profiles (
  user_id, brand_name, brand_slug, bio, website_url, portfolio_urls, social_links, is_verified
)
SELECT s.user_id, s.brand_name, s.brand_slug, s.bio, s.website_url, s.portfolio_urls, s.social_links, true
FROM seed s
WHERE NOT EXISTS (
  SELECT 1 FROM public.designer_profiles dp WHERE dp.brand_slug = s.brand_slug
);
