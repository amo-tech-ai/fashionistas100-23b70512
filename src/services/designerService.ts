import { supabase } from '@/integrations/supabase/client';

export interface Designer {
  id: string;
  userId: string;
  brandName: string;
  brandSlug: string;
  bio?: string;
  websiteUrl?: string;
  portfolioUrls: string[];
  socialLinks: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  isVerified: boolean;
  specialties?: string[];
  location?: string;
  memberSince: string;
  createdAt?: string;
}

export interface DesignerFilters {
  verified?: boolean;
  specialty?: string;
  location?: string;
  search?: string;
  sortBy?: 'popularity' | 'newest' | 'alphabetical' | 'oldest';
  page?: number;
  limit?: number;
  offset?: number;
}

export const listDesigners = async (filters: DesignerFilters = {}): Promise<Designer[]> => {
  try {
    // Mock data for now since we don't have the actual table structure
    const mockDesigners: Designer[] = [
      {
        id: '1',
        userId: 'user1',
        brandName: 'Elegante Studio',
        brandSlug: 'elegante-studio',
        bio: 'Contemporary fashion with Colombian heritage',
        websiteUrl: 'https://elegante.co',
        portfolioUrls: ['/placeholder.svg', '/placeholder.svg'],
        socialLinks: {
          instagram: 'https://instagram.com/elegante',
          website: 'https://elegante.co'
        },
        isVerified: true,
        specialties: ['Contemporary', 'Formal'],
        location: 'Bogotá, Colombia',
        memberSince: '2023-01-15',
        createdAt: '2023-01-15'
      },
      {
        id: '2',
        userId: 'user2',
        brandName: 'Tropical Couture',
        brandSlug: 'tropical-couture',
        bio: 'Vibrant designs inspired by Colombian culture',
        websiteUrl: 'https://tropicalcouture.co',
        portfolioUrls: ['/placeholder.svg'],
        socialLinks: {
          instagram: 'https://instagram.com/tropicalcouture'
        },
        isVerified: false,
        specialties: ['Casual', 'Beachwear'],
        location: 'Cartagena, Colombia',
        memberSince: '2023-03-20',
        createdAt: '2023-03-20'
      }
    ];

    // Apply filters
    let filteredDesigners = mockDesigners;

    if (filters.verified !== undefined) {
      filteredDesigners = filteredDesigners.filter(d => d.isVerified === filters.verified);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredDesigners = filteredDesigners.filter(d => 
        d.brandName.toLowerCase().includes(searchTerm) ||
        d.bio?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.specialty) {
      filteredDesigners = filteredDesigners.filter(d => 
        d.specialties?.includes(filters.specialty!)
      );
    }

    if (filters.location) {
      filteredDesigners = filteredDesigners.filter(d => 
        d.location?.includes(filters.location!)
      );
    }

    // Apply sorting
    if (filters.sortBy === 'alphabetical') {
      filteredDesigners.sort((a, b) => a.brandName.localeCompare(b.brandName));
    } else if (filters.sortBy === 'newest') {
      filteredDesigners.sort((a, b) => new Date(b.memberSince).getTime() - new Date(a.memberSince).getTime());
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const offset = filters.offset || (page - 1) * limit;
    const endIndex = offset + limit;

    return filteredDesigners.slice(offset, endIndex);
  } catch (error) {
    console.error('Error fetching designers:', error);
    return [];
  }
};

export const getDesignerBySlug = async (slug: string): Promise<Designer | null> => {
  try {
    const designers = await listDesigners();
    return designers.find(d => d.brandSlug === slug) || null;
  } catch (error) {
    console.error('Error fetching designer:', error);
    return null;
  }
};

export const getDesignerById = async (id: string): Promise<Designer | null> => {
  try {
    const designers = await listDesigners();
    return designers.find(d => d.id === id) || null;
  } catch (error) {
    console.error('Error fetching designer:', error);
    return null;
  }
};