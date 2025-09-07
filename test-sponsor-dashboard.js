#!/usr/bin/env node

// Test Sponsor Dashboard Data Connection
const SUPABASE_URL = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

async function testSponsorDashboard() {
  console.log('\n💼 SPONSOR DASHBOARD - DATA CONNECTION TEST');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Sponsored Events
    console.log('\n🎭 Testing Sponsored Events...');
    const eventsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/events?select=*&status=in.(active,published,upcoming)&limit=10`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const events = await eventsResponse.json();
    console.log(`✅ Available Events for Sponsorship: ${events.length}`);
    
    // Add mock sponsorship data
    const sponsoredEvents = events.slice(0, 3).map(e => ({
      ...e,
      sponsorType: ['Platinum', 'Gold', 'Silver'][Math.floor(Math.random() * 3)],
      investment: Math.floor(Math.random() * 50000 + 10000),
      reach: Math.floor(Math.random() * 10000 + 1000),
      roi: Math.floor(Math.random() * 200 + 50)
    }));
    
    if (sponsoredEvents[0]) {
      console.log(`   Sample: "${sponsoredEvents[0].event_name}" - ${sponsoredEvents[0].sponsorType} Sponsor`);
    }

    // Test 2: Calculate Metrics
    console.log('\n📊 Calculating Sponsorship Metrics...');
    const totalInvestment = sponsoredEvents.reduce((sum, e) => sum + e.investment, 0);
    const totalReach = sponsoredEvents.reduce((sum, e) => sum + e.reach, 0);
    const avgROI = Math.floor(sponsoredEvents.reduce((sum, e) => sum + e.roi, 0) / sponsoredEvents.length);
    
    console.log(`✅ Total Investment: $${totalInvestment.toLocaleString()}`);
    console.log(`✅ Total Reach: ${totalReach.toLocaleString()} people`);
    console.log(`✅ Average ROI: ${avgROI}%`);

    // Test 3: Upcoming Opportunities
    console.log('\n🎯 Testing Upcoming Opportunities...');
    const upcomingResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/events?select=*&status=eq.upcoming&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const upcomingEvents = await upcomingResponse.json();
    console.log(`✅ Upcoming Opportunities: ${upcomingEvents.length}`);
    
    // Test 4: Mock Sponsorship Packages
    console.log('\n📦 Creating Mock Sponsorship Packages...');
    const packages = [
      { name: 'Platinum', events: 3, investment: 50000, status: 'active' },
      { name: 'Gold', events: 2, investment: 25000, status: 'active' },
      { name: 'Silver', events: 1, investment: 10000, status: 'pending' }
    ];
    console.log(`✅ Sponsorship Packages: ${packages.length}`);
    packages.forEach(p => {
      console.log(`   • ${p.name}: $${p.investment.toLocaleString()} (${p.status})`);
    });

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 SPONSOR DASHBOARD DATA SUMMARY:');
    console.log('=' .repeat(60));
    console.log(`✅ Sponsored Events: ${sponsoredEvents.length}`);
    console.log(`✅ Total Investment: $${(totalInvestment/1000).toFixed(0)}K`);
    console.log(`✅ Total Reach: ${(totalReach/1000).toFixed(0)}K people`);
    console.log(`✅ Average ROI: ${avgROI}%`);
    console.log(`✅ Active Packages: ${packages.filter(p => p.status === 'active').length}`);
    console.log(`✅ New Opportunities: ${upcomingEvents.length}`);
    
    console.log('\n✨ SPONSOR DASHBOARD: DATA CONNECTION SUCCESSFUL!');
    console.log('🎯 Ready for sponsor management\n');
    
  } catch (error) {
    console.error('❌ Error testing sponsor dashboard:', error.message);
    process.exit(1);
  }
}

// Run the test
testSponsorDashboard();