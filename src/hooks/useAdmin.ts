import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const logAdminAction = useCallback(async (
    action: string,
    table: string,
    recordId: string,
    oldValues: any,
    newValues: any
  ) => {
    if (!user) return;

    try {
      // Simple logging without strict type constraints
      console.log('Admin Action:', { action, table, recordId, oldValues, newValues });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }, [user]);

  return {
    isLoading,
    logAdminAction
  };
};