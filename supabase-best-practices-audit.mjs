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
      hostname: 'api.supabase.io',
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
          reject(new Error(`API request failed: ${res.statusCode}`));
          return;
        }
        try {
          const result = JSON.parse(response);
          resolve(result);
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function auditSupabaseBestPractices() {
  console.log('🕵️ SUPABASE BEST PRACTICES AUDIT - FASHIONOS PLATFORM');
  console.log('='.repeat(70));
  
  const issues = [];
  const warnings = [];
  const passed = [];
  
  // 1. TABLE NAMING CONVENTIONS
  console.log('\n📋 1. TABLE NAMING CONVENTIONS (Best Practice: snake_case)');
  
  const tables = await executeSql(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);
  
  const invalidTableNames = tables.filter(t => 
    t.tablename !== t.tablename.toLowerCase() || 
    t.tablename.includes('-') ||
    /[A-Z]/.test(t.tablename)
  );
  
  if (invalidTableNames.length > 0) {
    issues.push(`❌ Invalid table names: ${invalidTableNames.map(t => t.tablename).join(', ')}`);
    console.log('  ❌ FAILED: Found non-snake_case table names');
  } else {
    passed.push('Table naming conventions');
    console.log('  ✅ PASSED: All tables use snake_case');
  }
  
  // 2. PRIMARY KEYS
  console.log('\n🔑 2. PRIMARY KEY AUDIT (Best Practice: UUID with gen_random_uuid())');
  
  const primaryKeys = await executeSql(`
    SELECT 
      tc.table_name,
      kcu.column_name,
      c.data_type,
      c.column_default
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.columns c
      ON c.table_name = tc.table_name 
      AND c.column_name = kcu.column_name
    WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public';
  `);
  
  const nonUuidPks = primaryKeys.filter(pk => pk.data_type !== 'uuid');
  const missingDefault = primaryKeys.filter(pk => 
    pk.data_type === 'uuid' && 
    (!pk.column_default || !pk.column_default.includes('gen_random_uuid'))
  );
  
  if (nonUuidPks.length > 0) {
    warnings.push(`⚠️ Non-UUID primary keys: ${nonUuidPks.map(pk => `${pk.table_name}.${pk.column_name}`).join(', ')}`);
    console.log(`  ⚠️ WARNING: ${nonUuidPks.length} tables with non-UUID primary keys`);
  }
  
  if (missingDefault.length > 0) {
    issues.push(`❌ Missing gen_random_uuid() default: ${missingDefault.map(pk => pk.table_name).join(', ')}`);
    console.log(`  ❌ FAILED: ${missingDefault.length} UUID columns without gen_random_uuid() default`);
  } else {
    passed.push('Primary key configuration');
    console.log('  ✅ PASSED: Primary keys properly configured');
  }
  
  // 3. TIMESTAMPS
  console.log('\n⏰ 3. TIMESTAMP AUDIT (Best Practice: created_at, updated_at with triggers)');
  
  const timestampColumns = await executeSql(`
    SELECT 
      table_name,
      array_agg(column_name) as columns
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND column_name IN ('created_at', 'updated_at')
    GROUP BY table_name;
  `);
  
  const tablesWithoutTimestamps = tables.filter(t => 
    !timestampColumns.find(tc => tc.table_name === t.tablename)
  );
  
  if (tablesWithoutTimestamps.length > 5) {
    warnings.push(`⚠️ ${tablesWithoutTimestamps.length} tables missing timestamp columns`);
    console.log(`  ⚠️ WARNING: ${tablesWithoutTimestamps.length} tables without timestamps`);
  } else {
    passed.push('Timestamp columns');
    console.log('  ✅ PASSED: Most tables have timestamps');
  }
  
  // 4. ROW LEVEL SECURITY
  console.log('\n🔒 4. ROW LEVEL SECURITY AUDIT');
  
  const rlsStatus = await executeSql(`
    SELECT 
      tablename,
      rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN ('events', 'bookings', 'venue_bookings', 'sponsors', 
                      'designer_profiles', 'model_profiles', 'venues', 
                      'sponsorships', 'tickets', 'users');
  `);
  
  const tablesWithoutRLS = rlsStatus.filter(t => !t.rowsecurity);
  
  if (tablesWithoutRLS.length > 0) {
    issues.push(`❌ RLS disabled on: ${tablesWithoutRLS.map(t => t.tablename).join(', ')}`);
    console.log(`  ❌ FAILED: ${tablesWithoutRLS.length} critical tables without RLS`);
  } else {
    passed.push('Row Level Security enabled');
    console.log('  ✅ PASSED: RLS enabled on all critical tables');
  }
  
  // 5. INDEXES FOR FOREIGN KEYS
  console.log('\n⚡ 5. INDEX OPTIMIZATION AUDIT');
  
  const foreignKeyIndexes = await executeSql(`
    WITH foreign_keys AS (
      SELECT
        tc.table_name,
        kcu.column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
    ),
    indexes AS (
      SELECT 
        tablename,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
    )
    SELECT 
      fk.table_name,
      fk.column_name,
      EXISTS(
        SELECT 1 FROM indexes i 
        WHERE i.tablename = fk.table_name 
        AND i.indexdef LIKE '%' || fk.column_name || '%'
      ) as has_index
    FROM foreign_keys fk;
  `);
  
  const missingIndexes = foreignKeyIndexes.filter(fk => !fk.has_index);
  
  if (missingIndexes.length > 0) {
    warnings.push(`⚠️ Missing indexes on ${missingIndexes.length} foreign keys`);
    console.log(`  ⚠️ WARNING: ${missingIndexes.length} foreign keys without indexes`);
  } else {
    passed.push('Foreign key indexes');
    console.log('  ✅ PASSED: All foreign keys have indexes');
  }
  
  // 6. ENUM TYPES
  console.log('\n📝 6. ENUM TYPES AUDIT (Best Practice: Use PostgreSQL enums)');
  
  const enumTypes = await executeSql(`
    SELECT 
      t.typname as enum_name,
      array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    GROUP BY t.typname;
  `);
  
  if (enumTypes.length > 0) {
    passed.push('Enum types usage');
    console.log(`  ✅ PASSED: Using ${enumTypes.length} enum types (best practice)`);
    enumTypes.forEach(e => {
      console.log(`     • ${e.enum_name}: [${e.values.join(', ')}]`);
    });
  } else {
    warnings.push('⚠️ No enum types found - consider using enums for status fields');
    console.log('  ⚠️ WARNING: No enum types found');
  }
  
  // 7. FUNCTIONS AND STORED PROCEDURES
  console.log('\n🔧 7. DATABASE FUNCTIONS AUDIT');
  
  const functions = await executeSql(`
    SELECT 
      routine_name,
      routine_type,
      data_type
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name NOT LIKE 'pg_%';
  `);
  
  if (functions.length > 0) {
    passed.push('Database functions');
    console.log(`  ✅ PASSED: ${functions.length} custom functions found`);
  } else {
    warnings.push('⚠️ No custom functions - consider adding for complex calculations');
    console.log('  ⚠️ WARNING: No custom functions found');
  }
  
  // 8. PERFORMANCE: N+1 QUERY PREVENTION
  console.log('\n🚀 8. PERFORMANCE OPTIMIZATION AUDIT');
  
  const viewsAndMaterialized = await executeSql(`
    SELECT 
      schemaname,
      viewname,
      definition
    FROM pg_views
    WHERE schemaname = 'public';
  `);
  
  if (viewsAndMaterialized.length > 0) {
    passed.push('Database views for optimization');
    console.log(`  ✅ PASSED: ${viewsAndMaterialized.length} views for query optimization`);
  } else {
    warnings.push('⚠️ No views found - consider adding for complex queries');
    console.log('  ⚠️ WARNING: No database views found');
  }
  
  // 9. SECURITY: COLUMN LEVEL SECURITY
  console.log('\n🛡️ 9. ADVANCED SECURITY AUDIT');
  
  const sensitiveColumns = await executeSql(`
    SELECT 
      table_name,
      column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND column_name IN ('password', 'api_key', 'secret', 'token', 'credit_card')
    ORDER BY table_name;
  `);
  
  if (sensitiveColumns.length > 0) {
    issues.push(`❌ Sensitive columns found: ${sensitiveColumns.map(c => `${c.table_name}.${c.column_name}`).join(', ')}`);
    console.log(`  ❌ FAILED: Found ${sensitiveColumns.length} potentially sensitive columns`);
  } else {
    passed.push('No plaintext sensitive data');
    console.log('  ✅ PASSED: No plaintext sensitive columns found');
  }
  
  // 10. DASHBOARD-SPECIFIC REQUIREMENTS
  console.log('\n📊 10. DASHBOARD REQUIREMENTS AUDIT');
  
  const requiredTables = [
    'events', 'bookings', 'venue_bookings', 'sponsorships',
    'designer_profiles', 'model_profiles', 'venues', 'sponsors',
    'tickets', 'event_tickets', 'event_registrations', 'attendees'
  ];
  
  const existingTables = await executeSql(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = ANY($1::text[]);
  `, [requiredTables]);
  
  const missingTables = requiredTables.filter(t => 
    !existingTables.find(et => et.tablename === t)
  );
  
  if (missingTables.length > 0) {
    issues.push(`❌ Missing required tables: ${missingTables.join(', ')}`);
    console.log(`  ❌ FAILED: Missing ${missingTables.length} required tables`);
  } else {
    passed.push('All dashboard tables present');
    console.log('  ✅ PASSED: All required dashboard tables exist');
  }
  
  // FINAL REPORT
  console.log('\n' + '='.repeat(70));
  console.log('📊 AUDIT SUMMARY REPORT\n');
  
  console.log(`✅ PASSED: ${passed.length} checks`);
  passed.forEach(p => console.log(`   • ${p}`));
  
  if (warnings.length > 0) {
    console.log(`\n⚠️ WARNINGS: ${warnings.length} recommendations`);
    warnings.forEach(w => console.log(`   ${w}`));
  }
  
  if (issues.length > 0) {
    console.log(`\n❌ CRITICAL ISSUES: ${issues.length} failures`);
    issues.forEach(i => console.log(`   ${i}`));
  }
  
  // PRODUCTION READINESS SCORE
  const totalChecks = 10;
  const score = Math.round((passed.length / totalChecks) * 100);
  
  console.log('\n' + '='.repeat(70));
  console.log(`🎯 PRODUCTION READINESS: ${score}%`);
  
  if (score >= 90) {
    console.log('✅ DATABASE IS PRODUCTION READY!');
  } else if (score >= 70) {
    console.log('⚠️ DATABASE NEEDS MINOR IMPROVEMENTS');
  } else {
    console.log('❌ DATABASE REQUIRES SIGNIFICANT WORK');
  }
  
  // RECOMMENDATIONS
  console.log('\n📝 IMMEDIATE ACTION ITEMS:');
  
  if (missingIndexes.length > 0) {
    console.log('\n1. Add missing indexes:');
    missingIndexes.forEach(idx => {
      console.log(`   CREATE INDEX idx_${idx.table_name}_${idx.column_name} ON ${idx.table_name}(${idx.column_name});`);
    });
  }
  
  if (tablesWithoutRLS.length > 0) {
    console.log('\n2. Enable RLS on tables:');
    tablesWithoutRLS.forEach(t => {
      console.log(`   ALTER TABLE ${t.tablename} ENABLE ROW LEVEL SECURITY;`);
    });
  }
  
  console.log('\n3. Create optimized dashboard functions:');
  console.log('   • calculate_total_revenue()');
  console.log('   • get_dashboard_metrics()');
  console.log('   • check_venue_availability()');
  console.log('   • calculate_engagement_score()');
}

auditSupabaseBestPractices().catch(console.error);