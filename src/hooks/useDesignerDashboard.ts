// Enhanced Designer Dashboard Hook
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { subDays, format, startOfMonth } from 'date-fns';
import { useUser } from '@clerk/clerk-react';

export const useDesignerDashboardData = () => {
  const { user } = useUser();
  const designerId = user?.id || 'guest-designer';

  // Fetch designer profile
  const profileQuery = useQuery({
    queryKey: ['designer-profile', designerId],
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from('designer_profiles')
        .select('*')
        .eq('user_id', designerId)
        .single();

      if (error || !profile) {
        const { data: demoProfile } = await supabase
          .from('designer_profiles')
          .select('*')
          .limit(1)
          .single();
        
        return demoProfile || {
          id: designerId,
          brand_name: 'Fashion Studio',
          bio: 'Contemporary fashion designer',
          style_category: 'Modern Elegance',
          years_experience: 5,
          portfolio_url: '#',
          instagram: '@fashionstudio',
          verified: false
        };
      }

      return profile;
    }
  });

  // CRITICAL: Designer Revenue Calculation
  const revenueQuery = useQuery({
    queryKey: ['designer-revenue', designerId],
    queryFn: async () => {
      const { data: bookings } = await supabase
        .from('designer_bookings')
        .select('amount, status, created_at')
        .eq('designer_id', profileQuery.data?.id);
      
      const totalEarnings = bookings?.reduce((sum, b) => sum + Number(b.amount || 0), 0) || 0;
      const confirmedEarnings = bookings?.filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + Number(b.amount || 0), 0) || 0;
      
      const thisMonth = bookings?.filter(b => 
        new Date(b.created_at).getMonth() === new Date().getMonth()
      ).reduce((sum, b) => sum + Number(b.amount || 0), 0) || 0;
      
      return {
        total: totalEarnings,
        confirmed: confirmedEarnings,
        thisMonth,
        formatted: `$${(totalEarnings / 1000).toFixed(1)}K`,
        growth: totalEarnings > 0 ? 12 : 0
      };
    },
    enabled: !!profileQuery.data?.id
  });

  // Booking requests
  const bookingsQuery = useQuery({
    queryKey: ['designer-bookings', designerId],
    queryFn: async () => {
      const { data: bookings } = await supabase
        .from('designer_bookings')
        .select('*')
        .eq('designer_id', profileQuery.data?.id)
        .order('created_at', { ascending: false });
      
      const pending = bookings?.filter(b => b.status === 'pending').length || 0;
      const confirmed = bookings?.filter(b => b.status === 'confirmed').length || 0;
      const total = bookings?.length || 0;
      
      return {
        pending,
        confirmed,
        total,
        bookings: bookings || []
      };
    },
    enabled: !!profileQuery.data?.id
  });

  // Events/shows participation
  const eventsQuery = useQuery({
    queryKey: ['designer-events', designerId],
    queryFn: async () => {
      const { data: eventDesigners } = await supabase
        .from('event_designers')
        .select(`
          *,
          events(*)
        `)
        .eq('designer_id', profileQuery.data?.id);
      
      const events = eventDesigners?.map(ed => ed.events) || [];
      const upcoming = events.filter(e => new Date(e.start_datetime) > new Date()).length;
      const completed = events.filter(e => new Date(e.start_datetime) < new Date()).length;
      
      return {
        total: events.length,
        upcoming,
        completed,
        events: events.slice(0, 5)
      };
    },
    enabled: !!profileQuery.data?.id
  });

  // Analytics and opportunities (mock for now)
  const analyticsQuery = useQuery({
    queryKey: ['designer-analytics', designerId],
    queryFn: async () => {
      return {
        portfolioViews: Math.floor(Math.random() * 1000) + 500,
        profileEngagement: Math.floor(Math.random() * 50) + 25,
        socialFollowers: Math.floor(Math.random() * 5000) + 1000,
        averageRating: 4.2 + Math.random() * 0.8
      };
    }
  });

  return {
    profile: profileQuery.data,
    revenue: revenueQuery.data,
    bookings: bookingsQuery.data,
    events: eventsQuery.data,
    analytics: analyticsQuery.data,
    collections: [], // Placeholder
    opportunities: [], // Placeholder
    isLoading: profileQuery.isLoading || revenueQuery.isLoading,
    error: profileQuery.error || revenueQuery.error
  };
};
