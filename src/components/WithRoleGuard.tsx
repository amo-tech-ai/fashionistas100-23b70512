import React from 'react';
import { Navigate } from 'react-router-dom';
import { type Role, hasAccess } from '@/lib/roles';

interface WithRoleGuardProps {
  allow: Role[];
  children: React.ReactNode;
  to?: string;
}

// 🚧 DEV MODE: Clerk disabled temporarily
export function WithRoleGuard({
  allow,
  children,
  to = '/403'
}: WithRoleGuardProps) {
  // Mock auth - always authenticated as organizer during development
  const role: Role = 'organizer';

  // Redirect to 403 if role not allowed
  if (!hasAccess(role, allow)) {
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
export const withRoleGuard = (allow: Role[], to = '/403') =>
  <P extends object>(Component: React.ComponentType<P>) =>
    (props: P) =>
      (
        <WithRoleGuard allow={allow} to={to}>
          <Component {...props} />
        </WithRoleGuard>
      );
