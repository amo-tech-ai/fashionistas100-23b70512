# QUICK START: Fixing the Event Wizard

**Time Required**: 3 days  
**Status**: You're fixing a 80% complete wizard with 5 critical security bugs  
**Goal**: Make it production-ready

---

## TL;DR - What's Wrong?

1. ❌ Actions execute in wrong wizard stages (security risk)
2. ❌ No JWT authentication (anyone can access)
3. ❌ Database policies incomplete (data leakage)
4. ❌ No error handling (app crashes)
5. ❌ User emails exposed to AI (privacy violation)

**Good news**: Architecture is correct, just needs security fixes.

---

## Setup (15 minutes)

```bash
# 1. Navigate to project
cd /home/sk/fx/fx300

# 2. Install dependencies
npm install
npm install react-error-boundary

# 3. Check environment variables
cat .env.local
# Should have:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY

# 4. Start dev server
npm run dev
# Opens on http://localhost:3000
```

---

## The 5 Fixes (In Order)

### Fix #1: Stage Guards (2 hours)

**What**: Prevent actions from executing in wrong stages

**File**: Every `use-stage-*.tsx` file

**Add to every action handler**:
```typescript
handler: async (params) => {
  // ADD THIS FIRST LINE
  if (stage !== 'organizerSetup') {  // Change stage name per file
    throw new Error('Action not available in current stage');
  }
  
  // ... rest of existing code
}
```

**Test**: Try calling `completeOrganizerSetup` when on Event stage - should fail

---

### Fix #2: JWT Auth (2 hours)

**What**: Verify user tokens in Edge Functions

**File**: `/home/sk/fx/fx300/supabase/functions/wizard-session/index.ts`

**Replace first 10 lines with**:
```typescript
export default async function handler(req: Request) {
  // 1. Get JWT token
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401 
    });
  }

  // 2. Create Supabase client with JWT (not service role!)
  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,  // ANON not SERVICE_ROLE
    {
      global: { headers: { Authorization: authHeader } }
    }
  );

  // 3. Verify token
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { 
      status: 401 
    });
  }

  // ... continue with rest of function
}
```

**Test**: Call Edge Function without token - should get 401

---

### Fix #3: RLS Policies (2 hours)

**What**: Add database security rules

**File**: Create `/home/sk/fx/fx300/supabase/migrations/20251002_wizard_rls.sql`

**Copy this**:
```sql
-- Wizard actions policies
CREATE POLICY "users_read_own_actions" ON wizard_actions
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM wizard_sessions 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "users_insert_own_actions" ON wizard_actions
  FOR INSERT WITH CHECK (
    session_id IN (
      SELECT session_id FROM wizard_sessions 
      WHERE user_id = auth.uid()
    )
  );

-- Wizard interactions policies  
CREATE POLICY "users_read_own_interactions" ON wizard_interactions
  FOR SELECT USING (
    session_id IN (
      SELECT session_id FROM wizard_sessions 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "users_insert_own_interactions" ON wizard_interactions
  FOR INSERT WITH CHECK (
    session_id IN (
      SELECT session_id FROM wizard_sessions 
      WHERE user_id = auth.uid()
    )
  );
```

**Run**:
```bash
supabase migration new add_wizard_rls
# Copy SQL above into the new file
supabase db push
```

**Test**: Try to query another user's session - should return empty

---

### Fix #4: Error Boundaries (1 hour)

**What**: Catch errors before they crash the app

**File**: Create `/home/sk/fx/fx300/src/components/error-boundary.tsx`

**Copy this**:
```typescript
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="p-4 border border-red-500 rounded">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}
```

**File**: Update `/home/sk/fx/fx300/event-wizard/09-main-chat-component.tsx`

**Wrap CopilotKit**:
```typescript
import { ErrorBoundary } from '@/components/error-boundary';

export function EventWizardChat() {
  return (
    <ErrorBoundary>  {/* ADD THIS */}
      <CopilotKit publicApiKey={publicApiKey}>
        <WizardContent />
      </CopilotKit>
    </ErrorBoundary>  {/* AND THIS */}
  );
}
```

**Test**: Throw an error in any component - should show error UI, not crash

