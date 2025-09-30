/**
 * Production Readiness System Check
 * Validates critical setup requirements
 */

import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

export function SystemCheck() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [checks, setChecks] = useState<CheckResult[]>([]);

  useEffect(() => {
    const results: CheckResult[] = [];

    // Check 1: Clerk Provider Mounted
    results.push({
      name: 'Clerk Provider',
      status: isLoaded ? 'pass' : 'fail',
      message: isLoaded 
        ? 'ClerkProvider is properly mounted' 
        : 'ClerkProvider not detected - check main.tsx',
    });

    // Check 2: Environment Variables
    const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    results.push({
      name: 'Clerk Publishable Key',
      status: hasClerkKey ? 'pass' : 'fail',
      message: hasClerkKey
        ? 'VITE_CLERK_PUBLISHABLE_KEY is set'
        : 'Missing VITE_CLERK_PUBLISHABLE_KEY in .env',
    });

    // Check 3: Key Format
    const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    const hasInvalidChar = key?.endsWith('$');
    results.push({
      name: 'Key Format',
      status: hasInvalidChar ? 'fail' : 'pass',
      message: hasInvalidChar
        ? 'Publishable key has trailing "$" - remove it!'
        : 'Key format is valid',
    });

    // Check 4: Supabase URL
    const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
    results.push({
      name: 'Supabase URL',
      status: hasSupabaseUrl ? 'pass' : 'fail',
      message: hasSupabaseUrl
        ? 'VITE_SUPABASE_URL is set'
        : 'Missing VITE_SUPABASE_URL',
    });

    // Check 5: User Profile (if signed in)
    if (isSignedIn && user) {
      const hasRole = !!user.publicMetadata?.role;
      results.push({
        name: 'User Role',
        status: hasRole ? 'pass' : 'warn',
        message: hasRole
          ? `Role: ${user.publicMetadata.role}`
          : 'No role assigned - will default to attendee',
      });
    }

    setChecks(results);
  }, [isLoaded, isSignedIn, user]);

  const failed = checks.filter(c => c.status === 'fail').length;
  const warned = checks.filter(c => c.status === 'warn').length;

  if (failed === 0 && warned === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md">
      <Alert variant={failed > 0 ? 'destructive' : 'default'}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {failed > 0 ? '⚠️ System Issues Detected' : '⚡ Warnings'}
        </AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-2 text-sm">
            {checks.map((check, i) => (
              <div key={i} className="flex items-start gap-2">
                {check.status === 'pass' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                {check.status === 'fail' && <XCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                {check.status === 'warn' && <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                <div className="flex-1">
                  <div className="font-medium">{check.name}</div>
                  <div className="text-xs opacity-80">{check.message}</div>
                </div>
              </div>
            ))}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
