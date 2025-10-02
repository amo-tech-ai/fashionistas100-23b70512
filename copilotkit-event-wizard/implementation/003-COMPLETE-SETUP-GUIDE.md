# 🚀 FashionOS Event Wizard - Complete Setup Guide

**Version**: 1.0.0  
**Date**: October 2, 2025  
**Location**: `/home/sk/fx/fx300`

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Supabase Configuration](#supabase-configuration)
5. [Running Locally](#running-locally)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Tools
```bash
# Check versions
node --version  # Should be v18+ 
npm --version   # Should be v9+
supabase --version  # Should be v1.100+

# Install if missing
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
npm install -g supabase
```

### Required Accounts
- [ ] Supabase account (https://supabase.com)
- [ ] Clerk account (https://clerk.com)
- [ ] OpenAI API key (https://platform.openai.com)
- [ ] Vercel account (https://vercel.com)
- [ ] Cloudinary account (https://cloudinary.com)
- [ ] Stripe account (https://stripe.com)

---

## 2. Environment Setup

### Step 1: Clone and Install
```bash
cd /home/sk/fx/fx300
npm install
```

### Step 2: Environment Variables
```bash
# Copy example env file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Required variables:
```env
# Supabase - Production
NEXT_PUBLIC_SUPABASE_URL=https://vuvfqjhkppmbdeqsflbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# CopilotKit
NEXT_PUBLIC_COPILOTKIT_PUBLIC_KEY=ck_...

# OpenAI
OPENAI_API_KEY=sk-...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 3. Database Setup

### Step 1: Connect to Supabase
```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref vuvfqjhkppmbdeqsflbn
```

### Step 2: Run Migrations
```bash
# Create tables and types
supabase db push < copilotkit-event-wizard/implementation/002-database-schema.sql

# Apply RLS policies
supabase db push < copilotkit-event-wizard/implementation/003-rls-policies.sql

# Create functions
supabase db push < copilotkit-event-wizard/implementation/004-database-functions.sql

# Load test data (optional)
supabase db push < copilotkit-event-wizard/implementation/005-seed-data.sql
```

### Step 3: Verify Setup
```bash
# Test connection
supabase db diff

# Check tables exist
supabase db query "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"
```

---

## 4. Supabase Configuration

### Deploy Edge Functions
```bash
# Deploy wizard session function
supabase functions deploy wizard-session \
  --no-verify-jwt \
  --import-map supabase/functions/import_map.json

# Deploy auth function
supabase functions deploy wizard-auth \
  --no-verify-jwt

# Set secrets
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set CLERK_SECRET_KEY=sk_test_...
```

### Configure CORS
```bash
# Update allowed origins in Supabase dashboard
# Settings > API > CORS Configuration
# Add: http://localhost:3000, https://your-domain.com
```

---

## 5. Running Locally

### Start Development Server
```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Start Supabase locally (optional)
supabase start

# Terminal 3: Start Edge Functions locally
supabase functions serve
```

### Access Points
- Frontend: http://localhost:3000
- Event Wizard: http://localhost:3000/events/create
- Supabase Studio: http://localhost:54323
- Edge Functions: http://localhost:54321/functions/v1/

---

## 6. Testing

### Manual Testing Checklist

#### Authentication
- [ ] Login with Clerk
- [ ] JWT token sent in requests
- [ ] Logout works correctly

#### Wizard Flow
- [ ] Stage 1: Organizer setup saves
- [ ] Stage 2: Event details with AI help
- [ ] Stage 3: Venue search works
- [ ] Stage 4: Ticket tiers add/remove
- [ ] Stage 5: Sponsors optional
- [ ] Stage 6: Review shows all data
- [ ] Publish creates event

#### Security
- [ ] Can't access other users' sessions
- [ ] Can't skip stages
- [ ] Errors show friendly UI
- [ ] No PII in console logs

### Automated Testing
```bash
# Run unit tests
npm run test

# Run E2E tests with Playwright
npx playwright test

# Run security tests
npm run test:security
```

### Test with MCP Playwright
```javascript
// Test wizard completion
await playwright_navigate({ 
  url: "http://localhost:3000/events/create" 
});

await playwright_snapshot();

// Fill organizer form
await playwright_fill_form({
  fields: [
    { name: "name", type: "textbox", ref: "e1", value: "Test User" },
    { name: "email", type: "textbox", ref: "e2", value: "test@fashion.com" }
  ]
});

await playwright_click({ 
  element: "Continue to Event Details", 
  ref: "e3" 
});

// Continue through all stages...
```

---

## 7. Deployment

### Deploy to Staging
```bash
# Build and test
npm run build
npm run test

# Deploy to Vercel staging
vercel --prod --scope=staging

# Run smoke tests on staging
npm run test:staging
```

### Deploy to Production
```bash
# Final checks
npm run lint
npm run type-check
npm run test:all

# Deploy to production
vercel --prod

# Monitor logs
vercel logs --follow
```

### Post-Deployment
```bash
# Verify deployment
curl https://fashionistas100-23b70512.vercel.app/api/health

# Check database migrations
supabase db diff --linked

# Monitor Edge Functions
supabase functions logs wizard-session --tail
```

---

## 8. Troubleshooting

### Common Issues

#### "401 Unauthorized" Error
```bash
# Check Clerk is configured
grep CLERK .env.local

# Verify JWT in requests
# Open Network tab > Check Authorization header
```

#### Database Connection Failed
```bash
# Check Supabase URL
echo $NEXT_PUBLIC_SUPABASE_URL

# Test connection
supabase db query "SELECT 1;"
```

#### Edge Function Not Working
```bash
# Check logs
supabase functions logs wizard-session

# Redeploy function
supabase functions deploy wizard-session --no-verify-jwt
```

#### Stage Transitions Broken
```javascript
// Check stage guards in hooks
console.log('Current stage:', stage);
console.log('Action available:', stage === 'organizerSetup');
```

### Debug Commands
```bash
# View all environment variables
env | grep SUPABASE

# Check Node modules
npm ls @supabase/supabase-js

# Clear cache
rm -rf .next node_modules
npm install
npm run dev

# Reset database
supabase db reset
```

---

## 📊 Performance Metrics

### Target Metrics
- Page Load: < 2 seconds
- API Response: < 200ms
- Wizard Completion: < 3 minutes
- Error Rate: < 0.1%

### Monitoring
```bash
# Check build size
npm run analyze

# Monitor runtime performance
# Chrome DevTools > Performance > Record

# Database performance
supabase db query "EXPLAIN ANALYZE SELECT * FROM wizard_sessions WHERE user_id = 'uuid';"
```

---

## 🔒 Security Checklist

Before going to production:

- [ ] All environment variables set
- [ ] RLS policies enabled on all tables
- [ ] JWT verification in all Edge Functions
- [ ] Stage guards in all action handlers
- [ ] No sensitive data in readables
- [ ] Error boundaries implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] SSL certificates valid
- [ ] Security headers configured

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [CopilotKit Docs](https://docs.copilotkit.ai)
- [Clerk Docs](https://clerk.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Project Documentation](/home/sk/fx/fx300/copilotkit-event-wizard/docs/)

---

## 📞 Support

For issues or questions:
1. Check documentation in `/docs/`
2. Review error logs
3. Test in isolation
4. Contact team lead

---

**Last Updated**: October 2, 2025  
**Maintained By**: FashionOS Development Team
