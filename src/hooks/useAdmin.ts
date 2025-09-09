import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalEvents: number;
  totalDesigners: number;
  totalContacts: number;
  totalUsers: number;
  recentActivity: AuditLog[];
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  old_values: unknown;
  new_values: unknown;
  created_at: string;
}

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // DEVELOPMENT OVERRIDE - Allow admin access with dev=true parameter
      const isDev = window.location.hostname === 'localhost' && window.location.search.includes('dev=true');
      if (isDev) {
        console.log('🔧 Development mode: Granting admin access');
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // TEMPORARY: Allow all users admin access (no authentication)
      console.log('🟡 Temporary: Granting admin access to all users');
      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  const getAdminStats = async (): Promise<AdminStats | null> => {
    if (!isAdmin) return null;

    try {
      const [eventsRes, designersRes, contactsRes, usersRes, activityRes] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('designer_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('contact_forms').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      return {
        totalEvents: eventsRes.count || 0,
        totalDesigners: designersRes.count || 0,
        totalContacts: contactsRes.count || 0,
        totalUsers: usersRes.count || 0,
        recentActivity: activityRes.data || []
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return null;
    }
  };

  const logAdminAction = async (
    action: string,
    tableName: string,
    recordId?: string,
    oldValues?: unknown,
    newValues?: unknown
  ) => {
    try {
      await supabase.from('audit_logs').insert({
        user_id: 'temporary-user',
        action,
        table_name: tableName,
        record_id: recordId,
        old_values: oldValues,
        new_values: newValues
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  return {
    isAdmin,
    loading,
    getAdminStats,
    logAdminAction
  };
};