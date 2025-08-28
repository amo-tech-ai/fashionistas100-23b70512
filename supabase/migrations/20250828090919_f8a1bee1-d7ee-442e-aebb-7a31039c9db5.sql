-- Update event images with proper production image URLs
UPDATE event_images SET image_url = CASE 
  WHEN image_url = '/src/assets/hero-runway-new.jpg' THEN '/hero-runway-new.jpg'
  WHEN image_url = '/src/assets/event-poster.jpg' THEN '/event-poster.jpg'
  WHEN image_url = '/src/assets/designer-studio.jpg' THEN '/designer-studio.jpg'
  WHEN image_url = '/src/assets/runway-1.jpg' THEN '/runway-1.jpg'
  WHEN image_url = '/src/assets/runway-2.jpg' THEN '/runway-2.jpg'
  WHEN image_url = '/src/assets/runway-3.jpg' THEN '/runway-3.jpg'
  WHEN image_url = '/src/assets/runway-4.jpg' THEN '/runway-4.jpg'
  WHEN image_url = '/src/assets/runway-5.jpg' THEN '/runway-5.jpg'
  WHEN image_url = '/src/assets/runway-6.jpg' THEN '/runway-6.jpg'
  ELSE image_url
END
WHERE image_url LIKE '/src/assets/%';

-- Add more gallery images for better event presentation
INSERT INTO event_images (event_id, image_url, image_type, display_order, is_active) VALUES
-- Fashion Week gallery
('b6eee46a-b967-4535-859f-239039a512aa', '/runway-1.jpg', 'gallery', 2, true),
('b6eee46a-b967-4535-859f-239039a512aa', '/runway-2.jpg', 'gallery', 3, true),
('b6eee46a-b967-4535-859f-239039a512aa', '/runway-3.jpg', 'gallery', 4, true),

-- Alta Costura gallery  
('adcb416d-777f-452b-a9d8-b9f32be43a69', '/runway-4.jpg', 'gallery', 2, true),
('adcb416d-777f-452b-a9d8-b9f32be43a69', '/runway-3.jpg', 'gallery', 3, true),

-- Sustainable Fashion gallery
('4d341958-f297-4181-bb4f-c5fbc83d828b', '/designer-studio-production.jpg', 'gallery', 2, true),
('4d341958-f297-4181-bb4f-c5fbc83d828b', '/runway-4.jpg', 'gallery', 3, true),

-- Urban Fashion gallery
('bddf9da3-a20f-4d2d-91b6-bd7fae9d1268', '/runway-1.jpg', 'gallery', 2, true),
('bddf9da3-a20f-4d2d-91b6-bd7fae9d1268', '/runway-2.jpg', 'gallery', 3, true),

-- Bridal Experience gallery
('c1f03c66-89a8-4ebb-8b19-a054a20622a2', '/runway-6.jpg', 'gallery', 2, true),
('c1f03c66-89a8-4ebb-8b19-a054a20622a2', '/event-poster.jpg', 'gallery', 3, true);