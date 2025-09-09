import { SignUp } from '@clerk/clerk-react';

export default function SignUpTest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Fashionistas Sign Up</h1>
        <SignUp 
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/admin/organizer"
        />
      </div>
    </div>
  );
}
