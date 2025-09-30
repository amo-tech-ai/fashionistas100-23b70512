import { useAuth, useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { type Role, ROLES } from '@/lib/roles';

// Re-export for backwards compatibility
export type UserRole = Role;

interface ResolvedRoleData {
  role: Role | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to resolve user role with proper precedence:
 * 1. Clerk organization role (if in org)
 * 2. Supabase profile role
 * 3. Clerk public metadata role
 * 
 * Automatically syncs Clerk → Supabase on first load
 */
export function useResolvedRole(): ResolvedRoleData {
  const { isLoaded: authLoaded, userId } = useAuth();
  const { user } = useUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ['resolved-role', userId],
    queryFn: async () => {
      if (!userId || !user) return null;

      // 1. Check Clerk org role first (highest priority)
      const orgRole = user.organizationMemberships?.[0]?.role;
      if (orgRole === 'admin' || orgRole === 'org:admin') {
        return 'admin' as UserRole;
      }

      // 2. Fetch Supabase profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // If profile exists, use that role
      if (profile?.role) {
        return profile.role as UserRole;
      }

      // 3. Fallback to Clerk metadata
      const clerkRole = user.publicMetadata?.role as UserRole | undefined;

      // 4. If no profile exists, create one with Clerk metadata or default
      if (!profile) {
        const newRole = clerkRole || ROLES.ATTENDEE;
        const nameParts = user.fullName?.split(' ') || [];
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            user_id: userId,
            role: newRole as any,
            email: user.primaryEmailAddress?.emailAddress || '',
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || null,
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Failed to create profile:', insertError);
        }

        return newRole;
      }

      return clerkRole || ROLES.ATTENDEE;
    },
    enabled: authLoaded && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  return {
    role: data ?? null,
    isLoading: !authLoaded || isLoading,
    error: error as Error | null,
  };
}

/**
 * Hook to check if user has specific role
 */
export function useHasRole(requiredRole: Role | Role[]): boolean {
  const { role } = useResolvedRole();
  
  if (!role) return false;
  
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(role);
}
