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
      if (!userId || !user) {
        console.log('⚠️ No userId or user available for role resolution');
        return null;
      }

      console.log('🔍 Resolving role for user:', userId);

      // 1. Check Clerk org role first (highest priority)
      const orgRole = user.organizationMemberships?.[0]?.role;
      if (orgRole === 'admin' || orgRole === 'org:admin') {
        console.log('✅ User has org admin role');
        return 'admin' as UserRole;
      }

      // 2. Fetch Supabase profile using clerk_id (not user_id!)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, id, email')
        .eq('clerk_id', userId) // Use clerk_id to match Clerk's user ID
        .maybeSingle(); // Use maybeSingle() to avoid errors when no profile exists

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        throw profileError;
      }

      // If profile exists, use that role
      if (profile?.role) {
        console.log('✅ Found existing profile with role:', profile.role);
        return profile.role as UserRole;
      }

      // 3. Fallback to Clerk metadata
      const clerkRole = user.publicMetadata?.role as UserRole | undefined;
      console.log('📝 Clerk metadata role:', clerkRole);

      // 4. If no profile exists, create one with Clerk metadata or default
      if (!profile) {
        const newRole = clerkRole || ROLES.ATTENDEE;
        const nameParts = user.fullName?.split(' ') || [];
        
        console.log('🆕 Creating new profile with role:', newRole);
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{
            clerk_id: userId, // Use clerk_id, not user_id
            user_id: userId, // Also set user_id for backwards compatibility
            role: newRole as any,
            email: user.primaryEmailAddress?.emailAddress || '',
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || null,
          }])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Failed to create profile:', insertError);
          // Don't throw - return the role anyway
          return newRole;
        }

        console.log('✅ Profile created successfully:', newProfile);
        return newRole;
      }

      return clerkRole || ROLES.ATTENDEE;
    },
    enabled: authLoaded && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3, // Retry failed queries
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
