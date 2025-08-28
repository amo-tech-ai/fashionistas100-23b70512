import { resolveImageUrl } from '@/assets';

// Image utility hook for handling database image URLs
export const useImageResolver = () => {
  const resolveImage = (dbImageUrl: string | null, fallback?: string): string => {
    if (!dbImageUrl) {
      return fallback || '/placeholder.svg';
    }
    
    return resolveImageUrl(dbImageUrl);
  };

  return { resolveImage };
};