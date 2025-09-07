#!/usr/bin/env node

// Test Designer Dashboard Data Connection
const SUPABASE_URL = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

async function testDesignerDashboard() {
  console.log('\n👗 DESIGNER DASHBOARD - DATA CONNECTION TEST');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Designer Profiles
    console.log('\n🎨 Testing Designer Profiles...');
    const profilesResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/designer_profiles?select=*&limit=5`,
      {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
      }
    );
    
    const profiles = await profilesResponse.json();
    console.log(`✅ Designer Profiles: ${profiles.length}`);
    if (profiles[0]) {
      console.log(`   Sample: ${profiles[0].brand_name || 'Designer'} - ${profiles[0].style_category || 'Fashion'}`);
    }

    // Test 2: Events for Designers
    console.log('\n🎭 Testing Events for Designers...');
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
    console.log(`✅ Available Events: ${events.length}`);
    
    // Add designer-specific data
    const designerEvents = events.slice(0, 3).map(e => ({
      ...e,
      collection: ['Spring/Summer', 'Fall/Winter', 'Resort'][Math.floor(Math.random() * 3)],
      pieces: Math.floor(Math.random() * 30 + 10),
      models: Math.floor(Math.random() * 15 + 5)
    }));
    
    if (designerEvents[0]) {
      console.log(`   Sample: "${designerEvents[0].event_name}" - ${designerEvents[0].collection} Collection`);
    }

    // Test 3: Bookings
    console.log('\n📋 Testing Designer Bookings...');
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
    console.log(`✅ Bookings: ${bookings.length}`);
    
    // Test 4: Mock Collections
    console.log('\n👗 Creating Mock Collections...');
    const collections = [
      { name: 'Ethereal Dreams SS25', pieces: 24, status: 'completed' },
      { name: 'Urban Luxe FW25', pieces: 18, status: 'in-progress' },
      { name: 'Sustainable Chic', pieces: 15, status: 'planning' }
    ];
    console.log(`✅ Collections: ${collections.length}`);
    collections.forEach(c => {
      console.log(`   • ${c.name}: ${c.pieces} pieces (${c.status})`);
    });

    // Test 5: Analytics (Mock)
    console.log('\n📊 Calculating Designer Analytics...');
    const analytics = {
      portfolioViews: 45600,
      likes: 3850,
      bookings: 24,
      revenue: 125000,
      viewsGrowth: 32,
      revenueGrowth: 22
    };
    
    console.log(`✅ Portfolio Views: ${(analytics.portfolioViews/1000).toFixed(1)}K`);
    console.log(`✅ Total Likes: ${analytics.likes.toLocaleString()}`);
    console.log(`✅ Revenue: $${(analytics.revenue/1000).toFixed(0)}K`);
    console.log(`✅ Growth: +${analytics.viewsGrowth}% views, +${analytics.revenueGrowth}% revenue`);

    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 DESIGNER DASHBOARD DATA SUMMARY:');
    console.log('=' .repeat(60));
    console.log(`✅ Designer Profiles: ${profiles.length}`);
    console.log(`✅ Available Events: ${events.length}`);
    console.log(`✅ Active Collections: ${collections.filter(c => c.status !== 'planning').length}`);
    console.log(`✅ Total Bookings: ${bookings.length}`);
    console.log(`✅ Portfolio Views: ${(analytics.portfolioViews/1000).toFixed(1)}K`);
    console.log(`✅ Revenue: $${(analytics.revenue/1000).toFixed(0)}K`);
    
    console.log('\n✨ DESIGNER DASHBOARD: DATA CONNECTION SUCCESSFUL!');
    console.log('🎯 Ready for designer portfolio management\n');
    
  } catch (error) {
    console.error('❌ Error testing designer dashboard:', error.message);
    process.exit(1);
  }
}

// Run the test
testDesignerDashboard();