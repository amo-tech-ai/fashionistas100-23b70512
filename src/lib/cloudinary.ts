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
    // Designer showcase images
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/w_1600,h_900,c_fill,q_auto,f_auto/Designer-1_pvqdus',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554440/designer-2_hjyokj.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554440/designer-3_qwqmr7.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554440/designer-4_jhrxby.jpg',
  ],
  gallery: [
    // Fashion gallery and portfolio images
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554438/runway-8_jbgmch.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554438/runway-6_w9gcpd.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554438/runway-7_tfmzfw.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554438/runway-5_yyqulg.jpg',
  ],
  backstage: [
    // Behind the scenes images
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554440/backstage-1_mqwtfa.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554440/backstage-2_r8j9xk.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554440/backstage-3_vhmscz.jpg',
  ],
  models: [
    // Model portfolio images
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554441/model-1_jxkqnv.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554441/model-2_xqr8pc.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554441/model-3_g9vkjt.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554441/model-4_mhqwzt.jpg',
  ],
  venues: [
    // Fashion venue images
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554442/venue-1_rtpq8w.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554442/venue-2_nmvqxk.jpg',
    'https://res.cloudinary.com/dzqy2ixl0/image/upload/v1753554442/venue-3_yqkfms.jpg',
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
