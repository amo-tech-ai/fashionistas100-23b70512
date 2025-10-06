import { type Role, ROLES } from '@/lib/roles';

// Re-export for backwards compatibility
export type UserRole = Role;

interface ResolvedRoleData {
  role: Role | null;
  isLoading: boolean;
  error: Error | null;
}

// 🚧 DEV MODE: Clerk disabled temporarily
export function useResolvedRole(): ResolvedRoleData {
  // Mock auth - always return organizer role
  return {
    role: ROLES.ORGANIZER,
    isLoading: false,
    error: null,
  };
}

/* ORIGINAL CLERK CODE - COMMENTED OUT FOR DEV
import { useAuth, useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

      // 2. Get profile ID first
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('clerk_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('❌ Error fetching profile:', profileError);
        throw profileError;
      }

      // 3. If profile doesn't exist, create it
      if (!profile) {
        const newRole = (user.publicMetadata?.role as UserRole) || ROLES.ATTENDEE;
        const nameParts = user.fullName?.split(' ') || [];
        
        console.log('🆕 Creating new profile with role:', newRole);
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{
            clerk_id: userId,
            user_id: userId,
            email: user.primaryEmailAddress?.emailAddress || '',
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || null,
          }])
          .select('id')
          .single();

        if (insertError) {
          console.error('❌ Failed to create profile:', insertError);
          return newRole;
        }

        // Create user_role entry
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            profile_id: newProfile.id,
            role: newRole,
          }]);

        if (roleError) {
          console.error('❌ Failed to create user_role:', roleError);
        }

        console.log('✅ Profile and role created successfully');
        return newRole;
      }

      // 4. Fetch role from user_roles table (NEW SECURE APPROACH)
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('profile_id', profile.id)
        .maybeSingle();

      if (roleError) {
        console.error('❌ Error fetching user role:', roleError);
        throw roleError;
      }

      if (userRole?.role) {
        console.log('✅ Found role in user_roles table:', userRole.role);
        return userRole.role as UserRole;
      }

      // 5. Fallback: Create role entry from Clerk metadata
      const clerkRole = (user.publicMetadata?.role as UserRole) || ROLES.ATTENDEE;
      console.log('📝 Creating role from Clerk metadata:', clerkRole);

      const { error: createRoleError } = await supabase
        .from('user_roles')
        .insert([{
          profile_id: profile.id,
          role: clerkRole,
        }]);

      if (createRoleError) {
        console.error('❌ Failed to create role:', createRoleError);
      }

      return clerkRole;
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

// 🚧 DEV MODE: Mock role check
export function useHasRole(requiredRole: Role | Role[]): boolean {
  const role = ROLES.ORGANIZER;
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(role);
}

/* ORIGINAL CLERK CODE - COMMENTED OUT
export function useHasRole(requiredRole: Role | Role[]): boolean {
  const { role } = useResolvedRole();
  if (!role) return false;
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(role);
}
*/
