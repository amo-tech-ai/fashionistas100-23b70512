import { useState, useCallback } from 'react';

export const useDesignerDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    events: [],
    metrics: {
      totalShows: 0,
      upcomingShows: 0,
      totalAttendees: 0
    }
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data for now
      setData({
        events: [],
        metrics: {
          totalShows: 12,
          upcomingShows: 3,
          totalAttendees: 450
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
export const useDesignerDashboardData = useDesignerDashboard;