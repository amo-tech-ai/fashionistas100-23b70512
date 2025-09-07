import { SignUp, useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showManualForm, setShowManualForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { clerk } = useClerk();
  const [clerkReady, setClerkReady] = useState(false);

  useEffect(() => {
    // Check if Clerk is properly initialized
    const checkClerk = async () => {
      if (clerk) {
        try {
          // Wait a bit for Clerk to fully initialize
          await new Promise(resolve => setTimeout(resolve, 1000));
          setClerkReady(true);
        } catch (error) {
          console.error('Clerk initialization error:', error);
          setClerkReady(false);
        }
      }
    };
    checkClerk();
  }, [clerk]);

  const handleManualSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // For development, create a mock session
    localStorage.setItem('fashionos_auth', JSON.stringify({
      user: { email, id: `dev-${Date.now()}` },
      session: { token: `token-${Date.now()}` }
    }));
    
    // Navigate to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  // If Clerk is not ready, show alternatives
  if (!clerkReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Join the Fashion Revolution</CardTitle>
            <CardDescription>
              Create your account to start organizing and attending fashion events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showManualForm ? (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Loading authentication service... Please choose an option below:
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => setShowManualForm(true)}
                  >
                    Sign Up with Email
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/preview/organizer')}
                  >
                    Continue to Preview Mode (No Sign-Up)
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    className="w-full"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Button variant="link" className="p-0" onClick={() => navigate('/sign-in')}>
                    Sign in
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleManualSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowManualForm(false)}
                >
                  Back to options
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // If Clerk is ready, show the Clerk SignUp component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Join the Fashion Revolution
          </h2>
          <p className="mt-2 text-sm text-gray-600">
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
          afterSignUpUrl="/dashboard"
        />
        
        <div className="text-center">
          <Button
            variant="link"
            className="text-sm text-gray-600"
            onClick={() => navigate('/preview/organizer')}
          >
            Skip sign-up and use preview mode →
          </Button>
        </div>
      </div>
    </div>
  );
}