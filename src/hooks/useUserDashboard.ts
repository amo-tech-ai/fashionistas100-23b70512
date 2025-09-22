// Hook to fetch real data for User Dashboard
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { subDays, format } from 'date-fns';

export const useUserDashboardData = () => {
  // Provide demo data when no user is authenticated
  const user = null;
  const userEmail = null;
  const userId = null;

  // Fetch user's tickets
  const ticketsQuery = useQuery({
    queryKey: ['user-tickets', userId],
    queryFn: async () => {
      // Get user's bookings
      const { data: registrations, error: regError } = await supabase
        .from('bookings')
        .select(`
          *,
          events (
            id,
            title,
            start_datetime,
            end_datetime,
            venue_id,
            status
          )
        `)
        .eq('user_id', userId || 'guest')
        .order('created_at', { ascending: false });

      if (regError) console.error('Registration error:', regError);

      // Get user's bookings
      const { data: bookings, error: bookError } = await supabase
        .from('bookings')
        .select(`
          *,
          events (
            id,
            event_name,
            start_datetime,
            venue_id
          )
        `)
        .or(`user_id.eq.${userId},customer_email.eq.${userEmail}`)
        .order('created_at', { ascending: false });

      if (bookError) console.error('Booking error:', bookError);

      return {
        registrations: registrations || [],
        bookings: bookings || [],
        total: (registrations?.length || 0) + (bookings?.length || 0)
      };
    }
  });

  // Fetch upcoming events user might be interested in
  const upcomingEventsQuery = useQuery({
    queryKey: ['user-upcoming-events'],
    queryFn: async () => {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .in('status', ['active', 'upcoming', 'published'])
        .gte('start_datetime', new Date().toISOString())
        .order('start_datetime', { ascending: true })
        .limit(6);

      if (error) console.error('Events error:', error);

      return events || [];
    }
  });

  // Fetch user's favorite designers/followed items
  const favoritesQuery = useQuery({
    queryKey: ['user-favorites', userId],
    queryFn: async () => {
      // Get designer profiles
      const { data: designers, error: designerError } = await supabase
        .from('designer_profiles')
        .select('*')
        .limit(4);

      if (designerError) console.error('Designer error:', designerError);

      // Get venues
      const { data: venues, error: venueError } = await supabase
        .from('venues')
        .select('*')
        .limit(4);

      if (venueError) console.error('Venue error:', venueError);

      return {
        designers: designers || [],
        venues: venues || []
      };
    }
  });

  // Calculate user stats
  const statsQuery = useQuery({
    queryKey: ['user-stats', userId],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30);

      // Count total events attended
      const { count: eventsAttended } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId || 'guest')
        .eq('status', 'confirmed');

      // Count bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .or(`user_id.eq.${userId},customer_email.eq.${userEmail}`);

      // Calculate total spent
      const { data: bookingAmounts } = await supabase
        .from('bookings')
        .select('total_amount')
        .or(`user_id.eq.${userId},customer_email.eq.${userEmail}`)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const totalSpent = bookingAmounts?.reduce((sum, b) => 
        sum + (b.total_amount || 0), 0) || 0;

      return {
        eventsAttended: eventsAttended || 0,
        totalBookings: totalBookings || 0,
        totalSpent,
        memberSince: user?.createdAt ? 
          format(new Date(user.createdAt), 'MMM yyyy') : 'New Member'
      };
    }
  });

  return {
    tickets: ticketsQuery.data,
    upcomingEvents: upcomingEventsQuery.data,
    favorites: favoritesQuery.data,
    stats: statsQuery.data,
    isLoading: ticketsQuery.isLoading || 
               upcomingEventsQuery.isLoading || 
               favoritesQuery.isLoading ||
               statsQuery.isLoading,
    user: {
      name: user?.fullName || user?.firstName || 'Fashion Enthusiast',
      email: userEmail || '',
      image: user?.imageUrl
    }
  };
};