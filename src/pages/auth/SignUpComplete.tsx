import { SignUp, useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Users, Globe } from 'lucide-react';

export default function SignUpComplete() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle successful authentication
  useEffect(() => {
    if (isLoaded && isSignedIn && user && !isRedirecting) {
      setIsRedirecting(true);
      
      // Determine redirect based on user metadata or default to organizer
      const userRole = user.publicMetadata?.role || 'organizer';
      const redirectPath = `/admin/${userRole}`;
      
      console.log('✅ Authentication successful:', {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        role: userRole,
        redirectPath
      });
      
      // Short delay to ensure UI updates
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1000);
    }
  }, [isLoaded, isSignedIn, user, navigate, isRedirecting]);

  // Show loading state during authentication
  if (!isLoaded || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-sm text-gray-600">
                {isRedirecting ? 'Redirecting to dashboard...' : 'Loading authentication...'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show sign-up form if not authenticated
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Join Fashionistas
          </h2>
          <p className="text-lg text-gray-600">
            The global platform for fashion events
          </p>
        </div>

        {/* Benefits Banner */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Free to join!</strong> Create events in 3 minutes, connect with global fashion community
          </AlertDescription>
        </Alert>

        {/* Sign-Up Component */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              Choose your preferred sign-up method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg transition-all duration-200',
                  card: 'shadow-none border-0',
                  headerTitle: 'hidden',
                  headerSubtitle: 'hidden',
                  socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 font-medium',
                  socialButtonsBlockButtonText: 'font-medium text-gray-700',
                  dividerLine: 'bg-gray-200',
                  dividerText: 'text-gray-500 font-medium',
                  formFieldInput: 'border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg',
                  formFieldLabel: 'font-medium text-gray-700',
                  footerActionLink: 'text-purple-600 hover:text-purple-800 font-medium',
                  formFieldInputShowPasswordButton: 'text-gray-500 hover:text-gray-700',
                  formResendCodeLink: 'text-purple-600 hover:text-purple-800',
                  alert: 'border-red-200 bg-red-50 text-red-800'
                },
                layout: {
                  socialButtonsVariant: 'blockButton',
                  socialButtonsPlacement: 'top'
                }
              }}
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              afterSignUpUrl="/admin/organizer"
              unsafeMetadata={{
                role: 'organizer' // Default role
              }}
            />
          </CardContent>
        </Card>

        {/* Additional Options */}
        <div className="text-center space-y-4">
          <Separator />
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => navigate('/preview/organizer')}
            >
              <Globe className="mr-2 h-4 w-4" />
              Try Demo Mode
            </Button>
            
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigate('/sign-in')}
            >
              Already have an account? Sign in
            </Button>
          </div>
        </div>

        {/* Features Footer */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Trusted by fashion professionals worldwide
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <span>✓ 3-min event creation</span>
            <span>✓ Global reach</span>
            <span>✓ Secure platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}
