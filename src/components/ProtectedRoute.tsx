import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export function ProtectedRoute({ 
  children, 
  fallbackUrl = '/sign-in'
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();
  
  // DEVELOPMENT OVERRIDE - Allow access without auth
  const isDev = window.location.hostname === 'localhost' && window.location.search.includes('dev=true');
  if (isDev) {
    return <>{children}</>;
  }
  
  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }
  
  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to={fallbackUrl} replace />;
  }
  
  // Render protected content
  return <>{children}</>;
}
