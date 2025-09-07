#!/usr/bin/env node

// Test User Dashboard Data Connection
const SUPABASE_URL = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

async function testUserDashboard() {
  console.log('\n👤 USER DASHBOARD - DATA CONNECTION TEST');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Event Registrations
    console.log('\n🎫 Testing Event Registrations...');
    const regResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/event_registrations?select=*,events(event_name,start_datetime)&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const registrations = await regResponse.json();
    console.log(`✅ Event Registrations: ${registrations.length}`);
    if (registrations[0]) {
      console.log(`   Sample: User ${registrations[0].user_id} registered for ${registrations[0].events?.event_name}`);
    }

    // Test 2: Bookings
    console.log('\n📋 Testing Bookings...');
    const bookingResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?select=*&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const bookings = await bookingResponse.json();
    console.log(`✅ Bookings: ${bookings.length}`);
    if (bookings[0]) {
      console.log(`   Sample: ${bookings[0].customer_name || 'Customer'} - $${bookings[0].total_amount}`);
    }

    // Test 3: Upcoming Events
    console.log('\n🎭 Testing Upcoming Events...');
    const eventsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/events?select=*&status=in.(active,upcoming,published)&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const events = await eventsResponse.json();
    console.log(`✅ Upcoming Events: ${events.length}`);
    
    // Test 4: Designer Profiles
    console.log('\n👗 Testing Designer Profiles...');
    const designersResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/designer_profiles?select=*&limit=3`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const designers = await designersResponse.json();
    console.log(`✅ Designer Profiles: ${designers.length}`);
    if (designers[0]) {
      console.log(`   Sample: ${designers[0].brand_name || 'Designer Brand'}`);
    }

    // Test 5: Venues (for favorites)
    console.log('\n🏛️ Testing Venues...');
    const venuesResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/venues?select=name,location&limit=3`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const venues = await venuesResponse.json();
    console.log(`✅ Venues: ${venues.length}`);

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 USER DASHBOARD DATA SUMMARY:');
    console.log('=' .repeat(60));
    console.log(`✅ Event Registrations: ${registrations.length} records`);
    console.log(`✅ Bookings: ${bookings.length} records`);
    console.log(`✅ Upcoming Events: ${events.length} available`);
    console.log(`✅ Designer Profiles: ${designers.length} designers`);
    console.log(`✅ Venues: ${venues.length} locations`);
    
    console.log('\n✨ USER DASHBOARD: DATA CONNECTION SUCCESSFUL!');
    console.log('🎯 Ready for user interactions\n');
    
  } catch (error) {
    console.error('❌ Error testing user dashboard:', error.message);
    process.exit(1);
  }
}

// Run the test
testUserDashboard();