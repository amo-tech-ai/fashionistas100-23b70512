import { useAuth, useClerk } from '@clerk/clerk-react';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Chrome, Facebook, Mail, Users, CheckCircle, LogOut } from 'lucide-react';

export default function SignUpFinal() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useAuth();
  const { openSignUp, signOut } = useClerk();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setIsInitialized(true);
      console.log('✅ Clerk initialized successfully');
    }
  }, [isLoaded]);

  // REMOVED AUTO-REDIRECT - Let users access signup page even if signed in
  // This allows testing the signup flow and manual sign-out

  const handleGoogleSignUp = () => {
    console.log('🔄 Opening Google Sign-Up...');
    openSignUp({
      strategy: 'oauth_google',
      redirectUrl: window.location.origin + '/fashionistas100-23b70512/admin/organizer'
    });
  };

  const handleFacebookSignUp = () => {
    console.log('🔄 Opening Facebook Sign-Up...');
    openSignUp({
      strategy: 'oauth_facebook', 
      redirectUrl: window.location.origin + '/fashionistas100-23b70512/admin/organizer'
    });
  };

  const handleEmailSignUp = () => {
    console.log('🔄 Opening Email Sign-Up...');
    openSignUp({
      redirectUrl: window.location.origin + '/fashionistas100-23b70512/admin/organizer'
    });
  };

  const handleSignOut = async () => {
    console.log('🔄 Signing out current user...');
    await signOut();
    navigate('/sign-up', { replace: true });
  };

  if (!isLoaded || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
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
            Sign up to access the full Clerk authentication experience
          </p>
        </div>

        {/* Show if already signed in */}
        {isSignedIn && user && (
          <Alert className="border-orange-200 bg-orange-50">
            <LogOut className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Already Signed In!</strong> You're logged in as {user.emailAddresses[0]?.emailAddress}. 
              <Button 
                variant="link" 
                className="p-0 ml-1 text-orange-700 underline"
                onClick={handleSignOut}
              >
                Sign out to create a new account
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Clerk Status */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Clerk Ready!</strong> Click any button below to see the full Clerk sign-up forms with Google & Facebook
          </AlertDescription>
        </Alert>

        {/* Authentication Options */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Choose Your Sign-Up Method</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Each button opens the full Clerk authentication interface
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Google Sign-Up */}
            <Button
              onClick={handleGoogleSignUp}
              variant="outline"
              className="w-full h-12 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <Chrome className="mr-3 h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-700">Sign up with Google</span>
            </Button>

            {/* Facebook Sign-Up */}
            <Button
              onClick={handleFacebookSignUp}
              variant="outline"
              className="w-full h-12 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <Facebook className="mr-3 h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-700">Sign up with Facebook</span>
            </Button>

            {/* Email Sign-Up */}
            <Button
              onClick={handleEmailSignUp}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Mail className="mr-3 h-5 w-5" />
              <span className="font-medium">Sign up with Email</span>
            </Button>

          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <h3 className="font-medium text-blue-900 mb-2">What happens next:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click any button to open Clerk's authentication modal</li>
              <li>• You'll see Google, Facebook, and Email options</li>
              <li>• Complete forms include username, email, phone fields</li>
              <li>• Professional UI with country code selection</li>
              <li>• Automatic redirect to dashboard after signup</li>
            </ul>
          </CardContent>
        </Card>

        {/* Alternative Options */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => navigate('/preview/organizer')}
            >
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
