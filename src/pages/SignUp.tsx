import { SignUp } from '@clerk/clerk-react'
import designerImage from '@/assets/designer-studio.jpg'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src={designerImage}
          alt="Fashion designer studio"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="font-playfair text-4xl font-bold mb-4">
              Join Fashionistas
            </h1>
            <p className="text-lg opacity-90">
              Create your account and become part of the exclusive fashion community
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-2xl font-bold text-foreground mb-2">
              Create Your Account
            </h2>
            <p className="text-muted-foreground">
              Join thousands of fashion enthusiasts and industry professionals
            </p>
          </div>
          
          <SignUp 
            routing="path" 
            path="/sign-up"
            signInUrl="/sign-in"
            redirectUrl="/onboarding"
            unsafeMetadata={{
              role: "fashion_enthusiast"
            }}
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg border border-border",
                formFieldInput: "border-border",
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}