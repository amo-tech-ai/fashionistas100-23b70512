import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BookingData {
  id: string;
  booking_reference?: string;
  event_id: string;
  profile_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  event?: {
    title: string;
    start_datetime: string;
    tags?: string[];
  };
  profile?: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
  booking_tickets?: Array<{
    quantity: number;
    unit_price: number;
    event_ticket_id: string;
    event_ticket?: {
      name: string;
    };
  }>;
}

export const useBookingsData = () => {
  return useQuery({
    queryKey: ['bookings-dashboard'],
    queryFn: async () => {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          event:events(title, start_datetime, tags),
          profile:profiles(first_name, last_name, email),
          booking_tickets(
            quantity,
            unit_price,
            event_ticket_id,
            event_ticket:event_tickets(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate metrics
      const totalBookings = bookings?.length || 0;
      const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
      const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
      const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0;
      
      // Calculate total tickets sold (sum of quantities)
      const totalTickets = bookings?.reduce((sum, booking) => {
        const ticketQty = booking.booking_tickets?.reduce((t, bt) => t + bt.quantity, 0) || 0;
        return sum + ticketQty;
      }, 0) || 0;

      // Calculate total earnings (confirmed bookings only)
      const totalEarnings = bookings
        ?.filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      // Group by category (from event tags)
      const categoryBreakdown: Record<string, number> = {};
      bookings?.forEach(booking => {
        const category = booking.event?.tags?.[0] || 'Other';
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
      });

      // Weekly trend data (last 7 days)
      const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayBookings = bookings?.filter(b => {
          const bookingDate = new Date(b.created_at);
          return bookingDate.toDateString() === date.toDateString();
        }).length || 0;

        return {
          day: dayName,
          bookings: dayBookings,
          date: date.toISOString(),
        };
      });

      return {
        bookings: bookings as BookingData[],
        metrics: {
          totalBookings,
          confirmedBookings,
          pendingBookings,
          cancelledBookings,
          totalTickets,
          totalEarnings,
        },
        categoryBreakdown,
        weeklyData,
      };
    },
    staleTime: 30000, // 30 seconds
  });
};
