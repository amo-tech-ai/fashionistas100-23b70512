import { Navigate } from 'react-router-dom';
import { useResolvedRole } from '@/hooks/useResolvedRole';
import { ROLE_DASHBOARD_MAP } from '@/lib/roles';

/**
 * Component that redirects to role-specific dashboard
 * Used at /dashboard route to prevent flicker
 */
export function RoleBasedRedirect() {
  const { role, isLoading } = useResolvedRole();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-1">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text-primary mx-auto"></div>
          <p className="text-text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return <Navigate to="/sign-in" replace />;
  }

  const dashboardPath = ROLE_DASHBOARD_MAP[role];
  return <Navigate to={dashboardPath} replace />;
}
