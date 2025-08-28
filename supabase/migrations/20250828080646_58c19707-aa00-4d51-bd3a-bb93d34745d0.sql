-- Seed sample verified designers with portfolio images
-- Each insert runs only if the slug doesn't already exist

-- 1) Rossi Couture
INSERT INTO public.designer_profiles (
  id, user_id, brand_name, brand_slug, bio, website_url, portfolio_urls, social_links, is_verified, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Rossi Couture',
  'rossi-couture',
  'Italian haute couture with timeless silhouettes crafted with precision and luxury fabrics.',
  'https://example.com/rossicouture',
  ARRAY[
    'https://images.unsplash.com/photo-1542718610-a1d656d1884b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1510678960173-b2f28be1d00d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&auto=format&fit=crop'
  ]::text[],
  '{"instagram":"https://instagram.com/rossicouture","website":"https://example.com/rossicouture"}'::jsonb,
  true,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.designer_profiles dp WHERE dp.brand_slug = 'rossi-couture'
);

-- 2) Chen Studios
INSERT INTO public.designer_profiles (
  id, user_id, brand_name, brand_slug, bio, website_url, portfolio_urls, social_links, is_verified, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000002'::uuid,
  'Chen Studios',
  'chen-studios',
  'Sustainable fashion with innovative materials and ethical production methods.',
  'https://example.com/chenstudios',
  ARRAY[
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1537832816519-689ad163238b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop'
  ]::text[],
  '{"instagram":"https://instagram.com/chenstudios","website":"https://example.com/chenstudios"}'::jsonb,
  true,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.designer_profiles dp WHERE dp.brand_slug = 'chen-studios'
);

-- 3) Laurent Paris
INSERT INTO public.designer_profiles (
  id, user_id, brand_name, brand_slug, bio, website_url, portfolio_urls, social_links, is_verified, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000003'::uuid,
  'Laurent Paris',
  'laurent-paris',
  'Parisian elegance in modern ready-to-wear for the contemporary audience.',
  'https://example.com/laurentparis',
  ARRAY[
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548426166-5f32dba0d7b3?w=800&auto=format&fit=crop'
  ]::text[],
  '{"instagram":"https://instagram.com/laurentparis","website":"https://example.com/laurentparis"}'::jsonb,
  true,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.designer_profiles dp WHERE dp.brand_slug = 'laurent-paris'
);
