import { useAuth, useUser, useClerk, useSignIn, useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import clerkConfig from '@/config/clerk.config';

// Custom hook for authentication state with additional utilities
export function useAuthState() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();

  // Get user role from metadata
  const userRole = user?.publicMetadata?.role as string || 'user';
  
  // Check if user has specific role
  const hasRole = useCallback((role: string) => {
    return userRole === role;
  }, [userRole]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles: string[]) => {
    return roles.includes(userRole);
  }, [userRole]);

  // Sign out with redirect
  const signOut = useCallback(async () => {
    await clerk.signOut();
    navigate(clerkConfig.redirects.afterSignOutUrl);
  }, [clerk, navigate]);

  // Get JWT token for API calls
  const getAuthToken = useCallback(async () => {
    try {
      return await getToken();
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }, [getToken]);

  return {
    isLoaded,
    isSignedIn,
    userId,
    sessionId,
    user,
    userRole,
    hasRole,
    hasAnyRole,
    signOut,
    getAuthToken,
    clerk,
  };
}

// Custom hook for protected routes with role-based access
export function useProtectedRoute(allowedRoles?: string[]) {
  const { isLoaded, isSignedIn, userRole } = useAuthState();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate(clerkConfig.redirects.signInUrl);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      navigate('/unauthorized');
      return;
    }

    setIsAuthorized(true);
  }, [isLoaded, isSignedIn, userRole, allowedRoles, navigate]);

  return {
    isLoaded,
    isAuthorized,
    userRole,
  };
}

// Custom hook for handling OAuth sign-in
export function useOAuthSignIn() {
  const { signIn } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'facebook' | 'github' | 'linkedin') => {
    if (!signIn) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: clerkConfig.redirects.afterSignInUrl,
      });
    } catch (err: any) {
      console.error(`OAuth ${provider} error:`, err);
      setError(err.errors?.[0]?.message || `Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  }, [signIn]);

  return {
    signInWithOAuth,
    isLoading,
    error,
  };
}

// Custom hook for user profile management
export function useUserProfile() {
  const { user } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateProfile = useCallback(async (data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    primaryEmailAddress?: string;
  }) => {
    if (!user) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      await user.update(data);
      return true;
    } catch (err: any) {
      console.error('Profile update error:', err);
      setUpdateError(err.errors?.[0]?.message || 'Failed to update profile');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user]);

  const updateAvatar = useCallback(async (file: File) => {
    if (!user) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      await user.setProfileImage({ file });
      return true;
    } catch (err: any) {
      console.error('Avatar update error:', err);
      setUpdateError(err.errors?.[0]?.message || 'Failed to update avatar');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [user]);

  const deleteAccount = useCallback(async () => {
    if (!user) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return false;

    try {
      await user.delete();
      return true;
    } catch (err: any) {
      console.error('Account deletion error:', err);
      setUpdateError(err.errors?.[0]?.message || 'Failed to delete account');
      return false;
    }
  }, [user]);

  return {
    user,
    updateProfile,
    updateAvatar,
    deleteAccount,
    isUpdating,
    updateError,
  };
}

// Custom hook for session management
export function useSessionManagement() {
  const { session } = useClerk();
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const loadActiveSessions = useCallback(async () => {
    if (!session) return;

    setIsLoadingSessions(true);
    try {
      const sessions = await session.user?.getSessions();
      setActiveSessions(sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [session]);

  const revokeSession = useCallback(async (sessionId: string) => {
    try {
      const sessionToRevoke = activeSessions.find(s => s.id === sessionId);
      if (sessionToRevoke) {
        await sessionToRevoke.revoke();
        await loadActiveSessions();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to revoke session:', error);
      return false;
    }
  }, [activeSessions, loadActiveSessions]);

  useEffect(() => {
    loadActiveSessions();
  }, [loadActiveSessions]);

  return {
    currentSession: session,
    activeSessions,
    isLoadingSessions,
    loadActiveSessions,
    revokeSession,
  };
}

// Custom hook for MFA management
export function useMFAManagement() {
  const { user } = useUser();
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const [isLoadingMFA, setIsLoadingMFA] = useState(false);

  useEffect(() => {
    if (user) {
      setIsMFAEnabled(user.twoFactorEnabled);
    }
  }, [user]);

  const enableMFA = useCallback(async () => {
    if (!user) return false;

    setIsLoadingMFA(true);
    try {
      // Implementation depends on your MFA setup
      // This is a placeholder
      console.log('Enabling MFA...');
      return true;
    } catch (error) {
      console.error('Failed to enable MFA:', error);
      return false;
    } finally {
      setIsLoadingMFA(false);
    }
  }, [user]);

  const disableMFA = useCallback(async () => {
    if (!user) return false;

    setIsLoadingMFA(true);
    try {
      // Implementation depends on your MFA setup
      // This is a placeholder
      console.log('Disabling MFA...');
      return true;
    } catch (error) {
      console.error('Failed to disable MFA:', error);
      return false;
    } finally {
      setIsLoadingMFA(false);
    }
  }, [user]);

  return {
    isMFAEnabled,
    isLoadingMFA,
    enableMFA,
    disableMFA,
  };
}

// Export all hooks
export default {
  useAuthState,
  useProtectedRoute,
  useOAuthSignIn,
  useUserProfile,
  useSessionManagement,
  useMFAManagement,
};