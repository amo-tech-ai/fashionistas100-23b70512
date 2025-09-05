import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join the Fashion Revolution
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account to start organizing and attending fashion events
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-black hover:bg-gray-800 text-white',
              card: 'shadow-xl border border-gray-200',
              headerTitle: 'text-2xl font-bold text-gray-900',
              headerSubtitle: 'text-gray-600',
              socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
              dividerLine: 'bg-gray-300',
              formFieldInput: 'border border-gray-300 focus:border-black focus:ring-black',
              footerActionLink: 'text-black hover:text-gray-800'
            }
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/onboarding"
          redirectUrl="/onboarding"
        />
      </div>
    </div>
  );
}