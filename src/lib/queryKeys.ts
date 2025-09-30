/**
 * Centralized React Query key factory
 * Ensures consistent cache keys across the app
 */

export interface EventFilters {
  status?: 'upcoming' | 'past' | 'draft';
  search?: string;
  category?: string;
}

export const queryKeys = {
  // Auth & User
  me: ['me'] as const,
  resolvedRole: (userId?: string) => ['resolved-role', userId] as const,
  profile: (userId: string) => ['profile', userId] as const,
  
  // Events
  events: (filters?: EventFilters) => ['events', filters] as const,
  event: (id: string) => ['event', id] as const,
  eventTickets: (eventId: string) => ['event-tickets', eventId] as const,
  eventAttendees: (eventId: string) => ['event-attendees', eventId] as const,
  
  // Tickets
  tickets: ['tickets'] as const,
  ticket: (id: string) => ['ticket', id] as const,
  userTickets: (userId: string) => ['user-tickets', userId] as const,
  
  // Sponsors
  sponsors: ['sponsors'] as const,
  sponsor: (id: string) => ['sponsor', id] as const,
  sponsorMetrics: (sponsorId: string) => ['sponsor-metrics', sponsorId] as const,
  
  // Venues
  venues: ['venues'] as const,
  venue: (id: string) => ['venue', id] as const,
  venueBookings: (venueId: string) => ['venue-bookings', venueId] as const,
  
  // Designers
  designers: ['designers'] as const,
  designer: (id: string) => ['designer', id] as const,
  designerPortfolio: (designerId: string) => ['designer-portfolio', designerId] as const,
  
  // Analytics
  dashboardMetrics: (role: string) => ['dashboard-metrics', role] as const,
  revenueData: (filters?: any) => ['revenue-data', filters] as const,
} as const;

/**
 * Type-safe error normalization
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (typeof error === 'string') return new Error(error);
  return new Error('An unknown error occurred');
}

/**
 * Generic API wrapper with error handling
 */
export async function apiCall<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    throw normalizeError(error);
  }
}
