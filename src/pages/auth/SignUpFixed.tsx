import { SignUp, useAuth, useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Chrome, Facebook, Mail, ArrowRight, Users, CheckCircle, Globe } from 'lucide-react';

export default function SignUpPageFixed() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignUp } = useClerk();
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    if (isLoaded && isSignedIn) {
      navigate('/admin/organizer', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-sm text-gray-600">Loading authentication...</p>
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

        {/* Main Sign-Up Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Join thousands of fashion professionals worldwide
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showEmailForm ? (
              <>
                {/* Social Sign-Up Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={() => openSignUp({ 
                      strategy: 'oauth_google',
                      redirectUrl: '/admin/organizer',
                      unsafeMetadata: { role: 'organizer' }
                    })}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                  >
                    <Chrome className="mr-3 h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-700">Continue with Google</span>
                  </Button>

                  <Button
                    onClick={() => openSignUp({ 
                      strategy: 'oauth_facebook',
                      redirectUrl: '/admin/organizer',
                      unsafeMetadata: { role: 'organizer' }
                    })}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                  >
                    <Facebook className="mr-3 h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-700">Continue with Facebook</span>
                  </Button>
                </div>

                <div className="relative">
                  <Separator />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
                    <span className="text-sm text-gray-500">or</span>
                  </div>
                </div>

                {/* Email Sign-Up Button */}
                <Button
                  onClick={() => setShowEmailForm(true)}
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                >
                  <Mail className="mr-3 h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Continue with Email</span>
                </Button>
              </>
            ) : (
              <>
                {/* Clerk SignUp Component */}
                <div className="clerk-sign-up-wrapper">
                  <SignUp 
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg transition-all duration-200',
                        card: 'shadow-none border-0 bg-transparent',
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
                      role: 'organizer' // Default role for new users
                    }}
                  />
                </div>

                <Button
                  onClick={() => setShowEmailForm(false)}
                  variant="ghost"
                  className="w-full"
                >
                  ← Back to options
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Additional Options */}
        <div className="text-center space-y-4">
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

        {/* Role Selection Note */}
        <Alert className="border-purple-200 bg-purple-50">
          <Users className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>Getting started as Event Organizer:</strong> You can change your role anytime in settings
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
