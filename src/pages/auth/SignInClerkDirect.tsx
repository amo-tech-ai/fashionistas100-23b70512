import { SignIn, useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowRight, Globe } from 'lucide-react';

export default function SignInClerkDirect() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    // Check if user is already signed in
    if (isLoaded && isSignedIn) {
      navigate('/admin/organizer', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

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

        {/* Clerk SignIn Component - DIRECT RENDERING */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Sign In to Your Account</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Choose your preferred sign-in method below
            </p>
          </CardHeader>
          <CardContent>
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg transition-all duration-200 rounded-lg h-11',
                  card: 'shadow-none border-0 bg-transparent',
                  headerTitle: 'text-2xl font-bold text-gray-900 mb-2',
                  headerSubtitle: 'text-gray-600 mb-6',
                  socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 font-medium h-11 rounded-lg',
                  socialButtonsBlockButtonText: 'font-medium text-gray-700',
                  socialButtonsProviderIcon: 'w-5 h-5',
                  dividerLine: 'bg-gray-200',
                  dividerText: 'text-gray-500 font-medium bg-white px-4',
                  formFieldInput: 'border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-11',
                  formFieldLabel: 'font-medium text-gray-700 mb-2',
                  footerActionLink: 'text-blue-600 hover:text-blue-800 font-medium',
                  formFieldInputShowPasswordButton: 'text-gray-500 hover:text-gray-700',
                  formResendCodeLink: 'text-blue-600 hover:text-blue-800',
                  alert: 'border-red-200 bg-red-50 text-red-800 rounded-lg',
                  alertText: 'text-red-800',
                  formFieldSuccessText: 'text-green-600',
                  formFieldErrorText: 'text-red-600',
                  identityPreviewText: 'text-gray-600',
                  identityPreviewEditButton: 'text-blue-600 hover:text-blue-800',
                  formForgotPasswordLink: 'text-blue-600 hover:text-blue-800 font-medium'
                },
                layout: {
                  socialButtonsVariant: 'blockButton',
                  socialButtonsPlacement: 'top'
                },
                variables: {
                  colorPrimary: '#2563eb',
                  colorBackground: '#ffffff',
                  colorInputBackground: '#ffffff',
                  colorInputText: '#1f2937',
                  colorText: '#1f2937',
                  colorTextSecondary: '#6b7280',
                  colorSuccess: '#059669',
                  colorDanger: '#dc2626',
                  colorWarning: '#d97706',
                  borderRadius: '0.5rem',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }
              }}
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              afterSignInUrl="/admin/organizer"
              redirectUrl="/admin/organizer"
            />
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
              <Globe className="mr-2 h-4 w-4" />
              Try Demo Mode
            </Button>
            
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => navigate('/sign-up')}
            >
              Don't have an account? Sign up
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Trusted by 10,000+ fashion professionals worldwide
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
