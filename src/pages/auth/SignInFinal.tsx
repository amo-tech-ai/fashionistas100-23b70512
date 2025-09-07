import { useAuth, useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Chrome, Facebook, Mail, Shield, CheckCircle } from 'lucide-react';

export default function SignInFinal() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setIsInitialized(true);
      console.log('✅ Clerk initialized successfully');
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log('✅ User already signed in, redirecting...');
      navigate('/admin/organizer', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleGoogleSignIn = () => {
    console.log('🔄 Opening Google Sign-In...');
    openSignIn({
      strategy: 'oauth_google',
      redirectUrl: '/admin/organizer'
    });
  };

  const handleFacebookSignIn = () => {
    console.log('🔄 Opening Facebook Sign-In...');
    openSignIn({
      strategy: 'oauth_facebook',
      redirectUrl: '/admin/organizer'
    });
  };

  const handleEmailSignIn = () => {
    console.log('🔄 Opening Email Sign-In...');
    openSignIn({
      redirectUrl: '/admin/organizer'
    });
  };

  if (!isLoaded || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Initializing Clerk authentication...</p>
              <p className="text-xs text-gray-500">
                Loaded: {isLoaded ? '✅' : '⏳'} | 
                Initialized: {isInitialized ? '✅' : '⏳'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Welcome back to Fashionistas
          </h2>
          <p className="text-lg text-gray-600">
            Sign in to access the full Clerk authentication experience
          </p>
        </div>

        {/* Clerk Status */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Clerk Ready!</strong> Click any button below to see the full Clerk sign-in forms with Google & Facebook
          </AlertDescription>
        </Alert>

        {/* Authentication Options */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Choose Your Sign-In Method</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Each button opens the full Clerk authentication interface
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Google Sign-In */}
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <Chrome className="mr-3 h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-700">Sign in with Google</span>
            </Button>

            {/* Facebook Sign-In */}
            <Button
              onClick={handleFacebookSignIn}
              variant="outline"
              className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <Facebook className="mr-3 h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-700">Sign in with Facebook</span>
            </Button>

            {/* Email Sign-In */}
            <Button
              onClick={handleEmailSignIn}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Mail className="mr-3 h-5 w-5" />
              <span className="font-medium">Sign in with Email</span>
            </Button>

          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <h3 className="font-medium text-green-900 mb-2">What happens next:</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Click any button to open Clerk's authentication modal</li>
              <li>• You'll see Google, Facebook, and Email options</li>
              <li>• Complete sign-in forms with your credentials</li>
              <li>• Professional UI with password recovery options</li>
              <li>• Automatic redirect to dashboard after sign-in</li>
            </ul>
          </CardContent>
        </Card>

        {/* Alternative Options */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => navigate('/preview/organizer')}
            >
              Try Demo Mode
            </Button>
            
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigate('/sign-up')}
            >
              Don't have an account? Sign up
            </Button>
          </div>
        </div>

        {/* Technical Status */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Clerk Status: {isLoaded ? '✅ Loaded' : '⏳ Loading'} | 
            Auth: {isSignedIn ? '✅ Signed In' : '🔓 Not Signed In'}
          </p>
        </div>
      </div>
    </div>
  );
}
