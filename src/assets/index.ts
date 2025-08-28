// Image asset exports for the application
import heroRunwayNew from './hero-runway-new.jpg';
import heroRunwayProduction from './hero-runway-production.jpg';
import eventPoster from './event-poster.jpg';
import designerStudio from './designer-studio.jpg';
import designerStudioProduction from './designer-studio-production.jpg';
import runway1 from './runway-1.jpg';
import runway2 from './runway-2.jpg';
import runway3 from './runway-3.jpg';
import runway4 from './runway-4.jpg';
import runway5 from './runway-5.jpg';
import runway6 from './runway-6.jpg';

// Hero images
export const heroImages = {
  runway: heroRunwayNew,
  runwayProduction: heroRunwayProduction,
  poster: eventPoster,
  studio: designerStudio,
  studioProduction: designerStudioProduction,
};

// Gallery images
export const galleryImages = {
  runway1,
  runway2,
  runway3,
  runway4,
  runway5,
  runway6,
};

// Image mapping for database URLs
export const imageUrlMap: Record<string, string> = {
  '/src/assets/hero-runway-new.jpg': heroRunwayNew,
  '/src/assets/hero-runway.jpg': heroRunwayNew,
  '/src/assets/event-poster.jpg': eventPoster,
  '/src/assets/designer-studio.jpg': designerStudio,
  '/src/assets/runway-1.jpg': runway1,
  '/src/assets/runway-2.jpg': runway2,
  '/src/assets/runway-3.jpg': runway3,
  '/src/assets/runway-4.jpg': runway4,
  '/src/assets/runway-5.jpg': runway5,
  '/src/assets/runway-6.jpg': runway6,
};

// Function to resolve image URL from database path
export const resolveImageUrl = (dbUrl: string): string => {
  // If it's already a proper URL or import, return as-is
  if (dbUrl.startsWith('http') || dbUrl.startsWith('data:') || dbUrl.startsWith('/')) {
    // Check if it needs mapping from our assets
    return imageUrlMap[dbUrl] || dbUrl;
  }
  
  // Return the URL as-is if no mapping found
  return dbUrl;
};

// Default images for fallbacks
export const defaultImages = {
  hero: heroRunwayProduction,
  gallery: runway1,
  designer: designerStudioProduction,
};

// Function to get default image by type
export const getDefaultImage = (type: 'hero' | 'gallery' | 'designer'): string => {
  return defaultImages[type];
};