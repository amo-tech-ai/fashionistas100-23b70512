import { SignIn } from '@clerk/clerk-react';

export default function SignInTest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Fashionistas Sign In</h1>
        <SignIn 
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/admin/organizer"
        />
      </div>
    </div>
  );
}
