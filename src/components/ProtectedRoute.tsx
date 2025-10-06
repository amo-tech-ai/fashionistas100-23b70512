import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { type Role, hasAccess } from '@/lib/roles';

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackUrl?: string;
  requiredRole?: Role | Role[];
}

// 🚧 DEV MODE: Clerk disabled temporarily
export function ProtectedRoute({ 
  children, 
  requiredRole,
}: ProtectedRouteProps) {
  // Mock auth - always authenticated as organizer during development
  const isSignedIn = true;
  const role: Role = 'organizer';
  
  // Check role if required
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!hasAccess(role, roles)) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // Render protected content
  return <>{children}</>;
}
