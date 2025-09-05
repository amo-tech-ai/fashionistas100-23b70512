// Test script to verify Leap backend connection
// Run this to confirm your backend is connected

async function testLeapConnection() {

  const LEAP_URL = 'https://staging-fashion-platform-backend-h7a2.frontend.encr.app';
  
  try {
    // Test 1: Check if backend is responsive
    const healthResponse = await fetch(`${LEAP_URL}/health`);
    if (healthResponse.ok) {
    } else {
    }

    // Test 2: Try to fetch events
    const eventsResponse = await fetch(`${LEAP_URL}/api/events`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (eventsResponse.ok) {
      const events = await eventsResponse.json();
    } else {
    }

    // Test 3: Check WebSocket support
    const wsUrl = LEAP_URL.replace('https://', 'wss://') + '/ws';

    // Test 4: Verify CORS headers
    const corsTest = await fetch(`${LEAP_URL}/api/events`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:8081',
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    const corsHeaders = corsTest.headers.get('access-control-allow-origin');
    if (corsHeaders) {
    } else {
    }

    
    return true;
  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    
    return false;
  }
}

// Test Supabase connection
async function testSupabaseConnection() {
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    const SUPABASE_URL = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxODA4NTQsImV4cCI6MjA3MTc1Njg1NH0.9CQrGMuLuK6DWlRe7Z8tOrNBjEBEPnj9-AsBO3x8zKc';
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Test connection
    const { data, error } = await supabase
      .from('designer_profiles')
      .select('count')
      .single();
    
    if (!error) {
      
      // Get designer count
      const { count } = await supabase
        .from('designer_profiles')
        .select('*', { count: 'exact', head: true });
      
    } else {
    }
  } catch (error) {
    console.error('❌ Supabase test failed:', error);
  }
}

// Run both tests
export async function testConnections() {
  
  await testLeapConnection();
  await testSupabaseConnection();
  
}

// Export for use in components
export { testLeapConnection, testSupabaseConnection };