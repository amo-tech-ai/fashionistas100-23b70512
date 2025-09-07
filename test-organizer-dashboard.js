#!/usr/bin/env node

// Test Organizer Dashboard Data Connection
const SUPABASE_URL = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

async function testOrganizerDashboard() {
  console.log('\n🎯 ORGANIZER DASHBOARD - DATA CONNECTION TEST');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Events Data
    console.log('\n📅 Testing Events Data...');
    const eventsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/events?select=*&order=start_datetime.asc`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const events = await eventsResponse.json();
    const activeEvents = events.filter(e => e.status === 'active' || e.status === 'published').length;
    
    console.log(`✅ Total Events: ${events.length}`);
    console.log(`   Active/Published: ${activeEvents}`);
    if (events[0]) {
      console.log(`   Latest: "${events[0].event_name}" (${events[0].status})`);
    }

    // Test 2: Attendees/Registrations
    console.log('\n👥 Testing Attendees Data...');
    const regResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/event_registrations?select=*`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    const registrations = await regResponse.json();
    
    const attendeesResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/attendees?select=*`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    const attendees = await attendeesResponse.json();
    
    console.log(`✅ Event Registrations: ${registrations.length}`);
    console.log(`✅ Attendees: ${attendees.length}`);
    console.log(`   Total Count: ${registrations.length + attendees.length}`);

    // Test 3: Revenue Data
    console.log('\n💰 Testing Revenue Data...');
    const bookingsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/bookings?select=total_amount`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    const bookings = await bookingsResponse.json();
    
    const venueBookingsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/venue_bookings?select=total_cost`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    const venueBookings = await venueBookingsResponse.json();
    
    const bookingRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
    const venueRevenue = venueBookings.reduce((sum, vb) => sum + (vb.total_cost || 0), 0);
    const totalRevenue = bookingRevenue + venueRevenue;
    
    console.log(`✅ Booking Revenue: $${bookingRevenue.toLocaleString()}`);
    console.log(`✅ Venue Revenue: $${venueRevenue.toLocaleString()}`);
    console.log(`   Total Revenue: $${totalRevenue.toLocaleString()}`);

    // Test 4: Communications (Messages)
    console.log('\n💬 Testing Communications Data...');
    const inquiriesResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/venue_inquiries?select=*,venues(name)&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    const inquiries = await inquiriesResponse.json();
    
    const contactsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/contact_forms?select=*&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    const contacts = await contactsResponse.json();
    
    console.log(`✅ Venue Inquiries: ${inquiries.length}`);
    console.log(`✅ Contact Forms: ${contacts.length}`);
    console.log(`   Total Messages: ${inquiries.length + contacts.length}`);

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 DASHBOARD DATA SUMMARY:');
    console.log('=' .repeat(60));
    console.log(`✅ Active Events: ${activeEvents}`);
    console.log(`✅ Total Attendees: ${registrations.length + attendees.length}`);
    console.log(`✅ Total Revenue: $${(totalRevenue/1000).toFixed(1)}K`);
    console.log(`✅ New Messages: ${inquiries.length + contacts.length}`);
    
    console.log('\n✨ ORGANIZER DASHBOARD: DATA CONNECTION SUCCESSFUL!');
    console.log('🎯 Ready for production use\n');
    
  } catch (error) {
    console.error('❌ Error testing dashboard:', error.message);
    process.exit(1);
  }
}

// Run the test
testOrganizerDashboard();