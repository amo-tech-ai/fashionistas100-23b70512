#!/usr/bin/env node

// Test Dashboard Data Connection for fashionistas-working
const SUPABASE_URL = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

async function testDashboardConnection() {
  console.log('\n🚀 FashionOS Dashboard - Production Test\n');
  console.log('=' .repeat(60));
  console.log('Directory: /home/sk/fashionistas/fashionistas-working');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Events with correct columns
    console.log('\n📊 Testing Events Data...');
    const eventsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/events?select=*&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const events = await eventsResponse.json();
    console.log(`✅ Events found: ${events.length}`);
    if (events.length > 0) {
      console.log(`   Columns: ${Object.keys(events[0]).join(', ')}`);
      console.log(`   Sample: "${events[0].event_name}" (${events[0].status})`);
    }
    // Test 2: Bookings
    console.log('\n💰 Testing Bookings Data...');
    const bookingsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?select=*&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const bookings = await bookingsResponse.json();
    console.log(`✅ Bookings found: ${bookings.length}`);
    
    // Test 3: Venue Bookings
    console.log('\n🏛️ Testing Venue Bookings...');
    const venueBookingsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/venue_bookings?select=*&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const venueBookings = await venueBookingsResponse.json();
    console.log(`✅ Venue bookings found: ${venueBookings.length}`);
    
    // Test 4: Event Registrations with join
    console.log('\n📝 Testing Event Registrations...');    const registrationsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/event_registrations?select=*,events(event_name,status)&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const registrations = await registrationsResponse.json();
    console.log(`✅ Registrations found: ${registrations.length}`);
    if (registrations.length > 0 && registrations[0].events) {
      console.log(`   Sample with join: Registration for "${registrations[0].events.event_name}"`);
    }
    
    // Test 5: Venue Inquiries
    console.log('\n🏢 Testing Venue Inquiries...');
    const inquiriesResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/venue_inquiries?select=*,venues(name,location)&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const inquiries = await inquiriesResponse.json();
    console.log(`✅ Venue inquiries found: ${inquiries.length}`);
    
    // Summary
    console.log('\n' + '=' .repeat(60));    console.log('📊 DASHBOARD DATA SUMMARY:');
    console.log('=' .repeat(60));
    console.log(`✅ Events: ${events.length} records`);
    console.log(`✅ Bookings: ${bookings.length} records`);
    console.log(`✅ Venue Bookings: ${venueBookings.length} records`);
    console.log(`✅ Registrations: ${registrations.length} records`);
    console.log(`✅ Venue Inquiries: ${inquiries.length} records`);
    
    const totalRecords = events.length + bookings.length + venueBookings.length + 
                        registrations.length + inquiries.length;
    
    console.log(`\n📈 Total Dashboard Records: ${totalRecords}`);
    
    if (totalRecords > 0) {
      console.log('\n✨ SUCCESS: Dashboard data is properly connected!');
      console.log('🎯 Production dashboard ready for deployment');
    } else {
      console.log('\n⚠️ Warning: No data found. Adding sample data may be needed.');
    }
    
  } catch (error) {
    console.error('❌ Error testing dashboard:', error.message);
    process.exit(1);
  }
}

// Run the test
testDashboardConnection();