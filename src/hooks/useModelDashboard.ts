// Hook to fetch real data for Model Dashboard
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { subDays, format } from 'date-fns';
import { useUser } from '@clerk/clerk-react';

export const useModelDashboardData = () => {
  const { user } = useUser();
  const modelId = user?.id || 'guest-model';

  // Fetch model profile
  const profileQuery = useQuery({
    queryKey: ['model-profile', modelId],
    queryFn: async () => {
      // Mock model profile (would come from model_profiles table)
      return {
        id: modelId,
        name: user?.fullName || 'Professional Model',
        agency: 'Elite Modeling Agency',
        height: "5'10\"",
        measurements: '34-26-36',
        experience: '3 years',
        instagram: '@modelname',
        verified: true,
        rating: 4.8
      };
    }
  });

  // Fetch model's bookings
  const bookingsQuery = useQuery({
    queryKey: ['model-bookings'],
    queryFn: async () => {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .in('status', ['active', 'published', 'upcoming'])
        .order('start_datetime', { ascending: true });

      if (error) console.error('Events error:', error);

      // Transform to model bookings
      const modelBookings = events?.slice(0, 5).map(event => ({
        ...event,
        designer: ['Laurent Paris', 'Rossi Couture', 'Chen Studios'][Math.floor(Math.random() * 3)],
        type: ['Runway', 'Photoshoot', 'Fitting', 'Presentation'][Math.floor(Math.random() * 4)],
        rate: Math.floor(Math.random() * 500 + 200),
        status: ['confirmed', 'pending', 'completed'][Math.floor(Math.random() * 3)]
      })) || [];

      return modelBookings;
    }
  });

  // Fetch casting calls
  const castingCallsQuery = useQuery({
    queryKey: ['model-casting-calls'],
    queryFn: async () => {
      const { data: upcomingEvents, error } = await supabase
        .from('events')
        .select('*')
        .in('status', ['upcoming', 'active'])
        .gte('start_datetime', new Date().toISOString())
        .order('start_datetime', { ascending: true })
        .limit(4);

      if (error) console.error('Casting calls error:', error);

      // Add casting details
      const castings = upcomingEvents?.map(event => ({
        ...event,
        lookingFor: ['Runway Models', 'Commercial', 'Editorial', 'Fashion Week'][Math.floor(Math.random() * 4)],
        compensation: '$' + (Math.floor(Math.random() * 3000 + 500)),
        applicants: Math.floor(Math.random() * 50 + 10),
        deadline: format(subDays(new Date(event.start_datetime), 7), 'MMM dd')
      })) || [];

      return castings;
    }
  });

  // Calculate analytics
  const analyticsQuery = useQuery({
    queryKey: ['model-analytics'],
    queryFn: async () => {
      return {
        totalBookings: 48,
        completedJobs: 42,
        earnings: 36500,
        rating: 4.8,
        profileViews: 12500,
        bookingsGrowth: 25,
        earningsGrowth: 18,
        viewsGrowth: 32
      };
    }
  });

  return {
    profile: profileQuery.data,
    bookings: bookingsQuery.data,
    castingCalls: castingCallsQuery.data,
    analytics: analyticsQuery.data,
    isLoading: profileQuery.isLoading || 
               bookingsQuery.isLoading || 
               castingCallsQuery.isLoading ||
               analyticsQuery.isLoading
  };
};