---

### Fix #5: Remove PII (1 hour)

**What**: Don't expose emails to AI

**File**: Every `use-stage-*.tsx` file

**Find this**:
```typescript
useCopilotReadable({
  value: {
    email: user.primaryEmailAddress?.emailAddress  // ❌ REMOVE THIS
  }
});
```

**Replace with**:
```typescript
useCopilotReadable({
  value: {
    hasEmail: Boolean(user.primaryEmailAddress)  // ✅ ONLY PRESENCE FLAG
  }
});
```

**Test**: Check browser console - no emails should appear in logs

---

## Testing Each Fix

### Quick Test Script

```bash
# 1. Start dev
npm run dev

# 2. Open browser console
# 3. Start wizard
# 4. Try to break it:

# Test 1: Stage guards
# - Complete organizer stage
# - Go back to organizer stage
# - Try to complete again
# - Should see error in console

# Test 2: JWT auth
# - Open Network tab
# - Watch Edge Function calls
# - Should see Authorization header
# - Should see 401 if token missing

# Test 3: RLS
# - Create wizard session
# - Note session_id
# - In Supabase SQL editor:
SELECT * FROM wizard_sessions WHERE session_id = 'other-users-id';
# - Should return nothing

# Test 4: Error boundary
# - In any component, add: throw new Error('test')
# - Should show error UI, not white screen

# Test 5: PII
# - Open React DevTools
# - Find useCopilotReadable values
# - Should NOT see actual emails
```

---

## Common Issues

### "401 Unauthorized" after Fix #2
**Problem**: Frontend not sending JWT token  
**Fix**: Check Clerk is configured and user is authenticated

### Migration fails in Fix #3
**Problem**: Tables don't exist yet  
**Fix**: Run database setup first: `supabase db push`

### Error boundary not catching errors
**Problem**: Not wrapped high enough in component tree  
**Fix**: Move ErrorBoundary higher, ideally in `_app.tsx`

### Still seeing emails in Fix #5
**Problem**: Multiple places exposing PII  
**Fix**: Search entire codebase for `user.email` and `primaryEmailAddress`

---

## Verification Script

After all fixes:

```bash
# Run this to verify
cd /home/sk/fx/fx300

# 1. Check stage guards exist
grep -r "if (stage !==.*)" event-wizard/stages/
# Should show guards in all stage hooks

# 2. Check JWT verification
grep -r "getUser" supabase/functions/wizard-session/
# Should show JWT verification code

# 3. Check RLS policies
supabase db diff
# Should show new RLS policies

# 4. Check error boundary
grep -r "ErrorBoundary" src/
# Should show ErrorBoundary in use

# 5. Check no PII
grep -r "primaryEmailAddress?.emailAddress" event-wizard/
# Should return no results
```

---

## Deploy

After all tests pass:

```bash
# 1. Create branch
git checkout -b fix/production-ready

# 2. Commit changes
git add .
git commit -m "Security fixes for production"

# 3. Push
git push origin fix/production-ready

# 4. Deploy to staging
vercel --target staging

# 5. Test staging
# - Create test account
# - Complete wizard
# - Verify everything works

# 6. Deploy to production
vercel --prod
```

---

## Help

### Documents to Reference
- `/home/sk/fx/fx300/plan/001-copilotkit-audit.md` - Full audit
- `/home/sk/fx/fx300/plan/002-critical-fixes.md` - Detailed fixes
- `/home/sk/fx/fx300/plan/004-architecture-diagrams.md` - Diagrams

### If Stuck
1. Check error logs: `npm run logs`
2. Check Supabase logs: Dashboard → Logs
3. Check Edge Function logs: Supabase → Functions → Logs
4. Ask for help with specific error message

---

## Success Metrics

You're done when:
- [ ] All 5 fixes implemented
- [ ] All tests pass
- [ ] No console errors
- [ ] Can complete wizard end-to-end
- [ ] Security tests pass (can't access other users' data)

---

**Estimated Time**: 8 hours (1 day)  
**Difficulty**: Medium (mostly copy/paste with testing)  
**Impact**: 🔴 CRITICAL - Blocks production launch