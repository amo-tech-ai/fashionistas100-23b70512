// Hybrid Service - Uses both Supabase and Leap Backend
// This demonstrates how to leverage both systems

import { supabase } from '@/integrations/supabase/client';
import { leapClient } from './leapClient';

/**
 * Hybrid Event Service
 * - Uses Supabase for designer data (existing)
 * - Uses Leap for event management (new features)
 */
export class HybridEventService {
  
  /**
   * Create a fashion event with designer association
   * Uses both Leap and Supabase
   */
  static async createFashionEvent(eventData: {
    name: string;
    date: Date;
    venue: string;
    capacity: number;
    description: string;
    designerIds: string[];
  }) {
    try {
      // 1. Create event in Leap backend
      const leapEvent = await leapClient.event.create({
        name: eventData.name,
        date: eventData.date,
        venue: eventData.venue,
        capacity: eventData.capacity,
        description: eventData.description,
        organizerId: 1 // You'd get this from current user
      });

      // 2. Link designers from Supabase
      if (eventData.designerIds.length > 0) {
        const { data: designers, error } = await supabase
          .from('designer_profiles')
          .select('*')
          .in('id', eventData.designerIds);

        if (!error && designers) {
          // Store designer-event relationship in Supabase
          const designerEvents = designers.map(designer => ({
            event_id: leapEvent.id,
            designer_id: designer.id,
            event_name: leapEvent.name,
            event_date: leapEvent.date
          }));

          await supabase
            .from('designer_events')
            .insert(designerEvents);
        }
      }

      // 3. Publish event if ready
      await leapClient.event.publish(leapEvent.id);

      // 4. Send notifications via Leap
      await leapClient.notification.sendConfirmationEmail({
        to: 'organizer@fashion.com',
        subject: 'Event Created Successfully',
        body: `Your event "${leapEvent.name}" has been created and published.`
      });

      return { success: true, event: leapEvent };
    } catch (error) {
      console.error('Error creating fashion event:', error);
      return { success: false, error };
    }
  }

  /**
   * Get event with designer information
   */
  static async getEventWithDesigners(eventId: number) {
    try {
      // Get event from Leap
      const event = await leapClient.event.get(eventId);

      // Get associated designers from Supabase
      const { data: designerEvents } = await supabase
        .from('designer_events')
        .select(`
          designer_id,
          designer_profiles (
            id,
            brand_name,
            brand_slug,
            bio,
            portfolio_urls
          )
        `)
        .eq('event_id', eventId);

      return {
        ...event,
        designers: designerEvents?.map(de => de.designer_profiles) || []
      };
    } catch (error) {
      console.error('Error fetching event with designers:', error);
      throw error;
    }
  }

  /**
   * Book event with user preferences from Supabase
   */
  static async bookEventWithPreferences(params: {
    eventId: number;
    ticketTier: string;
    quantity: number;
    userId: string;
  }) {
    try {
      // Get user preferences from Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.userId)
        .single();

      // Create booking in Leap
      const booking = await leapClient.booking.book({
        eventId: params.eventId,
        ticketTier: params.ticketTier,
        quantity: params.quantity
      });

      // Store booking reference in Supabase for user history
      await supabase
        .from('user_bookings')
        .insert({
          user_id: params.userId,
          leap_booking_id: booking.id,
          event_id: params.eventId,
          created_at: new Date()
        });

      // Get ML recommendations from Leap
      // (This would be a custom endpoint in your Leap backend)
      
      return booking;
    } catch (error) {
      console.error('Error booking event:', error);
      throw error;
    }
  }
}

/**
 * Example: Using WebSocket from Leap for real-time updates
 */
export function subscribeToEventUpdates(eventId: number) {
  // Subscribe to Leap WebSocket for real-time event updates
  const unsubscribe = leapClient.realtime.subscribeToEventUpdates((update) => {
    if (update.eventId === eventId) {
      console.log('Event update received:', update);
      
      // Update local state or trigger UI updates
      // You could also sync this with Supabase if needed
    }
  });

  return unsubscribe;
}