import { Navigate } from 'react-router-dom';
import { ROLE_DASHBOARD_MAP } from '@/lib/roles';

// 🚧 DEV MODE: Clerk disabled temporarily
export function RoleBasedRedirect() {
  // Mock auth - always redirect to organizer dashboard
  const role = 'organizer';
  const dashboardPath = ROLE_DASHBOARD_MAP[role];
  
  console.log('🚧 DEV MODE: Redirecting to organizer dashboard');
  return <Navigate to={dashboardPath} replace />;
}
