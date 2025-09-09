// Enhanced Hook with Real Revenue Calculations
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { subDays, startOfDay } from 'date-fns';

export const useOrganizerDashboardData = () => {
  const user = { id: 'temp-user' }; // Temporary mock user
  // Fetch events data
  const eventsQuery = useQuery({
    queryKey: ['organizer-events'],
    queryFn: async () => {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('start_datetime', { ascending: true });
      
      if (error) throw error;
      
      const active = events?.filter(e => 
        e.status === 'active' || e.status === 'published'
      ).length || 0;
      
      const thisWeek = events?.filter(e => {
        const eventDate = new Date(e.start_datetime);
        const weekAgo = subDays(new Date(), 7);
        return eventDate >= weekAgo;
      }).length || 0;
      
      return { 
        events: events || [], 
        activeCount: active,
        thisWeek: thisWeek
      };
    }
  });

  // CRITICAL: Real Revenue Calculation
  const revenueQuery = useQuery({
    queryKey: ['organizer-revenue'],
    queryFn: async () => {
      const [bookings, venueBookings, sponsorships] = await Promise.all([
        supabase.from('bookings').select('total_amount').not('total_amount', 'is', null),
        supabase.from('venue_bookings').select('total_amount').not('total_amount', 'is', null),
        supabase.from('sponsorships').select('amount').not('amount', 'is', null)
      ]);
      
      const bookingRevenue = bookings.data?.reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;
      const venueRevenue = venueBookings.data?.reduce((sum, v) => sum + Number(v.total_amount), 0) || 0;
      const sponsorRevenue = sponsorships.data?.reduce((sum, s) => sum + Number(s.amount), 0) || 0;
      const totalRevenue = bookingRevenue + venueRevenue + sponsorRevenue;
      
      return {
        total: totalRevenue,
        breakdown: { bookingRevenue, venueRevenue, sponsorRevenue },
        formatted: `$${(totalRevenue / 1000).toFixed(0)}K`,
        growth: totalRevenue > 0 ? 15 : 0 // Mock growth for now
      };
    },
    refetchInterval: 30000 // Real-time updates
  });

  // Ticket Sales Calculation
  const ticketSalesQuery = useQuery({
    queryKey: ['organizer-tickets'],
    queryFn: async () => {
      const { data: tickets } = await supabase
        .from('event_tickets')
        .select('quantity_sold, price')
        .not('quantity_sold', 'is', null);
      
      const totalSold = tickets?.reduce((sum, t) => sum + (t.quantity_sold || 0), 0) || 0;
      const totalRevenue = tickets?.reduce((sum, t) => sum + ((t.quantity_sold || 0) * (t.price || 0)), 0) || 0;
      const averagePrice = totalSold > 0 ? totalRevenue / totalSold : 0;
      
      return {
        ticketsSold: totalSold,
        revenue: totalRevenue,
        averagePrice: averagePrice,
        formatted: `$${averagePrice.toFixed(2)}`
      };
    }
  });

  // Attendees count with growth
  const attendeesQuery = useQuery({
    queryKey: ['organizer-attendees'],
    queryFn: async () => {
      const { count: registrations } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true });
      
      const { count: attendees } = await supabase
        .from('attendees')
        .select('*', { count: 'exact', head: true });
      
      const total = (registrations || 0) + (attendees || 0);
      const lastMonth = Math.max(0, total - Math.floor(total * 0.15)); // Mock 15% growth
      const growth = lastMonth > 0 ? Math.round(((total - lastMonth) / lastMonth) * 100) : 0;
      
      return {
        total,
        lastMonth,
        growth,
        formatted: total.toLocaleString()
      };
    }
  });

  // Messages/notifications
  const messagesQuery = useQuery({
    queryKey: ['organizer-messages'],
    queryFn: async () => {
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      return notifications?.map(n => ({
        id: n.id,
        type: n.type || 'info',
        message: n.message || n.title,
        time: new Date(n.created_at).toLocaleTimeString(),
        urgent: n.type === 'error' || n.type === 'warning'
      })) || [];
    }
  });

  // Return enhanced data with loading states
  return {
    events: eventsQuery.data,
    revenue: revenueQuery.data,
    ticketSales: ticketSalesQuery.data,
    attendees: attendeesQuery.data,
    messages: messagesQuery.data,
    isLoading: eventsQuery.isLoading || revenueQuery.isLoading,
    error: eventsQuery.error || revenueQuery.error
  };
};
