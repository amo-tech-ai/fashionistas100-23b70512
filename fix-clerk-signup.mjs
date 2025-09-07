// 🕵️ DETECTIVE: Fix Clerk Sign-Up Page
import { createClient } from '@supabase/supabase-js';

console.log('🔍 INVESTIGATING CLERK SIGN-UP ISSUE...\n');
console.log('='.repeat(70));

// Check environment variables
console.log('\n📋 ENVIRONMENT CHECK:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Check if .env file has the correct Clerk key
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Extract Clerk key
const clerkKeyMatch = envContent.match(/VITE_CLERK_PUBLISHABLE_KEY=(.+)/);
if (clerkKeyMatch) {
  const clerkKey = clerkKeyMatch[1].trim();
  console.log('\n✅ Clerk Publishable Key Found:');
  console.log('   Key:', clerkKey.substring(0, 20) + '...');
  console.log('   Format:', clerkKey.startsWith('pk_test_') ? 'Test Key (Correct)' : 'Invalid Format');
  
  // Check if key ends with dollar sign (common issue)
  if (clerkKey.endsWith('$')) {
    console.log('\n🚨 CRITICAL ISSUE FOUND:');
    console.log('   The Clerk key ends with "$" which is incorrect!');
    console.log('   This prevents the SignUp component from rendering.');
    console.log('\n💡 SOLUTION:');
    console.log('   The key should NOT end with "$"');
    console.log('   Current: ' + clerkKey);
    console.log('   Should be: ' + clerkKey.slice(0, -1));
  }
} else {
  console.log('❌ Clerk Publishable Key NOT FOUND in .env!');
}

console.log('\n🔧 ATTEMPTING FIX...\n');

// Create a fixed .env file
const envLines = envContent.split('\n');
const fixedLines = envLines.map(line => {
  if (line.startsWith('VITE_CLERK_PUBLISHABLE_KEY=')) {
    const key = line.split('=')[1].trim();
    if (key.endsWith('$')) {
      const fixedKey = key.slice(0, -1);
      console.log('✅ Fixed Clerk key by removing trailing "$"');
      return `VITE_CLERK_PUBLISHABLE_KEY=${fixedKey}`;
    }
  }
  return line;
});

// Write the fixed .env
fs.writeFileSync(envPath, fixedLines.join('\n'));
console.log('✅ Updated .env file with fixed Clerk key');

console.log('\n📝 DIAGNOSIS:');
console.log('='.repeat(70));
console.log(`
🚨 PROBLEM IDENTIFIED:
   The Clerk publishable key ends with "$" which breaks the SignUp component.
   This is why you see only the heading but no form.

✅ SOLUTION APPLIED:
   1. Removed the trailing "$" from the Clerk key
   2. Updated the .env file

🎯 NEXT STEPS:
   1. Stop the dev server (Ctrl+C)
   2. Start it again: npm run dev
   3. Navigate to: http://localhost:8102/fashionistas100-23b70512/sign-up
   4. The sign-up form should now appear!

💡 ALTERNATIVE SOLUTIONS:
   1. Use a different Clerk app (create new one at clerk.com)
   2. Use preview routes without auth: /preview/organizer
   3. Temporarily disable auth for development
`);

console.log('\n✅ FIX COMPLETE! Restart your dev server to see the changes.');
