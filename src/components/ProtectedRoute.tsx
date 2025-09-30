import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useResolvedRole, type UserRole } from '@/hooks/useResolvedRole';

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackUrl?: string;
  requiredRole?: UserRole | UserRole[];
}

export function ProtectedRoute({ 
  children, 
  fallbackUrl = '/sign-in',
  requiredRole,
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { role, isLoading: roleLoading } = useResolvedRole();
  
  // Show loading state while Clerk is loading
  if (!isLoaded || (isSignedIn && roleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-1">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text-primary mx-auto"></div>
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to={fallbackUrl} replace />;
  }
  
  // Check role if required
  if (requiredRole && role) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(role)) {
      // Redirect to user's actual dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // Render protected content
  return <>{children}</>;
}
