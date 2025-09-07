// Execute SQL to create missing tables
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

const supabase = createClient(supabaseUrl, supabaseKey);

// Use Supabase Management API to execute SQL
async function executeSql() {
  const sql = fs.readFileSync('./create-missing-tables.sql', 'utf8');
  
  const response = await fetch(
    'https://api.supabase.com/v1/projects/vuvfqjhkppmbdeqsflbn/database/query',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sbp_7024d97cbc348845b3f00c74c103c6010dc360a8',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    }
  );

  const result = await response.json();
  
  if (response.ok) {
    console.log('✅ Tables created successfully!');
    return true;
  } else {
    console.error('❌ Error creating tables:', result);
    return false;
  }
}

async function main() {
  console.log('Creating missing tables...\n');
  
  const success = await executeSql();
  
  if (success) {
    console.log('\nNow adding sample data...\n');
    
    // Wait a moment for tables to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Import and run the data script
    const { default: addData } = await import('./add-designer-model-data.mjs');
    if (typeof addData === 'function') {
      await addData();
    }
  }
}

main().catch(console.error);
