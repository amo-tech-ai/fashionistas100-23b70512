import { SignIn } from '@clerk/clerk-react'
import heroImage from '@/assets/hero-runway.jpg'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src={heroImage}
          alt="Fashion runway"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="font-playfair text-4xl font-bold mb-4">
              Welcome Back
            </h1>
            <p className="text-lg opacity-90">
              Continue your fashion journey with exclusive events and designer access
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Sign In */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-2xl font-bold text-foreground mb-2">
              Sign In to Fashionistas
            </h2>
            <p className="text-muted-foreground">
              Access your account and discover amazing fashion events
            </p>
          </div>
          
          <SignIn 
            routing="path" 
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg border border-border",
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}