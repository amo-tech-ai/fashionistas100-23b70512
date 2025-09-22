import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  event_name: string;
  title: string;
  description: string;
  startISO: string;
  endISO?: string;
  start_datetime: string;
  end_datetime?: string;
  imageUrl: string;
  heroImage?: string;
  galleryImages?: string[];
  venue: {
    id: string;
    name: string;
    address?: string;
    city: string;
  };
  organizer?: {
    id: string;
    name: string;
  };
  capacity?: number;
  ticketsSold: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  slug: string;
  metadata?: any;
  priceMin?: number;
  currency?: string;
  available?: boolean;
}

export interface EventSummary extends Event {
  heroImage: string;
  galleryImages: string[];
  priceMin: number;
  currency: string;
  available: boolean;
}

export interface EventFilters {
  status?: string;
  city?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export const listEvents = async (filters: EventFilters = {}): Promise<Event[]> => {
  try {
    // Mock data for now
    const mockEvents: Event[] = [
      {
        id: '1',
        event_name: 'Colombian Fashion Week 2024',
        title: 'Colombian Fashion Week 2024',
        description: 'The biggest fashion event in Colombia featuring top designers and models.',
        startISO: '2024-03-15T19:00:00Z',
        endISO: '2024-03-17T23:00:00Z',
        start_datetime: '2024-03-15T19:00:00Z',
        end_datetime: '2024-03-17T23:00:00Z',
        imageUrl: '/placeholder.svg',
        heroImage: '/placeholder.svg',
        galleryImages: ['/placeholder.svg', '/placeholder.svg'],
        venue: {
          id: 'venue1',
          name: 'Centro de Convenciones Corferias',
          address: 'Carrera 37 # 24-67',
          city: 'Bogotá'
        },
        organizer: {
          id: 'org1',
          name: 'Fashion Colombia'
        },
        capacity: 2000,
        ticketsSold: 1250,
        status: 'published',
        slug: 'colombian-fashion-week-2024',
        metadata: {},
        priceMin: 50000,
        currency: 'COP',
        available: true
      },
      {
        id: '2',
        event_name: 'Emerging Designers Showcase',
        title: 'Emerging Designers Showcase',
        description: 'Discover the next generation of Colombian fashion talent.',
        startISO: '2024-04-20T18:00:00Z',
        endISO: '2024-04-20T22:00:00Z',
        start_datetime: '2024-04-20T18:00:00Z',
        end_datetime: '2024-04-20T22:00:00Z',
        imageUrl: '/placeholder.svg',
        heroImage: '/placeholder.svg',
        galleryImages: ['/placeholder.svg'],
        venue: {
          id: 'venue2',
          name: 'Museo Nacional',
          address: 'Carrera 7 # 28-66',
          city: 'Bogotá'
        },
        capacity: 300,
        ticketsSold: 150,
        status: 'published',
        slug: 'emerging-designers-showcase',
        metadata: {},
        priceMin: 25000,
        currency: 'COP',
        available: true
      }
    ];

    let filteredEvents = mockEvents;

    // Apply filters
    if (filters.status) {
      filteredEvents = filteredEvents.filter(e => e.status === filters.status);
    }

    if (filters.city) {
      filteredEvents = filteredEvents.filter(e => e.venue.city === filters.city);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(e => 
        e.event_name.toLowerCase().includes(searchTerm) ||
        e.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.startDate) {
      filteredEvents = filteredEvents.filter(e => 
        new Date(e.startISO) >= new Date(filters.startDate!)
      );
    }

    if (filters.endDate) {
      filteredEvents = filteredEvents.filter(e => 
        new Date(e.startISO) <= new Date(filters.endDate!)
      );
    }

    // Apply pagination
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    
    return filteredEvents.slice(offset, offset + limit);
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const events = await listEvents();
    return events.find(e => e.id === id) || null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  try {
    const events = await listEvents();
    return events.find(e => e.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

export const getRelatedEvents = async (eventId: string, city?: string): Promise<Event[]> => {
  try {
    const events = await listEvents({ city });
    return events.filter(e => e.id !== eventId).slice(0, 3);
  } catch (error) {
    console.error('Error fetching related events:', error);
    return [];
  }
};