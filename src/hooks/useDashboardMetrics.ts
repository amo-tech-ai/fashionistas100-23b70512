import { useState, useEffect } from 'react';

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalTickets: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set mock metrics for now
    setMetrics({
      totalEvents: 25,
      totalUsers: 1248,
      totalRevenue: 45600,
      totalTickets: 892
    });
  }, []);

  return {
    metrics,
    isLoading,
    data: metrics // Add this for compatibility
  };
};

export const useRecentActivities = () => {
  return {
    data: [],
    isLoading: false
  };
};

export const useBookingPipeline = () => {
  return {
    data: [],
    isLoading: false
  };
};