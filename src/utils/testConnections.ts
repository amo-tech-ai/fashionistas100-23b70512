// Test script to verify Leap backend connection
// Run this to confirm your backend is connected

async function testLeapConnection() {
  console.log('🔍 Testing Leap Backend Connection...\n');

  const LEAP_URL = 'https://staging-fashion-platform-backend-h7a2.frontend.encr.app';
  
  try {
    // Test 1: Check if backend is responsive
    console.log('1. Testing backend availability...');
    const healthResponse = await fetch(`${LEAP_URL}/health`);
    if (healthResponse.ok) {
      console.log('✅ Backend is responding');
    } else {
      console.log(`⚠️ Backend returned status: ${healthResponse.status}`);
    }

    // Test 2: Try to fetch events
    console.log('\n2. Testing events endpoint...');
    const eventsResponse = await fetch(`${LEAP_URL}/api/events`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (eventsResponse.ok) {
      const events = await eventsResponse.json();
      console.log(`✅ Events endpoint working. Found ${events.length || 0} events`);
    } else {
      console.log(`⚠️ Events endpoint returned: ${eventsResponse.status}`);
    }

    // Test 3: Check WebSocket support
    console.log('\n3. Testing WebSocket support...');
    const wsUrl = LEAP_URL.replace('https://', 'wss://') + '/ws';
    console.log(`WebSocket URL would be: ${wsUrl}`);

    // Test 4: Verify CORS headers
    console.log('\n4. Checking CORS configuration...');
    const corsTest = await fetch(`${LEAP_URL}/api/events`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:8081',
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    const corsHeaders = corsTest.headers.get('access-control-allow-origin');
    if (corsHeaders) {
      console.log(`✅ CORS configured: ${corsHeaders}`);
    } else {
      console.log('⚠️ CORS headers not found - may need configuration');
    }

    console.log('\n📊 Connection Test Summary:');
    console.log('============================');
    console.log(`Backend URL: ${LEAP_URL}`);
    console.log('Status: Connected (if all checks passed)');
    
    return true;
  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    console.log('\nPossible issues:');
    console.log('1. Backend is not deployed or running');
    console.log('2. Network/firewall blocking connection');
    console.log('3. CORS not configured for your domain');
    
    return false;
  }
}

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('\n🔍 Testing Supabase Connection...\n');
  
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
      console.log('✅ Supabase connected successfully');
      
      // Get designer count
      const { count } = await supabase
        .from('designer_profiles')
        .select('*', { count: 'exact', head: true });
      
      console.log(`Found ${count} designers in Supabase`);
    } else {
      console.log('⚠️ Supabase connection issue:', error.message);
    }
  } catch (error) {
    console.error('❌ Supabase test failed:', error);
  }
}

// Run both tests
export async function testConnections() {
  console.log('🚀 FashionOS Backend Connection Test\n');
  console.log('=====================================\n');
  
  await testLeapConnection();
  await testSupabaseConnection();
  
  console.log('\n=====================================');
  console.log('✅ Test complete!\n');
}

// Export for use in components
export { testLeapConnection, testSupabaseConnection };