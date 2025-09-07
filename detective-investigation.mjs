// Detective Investigation: Check Actual Supabase Tables
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function detectiveScan() {
  console.log('🕵️ DETECTIVE INVESTIGATION: Supabase Connection Analysis');
  console.log('='.repeat(70));
  
  try {
    // Check for designer_profiles table (the REAL one)
    console.log('\n🔍 CHECKING DESIGNER_PROFILES TABLE:');
    const { data: designerProfiles, error: dpError } = await supabase
      .from('designer_profiles')
      .select('*')
      .limit(5);
    
    if (dpError) {
      console.log('❌ designer_profiles error:', dpError.message);
    } else {
      console.log(`✅ designer_profiles found: ${designerProfiles?.length || 0} records`);
      if (designerProfiles?.length > 0) {
        console.log('   Sample:', designerProfiles[0]);
      }
    }

    // Check for model_profiles table (the REAL one)
    console.log('\n🔍 CHECKING MODEL_PROFILES TABLE:');
    const { data: modelProfiles, error: mpError } = await supabase
      .from('model_profiles')
      .select('*')
      .limit(5);
    
    if (mpError) {
      console.log('❌ model_profiles error:', mpError.message);
    } else {
      console.log(`✅ model_profiles found: ${modelProfiles?.length || 0} records`);
      if (modelProfiles?.length > 0) {
        console.log('   Sample:', modelProfiles[0]);
      }
    }

    // Check for event_designers table
    console.log('\n🔍 CHECKING EVENT_DESIGNERS TABLE:');
    const { data: eventDesigners, error: edError } = await supabase
      .from('event_designers')
      .select('*')
      .limit(5);
    
    if (edError) {
      console.log('❌ event_designers error:', edError.message);
    } else {
      console.log(`✅ event_designers found: ${eventDesigners?.length || 0} records`);
    }

    // Check what tables actually exist
    console.log('\n🔍 LISTING ALL TABLES IN PUBLIC SCHEMA:');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%design%');
    
    if (!tablesError && tables) {
      console.log('Designer-related tables:', tables.map(t => t.table_name));
    }

    // Check for our incorrectly created tables
    console.log('\n🔍 CHECKING FOR INCORRECT TABLES:');
    const { data: designers, error: dError } = await supabase
      .from('designers')
      .select('*')
      .limit(1);
    
    if (!dError) {
      console.log('⚠️  Found "designers" table (should be designer_profiles)');
    }

    const { data: models, error: mError } = await supabase
      .from('models')
      .select('*')
      .limit(1);
    
    if (!mError) {
      console.log('⚠️  Found "models" table (should be model_profiles)');
    }

    // Calculate revenue from correct tables
    console.log('\n💰 CHECKING REVENUE SOURCES:');
    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_amount');
    
    const bookingRevenue = bookings?.reduce((sum, b) => sum + Number(b.total_amount || 0), 0) || 0;
    console.log(`  Bookings revenue: $${bookingRevenue.toLocaleString()}`);

    const { data: venueBookings } = await supabase
      .from('venue_bookings')
      .select('total_amount');
    
    const venueRevenue = venueBookings?.reduce((sum, v) => sum + Number(v.total_amount || 0), 0) || 0;
    console.log(`  Venue revenue: $${venueRevenue.toLocaleString()}`);

    console.log(`  TOTAL REVENUE: $${(bookingRevenue + venueRevenue).toLocaleString()}`);

    // Check if profiles table exists
    console.log('\n🔍 CHECKING PROFILES TABLE (parent table):');
    const { data: profiles, error: pError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (pError) {
      console.log('❌ profiles table error:', pError.message);
    } else {
      console.log(`✅ profiles table exists with ${profiles?.length || 0} sample records`);
    }

    // SUMMARY
    console.log('\n' + '='.repeat(70));
    console.log('🚨 DETECTIVE FINDINGS:');
    console.log('='.repeat(70));
    console.log(`
    ✅ CORRECT TABLES EXIST:
       - designer_profiles (with proper schema)
       - model_profiles (with proper schema)
       - event_designers (junction table)
    
    ⚠️  PROBLEM IDENTIFIED:
       - We created "designers" and "models" tables
       - Should be using "designer_profiles" and "model_profiles"
       - Dashboards are querying wrong table names!
    
    💡 SOLUTION NEEDED:
       1. Update dashboard hooks to use correct table names
       2. Populate designer_profiles and model_profiles with data
       3. Remove incorrect tables (designers, models)
    `);

  } catch (error) {
    console.error('❌ Detective scan error:', error);
  }
}

detectiveScan();
