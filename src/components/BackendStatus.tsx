import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { testLeapConnection, testSupabaseConnection } from '@/utils/testConnections';

export const BackendStatus = () => {
  const [testing, setTesting] = useState(false);
  const [leapStatus, setLeapStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [leapUrl] = useState(import.meta.env.VITE_LEAP_API_URL || 'Not configured');
  const [supabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || 'Not configured');

  const testConnections = async () => {
    setTesting(true);
    
    // Test Leap
    setLeapStatus('testing');
    try {
      const leapConnected = await testLeapConnection();
      setLeapStatus(leapConnected ? 'connected' : 'error');
    } catch {
      setLeapStatus('error');
    }

    // Test Supabase
    setSupabaseStatus('testing');
    try {
      const supabaseConnected = await testSupabaseConnection();
      setSupabaseStatus(supabaseConnected ? 'connected' : 'error');
    } catch {
      setSupabaseStatus('error');
    }

    setTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'testing':
        return <Badge className="bg-yellow-100 text-yellow-800">Testing...</Badge>;
      default:
        return <Badge variant="outline">Not tested</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Backend Connection Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Leap Backend Status */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold flex items-center gap-2">
              {getStatusIcon(leapStatus)}
              Leap/Encore Backend
            </h3>
            {getStatusBadge(leapStatus)}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Event management, bookings, analytics, ML recommendations
          </p>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {leapUrl}
          </code>
        </div>

        {/* Supabase Status */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold flex items-center gap-2">
              {getStatusIcon(supabaseStatus)}
              Supabase
            </h3>
            {getStatusBadge(supabaseStatus)}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Designer profiles, user data, authentication
          </p>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {supabaseUrl}
          </code>
        </div>

        {/* Test Button */}
        <Button 
          onClick={testConnections}
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connections...
            </>
          ) : (
            'Test Backend Connections'
          )}
        </Button>

        {/* Architecture Info */}
        <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
          <p className="font-semibold">Hybrid Architecture:</p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>Supabase:</strong> Core data (designers, users)</li>
            <li>• <strong>Leap:</strong> Events, bookings, analytics</li>
            <li>• <strong>Integration:</strong> Both work together</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};