import { Navigate } from 'react-router-dom';
import { useResolvedRole } from '@/hooks/useResolvedRole';
import { ROLE_DASHBOARD_MAP } from '@/lib/roles';

/**
 * Component that redirects to role-specific dashboard
 * Used at /dashboard route to prevent flicker
 */
export function RoleBasedRedirect() {
  const { role, isLoading, error } = useResolvedRole();

  // Show error if role resolution failed
  if (error) {
    console.error('❌ Role resolution error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-1">
        <div className="text-center space-y-4 p-8">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h2>
          <p className="text-text-muted">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
    console.log('⚠️ No role found, redirecting to sign-in');
    return <Navigate to="/sign-in" replace />;
  }

  const dashboardPath = ROLE_DASHBOARD_MAP[role];
  console.log('✅ Redirecting to dashboard:', dashboardPath, 'for role:', role);
  return <Navigate to={dashboardPath} replace />;
}
