// Complete Leap Backend Integration Guide for FashionOS
// ======================================================

// Define the API base URL based on environment
const LEAP_BACKEND_URL = import.meta.env.VITE_LEAP_BACKEND_URL || 'http://localhost:4000';

// Initialize the Leap client with all your services
export const leapBackend = {
  
  // EVENT SERVICE - Manage fashion events
  events: {
    create: async (eventData) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      return response.json();
    },
    
    list: async () => {
      const response = await fetch(`${LEAP_BACKEND_URL}/event`);
      return response.json();
    },
    
    getDetails: async (eventId) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/event/${eventId}`);
      return response.json();
    },
    
    getAnalytics: async (eventId) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/event/${eventId}/analytics`);
      return response.json();
    }
  },

  // BOOKING SERVICE - Handle ticket bookings
  bookings: {
    create: async (bookingData) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      return response.json();
    },
    
    confirmBooking: async (bookingId) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/booking/${bookingId}/confirm`, {
        method: 'POST'
      });
      return response.json();
    },
    
    createGroupBooking: async (groupData) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/group/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData)
      });
      return response.json();
    }
  },

  // SPONSOR SERVICE - Manage event sponsors
  sponsors: {
    list: async () => {
      const response = await fetch(`${LEAP_BACKEND_URL}/sponsor`);
      return response.json();
    },
    
    getProspects: async () => {
      const response = await fetch(`${LEAP_BACKEND_URL}/sponsor/prospects`);
      return response.json();
    },
    
    createLead: async (leadData) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/sponsor/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      return response.json();
    },
    
    getDashboard: async () => {
      const response = await fetch(`${LEAP_BACKEND_URL}/sponsor/dashboard`);
      return response.json();
    }
  },

  // VENUE SERVICE - Venue management and analytics
  venues: {
    list: async () => {
      const response = await fetch(`${LEAP_BACKEND_URL}/venue`);
      return response.json();
    },
    
    getAnalytics: async (venueId) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/venue/${venueId}/analytics`);
      return response.json();
    },
    
    compareVenues: async (venueIds) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/venue/comparison`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueIds })
      });
      return response.json();
    }
  },

  // ORGANIZER SERVICE - Event organizer features
  organizers: {
    getDashboard: async (organizerId) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/organizer/${organizerId}/dashboard`);
      return response.json();
    },
    
    getFeatures: async () => {
      const response = await fetch(`${LEAP_BACKEND_URL}/organizer/features`);
      return response.json();
    }
  },

  // USER SERVICE - User management
  users: {
    create: async (userData) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return response.json();
    },
    
    getDashboard: async (userId) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/user/${userId}/dashboard`);
      return response.json();
    },
    
    updatePreferences: async (userId, preferences) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/user/${userId}/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      return response.json();
    }
  },

  // NOTIFICATION SERVICE - Send notifications
  notifications: {
    send: async (notificationData) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });
      return response.json();
    }
  },

  // PRODUCTION SERVICE - Event production planning
  production: {
    createPlan: async (productionData) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/production/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productionData)
      });
      return response.json();
    },
    
    getAdvancedPlanning: async (eventId) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/production/${eventId}/advanced`);
      return response.json();
    }
  },

  // RECOMMENDATION SERVICE - ML/AI recommendations
  recommendations: {
    getForUser: async (userId) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/recommendation/user/${userId}`);
      return response.json();
    },
    
    getForEvent: async (eventId) => {
      const response = await fetch(`${LEAP_BACKEND_URL}/recommendation/event/${eventId}`);
      return response.json();
    }
  },

  // REALTIME SERVICE - WebSocket connections
  realtime: {
    connect: () => {
      const ws = new WebSocket(`ws://localhost:4000/realtime`);
      
      ws.onopen = () => {
        console.log('Connected to Leap realtime service');
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Realtime update:', data);
      };
      
      return ws;
    }
  }
};

export default leapBackend;