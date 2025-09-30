import { useAuth, useUser, useClerk } from '@clerk/clerk-react';
import { useEffect } from 'react';

/**
 * Debug component to diagnose Clerk authentication issues
 * Shows in development to help troubleshoot auth problems
 */
export function AuthDebug() {
  const clerk = useClerk();
  const auth = useAuth();
  const { user } = useUser();

  useEffect(() => {
    // Log everything about Clerk state
    console.group('🔍 CLERK DEBUG INFO');
    console.log('Clerk Instance:', {
      exists: !!clerk,
      loaded: clerk?.loaded,
      version: (clerk as any)?.__version
    });
    console.log('Auth State:', {
      isLoaded: auth?.isLoaded,
      isSignedIn: auth?.isSignedIn,
      userId: auth?.userId
    });
    console.log('User:', {
      exists: !!user,
      id: user?.id,
      email: user?.primaryEmailAddress?.emailAddress
    });
    console.log('Environment:', {
      liveKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 20),
      testKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY_TEST?.substring(0, 20),
      mode: import.meta.env.MODE,
      hostname: window.location.hostname
    });
    console.groupEnd();
  }, [clerk, auth, user]);

  // Only show in development
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50 font-mono">
      <div className="font-bold mb-2">🔍 Clerk Debug</div>
      <div>Loaded: {auth?.isLoaded ? '✅' : '❌'}</div>
      <div>Signed In: {auth?.isSignedIn ? '✅' : '❌'}</div>
      <div>User: {user ? '✅' : '❌'}</div>
      <div className="mt-2 text-yellow-300">
        Check console for details
      </div>
    </div>
  );
}
