import { useState, useEffect } from 'react';
import { listPublishedEvents, getEventById } from '@/services/eventService';
import type { EventSummary } from '@/services/eventService';

export interface EventFilters {
  city?: string;
  date?: string;
  limit?: number;
}

// Hook for fetching multiple events
export function useEvents(filters: EventFilters = {}) {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await listPublishedEvents(filters);
      
      if (result.error) {
        setError(result.error);
      } else {
        setEvents(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters.city, filters.date, filters.limit]);

  return { events, loading, error, refetch: fetchEvents };
}

// Hook for fetching a single event
export function useEvent(eventId: string) {
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getEventById(eventId);
      
      if (result.error) {
        setError(result.error);
      } else {
        setEvent(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  return { event, loading, error, refetch: fetchEvent };
}