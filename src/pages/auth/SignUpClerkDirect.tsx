import { SignUp, useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, CheckCircle, Globe } from 'lucide-react';

export default function SignUpClerkDirect() {
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
            Join FashionOS
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

        {/* Clerk SignUp Component - DIRECT RENDERING */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Choose your preferred sign-up method below
            </p>
          </CardHeader>
          <CardContent>
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg transition-all duration-200 rounded-lg h-11',
                  card: 'shadow-none border-0 bg-transparent',
                  headerTitle: 'text-2xl font-bold text-gray-900 mb-2',
                  headerSubtitle: 'text-gray-600 mb-6',
                  socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 font-medium h-11 rounded-lg',
                  socialButtonsBlockButtonText: 'font-medium text-gray-700',
                  socialButtonsProviderIcon: 'w-5 h-5',
                  dividerLine: 'bg-gray-200',
                  dividerText: 'text-gray-500 font-medium bg-white px-4',
                  formFieldInput: 'border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg h-11',
                  formFieldLabel: 'font-medium text-gray-700 mb-2',
                  footerActionLink: 'text-purple-600 hover:text-purple-800 font-medium',
                  formFieldInputShowPasswordButton: 'text-gray-500 hover:text-gray-700',
                  formResendCodeLink: 'text-purple-600 hover:text-purple-800',
                  alert: 'border-red-200 bg-red-50 text-red-800 rounded-lg',
                  alertText: 'text-red-800',
                  formFieldSuccessText: 'text-green-600',
                  formFieldErrorText: 'text-red-600',
                  identityPreviewText: 'text-gray-600',
                  identityPreviewEditButton: 'text-purple-600 hover:text-purple-800'
                },
                layout: {
                  socialButtonsVariant: 'blockButton',
                  socialButtonsPlacement: 'top',
                  showOptionalFields: true
                },
                variables: {
                  colorPrimary: '#9333ea',
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
              path="/sign-up"
              signInUrl="/sign-in"
              afterSignUpUrl="/admin/organizer"
              initialValues={{
                unsafeMetadata: {
                  role: 'organizer'
                }
              }}
            />
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

        {/* Role Selection Note */}
        <Alert className="border-purple-200 bg-purple-50">
          <Users className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>Starting as Event Organizer:</strong> You can change your role anytime in settings after signup
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
