// Leap/Encore Backend Client Configuration
// This connects your FashionOS frontend to the Leap backend

import { createClient } from '@encore.dev/client';

// Define the API base URL based on environment
const API_BASE_URL = import.meta.env.VITE_LEAP_API_URL || 'http://localhost:4000';

// Create Encore client instance
export const leapClient = createClient<LeapAPI>({
  baseURL: API_BASE_URL,
  // Add authentication headers if needed
  headers: () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
});

// API Type Definitions (from your Leap backend)
interface LeapAPI {
  event: {
    create: (params: CreateEventParams) => Promise<Event>;
    get: (id: number) => Promise<Event>;
    list: (params?: ListEventsParams) => Promise<Event[]>;
    publish: (id: number) => Promise<void>;
    search: (query: string) => Promise<Event[]>;
    getAnalytics: (id: number) => Promise<EventAnalytics>;
  };
  
  booking: {
    book: (params: BookEventParams) => Promise<Booking>;
    get: (id: string) => Promise<Booking>;
    list: () => Promise<Booking[]>;
    getBookingDetails: () => Promise<BookingDetails>;
  };
  
  venue: {
    getAnalytics: (id: number) => Promise<VenueAnalytics>;
    getOptimization: (id: number) => Promise<VenueOptimization>;
    getComparison: (id: number) => Promise<VenueComparison>;
  };
  
  organizer: {
    getDashboardMetrics: (id: number) => Promise<DashboardMetrics>;
  };
  
  notification: {
    sendConfirmationEmail: (params: EmailParams) => Promise<void>;
  };
  
  user: {
    create: (params: CreateUserParams) => Promise<User>;
    get: (id: string) => Promise<User>;
  };
  
  realtime: {
    subscribeToEventUpdates: (callback: (update: EventUpdate) => void) => () => void;
  };
}

// Types
export interface Event {
  id: number;
  name: string;
  date: Date;
  venue: string;
  capacity: number;
  description?: string;
  organizerId: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: Date;
  publishedAt?: Date;
}

export interface Booking {
  id: string;
  eventId: number;
  userId: string;
  ticketTier: string;
  quantity: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  createdAt: Date;
}

export interface CreateEventParams {
  name: string;
  date: Date;
  venue: string;
  capacity: number;
  description?: string;
  organizerId: number;
}

export interface ListEventsParams {
  status?: string;
  organizerId?: number;
  fromDate?: Date;
  toDate?: Date;
}

export interface BookEventParams {
  eventId: number;
  ticketTier: string;
  quantity: number;
}

export interface EventAnalytics {
  totalBookings: number;
  revenue: number;
  capacityUtilization: number;
  demographics: unknown;
}

export interface VenueAnalytics {
  occupancyRate: number;
  averageTicketPrice: number;
  peakHours: string[];
}

export interface DashboardMetrics {
  totalEvents: number;
  upcomingEvents: number;
  totalRevenue: number;
  totalAttendees: number;
}

// Export types for use in components
export type {
  LeapAPI,
  User,
  CreateUserParams,
  EmailParams,
  EventUpdate,
  BookingDetails,
  VenueOptimization,
  VenueComparison
};