import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
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
  old_values: any;
  new_values: any;
  created_at: string;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

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
    oldValues?: any,
    newValues?: any
  ) => {
    if (!isAdmin || !user) return;

    try {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
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