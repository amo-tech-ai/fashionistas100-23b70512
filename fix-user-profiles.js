import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

const supabase = createClient(supabaseUrl, serviceKey);

async function fixUserProfiles() {
  try {
    // First check if column exists
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'user_profiles')
      .eq('column_name', 'full_name');

    if (columnError) {
      console.log('Column check error (expected if table is new):', columnError.message);
    }

    // Use direct SQL execution via Management API
    const response = await fetch('https://api.supabase.com/v1/projects/vuvfqjhkppmbdeqsflbn/database/query', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sbp_7024d97cbc348845b3f00c74c103c6010dc360a8',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          ALTER TABLE user_profiles 
          ADD COLUMN IF NOT EXISTS full_name TEXT;
          
          -- Update existing records to have a full_name
          UPDATE user_profiles 
          SET full_name = COALESCE(first_name || ' ' || last_name, email, 'User') 
          WHERE full_name IS NULL;
        `
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Successfully added full_name column to user_profiles');
      console.log('Result:', result);
    } else {
      console.error('❌ Failed to update schema:', result);
    }

  } catch (err) {
    console.error('Fix failed:', err);
  }
}

fixUserProfiles();
