import { useAuth, useClerk } from '@clerk/clerk-react';
import { Button } from './ui/button';

/**
 * Emergency auth status banner
 * Shows if auth isn't working and provides manual sign-in
 */
export function AuthStatusBanner() {
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();

  // Only show if Clerk hasn't loaded after 3 seconds
  const [showBanner, setShowBanner] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setShowBanner(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoaded]);

  if (!showBanner || isLoaded) return null;

  return (
    <div className="fixed top-16 left-0 right-0 bg-yellow-100 border-b border-yellow-300 p-3 z-40">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-sm text-yellow-800">
          ⚠️ Authentication is taking longer than expected...
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => clerk.openSignIn()}
          >
            Try Sign In
          </Button>
          <Button 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}

// Add React import
import * as React from 'react';
