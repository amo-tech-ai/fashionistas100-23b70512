import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { startOfDay, subDays, format } from 'date-fns'

// Fetch dashboard metrics with real Supabase data
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const today = new Date()
      const weekAgo = subDays(today, 7)
      const monthAgo = subDays(today, 30)

      // Fetch events with correct column names
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .in('status', ['active', 'upcoming', 'published'])
        .order('start_datetime', { ascending: true })

      if (eventsError) {
        console.error('Events error:', eventsError)
      }

      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('total_amount, created_at, status')
        .gte('created_at', monthAgo.toISOString())

      if (bookingsError) {
        console.error('Bookings error:', bookingsError)
      }
      // Fetch venue bookings for revenue
      const { data: venueBookings, error: venueBookingsError } = await supabase
        .from('venue_bookings')
        .select('total_amount, created_at, status')
        .gte('created_at', monthAgo.toISOString())

      if (venueBookingsError) {
        console.error('Venue bookings error:', venueBookingsError)
      }

      // Calculate metrics
      const totalEvents = events?.length || 0
      const upcomingEvents = events?.filter(e => 
        e.status === 'upcoming' || (e.start_datetime && new Date(e.start_datetime) > today)
      ).length || 0
      const activeEvents = events?.filter(e => 
        e.status === 'active' || e.status === 'published'
      ).length || 0

      // Calculate revenue from bookings and venue bookings
      const allRevenueSources = [
        ...(bookings || []).map(b => ({
          amount: b.total_amount || 0,
          date: b.created_at
        })),
        ...(venueBookings || []).map(vb => ({
          amount: vb.total_amount || 0,
          date: vb.created_at
        }))
      ]

      const dailyRevenue = allRevenueSources
        .filter(r => new Date(r.date) >= startOfDay(today))
        .reduce((sum, r) => sum + r.amount, 0)
      const weeklyRevenue = allRevenueSources
        .filter(r => new Date(r.date) >= weekAgo)
        .reduce((sum, r) => sum + r.amount, 0)

      const monthlyRevenue = allRevenueSources
        .reduce((sum, r) => sum + r.amount, 0)

      return {
        totalEvents,
        upcomingEvents,
        activeEvents,
        dailyRevenue,
        weeklyRevenue,
        monthlyRevenue,
        events: events || [],
        recentBookings: bookings?.slice(0, 5) || []
      }
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  })
}

// Fetch recent activities
export const useRecentActivities = () => {
  return useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      // Fetch recent registrations
      const { data: registrations } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events!inner (event_name, description)
        `)
        .order('created_at', { ascending: false })
        .limit(5)
      // Fetch recent tickets
      const { data: tickets } = await supabase
        .from('event_tickets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch recent venue inquiries
      const { data: inquiries } = await supabase
        .from('venue_inquiries')
        .select(`
          *,
          venues!inner (name, location)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      // Combine all activities
      const activities = [
        ...(registrations || []).map(r => ({
          type: 'registration',
          message: `New registration for ${r.events?.event_name}`,
          timestamp: r.created_at,
          ...r
        })),
        ...(tickets || []).map(t => ({
          type: 'ticket',
          message: `Ticket created: ${t.name}`,
          timestamp: t.created_at,
          ...t
        })),
        ...(inquiries || []).map(i => ({
          type: 'inquiry',
          message: `Venue inquiry for ${i.venues?.name}`,
          timestamp: i.created_at,
          ...i
        }))      ].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 10)

      return activities
    },
    refetchInterval: 60000 // Refresh every minute
  })
}

// Fetch booking pipeline status
export const useBookingPipeline = () => {
  return useQuery({
    queryKey: ['booking-pipeline'],
    queryFn: async () => {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('status')
      
      const { data: venueBookings } = await supabase
        .from('venue_bookings')
        .select('status')

      const allBookings = [
        ...(bookings || []),
        ...(venueBookings || [])
      ]

      const pipeline = {
        pending: allBookings.filter(b => b.status === 'pending').length,
        confirmed: allBookings.filter(b => b.status === 'confirmed').length,
        cancelled: allBookings.filter(b => b.status === 'cancelled').length
      }

      return pipeline
    },
    refetchInterval: 30000
  })
}