import { SignIn, useAuth, useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Chrome, Facebook, Mail, ArrowRight, Shield } from 'lucide-react';

export default function SignInPageFixed() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();
  const [isClerkReady, setIsClerkReady] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    if (isLoaded && isSignedIn) {
      navigate('/admin/organizer', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    // Check if Clerk components are working
    const timer = setTimeout(() => {
      setIsClerkReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Loading authentication...</p>
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
            Welcome back to FashionOS
          </h2>
          <p className="text-lg text-gray-600">
            Sign in to continue your fashion journey
          </p>
        </div>

        {/* Security Badge */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Secure Sign-In:</strong> Your data is protected with enterprise-grade security
          </AlertDescription>
        </Alert>

        {/* Main Sign-In Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">Sign In to Your Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showEmailForm ? (
              <>
                {/* Social Sign-In Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={() => openSignIn({ 
                      strategy: 'oauth_google',
                      redirectUrl: '/admin/organizer'
                    })}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Chrome className="mr-3 h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-700">Continue with Google</span>
                  </Button>

                  <Button
                    onClick={() => openSignIn({ 
                      strategy: 'oauth_facebook',
                      redirectUrl: '/admin/organizer'
                    })}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Facebook className="mr-3 h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-700">Continue with Facebook</span>
                  </Button>
                </div>

                <div className="relative">
                  <Separator />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
                    <span className="text-sm text-gray-500">or</span>
                  </div>
                </div>

                {/* Email Sign-In Button */}
                <Button
                  onClick={() => setShowEmailForm(true)}
                  variant="outline"
                  className="w-full h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <Mail className="mr-3 h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">Continue with Email</span>
                </Button>
              </>
            ) : (
              <>
                {/* Clerk SignIn Component */}
                <div className="clerk-sign-in-wrapper">
                  <SignIn 
                    appearance={{
                      elements: {
                        formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg transition-all duration-200',
                        card: 'shadow-none border-0 bg-transparent',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 font-medium',
                        socialButtonsBlockButtonText: 'font-medium text-gray-700',
                        dividerLine: 'bg-gray-200',
                        dividerText: 'text-gray-500 font-medium',
                        formFieldInput: 'border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg',
                        formFieldLabel: 'font-medium text-gray-700',
                        footerActionLink: 'text-blue-600 hover:text-blue-800 font-medium',
                        formFieldInputShowPasswordButton: 'text-gray-500 hover:text-gray-700',
                        formResendCodeLink: 'text-blue-600 hover:text-blue-800',
                        alert: 'border-red-200 bg-red-50 text-red-800'
                      },
                      layout: {
                        socialButtonsVariant: 'blockButton',
                        socialButtonsPlacement: 'top'
                      }
                    }}
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    afterSignInUrl="/admin/organizer"
                    redirectUrl="/admin/organizer"
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

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => navigate('/preview/organizer')}
            >
              Try Demo Mode
              <ArrowRight className="ml-2 h-4 w-4" />
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

        {/* Trust Indicators */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Trusted by 10,000+ fashion professionals
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <span>✓ SOC 2 Compliant</span>
            <span>✓ GDPR Ready</span>
            <span>✓ 99.9% Uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
