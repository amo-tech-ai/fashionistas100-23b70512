import { SignUp, useAuth, useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SignUpWorking() {
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();
  const [showClerk, setShowClerk] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      console.log('Clerk loaded:', { isLoaded, isSignedIn, clerk });
      setShowClerk(true);
    }
  }, [isLoaded, isSignedIn, clerk]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Clerk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <h1 className="text-3xl font-bold text-center mb-8">FashionOS Sign Up</h1>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Debug Info:</strong><br/>
            Clerk Loaded: {isLoaded ? 'Yes' : 'No'}<br/>
            Show Clerk: {showClerk ? 'Yes' : 'No'}<br/>
            Is Signed In: {isSignedIn ? 'Yes' : 'No'}
          </p>
        </div>

        {showClerk && (
          <div className="clerk-container">
            <SignUp 
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              afterSignUpUrl="/admin/organizer"
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                  card: 'shadow-lg border border-gray-200',
                  headerTitle: 'text-2xl font-bold text-gray-900',
                  headerSubtitle: 'text-gray-600',
                  socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
                  formFieldInput: 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                  footerActionLink: 'text-blue-600 hover:text-blue-800'
                }
              }}
            />
          </div>
        )}

        {!showClerk && (
          <div className="text-center">
            <p className="text-red-600 mb-4">Clerk component not rendering</p>
            <Button 
              onClick={() => setShowClerk(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Force Show Clerk
            </Button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button 
            onClick={() => window.location.href = '/preview/organizer'}
            variant="outline"
            className="mr-4"
          >
            Try Demo Mode
          </Button>
          <Button 
            onClick={() => window.location.href = '/sign-in'}
            variant="ghost"
          >
            Sign In Instead
          </Button>
        </div>
      </div>
    </div>
  );
}
