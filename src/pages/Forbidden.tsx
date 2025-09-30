import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useResolvedRole } from '@/hooks/useResolvedRole';

/**
 * 403 Forbidden page
 * Shown when user tries to access a route they don't have permission for
 */
export default function Forbidden() {
  const { role } = useResolvedRole();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-1 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-danger/10 p-6">
            <ShieldAlert className="h-16 w-16 text-danger" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="ds-title" data-testid="error-code">403</h1>
          <p className="ds-body text-text-muted">
            You don't have permission to access this page
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-text-muted">
            {role ? (
              <>Your current role is <strong className="font-semibold text-text-primary">{role}</strong></>
            ) : (
              'No role assigned'
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </div>

        <div className="pt-6 border-t border-border-strong">
          <p className="text-sm text-text-muted">
            Need different access?{' '}
            <Link to="/contact" className="text-action hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
