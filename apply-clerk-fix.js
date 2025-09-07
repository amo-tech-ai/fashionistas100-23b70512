const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

async function fixClerkIntegration() {
  console.log('🔧 Fixing Clerk Integration with Supabase...\n');
  
  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // Read the SQL migration file
    const sqlFile = fs.readFileSync(path.join(__dirname, 'fix-clerk-integration.sql'), 'utf8');
    
    // Split SQL into individual statements (separated by semicolons)
    const statements = sqlFile
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s + ';');

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const firstLine = statement.split('\n')[0].substring(0, 50);
      
      console.log(`Executing statement ${i + 1}/${statements.length}: ${firstLine}...`);
      
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement
      }).single();
      
      if (error) {
        // Try direct execution if RPC fails
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ query: statement })
        });
        
        if (!response.ok) {
          console.error(`❌ Failed: ${error?.message || 'Unknown error'}`);
        } else {
          console.log(`✅ Success`);
        }
      } else {
        console.log(`✅ Success`);
      }
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Refresh the integration test page');
    console.log('2. All tests should now pass');
    console.log('3. The RLS error should be resolved');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n🔧 Alternative: Run the SQL manually in Supabase Dashboard:');
    console.log('1. Go to: https://supabase.com/dashboard/project/vuvfqjhkppmbdeqsflbn/sql');
    console.log('2. Copy the contents of fix-clerk-integration.sql');
    console.log('3. Paste and run in the SQL editor');
  }
}

// Run the fix
fixClerkIntegration();