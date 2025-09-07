#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://vuvfqjhkppmbdeqsflbn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk'
);

console.log('🕵️ DETECTIVE ANALYSIS: Complete Dashboard Production Readiness Test\n');
console.log('='.repeat(70));

async function testAllDashboards() {
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  // TEST 1: Events Data
  console.log('\n📊 TEST 1: Events Data');
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .in('status', ['active', 'upcoming', 'published']);
  
  if (events && events.length > 0) {
    console.log(`  ✅ Events: ${events.length} found`);
    results.passed.push('Events data loaded');
  } else {
    console.log(`  ❌ Events: ${eventsError || 'No events found'}`);
    results.failed.push('Events data missing');
  }
  // TEST 2: Revenue Data
  console.log('\n💰 TEST 2: Revenue Calculation');
  const { data: bookings } = await supabase
    .from('bookings')
    .select('total_amount')
    .not('total_amount', 'is', null);
  
  const { data: venueBookings } = await supabase
    .from('venue_bookings')
    .select('total_amount')
    .not('total_amount', 'is', null);
  
  const bookingRevenue = bookings?.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0) || 0;
  const venueRevenue = venueBookings?.reduce((sum, vb) => sum + (Number(vb.total_amount) || 0), 0) || 0;
  const totalRevenue = bookingRevenue + venueRevenue;
  
  console.log(`  💵 Booking Revenue: $${bookingRevenue.toLocaleString()}`);
  console.log(`  🏢 Venue Revenue: $${venueRevenue.toLocaleString()}`);
  console.log(`  📈 Total Revenue: $${totalRevenue.toLocaleString()}`);
  
  if (totalRevenue > 0) {
    results.passed.push('Revenue calculation working');
  } else {
    results.failed.push('Revenue showing as $0');
  }

  // TEST 3: User/Designer/Model Data
  console.log('\n👥 TEST 3: User Profiles');  const { count: designers } = await supabase
    .from('designer_profiles')
    .select('*', { count: 'exact', head: true });
  
  const { count: models } = await supabase
    .from('model_profiles')
    .select('*', { count: 'exact', head: true });
  
  const { count: venues } = await supabase
    .from('venues')
    .select('*', { count: 'exact', head: true });
  
  console.log(`  👗 Designers: ${designers || 0}`);
  console.log(`  🚶 Models: ${models || 0}`);
  console.log(`  🏛️ Venues: ${venues || 0}`);
  
  if (designers > 0) results.passed.push('Designer profiles exist');
  else results.warnings.push('No designer profiles');
  
  if (models > 0) results.passed.push('Model profiles exist');
  else results.warnings.push('No model profiles');
  
  if (venues > 0) results.passed.push('Venues exist');
  else results.failed.push('No venues found');

  // TEST 4: Registrations/Attendees
  console.log('\n🎟️ TEST 4: Attendee Data');
  const { count: registrations } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true });  
  const { count: attendees } = await supabase
    .from('attendees')
    .select('*', { count: 'exact', head: true });
  
  console.log(`  📝 Registrations: ${registrations || 0}`);
  console.log(`  👤 Attendees: ${attendees || 0}`);
  
  if ((registrations || 0) + (attendees || 0) > 0) {
    results.passed.push('Attendee data exists');
  } else {
    results.warnings.push('No attendee data');
  }

  // FINAL REPORT
  console.log('\n' + '='.repeat(70));
  console.log('📋 PRODUCTION READINESS REPORT\n');
  
  const totalTests = results.passed.length + results.failed.length + results.warnings.length;
  const passRate = Math.round((results.passed.length / totalTests) * 100);
  
  console.log(`✅ PASSED: ${results.passed.length}/${totalTests} tests`);
  results.passed.forEach(test => console.log(`   ✓ ${test}`));
  
  if (results.warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS: ${results.warnings.length}`);
    results.warnings.forEach(warn => console.log(`   ⚠ ${warn}`));
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ FAILED: ${results.failed.length}`);    results.failed.forEach(fail => console.log(`   ✗ ${fail}`));
  }
  
  console.log(`\n🎯 PRODUCTION READINESS: ${passRate}%`);
  
  if (passRate >= 90) {
    console.log('✅ READY FOR PRODUCTION');
  } else if (passRate >= 70) {
    console.log('⚠️  NEEDS MINOR FIXES');
  } else {
    console.log('❌ NOT PRODUCTION READY');
  }
}

testAllDashboards().catch(console.error);