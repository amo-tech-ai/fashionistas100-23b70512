import { useEffect, useMemo, useState } from "react";
import { eventService } from "@/services/eventService";
import type { Event } from "@/services/eventService";

export type Venue = {
  name: string;
  address: string;
  city?: string;
};

export type EventSummary = Event & {
  title: string; // Alias for event_name
  startISO: string; // Alias for start_datetime
  endISO: string; // Alias for end_datetime
  venue: Venue;
};

export interface EventFilters {
  city?: string;
  date?: string;
  limit?: number;
  featured?: boolean;
  relatedToId?: string;
}

type UseEventDataParams =
  | { kind: "list"; limit?: number; relatedToId?: string; featured?: boolean; city?: string }
  | { kind: "detail"; id: string };

type UseEventDataResult = {
  data: EventSummary[] | EventSummary | undefined;
  error: string | null;
  isLoading: boolean;
};

/**
 * Unified hook: always returns { data, error, isLoading }.
 * Accepts either a list query or a detail query.
 */
export function useEventData(params: UseEventDataParams): UseEventDataResult {
  const [data, setData] = useState<EventSummary[] | EventSummary | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        if (params.kind === "detail") {
          const result = await eventService.getEvent(params.id);
          if (!cancelled && result) {
            setData(normalizeEvent(result));
          } else if (!cancelled) {
            setError("Event not found");
          }
        } else {
          const { limit, relatedToId, featured, city } = params;
          let result = await eventService.getAllEvents();
          
          // Apply filters
          if (featured) {
            result = await eventService.getFeaturedEvents(limit);
          }
          if (relatedToId) {
            result = result.filter(e => e.id !== relatedToId);
          }
          if (city) {
            result = result.filter(e => {
              const venueData = (e as any).venue || { address: "" };
              const eventCity = extractCityFromAddress(venueData.address || "");
              return eventCity?.toLowerCase().includes(city.toLowerCase());
            });
          }
          if (limit) {
            result = result.slice(0, limit);
          }
          
          if (!cancelled) {
            setData(result.map(normalizeEvent));
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load events");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [JSON.stringify(params)]);

  return { data, error, isLoading };
}

/** Helper: normalize event fields and derive venue.city if missing */
function normalizeEvent(e: Event): EventSummary {
  // Handle venue properly - it might not exist or have the expected structure
  const venueData = (e as any).venue || { name: "TBD", address: "" };
  const venue = {
    name: venueData.name || "TBD",
    address: venueData.address || "",
    city: venueData.city || extractCityFromAddress(venueData.address || "")
  };
  
  return {
    ...e,
    title: e.event_name,
    startISO: e.start_datetime,
    endISO: e.end_datetime,
    venue
  };
}

/** Helper: extract city from address string */
function extractCityFromAddress(address: string): string | undefined {
  if (!address) return undefined;
  const parts = address.split(",").map(s => s.trim());
  return parts.length >= 2 ? parts[parts.length - 2] : undefined;
}

// Legacy hooks for backward compatibility
export function useEvents(filters: EventFilters = {}) {
  const result = useEventData({ 
    kind: "list", 
    ...filters 
  });
  
  return { 
    events: Array.isArray(result.data) ? result.data : [], 
    loading: result.isLoading, 
    error: result.error, 
    refetch: async () => {} 
  };
}

export function useEvent(eventId: string) {
  const result = useEventData({ 
    kind: "detail", 
    id: eventId 
  });
  
  return { 
    event: !Array.isArray(result.data) ? result.data || null : null, 
    loading: result.isLoading, 
    error: result.error, 
    refetch: async () => {} 
  };
}