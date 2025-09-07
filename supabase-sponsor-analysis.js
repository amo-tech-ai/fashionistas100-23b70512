const https = require('https');

const PROJECT_REF = 'vuvfqjhkppmbdeqsflbn';
const ACCESS_TOKEN = 'sbp_7024d97cbc348845b3f00c74c103c6010dc360a8';

async function executeSql(sql) {
  const data = JSON.stringify({ query: sql });
  
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.supabase.io', // CRITICAL: .io not .com
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, res => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => {
        // Accept both 200 and 201 as success
        if (res.statusCode !== 200 && res.statusCode !== 201) {
          console.error(`HTTP ${res.statusCode}: ${response}`);
          reject(new Error(`API request failed: ${res.statusCode}`));
          return;
        }
        
        try {
          const result = JSON.parse(response);
          resolve(result);
        } catch (e) {
          console.error('JSON Parse Error. Response:', response);
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function analyzeExistingTables() {
  console.log('🔍 Analyzing existing sponsorship tables...\n');
  
  try {
    // Check existing tables
    const tables = await executeSql(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('sponsors', 'sponsorships', 'sponsor_packages', 'sponsor_leads')
      ORDER BY table_name;
    `);
    
    console.log('✅ Existing Tables Found:');
    tables.forEach(t => console.log(`  - ${t.table_name}`));
    
    // Check columns for each table
    for (const table of tables) {
      const columns = await executeSql(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = '${table.table_name}'
        ORDER BY ordinal_position;
      `);
      
      console.log(`\n📊 ${table.table_name} columns (${columns.length}):`);
      columns.forEach(c => {
        console.log(`  - ${c.column_name} (${c.data_type}) ${c.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
      });
    }
    
    // Check for missing tables
    const missingTables = [
      'sponsor_activations',
      'sponsor_digital_assets', 
      'sponsor_brand_guidelines',
      'sponsor_placements',
      'sponsor_communications',
      'sponsor_documents',
      'sponsor_activities',
      'sponsor_payments'
    ];
    
    const checkMissing = await executeSql(`
      SELECT '${missingTables.join("','")}' EXCEPT 
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    
    console.log('\n❌ Missing Tables Needed:');
    missingTables.forEach(t => console.log(`  - ${t}`));
    
  } catch (error) {
    console.error('Error analyzing tables:', error.message);
  }
}

// Run analysis
analyzeExistingTables();