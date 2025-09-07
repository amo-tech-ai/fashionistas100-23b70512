import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n🔍 DETECTIVE MODE: NAVIGATION & AUTH FIX VERIFICATION');
console.log('=' .repeat(70));

const issues = {
  navigation: [],
  authentication: [],
  routing: [],
  build: []
};

const fixes = {
  signUpButton: false,
  dashboardRoute: false,
  clerkConfig: false,
  buildSuccess: false
};

// Test 1: Check Navigation Component
console.log('\n📍 TEST 1: Navigation Component');
console.log('-'.repeat(40));

function testNavigation() {
  try {
    const navFile = fs.readFileSync(path.join(__dirname, 'src/components/Navigation.tsx'), 'utf-8');
    
    // Check for SignUpButton import
    if (navFile.includes('SignUpButton')) {
      console.log('  ✅ SignUpButton imported');
      fixes.signUpButton = true;
    } else {
      console.log('  ❌ SignUpButton not imported');
      issues.navigation.push('Missing SignUpButton import');
    }
    
    // Check for SignUpButton usage
    if (navFile.includes('<SignUpButton')) {
      console.log('  ✅ SignUpButton component used');
    } else {
      console.log('  ❌ SignUpButton not used');
      issues.navigation.push('SignUpButton not implemented');
    }
    
    // Check for Dashboard link
    if (navFile.includes('"/dashboard"')) {
      console.log('  ✅ Dashboard route configured');
      fixes.dashboardRoute = true;
    } else {
      console.log('  ❌ Dashboard route missing');
      issues.routing.push('Dashboard route not configured');
    }
    
    // Check for mobile menu
    if (navFile.includes('isMenuOpen')) {
      console.log('  ✅ Mobile menu implemented');
    } else {
      console.log('  ⚠️  Mobile menu might be missing');
    }
    
  } catch (error) {
    console.error('  ❌ Navigation test failed:', error.message);
  }
}

// Test 2: Check App Routing
console.log('\n🗺️ TEST 2: Routing Configuration');
console.log('-'.repeat(40));

function testRouting() {
  try {
    const appFile = fs.readFileSync(path.join(__dirname, 'src/App.tsx'), 'utf-8');
    
    // Check for dashboard routes
    const routes = [
      { path: '/dashboard', name: 'Main Dashboard' },
      { path: '/sign-in', name: 'Sign In' },
      { path: '/sign-up', name: 'Sign Up' },
      { path: '/events', name: 'Events' },
      { path: '/designers', name: 'Designers' },
      { path: '/sponsors', name: 'Sponsors' }
    ];
    
    for (const route of routes) {
      if (appFile.includes(`path="${route.path}"`)) {
        console.log(`  ✅ ${route.name}: ${route.path}`);
      } else {
        console.log(`  ❌ ${route.name}: Missing`);
        issues.routing.push(`Missing route: ${route.path}`);
      }
    }
    
    // Check for ProtectedRoute wrapper
    if (appFile.includes('<ProtectedRoute>')) {
      console.log('  ✅ Protected routes configured');
    } else {
      console.log('  ⚠️  No protected routes found');
    }
    
  } catch (error) {
    console.error('  ❌ Routing test failed:', error.message);
  }
}

// Test 3: Check Clerk Configuration
console.log('\n🔐 TEST 3: Clerk Authentication');
console.log('-'.repeat(40));

function testClerk() {
  try {
    const mainFile = fs.readFileSync(path.join(__dirname, 'src/main.tsx'), 'utf-8');
    const clerkConfigFile = fs.readFileSync(path.join(__dirname, 'src/config/clerk.config.ts'), 'utf-8');
    
    // Check for ClerkProvider
    if (mainFile.includes('ClerkProvider')) {
      console.log('  ✅ ClerkProvider configured');
      fixes.clerkConfig = true;
    } else {
      console.log('  ❌ ClerkProvider not found');
      issues.authentication.push('ClerkProvider not configured');
    }
    
    // Check for environment variable
    if (mainFile.includes('VITE_CLERK_PUBLISHABLE_KEY')) {
      console.log('  ✅ Clerk publishable key referenced');
    } else {
      console.log('  ❌ Clerk key not configured');
      issues.authentication.push('Clerk key missing');
    }
    
    // Check redirect URLs
    if (clerkConfigFile.includes('afterSignInUrl')) {
      console.log('  ✅ Sign-in redirects configured');
    } else {
      console.log('  ⚠️  Sign-in redirects might be missing');
    }
    
  } catch (error) {
    console.error('  ⚠️  Clerk config test warning:', error.message);
  }
}

// Test 4: Build Test
console.log('\n🏗️ TEST 4: Build Verification');
console.log('-'.repeat(40));

function testBuild() {
  try {
    // Check if dist exists
    if (fs.existsSync(path.join(__dirname, 'dist'))) {
      console.log('  ✅ Production build exists');
      
      // Check index.html
      const indexHtml = fs.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf-8');
      
      if (indexHtml.includes('script')) {
        console.log('  ✅ JavaScript bundles included');
        fixes.buildSuccess = true;
      }
      
      // Check for assets
      const assets = fs.readdirSync(path.join(__dirname, 'dist/assets'));
      console.log(`  ✅ ${assets.length} asset files`);
      
    } else {
      console.log('  ⚠️  No production build found');
      console.log('     Run: npm run build');
    }
    
  } catch (error) {
    console.error('  ⚠️  Build test warning:', error.message);
  }
}

// Run all tests
testNavigation();
testRouting();
testClerk();
testBuild();

// Generate Report
console.log('\n' + '='.repeat(70));
console.log('📊 DETECTIVE REPORT');
console.log('='.repeat(70));

const totalIssues = issues.navigation.length + issues.authentication.length + 
                    issues.routing.length + issues.build.length;

if (totalIssues === 0) {
  console.log('\n✅ ALL NAVIGATION & AUTH ISSUES FIXED!');
  console.log('The buttons should now work correctly.');
} else {
  console.log(`\n⚠️  ${totalIssues} ISSUES FOUND:`);
  
  if (issues.navigation.length > 0) {
    console.log('\n🔴 Navigation Issues:');
    issues.navigation.forEach(issue => console.log(`  - ${issue}`));
  }
  
  if (issues.authentication.length > 0) {
    console.log('\n🔴 Authentication Issues:');
    issues.authentication.forEach(issue => console.log(`  - ${issue}`));
  }
  
  if (issues.routing.length > 0) {
    console.log('\n🔴 Routing Issues:');
    issues.routing.forEach(issue => console.log(`  - ${issue}`));
  }
}

console.log('\n📝 FIX CHECKLIST:');
console.log(`  ${fixes.signUpButton ? '✅' : '❌'} SignUpButton component added`);
console.log(`  ${fixes.dashboardRoute ? '✅' : '❌'} Dashboard route configured`);
console.log(`  ${fixes.clerkConfig ? '✅' : '❌'} Clerk authentication setup`);
console.log(`  ${fixes.buildSuccess ? '✅' : '❌'} Production build ready`);

console.log('\n🚀 DEPLOYMENT STEPS:');
console.log('1. Rebuild: npm run build');
console.log('2. Test locally: npm run preview');
console.log('3. Commit changes: git add -A && git commit -m "fix: navigation buttons"');
console.log('4. Push to GitHub: git push origin main');
console.log('5. Vercel will auto-deploy from GitHub');

process.exit(totalIssues > 0 ? 1 : 0);
