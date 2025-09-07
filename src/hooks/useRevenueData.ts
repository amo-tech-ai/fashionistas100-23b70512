import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface RevenueData {
  total: number;
  formatted: string;
  breakdown: {
    bookings: number;
    venues: number;
    tickets: number;
  };
  growth: number;
  monthlyRevenue: number;
}

export const useRevenueData = () => {
  return useQuery({
    queryKey: ['revenue-data'],
    queryFn: async (): Promise<RevenueData> => {
      try {
        // Get all revenue sources in parallel
        const [bookingsResult, venueBookingsResult, ticketsResult] = await Promise.all([
          supabase
            .from('bookings')
            .select('total_amount, created_at')
            .not('total_amount', 'is', null),
          
          supabase
            .from('venue_bookings')
            .select('total_amount, created_at')
            .not('total_amount', 'is', null),
          
          supabase
            .from('event_tickets')
            .select('price, quantity_sold')
            .not('price', 'is', null)
            .not('quantity_sold', 'is', null)
        ]);

        // Calculate revenue from each source
        const bookingRevenue = bookingsResult.data?.reduce(
          (sum, b) => sum + (Number(b.total_amount) || 0), 0
        ) || 0;

        const venueRevenue = venueBookingsResult.data?.reduce(
          (sum, vb) => sum + (Number(vb.total_amount) || 0), 0
        ) || 0;

        const ticketRevenue = ticketsResult.data?.reduce(
          (sum, t) => sum + ((Number(t.price) || 0) * (Number(t.quantity_sold) || 0)), 0
        ) || 0;

        const totalRevenue = bookingRevenue + venueRevenue + ticketRevenue;

        // Calculate monthly revenue for growth
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const monthlyBookings = bookingsResult.data?.filter(
          b => new Date(b.created_at) >= thirtyDaysAgo
        ) || [];
        
        const monthlyVenues = venueBookingsResult.data?.filter(
          vb => new Date(vb.created_at) >= thirtyDaysAgo
        ) || [];

        const monthlyRevenue = monthlyBookings.reduce(
          (sum, b) => sum + (Number(b.total_amount) || 0), 0
        ) + monthlyVenues.reduce(
          (sum, vb) => sum + (Number(vb.total_amount) || 0), 0
        );

        // Mock growth calculation (in real app, compare with previous period)
        const growthRate = totalRevenue > 0 ? 22.5 : 0;

        return {
          total: totalRevenue,
          formatted: totalRevenue > 0 ? `$${(totalRevenue / 1000).toFixed(1)}K` : '$0',
          breakdown: {
            bookings: bookingRevenue,
            venues: venueRevenue,
            tickets: ticketRevenue
          },
          growth: growthRate,
          monthlyRevenue
        };
      } catch (error) {
        console.error('Revenue data error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};
