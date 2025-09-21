import { useState, useCallback } from 'react';

export const useOrganizerDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    events: [],
    revenue: 0,
    attendees: 0,
    metrics: {
      totalEvents: 0,
      totalRevenue: 0,
      totalAttendees: 0
    }
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data for now
      setData({
        events: [],
        revenue: 125000,
        attendees: 2400,
        metrics: {
          totalEvents: 18,
          totalRevenue: 125000,
          totalAttendees: 2400
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    fetchData,
    isLoading
  };
};

// Add this for compatibility
export const useOrganizerDashboardData = useOrganizerDashboard;