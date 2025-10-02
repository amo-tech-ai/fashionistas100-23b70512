// Cloudinary configuration for Fashionistas
export const CLOUDINARY_CONFIG = {
  cloudName: 'dzqy2ixl0',
  collectionId: '86f7b7cc7c880fe4a6b183872414ae20',
};

// Fashion images from your Cloudinary collection
export const fashionImages = {
  hero: {
    // Main hero image - runway show
    main: 'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554437/RUNWAy-4_mv4pll.jpg',
    // Alternative hero images
    runway: 'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554438/runway-2_vqzxsh.jpg',
    model: 'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554437/runway-3_khflw6.jpg',
  },
  events: [
    // Fashion week and runway events
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554437/RUNWAy-4_mv4pll.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554438/runway-2_vqzxsh.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554437/runway-3_khflw6.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554437/runway-1_kx8fzn.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554439/runway-9_vdrlvx.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554439/runway-10_qydbir.jpg',
  ],
  designers: [
    // Reliable designer showcase images (optimized, CDN-backed)
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495121553079-4c61bcce1894?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503342452485-86ff0a8befe1?w=1600&auto=format&fit=crop',
  ],
  gallery: [
    // Fashion gallery and portfolio images
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200&auto=format&fit=crop',
  ],
  backstage: [
    // Behind the scenes images
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1200&auto=format&fit=crop',
  ],
  models: [
    // Model portfolio images (reliable CDN)
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&auto=format&fit=crop',
  ],
  venues: [
    // Fashion venue images (reliable CDN)
    'https://images.unsplash.com/photo-1519167758481-83f29da8c686?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&auto=format&fit=crop',
  ],
  // Fallback images in case Cloudinary is down
  fallback: {
    hero: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
    event: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop',
    designer: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
  }
};

// Helper function to get a random image from a category
export const getRandomImage = (category: keyof typeof fashionImages): string => {
  const images = fashionImages[category];
  if (Array.isArray(images)) {
    return images[Math.floor(Math.random() * images.length)];
  }
  return fashionImages.fallback.hero;
};

// Helper function to handle image errors
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, fallbackCategory: 'hero' | 'event' | 'designer' = 'hero') => {
  const target = e.target as HTMLImageElement;
  target.src = fashionImages.fallback[fallbackCategory];
};
