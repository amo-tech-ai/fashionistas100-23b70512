// Image utility hook for handling database image URLs
export const useImageResolver = () => {
  // Simple URL mapping for production paths
  const imageUrlMap: Record<string, string> = {
    '/src/assets/hero-runway-new.jpg': '/hero-runway-new.jpg',
    '/src/assets/hero-runway.jpg': '/hero-runway-new.jpg', 
    '/src/assets/event-poster.jpg': '/event-poster.jpg',
    '/src/assets/designer-studio.jpg': '/designer-studio.jpg',
    '/src/assets/runway-1.jpg': '/runway-1.jpg',
    '/src/assets/runway-2.jpg': '/runway-2.jpg',
    '/src/assets/runway-3.jpg': '/runway-3.jpg',
    '/src/assets/runway-4.jpg': '/runway-4.jpg',
    '/src/assets/runway-5.jpg': '/runway-5.jpg',
    '/src/assets/runway-6.jpg': '/runway-6.jpg',
    '/designer-studio-production.jpg': '/designer-studio-production.jpg',
  };

  const resolveImage = (dbImageUrl: string | null, fallback?: string): string => {
    if (!dbImageUrl) {
      return fallback || '/placeholder.svg';
    }
    
    // Check if URL needs mapping
    const mappedUrl = imageUrlMap[dbImageUrl];
    if (mappedUrl) {
      return mappedUrl;
    }
    
    // Return the URL as-is for other cases
    return dbImageUrl;
  };

  return { resolveImage };
};