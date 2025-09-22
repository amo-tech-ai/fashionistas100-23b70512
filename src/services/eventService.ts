import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  event_name: string;
  title?: string; // For backward compatibility
  description: string;
  start_datetime: string;
  end_datetime: string;
  startISO?: string; // For backward compatibility
  endISO?: string; // For backward compatibility
  venue_id: string;
  venue?: { name: string; address: string }; // For backward compatibility
  organizer_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  heroImage?: string;
  galleryImages?: string[];
  capacity?: number;
  ticketsSold?: number;
  priceMin?: number;
  currency?: string;
  available?: boolean;
  slug?: string;
}

// Legacy type aliases for backward compatibility
export type EventSummary = Event;

export interface EventFilters {
  type?: string;
  date?: string;
  location?: string;
  price?: string;
}

export const eventService = {
  async getAllEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_datetime', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllEvents:', error);
      return [];
    }
  },

  async getEvent(id: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getEvent:', error);
      return null;
    }
  },

  async searchEvents(query: string, filters: EventFilters = {}): Promise<Event[]> {
    try {
      let queryBuilder = supabase
        .from('events')
        .select('*');

      if (query) {
        queryBuilder = queryBuilder.or(`event_name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, error } = await queryBuilder
        .order('start_datetime', { ascending: true });

      if (error) {
        console.error('Error searching events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchEvents:', error);
      return [];
    }
  },

  async getFeaturedEvents(limit: number = 6): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'active')
        .order('start_datetime', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFeaturedEvents:', error);
      return [];
    }
  }
};

// Legacy function names for backward compatibility
export const listPublishedEvents = eventService.getAllEvents;
export const getEventById = eventService.getEvent;

export default eventService;