import { useAuth, useUser, useClerk } from '@clerk/clerk-react';
import { useResolvedRole } from '@/hooks/useResolvedRole';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';

/**
 * Comprehensive dashboard test page
 * Tests Clerk auth, Supabase connection, and role resolution
 */
export default function DashboardTest() {
  const clerk = useClerk();
  const auth = useAuth();
  const { user } = useUser();
  const { role, isLoading: roleLoading, error: roleError } = useResolvedRole();
  const [supabaseTest, setSupabaseTest] = useState<string>('Not tested');
  const [profileTest, setProfileTest] = useState<string>('Not tested');

  // Test Supabase connection
  const testSupabase = async () => {
    setSupabaseTest('Testing...');
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title')
        .limit(1);
      
      if (error) throw error;
      setSupabaseTest(`✅ Success! Found ${data?.length || 0} events`);
    } catch (err: any) {
      setSupabaseTest(`❌ Error: ${err.message}`);
    }
  };

  // Test profile creation
  const testProfile = async () => {
    if (!user) {
      setProfileTest('❌ No user logged in');
      return;
    }
    
    setProfileTest('Testing...');
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setProfileTest(`✅ Profile exists! Role: ${data.role}`);
      } else {
        setProfileTest('⚠️ No profile found - will be created on dashboard access');
      }
    } catch (err: any) {
      setProfileTest(`❌ Error: ${err.message}`);
    }
  };

  // Redirect if fully authenticated
  if (auth.isSignedIn && role && !roleLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Test Page</h1>
        
        {/* Clerk Auth Status */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">🔐 Clerk Authentication</h2>
          <div className="space-y-2 text-sm">
            <div>Clerk Loaded: {clerk.loaded ? '✅' : '❌'}</div>
            <div>Auth Loaded: {auth.isLoaded ? '✅' : '❌'}</div>
            <div>Signed In: {auth.isSignedIn ? '✅' : '❌'}</div>
            <div>User ID: {auth.userId || 'None'}</div>
            <div>User Email: {user?.primaryEmailAddress?.emailAddress || 'None'}</div>
            <div>User Name: {user?.fullName || 'None'}</div>
          </div>
        </Card>

        {/* Role Resolution */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">👤 Role Resolution</h2>
          <div className="space-y-2 text-sm">
            <div>Role Loading: {roleLoading ? '⏳' : '✅'}</div>
            <div>Resolved Role: {role || 'None'}</div>
            <div>Error: {roleError?.message || 'None'}</div>
            <div>Clerk Metadata Role: {(user?.publicMetadata?.role as string) || 'None'}</div>
          </div>
        </Card>

        {/* Supabase Connection */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">🗄️ Supabase Connection</h2>
          <div className="space-y-2 text-sm mb-4">
            <div>Status: {supabaseTest}</div>
            <div>Profile Status: {profileTest}</div>
          </div>
          <div className="flex gap-2">
            <Button onClick={testSupabase}>Test Events Query</Button>
            <Button onClick={testProfile} disabled={!user}>Test Profile</Button>
          </div>
        </Card>

        {/* Environment Info */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">⚙️ Environment</h2>
          <div className="space-y-2 text-sm font-mono">
            <div>Hostname: {window.location.hostname}</div>
            <div>Clerk Key: {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 20)}...</div>
            <div>Test Key: {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY_TEST?.substring(0, 20)}...</div>
            <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL}</div>
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">🚀 Actions</h2>
          <div className="flex gap-2">
            {!auth.isSignedIn ? (
              <Button onClick={() => clerk.openSignIn()}>Sign In</Button>
            ) : (
              <>
                <Button onClick={() => window.location.href = '/dashboard'}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => clerk.signOut()}>
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
