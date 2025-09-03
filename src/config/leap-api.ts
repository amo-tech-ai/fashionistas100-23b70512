// Leap Backend API Configuration
const LEAP_API_CONFIG = {
  // Your Leap staging URL
  baseURL: 'https://staging-fashion-platform-backend-h7a2.frontend.encr.app',
  
  // API endpoints from your Leap architecture
  endpoints: {
    // Events
    events: {
      list: '/api/events',
      get: '/api/events/:id',
      create: '/api/events',
      update: '/api/events/:id',
      delete: '/api/events/:id',
      search: '/api/events/search',
      getAnalytics: '/api/events/:id/analytics'
    },
    
    // Bookings
    bookings: {
      create: '/api/bookings',
      list: '/api/bookings',
      get: '/api/bookings/:id',
      getUserBookings: '/api/bookings/user/:userId',
      getEventBookings: '/api/bookings/event/:eventId',
      cancel: '/api/bookings/:id/cancel'
    },
    
    // Venues
    venues: {
      list: '/api/venues',
      get: '/api/venues/:id',
      create: '/api/venues',
      update: '/api/venues/:id',
      getAnalytics: '/api/venues/:id/analytics',
      getOptimization: '/api/venues/:id/optimization'
    },
    
    // Organizers
    organizers: {
      list: '/api/organizers',
      get: '/api/organizers/:id',
      getDashboardMetrics: '/api/organizers/:id/dashboard'
    },
    
    // Notifications
    notifications: {
      send: '/api/notifications/send',
      sendConfirmationEmail: '/api/notifications/confirmation'
    },
    
    // Users
    users: {
      create: '/api/users',
      get: '/api/users/:id',
      update: '/api/users/:id',
      getProfile: '/api/users/profile'
    },
    
    // Realtime (WebSocket)
    realtime: {
      connect: '/ws',
      subscribe: '/api/realtime/subscribe',
      events: '/api/realtime/events'
    }
  },
  
  // Headers configuration
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default LEAP_API_CONFIG;