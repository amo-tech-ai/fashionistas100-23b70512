-- Create sample verified designers without foreign key dependencies
-- Using dummy user_ids that won't violate constraints

INSERT INTO public.designer_profiles (
  user_id, brand_name, brand_slug, bio, website_url, portfolio_urls, social_links, is_verified
)
SELECT
  gen_random_uuid(), -- Generate random UUID to avoid foreign key issues
  'Rossi Couture',
  'rossi-couture',
  'Italian haute couture with timeless silhouettes crafted with precision and luxury fabrics. Over 15 years of experience creating pieces for global elite.',
  'https://rossicouture.com',
  ARRAY[
    'https://images.unsplash.com/photo-1542718610-a1d656d1884b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1510678960173-b2f28be1d00d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&auto=format&fit=crop'
  ]::text[],
  '{"instagram":"https://instagram.com/rossicouture","website":"https://rossicouture.com"}'::jsonb,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.designer_profiles WHERE brand_slug = 'rossi-couture'
);

INSERT INTO public.designer_profiles (
  user_id, brand_name, brand_slug, bio, website_url, portfolio_urls, social_links, is_verified
)
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
  '{"instagram":"https://instagram.com/chenstudios","website":"https://chenstudios.com"}'::jsonb,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.designer_profiles WHERE brand_slug = 'chen-studios'
);

INSERT INTO public.designer_profiles (
  user_id, brand_name, brand_slug, bio, website_url, portfolio_urls, social_links, is_verified
)
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
  '{"instagram":"https://instagram.com/laurentparis","website":"https://laurentparis.com"}'::jsonb,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.designer_profiles WHERE brand_slug = 'laurent-paris'
);