// Production Readiness Test - Final Verification
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

const supabase = createClient(supabaseUrl, supabaseKey);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

async function runProductionTest() {
  console.log(`${colors.cyan}${colors.bright}
╔══════════════════════════════════════════════════════════════════╗
║          🚀 FASHIONOS PRODUCTION READINESS TEST 🚀              ║
╚══════════════════════════════════════════════════════════════════╝
${colors.reset}`);

  let passedTests = 0;
  let failedTests = 0;
  const testResults = [];

  // Test 1: Events Table
  console.log(`\n${colors.blue}TEST 1: Events Table${colors.reset}`);
  try {
    const { data: events, error } = await supabase.from('events').select('*');
    if (error) throw error;
    const activeEvents = events?.filter(e => e.status === 'active' || e.status === 'published').length || 0;
    console.log(`${colors.green}✅ Events: ${events?.length || 0} total, ${activeEvents} active${colors.reset}`);
    passedTests++;
    testResults.push({ test: 'Events', status: 'PASS', count: events?.length });
  } catch (error) {
    console.log(`${colors.red}❌ Events: ${error.message}${colors.reset}`);
    failedTests++;
    testResults.push({ test: 'Events', status: 'FAIL', error: error.message });
  }

  // Test 2: Revenue Calculation
  console.log(`\n${colors.blue}TEST 2: Revenue Calculation${colors.reset}`);
  try {
    const [bookings, venueBookings, sponsorships] = await Promise.all([
      supabase.from('bookings').select('total_amount'),
      supabase.from('venue_bookings').select('total_amount'),
      supabase.from('sponsorships').select('amount')
    ]);

    const bookingRevenue = bookings.data?.reduce((sum, b) => sum + Number(b.total_amount || 0), 0) || 0;
    const venueRevenue = venueBookings.data?.reduce((sum, v) => sum + Number(v.total_amount || 0), 0) || 0;
    const sponsorRevenue = sponsorships.data?.reduce((sum, s) => sum + Number(s.amount || 0), 0) || 0;
    const totalRevenue = bookingRevenue + venueRevenue + sponsorRevenue;

    console.log(`${colors.green}✅ Revenue: $${totalRevenue.toLocaleString()}${colors.reset}`);
    console.log(`   - Bookings: $${bookingRevenue.toLocaleString()}`);
    console.log(`   - Venues: $${venueRevenue.toLocaleString()}`);
    console.log(`   - Sponsors: $${sponsorRevenue.toLocaleString()}`);
    passedTests++;
    testResults.push({ test: 'Revenue', status: 'PASS', amount: totalRevenue });
  } catch (error) {
    console.log(`${colors.red}❌ Revenue: ${error.message}${colors.reset}`);
    failedTests++;
    testResults.push({ test: 'Revenue', status: 'FAIL', error: error.message });
  }

  // Test 3: Designer Profiles (CORRECT TABLE)
  console.log(`\n${colors.blue}TEST 3: Designer Profiles${colors.reset}`);
  try {
    const { data: designers, error } = await supabase.from('designer_profiles').select('*');
    if (error) throw error;
    console.log(`${colors.green}✅ Designer Profiles: ${designers?.length || 0} found${colors.reset}`);
    if (designers?.length > 0) {
      console.log(`   Sample: ${designers[0].brand_name}`);
    }
    passedTests++;
    testResults.push({ test: 'Designer Profiles', status: 'PASS', count: designers?.length });
  } catch (error) {
    console.log(`${colors.red}❌ Designer Profiles: ${error.message}${colors.reset}`);
    failedTests++;
    testResults.push({ test: 'Designer Profiles', status: 'FAIL', error: error.message });
  }

  // Test 4: Model Profiles (CORRECT TABLE)
  console.log(`\n${colors.blue}TEST 4: Model Profiles${colors.reset}`);
  try {
    const { data: models, error } = await supabase.from('model_profiles').select('*');
    if (error) throw error;
    console.log(`${colors.green}✅ Model Profiles: ${models?.length || 0} found${colors.reset}`);
    if (models?.length > 0) {
      console.log(`   Sample: ${models[0].stage_name}`);
    }
    passedTests++;
    testResults.push({ test: 'Model Profiles', status: 'PASS', count: models?.length });
  } catch (error) {
    console.log(`${colors.red}❌ Model Profiles: ${error.message}${colors.reset}`);
    failedTests++;
    testResults.push({ test: 'Model Profiles', status: 'FAIL', error: error.message });
  }

  // Test 5: Event Designers Junction
  console.log(`\n${colors.blue}TEST 5: Event Designers Junction${colors.reset}`);
  try {
    const { data: eventDesigners, error } = await supabase.from('event_designers').select('*');
    if (error) throw error;
    console.log(`${colors.green}✅ Event Designers: ${eventDesigners?.length || 0} connections${colors.reset}`);
    passedTests++;
    testResults.push({ test: 'Event Designers', status: 'PASS', count: eventDesigners?.length });
  } catch (error) {
    console.log(`${colors.red}❌ Event Designers: ${error.message}${colors.reset}`);
    failedTests++;
    testResults.push({ test: 'Event Designers', status: 'FAIL', error: error.message });
  }

  // Test 6: Venues
  console.log(`\n${colors.blue}TEST 6: Venues${colors.reset}`);
  try {
    const { data: venues, error } = await supabase.from('venues').select('*');
    if (error) throw error;
    console.log(`${colors.green}✅ Venues: ${venues?.length || 0} locations${colors.reset}`);
    passedTests++;
    testResults.push({ test: 'Venues', status: 'PASS', count: venues?.length });
  } catch (error) {
    console.log(`${colors.red}❌ Venues: ${error.message}${colors.reset}`);
    failedTests++;
    testResults.push({ test: 'Venues', status: 'FAIL', error: error.message });
  }

  // Test 7: Attendees/Registrations
  console.log(`\n${colors.blue}TEST 7: Attendees & Registrations${colors.reset}`);
  try {
    const { count: registrations } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true });
    const { count: attendees } = await supabase
      .from('attendees')
      .select('*', { count: 'exact', head: true });
    
    const total = (registrations || 0) + (attendees || 0);
    console.log(`${colors.green}✅ Attendees: ${total} total (${registrations} registrations, ${attendees} attendees)${colors.reset}`);
    passedTests++;
    testResults.push({ test: 'Attendees', status: 'PASS', count: total });
  } catch (error) {
    console.log(`${colors.red}❌ Attendees: ${error.message}${colors.reset}`);
    failedTests++;
    testResults.push({ test: 'Attendees', status: 'FAIL', error: error.message });
  }

  // Test 8: Real-time Subscriptions
  console.log(`\n${colors.blue}TEST 8: Real-time Subscriptions${colors.reset}`);
  try {
    const channel = supabase
      .channel('test-production')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' },
        () => {})
      .subscribe();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (channel.state === 'joined') {
      console.log(`${colors.green}✅ Real-time: Subscription active${colors.reset}`);
      passedTests++;
      testResults.push({ test: 'Real-time', status: 'PASS' });
    } else {
      throw new Error('Subscription not joined');
    }
    
    supabase.removeChannel(channel);
  } catch (error) {
    console.log(`${colors.red}❌ Real-time: ${error.message}${colors.reset}`);
    failedTests++;
    testResults.push({ test: 'Real-time', status: 'FAIL', error: error.message });
  }

  // Final Report
  console.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}📊 PRODUCTION READINESS REPORT${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);

  const totalTests = passedTests + failedTests;
  const percentage = Math.round((passedTests / totalTests) * 100);

  console.log(`Tests Passed: ${colors.green}${passedTests}/${totalTests}${colors.reset}`);
  console.log(`Success Rate: ${percentage >= 80 ? colors.green : colors.yellow}${percentage}%${colors.reset}`);

  // Summary Table
  console.log(`\n${colors.bright}Test Results:${colors.reset}`);
  testResults.forEach(result => {
    const statusColor = result.status === 'PASS' ? colors.green : colors.red;
    const icon = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${result.test}: ${statusColor}${result.status}${colors.reset}`);
  });

  // Production Readiness Status
  console.log(`\n${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  if (percentage === 100) {
    console.log(`${colors.green}${colors.bright}
    🎉 PRODUCTION READY! 🎉
    All systems operational and connected to Supabase.
    ${colors.reset}`);
  } else if (percentage >= 80) {
    console.log(`${colors.yellow}${colors.bright}
    ⚠️  MOSTLY READY
    Some minor issues to fix before production.
    ${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bright}
    ❌ NOT PRODUCTION READY
    Critical issues need to be resolved.
    ${colors.reset}`);
  }

  // Dashboard URLs
  console.log(`\n${colors.bright}Dashboard URLs:${colors.reset}`);
  console.log(`Preview: ${colors.blue}http://localhost:8102/fashionistas100-23b70512/preview/organizer${colors.reset}`);
  console.log(`Production: ${colors.blue}http://localhost:8102/fashionistas100-23b70512/admin/organizer${colors.reset}`);
  console.log(`Live: ${colors.blue}https://fashionistas100-23b70512.vercel.app${colors.reset}`);
}

// Run the test
runProductionTest().catch(console.error);
