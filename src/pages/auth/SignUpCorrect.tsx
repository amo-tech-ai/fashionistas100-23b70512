import { SignUp } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Users } from 'lucide-react';

export default function SignUpCorrect() {
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
            Professional fashion event management platform
          </p>
        </div>

        {/* Success Alert */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Clerk Ready!</strong> Complete signup form with Google, Facebook, and Email options
          </AlertDescription>
        </Alert>

        {/* Clerk SignUp Component - This is the correct way! */}
        <Card className="shadow-2xl border-0">
          <CardContent className="p-0">
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
                  card: 'shadow-none border-0',
                  headerTitle: 'text-2xl font-bold text-gray-900',
                  headerSubtitle: 'text-gray-600',
                  socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
                  formFieldInput: 'border border-gray-300 focus:border-purple-500 focus:ring-purple-500',
                  footerActionLink: 'text-purple-600 hover:text-purple-800'
                }
              }}
              routing="hash"
              signInUrl="/sign-in"
              afterSignUpUrl="/admin/organizer"
            />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Complete form with Google, Facebook, or Email signup</li>
              <li>• Verify your email address if using email signup</li>
              <li>• Automatic redirect to dashboard after successful signup</li>
              <li>• Secure, enterprise-grade authentication by Clerk</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
