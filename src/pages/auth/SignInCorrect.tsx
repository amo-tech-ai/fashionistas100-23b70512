import { SignIn } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Shield } from 'lucide-react';

export default function SignInCorrect() {
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
            Sign in to access your fashion dashboard
          </p>
        </div>

        {/* Success Alert */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Clerk Ready!</strong> Sign in with Google, Facebook, or Email
          </AlertDescription>
        </Alert>

        {/* Clerk SignIn Component - This is the correct way! */}
        <Card className="shadow-2xl border-0">
          <CardContent className="p-0">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
                  card: 'shadow-none border-0',
                  headerTitle: 'text-2xl font-bold text-gray-900',
                  headerSubtitle: 'text-gray-600',
                  socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
                  formFieldInput: 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                  footerActionLink: 'text-blue-600 hover:text-blue-800'
                }
              }}
              routing="hash"
              signUpUrl="/sign-up"
              afterSignInUrl="/admin/organizer"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
