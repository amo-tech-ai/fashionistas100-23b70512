import { useUser } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // For now, allow access to all authenticated users
  // In a real app, you'd check user roles from user metadata
  const userRole = user?.publicMetadata?.role || 'fashion_enthusiast';
  
  if (!allowedRoles.includes(userRole as string)) {
    return fallback || (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="text-center p-8">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-playfair text-lg font-bold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Required roles: {allowedRoles.join(', ')}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return <>{children}</>;
}