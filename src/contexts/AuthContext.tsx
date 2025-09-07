import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from '@/hooks/useClerkAuth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  // Clerk auth state
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  user: any;
  userRole: string;
  
  // Supabase sync state
  supabaseProfile: any;
  isProfileLoading: boolean;
  
  // Actions
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUserRole: (role: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const clerkAuth = useAuthState();
  const [supabaseProfile, setSupabaseProfile] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // Sync Clerk user with Supabase
  useEffect(() => {
    if (clerkAuth.isLoaded && clerkAuth.isSignedIn && clerkAuth.user) {
      syncWithSupabase();
    } else {
      setSupabaseProfile(null);
      setIsProfileLoading(false);
    }
  }, [clerkAuth.isLoaded, clerkAuth.isSignedIn, clerkAuth.userId]);

  const syncWithSupabase = async () => {
    if (!clerkAuth.user) return;

    setIsProfileLoading(true);
    try {
      // Check if user exists in Supabase
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkAuth.userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user:', fetchError);
        setIsProfileLoading(false);
        return;
      }

      if (!existingUser) {
        // Create new user in Supabase
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            clerk_id: clerkAuth.userId,
            email: clerkAuth.user.primaryEmailAddress?.emailAddress,
            username: clerkAuth.user.username,
            first_name: clerkAuth.user.firstName,
            last_name: clerkAuth.user.lastName,
            avatar_url: clerkAuth.user.imageUrl,
            role: clerkAuth.userRole || 'user',
            metadata: {
              created_via: 'clerk',
              clerk_data: {
                id: clerkAuth.user.id,
                createdAt: clerkAuth.user.createdAt,
              }
            }
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
        } else {
          setSupabaseProfile(newUser);
        }
      } else {
        // Update existing user
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            email: clerkAuth.user.primaryEmailAddress?.emailAddress,
            username: clerkAuth.user.username,
            first_name: clerkAuth.user.firstName,
            last_name: clerkAuth.user.lastName,
            avatar_url: clerkAuth.user.imageUrl,
            last_seen: new Date().toISOString(),
          })
          .eq('clerk_id', clerkAuth.userId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating user:', updateError);
        } else {
          setSupabaseProfile(updatedUser);
        }
      }
    } catch (error) {
      console.error('Supabase sync error:', error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    await syncWithSupabase();
  };

  const updateUserRole = async (role: string): Promise<boolean> => {
    if (!clerkAuth.userId) return false;

    try {
      // Update in Supabase
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('clerk_id', clerkAuth.userId);

      if (error) {
        console.error('Error updating role:', error);
        return false;
      }

      // Update in Clerk (requires backend API call)
      // This would typically be done through your backend
      console.log('Role update in Clerk requires backend implementation');

      await refreshProfile();
      return true;
    } catch (error) {
      console.error('Role update error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    isLoaded: clerkAuth.isLoaded,
    isSignedIn: clerkAuth.isSignedIn || false,
    userId: clerkAuth.userId,
    user: clerkAuth.user,
    userRole: supabaseProfile?.role || clerkAuth.userRole,
    supabaseProfile,
    isProfileLoading,
    signOut: clerkAuth.signOut,
    refreshProfile,
    updateUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}