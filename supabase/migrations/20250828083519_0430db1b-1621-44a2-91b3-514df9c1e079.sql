-- Insert sample verified designer profiles for testing
INSERT INTO public.designer_profiles (
  user_id, brand_name, brand_slug, bio, website_url, 
  portfolio_urls, social_links, is_verified
) VALUES 
(
  gen_random_uuid(),
  'Atelier Milano',
  'atelier-milano', 
  'Luxury Italian couture house specializing in Haute Couture and evening wear, based in Bogotá',
  'https://ateliermilano.com',
  ARRAY[
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'
  ],
  '{"instagram": "https://instagram.com/ateliermilano", "twitter": "https://twitter.com/ateliermilano"}',
  true
),
(
  gen_random_uuid(),
  'Verde Studios',
  'verde-studios',
  'Sustainable fashion pioneer creating Ready-to-Wear collections in Medellín with eco-friendly materials',
  'https://verdestudios.co',
  ARRAY[
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500'
  ],
  '{"instagram": "https://instagram.com/verdestudios"}',
  true
),
(
  gen_random_uuid(),
  'Cartagena Bridal',
  'cartagena-bridal',
  'Exquisite Bridal couture house creating dream wedding dresses in the historic city of Cartagena',
  null,
  ARRAY[
    'https://images.unsplash.com/photo-1594736797933-d0ae710da089?w=500'
  ],
  '{"instagram": "https://instagram.com/cartagenabridal"}',
  true
),
(
  gen_random_uuid(),
  'Urban Edge Cali',
  'urban-edge-cali',
  'Contemporary Streetwear brand pushing boundaries with bold designs and urban aesthetics in Cali',
  'https://urbancali.com',
  ARRAY[
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500'
  ],
  '{"instagram": "https://instagram.com/urbancali", "website": "https://urbancali.com"}',
  true
),
(
  gen_random_uuid(),
  'Amazonia Textiles',
  'amazonia-textiles',
  'Sustainable Evening Wear inspired by Colombian biodiversity, handcrafted in Barranquilla',
  'https://amazoniatextiles.com',
  ARRAY[
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=500'
  ],
  '{"instagram": "https://instagram.com/amazoniatextiles"}',
  true
);