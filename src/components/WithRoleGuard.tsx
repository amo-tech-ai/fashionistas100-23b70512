import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useResolvedRole, type UserRole } from '@/hooks/useResolvedRole';

interface WithRoleGuardProps {
  allow: UserRole[];
  children: React.ReactNode;
  to?: string;
}

/**
 * Role-based route guard component
 * Blocks access if user doesn't have required role
 * 
 * @example
 * <WithRoleGuard allow={["organizer", "admin"]}>
 *   <OrganizerDashboard />
 * </WithRoleGuard>
 */
export function WithRoleGuard({
  allow,
  children,
  to = '/403'
}: WithRoleGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { role, isLoading } = useResolvedRole();
  const location = useLocation();

  // Show loading state while auth is loading
  if (!isLoaded || isLoading) {
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
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  // Redirect to 403 if role not allowed
  if (!role || !allow.includes(role)) {
    return <Navigate to={to} replace />;
  }

  return <>{children}</>;
}

/**
 * HOC version of WithRoleGuard for wrapping components
 * 
 * @example
 * const ProtectedOrganizer = withRoleGuard(["organizer", "admin"])(OrganizerDashboard);
 */
export const withRoleGuard = (allow: UserRole[], to = '/403') =>
  <P extends object>(Component: React.ComponentType<P>) =>
    (props: P) =>
      (
        <WithRoleGuard allow={allow} to={to}>
          <Component {...props} />
        </WithRoleGuard>
      );
