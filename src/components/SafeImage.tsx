import { useState } from 'react';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Image component with automatic fallback on 404/error
 * Prevents broken images from crashing the UI
 */
export function SafeImage({ 
  src, 
  alt, 
  className, 
  fallback = '/placeholder.svg',
  loading = 'lazy'
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
      console.warn(`Failed to load image: ${src}, using fallback`);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
}
