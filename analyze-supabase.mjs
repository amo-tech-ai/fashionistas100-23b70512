#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import https from 'https';

const supabase = createClient(
  'https://vuvfqjhkppmbdeqsflbn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk'
);

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
        if (res.statusCode !== 200 && res.statusCode !== 201) {
          console.error(`HTTP ${res.statusCode}: ${response}`);
          reject(new Error(`API request failed: ${res.statusCode}`));
          return;
        }
        
        try {
          const result = JSON.parse(response);
          resolve(result);
        } catch (e) {
          console.error('JSON Parse Error:', e);
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function analyzeDatabase() {
  console.log('🔍 COMPLETE SUPABASE INFRASTRUCTURE ANALYSIS FOR FASHIONOS');
  console.log('='.repeat(70));
  
  // 1. Check table columns
  console.log('\n📋 TABLE STRUCTURE ANALYSIS:\n');
  
  const tableStructure = await executeSql(`
    SELECT 
      table_name,
      column_name,
      data_type,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name IN ('events', 'bookings', 'venue_bookings', 'sponsors', 'sponsorships')
    ORDER BY table_name, ordinal_position;
  `);
  
  let currentTable = '';
  tableStructure.forEach(col => {
    if (col.table_name !== currentTable) {
      currentTable = col.table_name;
      console.log(`\n📊 TABLE: ${currentTable}`);
    }
    console.log(`  • ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
  });
  
  // 2. Check RLS policies
  console.log('\n🔒 ROW LEVEL SECURITY (RLS) STATUS:\n');
  
  const rlsStatus = await executeSql(`
    SELECT 
      schemaname,
      tablename,
      rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN ('events', 'bookings', 'venue_bookings', 'sponsors', 'designer_profiles', 'model_profiles', 'venues')
    ORDER BY tablename;
  `);
  
  rlsStatus.forEach(table => {
    const status = table.rowsecurity ? '✅ ENABLED' : '❌ DISABLED';
    console.log(`  ${status} - ${table.tablename}`);
  });
  
  // 3. Check RLS policies details
  console.log('\n📜 RLS POLICIES:\n');
  
  const policies = await executeSql(`
    SELECT 
      schemaname,
      tablename,
      policyname,
      permissive,
      roles,
      cmd,
      qual
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
  `);
  
  if (policies.length > 0) {
    let currentTable = '';
    policies.forEach(policy => {
      if (policy.tablename !== currentTable) {
        currentTable = policy.tablename;
        console.log(`\n  TABLE: ${currentTable}`);
      }
      console.log(`    • ${policy.policyname} (${policy.cmd}) - ${policy.permissive === 'PERMISSIVE' ? '✅' : '⚠️'}`);
    });
  } else {
    console.log('  ⚠️ No RLS policies found!');
  }
  
  // 4. Check indexes for performance
  console.log('\n⚡ DATABASE INDEXES:\n');
  
  const indexes = await executeSql(`
    SELECT 
      tablename,
      indexname,
      indexdef
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename IN ('events', 'bookings', 'venue_bookings', 'sponsors')
    ORDER BY tablename, indexname;
  `);
  
  let currentIndexTable = '';
  indexes.forEach(idx => {
    if (idx.tablename !== currentIndexTable) {
      currentIndexTable = idx.tablename;
      console.log(`\n  TABLE: ${currentIndexTable}`);
    }
    console.log(`    • ${idx.indexname}`);
  });
  
  // 5. Check triggers
  console.log('\n🔧 DATABASE TRIGGERS:\n');
  
  const triggers = await executeSql(`
    SELECT 
      event_object_table as table_name,
      trigger_name,
      event_manipulation,
      action_timing
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    ORDER BY event_object_table, trigger_name;
  `);
  
  if (triggers.length > 0) {
    triggers.forEach(trigger => {
      console.log(`  • ${trigger.table_name}.${trigger.trigger_name} (${trigger.action_timing} ${trigger.event_manipulation})`);
    });
  } else {
    console.log('  ⚠️ No triggers found');
  }
  
  // 6. Check foreign key relationships
  console.log('\n🔗 FOREIGN KEY RELATIONSHIPS:\n');
  
  const foreignKeys = await executeSql(`
    SELECT
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    ORDER BY tc.table_name;
  `);
  
  let currentFkTable = '';
  foreignKeys.forEach(fk => {
    if (fk.table_name !== currentFkTable) {
      currentFkTable = fk.table_name;
      console.log(`\n  TABLE: ${currentFkTable}`);
    }
    console.log(`    • ${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
  });
  
  // 7. Check for missing critical fields
  console.log('\n⚠️  CRITICAL FIELD CHECK:\n');
  
  const criticalFields = [
    { table: 'events', fields: ['id', 'event_name', 'date', 'status', 'capacity'] },
    { table: 'bookings', fields: ['id', 'total_amount', 'user_id', 'event_id'] },
    { table: 'venue_bookings', fields: ['id', 'total_amount', 'venue_id', 'event_id'] },
    { table: 'sponsors', fields: ['id', 'company_name', 'status'] },
    { table: 'sponsorships', fields: ['id', 'sponsor_id', 'event_id', 'amount'] }
  ];
  
  for (const check of criticalFields) {
    const columns = await executeSql(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = '${check.table}';
    `);
    
    const columnNames = columns.map(c => c.column_name);
    const missing = check.fields.filter(f => !columnNames.includes(f));
    
    if (missing.length > 0) {
      console.log(`  ❌ ${check.table}: Missing fields: ${missing.join(', ')}`);
    } else {
      console.log(`  ✅ ${check.table}: All critical fields present`);
    }
  }
  
  // 8. Final recommendations
  console.log('\n📝 RECOMMENDATIONS:\n');
  
  const hasRLS = rlsStatus.some(t => t.rowsecurity);
  const hasPolicies = policies.length > 0;
  const hasIndexes = indexes.length > 0;
  const hasTriggers = triggers.length > 0;
  
  if (!hasRLS) {
    console.log('  🚨 CRITICAL: Enable RLS on all tables for security');
  }
  if (!hasPolicies) {
    console.log('  🚨 CRITICAL: Create RLS policies for data access control');
  }
  if (!hasIndexes) {
    console.log('  ⚠️ WARNING: Add indexes for better query performance');
  }
  if (!hasTriggers) {
    console.log('  💡 SUGGESTION: Consider adding triggers for audit trails');
  }
  
  if (hasRLS && hasPolicies && hasIndexes) {
    console.log('  ✅ Database infrastructure looks good for production!');
  }
}

analyzeDatabase().catch(console.error);