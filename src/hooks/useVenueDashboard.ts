import { useState, useCallback } from 'react';

export const useVenueDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    venues: [],
    bookings: [],
    metrics: {
      totalVenues: 0,
      totalBookings: 0,
      totalRevenue: 0
    }
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data for now
      setData({
        venues: [],
        bookings: [],
        metrics: {
          totalVenues: 8,
          totalBookings: 45,
          totalRevenue: 85000
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
export const useVenueDashboardData = useVenueDashboard;