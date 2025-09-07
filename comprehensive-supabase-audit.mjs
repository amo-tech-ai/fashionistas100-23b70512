#!/usr/bin/env node

import https from 'https';

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

async function comprehensiveSupabaseAudit() {
  console.log('🕵️ COMPREHENSIVE SUPABASE INFRASTRUCTURE AUDIT');
  console.log('='.repeat(70));
  
  const report = {
    critical: [],
    warnings: [],
    passed: [],
    recommendations: []
  };
  
  // 1. DASHBOARD TABLES VERIFICATION
  console.log('\n📊 DASHBOARD TABLES VERIFICATION\n');
  
  const dashboardTables = {
    'Event Organizer': ['events', 'bookings', 'venue_bookings', 'sponsorships', 'tickets'],
    'Designer': ['designer_profiles', 'designer_bookings', 'event_designers', 'designer_reviews'],
    'Model': ['model_profiles', 'model_bookings', 'casting_applications'],
    'Venue': ['venues', 'venue_bookings', 'venue_inquiries'],
    'Sponsor': ['sponsors', 'sponsorships', 'sponsor_leads'],
    'User': ['users', 'tickets', 'event_registrations', 'saved_events'],
    'Analytics': ['event_analytics', 'platform_fees', 'user_analytics']
  };
  
  for (const [dashboard, tables] of Object.entries(dashboardTables)) {
    console.log(`\n  ${dashboard} Dashboard:`);
    for (const table of tables) {
      const result = await executeSql(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '${table}'
        ) as exists,
        (SELECT COUNT(*) FROM ${table} LIMIT 1) as count
      `).catch(() => ({ exists: false, count: 0 }));
      
      if (result && result[0]?.exists) {
        console.log(`    ✅ ${table}: EXISTS`);
      } else {
        console.log(`    ❌ ${table}: MISSING`);
        report.critical.push(`Missing table: ${table} (required for ${dashboard} Dashboard)`);
      }
    }
  }
  
  // 2. CRITICAL FIELDS CHECK
  console.log('\n\n🔍 CRITICAL FIELDS VERIFICATION\n');
  
  const criticalFields = [
    { table: 'events', fields: ['id', 'event_name', 'date', 'capacity', 'status'] },
    { table: 'bookings', fields: ['id', 'total_amount', 'event_id', 'user_id'] },
    { table: 'venue_bookings', fields: ['id', 'total_amount', 'venue_id', 'event_id'] },
    { table: 'sponsorships', fields: ['id', 'sponsor_id', 'event_id', 'amount'] },
    { table: 'tickets', fields: ['id', 'price', 'event_id'] }
  ];
  
  for (const check of criticalFields) {
    const columns = await executeSql(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = '${check.table}';
    `).catch(() => []);
    
    if (columns.length === 0) {
      console.log(`  ❌ ${check.table}: TABLE NOT FOUND`);
      continue;
    }
    
    const columnNames = columns.map(c => c.column_name);
    const missing = check.fields.filter(f => !columnNames.includes(f));
    
    if (missing.length > 0) {
      console.log(`  ❌ ${check.table}: Missing fields: ${missing.join(', ')}`);
      report.critical.push(`${check.table} missing: ${missing.join(', ')}`);
    } else {
      console.log(`  ✅ ${check.table}: All critical fields present`);
      report.passed.push(`${check.table} structure`);
    }
  }
  
  // 3. RLS POLICIES CHECK
  console.log('\n\n🔒 ROW LEVEL SECURITY POLICIES\n');
  
  const policies = await executeSql(`
    SELECT 
      tablename,
      policyname,
      cmd,
      permissive
    FROM pg_policies
    WHERE schemaname = 'public'
    GROUP BY tablename, policyname, cmd, permissive
    ORDER BY tablename;
  `);
  
  const policyCount = {};
  policies.forEach(p => {
    policyCount[p.tablename] = (policyCount[p.tablename] || 0) + 1;
  });
  
  const criticalTablesForRLS = ['events', 'bookings', 'venue_bookings', 'sponsorships', 'users'];
  
  for (const table of criticalTablesForRLS) {
    const count = policyCount[table] || 0;
    if (count === 0) {
      console.log(`  ❌ ${table}: NO POLICIES`);
      report.critical.push(`No RLS policies on ${table}`);
    } else if (count < 3) {
      console.log(`  ⚠️ ${table}: Only ${count} policies (may need more)`);
      report.warnings.push(`${table} has only ${count} RLS policies`);
    } else {
      console.log(`  ✅ ${table}: ${count} policies configured`);
      report.passed.push(`${table} RLS policies`);
    }
  }
  
  // 4. DATABASE FUNCTIONS FOR DASHBOARDS
  console.log('\n\n🔧 DATABASE FUNCTIONS CHECK\n');
  
  const requiredFunctions = [
    'calculate_total_revenue',
    'get_dashboard_metrics',
    'check_venue_availability',
    'calculate_engagement_score'
  ];
  
  const functions = await executeSql(`
    SELECT routine_name 
    FROM information_schema.routines
    WHERE routine_schema = 'public';
  `);
  
  const functionNames = functions.map(f => f.routine_name);
  
  for (const func of requiredFunctions) {
    if (functionNames.includes(func)) {
      console.log(`  ✅ ${func}: EXISTS`);
      report.passed.push(`Function ${func}`);
    } else {
      console.log(`  ❌ ${func}: MISSING`);
      report.recommendations.push(`Create function: ${func}`);
    }
  }
  
  // 5. PERFORMANCE INDEXES
  console.log('\n\n⚡ PERFORMANCE INDEXES CHECK\n');
  
  const indexes = await executeSql(`
    SELECT 
      tablename,
      indexname,
      indexdef
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename IN ('events', 'bookings', 'venue_bookings', 'sponsorships')
    ORDER BY tablename;
  `);
  
  const indexByTable = {};
  indexes.forEach(idx => {
    indexByTable[idx.tablename] = (indexByTable[idx.tablename] || 0) + 1;
  });
  
  for (const [table, count] of Object.entries(indexByTable)) {
    if (count < 3) {
      console.log(`  ⚠️ ${table}: Only ${count} indexes (consider adding more)`);
      report.warnings.push(`${table} has only ${count} indexes`);
    } else {
      console.log(`  ✅ ${table}: ${count} indexes configured`);
      report.passed.push(`${table} indexes`);
    }
  }
  
  // 6. TRIGGERS CHECK
  console.log('\n\n🔄 UPDATE TRIGGERS CHECK\n');
  
  const triggers = await executeSql(`
    SELECT 
      event_object_table,
      trigger_name
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    AND trigger_name LIKE '%updated_at%'
    GROUP BY event_object_table, trigger_name;
  `);
  
  const tablesWithTriggers = [...new Set(triggers.map(t => t.event_object_table))];
  
  console.log(`  ✅ ${tablesWithTriggers.length} tables with updated_at triggers`);
  
  if (tablesWithTriggers.length < 10) {
    report.warnings.push(`Only ${tablesWithTriggers.length} tables have updated_at triggers`);
  } else {
    report.passed.push('Update triggers');
  }
  
  // 7. DATA INTEGRITY CHECK
  console.log('\n\n✅ DATA INTEGRITY CHECK\n');
  
  const integrityChecks = await executeSql(`
    SELECT 
      (SELECT COUNT(*) FROM events) as events,
      (SELECT COUNT(*) FROM bookings) as bookings,
      (SELECT COUNT(*) FROM venue_bookings) as venue_bookings,
      (SELECT COUNT(*) FROM sponsorships) as sponsorships,
      (SELECT SUM(total_amount) FROM bookings) as booking_revenue,
      (SELECT SUM(total_amount) FROM venue_bookings) as venue_revenue,
      (SELECT SUM(amount) FROM sponsorships) as sponsor_revenue;
  `);
  
  const data = integrityChecks[0];
  console.log(`  Events: ${data.events}`);
  console.log(`  Bookings: ${data.bookings}`);
  console.log(`  Venue Bookings: ${data.venue_bookings}`);
  console.log(`  Sponsorships: ${data.sponsorships}`);
  console.log(`  Total Revenue: $${(Number(data.booking_revenue || 0) + Number(data.venue_revenue || 0) + Number(data.sponsor_revenue || 0)).toLocaleString()}`);
  
  if (data.events > 0 && (data.bookings > 0 || data.venue_bookings > 0)) {
    report.passed.push('Data integrity');
  } else {
    report.warnings.push('Limited test data available');
  }
  
  // FINAL REPORT
  console.log('\n' + '='.repeat(70));
  console.log('📊 AUDIT SUMMARY REPORT\n');
  
  if (report.passed.length > 0) {
    console.log(`✅ PASSED (${report.passed.length}):`);
    report.passed.forEach(p => console.log(`   • ${p}`));
  }
  
  if (report.warnings.length > 0) {
    console.log(`\n⚠️ WARNINGS (${report.warnings.length}):`);
    report.warnings.forEach(w => console.log(`   • ${w}`));
  }
  
  if (report.critical.length > 0) {
    console.log(`\n❌ CRITICAL ISSUES (${report.critical.length}):`);
    report.critical.forEach(c => console.log(`   • ${c}`));
  }
  
  if (report.recommendations.length > 0) {
    console.log(`\n💡 RECOMMENDATIONS (${report.recommendations.length}):`);
    report.recommendations.forEach(r => console.log(`   • ${r}`));
  }
  
  // PRODUCTION READINESS SCORE
  const totalChecks = report.passed.length + report.warnings.length + report.critical.length;
  const score = Math.round((report.passed.length / totalChecks) * 100);
  
  console.log('\n' + '='.repeat(70));
  console.log(`🎯 PRODUCTION READINESS SCORE: ${score}%\n`);
  
  if (score >= 85) {
    console.log('✅ DATABASE IS PRODUCTION READY!');
  } else if (score >= 70) {
    console.log('⚠️ DATABASE NEEDS IMPROVEMENTS');
  } else {
    console.log('❌ DATABASE REQUIRES SIGNIFICANT WORK');
  }
  
  // ACTION ITEMS
  console.log('\n📝 IMMEDIATE ACTION ITEMS:\n');
  
  if (report.critical.length === 0) {
    console.log('1. ✅ No critical issues - system is stable\n');
  } else {
    console.log('1. Fix critical issues first:\n');
    report.critical.slice(0, 3).forEach(c => console.log(`   • ${c}`));
  }
  
  console.log('\n2. Create missing database functions:');
  console.log('   See dashboard functions in SUPABASE-INFRASTRUCTURE-REPORT.md\n');
  
  console.log('3. Add performance monitoring:');
  console.log('   • Enable query performance insights');
  console.log('   • Set up slow query logging');
  console.log('   • Monitor connection pool usage\n');
  
  console.log('4. Implement caching strategy:');
  console.log('   • Use materialized views for heavy aggregations');
  console.log('   • Enable statement-level caching');
  console.log('   • Consider Redis for session data\n');
}

comprehensiveSupabaseAudit().catch(console.error);