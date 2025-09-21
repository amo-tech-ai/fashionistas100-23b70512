import { useState, useCallback } from 'react';

export const useRevenueData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: [],
    growth: 0
  });

  const fetchRevenueData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock revenue data for now
      setRevenueData({
        totalRevenue: 125000,
        monthlyRevenue: [
          { month: 'Jan', revenue: 15000 },
          { month: 'Feb', revenue: 18000 },
          { month: 'Mar', revenue: 22000 },
          { month: 'Apr', revenue: 25000 },
          { month: 'May', revenue: 28000 },
          { month: 'Jun', revenue: 17000 }
        ],
        growth: 12.5
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    revenueData,
    fetchRevenueData,
    isLoading
  };
};