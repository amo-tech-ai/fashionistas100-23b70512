import { useState } from 'react';
import { useAuth, useSignUp } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TestDirectAuth() {
  const { isSignedIn } = useAuth();
  const { signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Direct signup without OAuth
  const handleSignUp = async () => {
    setError('');
    setSuccess('');
    
    if (!signUp) {
      setError('SignUp not initialized');
      return;
    }

    try {
      // Create the user
      const result = await signUp.create({
        emailAddress: email,
        password: password,
        username: username,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ 
        strategy: 'email_code' 
      });

      setPendingVerification(true);
      setSuccess('Verification code sent to your email!');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.errors?.[0]?.message || 'Failed to sign up');
    }
  };

  // Verify email code
  const handleVerify = async () => {
    setError('');
    
    if (!signUp || !setActive) {
      setError('SignUp not initialized');
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/admin/organizer'), 2000);
      } else {
        setError('Verification incomplete. Status: ' + completeSignUp.status);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.errors?.[0]?.message || 'Verification failed');
    }
  };

  if (isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Already Signed In</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You are already signed in!
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/admin/organizer')}
              className="w-full mt-4"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Direct Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!pendingVerification ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Strong password"
                />
              </div>

              <Button 
                onClick={handleSignUp}
                className="w-full"
                disabled={!email || !password || !username}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Check your email for a verification code!
                </AlertDescription>
              </Alert>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Verification Code
                </label>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                />
              </div>

              <Button 
                onClick={handleVerify}
                className="w-full"
                disabled={!verificationCode}
              >
                Verify Email
              </Button>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}