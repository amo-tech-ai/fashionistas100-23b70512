# CRITICAL FIXES - Implementation Guide
**Priority**: 🔴 URGENT  
**Timeline**: Day 1 (8 hours)  
**Must complete before any deployment**

---

## Fix #1: Stage Guards in Actions (2 hours)

### File: `/home/sk/fx/fx300/event-wizard/stages/use-stage-organizer.tsx`

**BEFORE (Wrong)**:
```typescript
useCopilotAction({
  name: "completeOrganizerSetup",
  available: isActive ? "enabled" : "disabled",
  handler: async (params) => {
    const validated = OrganizerSchema.parse(params);
    // ... continues without checking stage
  }
});
```

**AFTER (Correct)**:
```typescript
useCopilotAction({
  name: "completeOrganizerSetup",
  available: stage === 'organizerSetup' ? "enabled" : "disabled",
  handler: async (params) => {
    // CRITICAL: Add stage guard FIRST
    if (stage !== 'organizerSetup') {
      console.error('[ACTION BLOCKED]', {
        action: 'completeOrganizerSetup',
        expectedStage: 'organizerSetup',
        actualStage: stage,
        timestamp: new Date().toISOString()
      });
      throw new Error('Action not available in current stage');
    }
    
    // Log action start
    console.log('[ACTION START] completeOrganizerSetup', {
      stage,
      userId: get().userId,
      params: Object.keys(params)
    });
    
    try {
      const validated = OrganizerSchema.parse(params);
      setOrganizerData(validated);
      await updateProgress('organizerSetup', 100);
      await saveToBackend();
      nextStage();
      
      console.log('[ACTION SUCCESS] completeOrganizerSetup');
      return { success: true, message: `Welcome ${validated.name}` };
    } catch (error) {
      console.error('[ACTION ERROR] completeOrganizerSetup', error);
      throw error;
    }
  }
});
```

**Apply to ALL stage hooks**:
- `use-stage-organizer.tsx`
- `use-stage-event.tsx`  
- `use-stage-venue.tsx`
- `use-stage-ticket.tsx`
- `use-stage-sponsors.tsx`
- `use-stage-review.tsx`

---

## Fix #2: JWT Authentication (2 hours)

### File: `/home/sk/fx/fx300/supabase/functions/wizard-session/index.ts`

**BEFORE (Insecure)**:
```typescript
export default async function handler(req: Request) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  const { operation, sessionId, data } = await req.json();
  // ... operations without auth check
}
```

**AFTER (Secure)**:
```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

export default async function handler(req: Request) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 1. Extract JWT token
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('[AUTH] Missing or invalid Authorization header');
    return new Response(
      JSON.stringify({ error: 'Unauthorized - No token provided' }), 
      { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  const token = authHeader.replace('Bearer ', '');

  // 2. Create Supabase client with user JWT (RLS enforced)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,  // ✅ Use anon key
    {
      global: {
        headers: { Authorization: authHeader }
      }
    }
  );

  // 3. Verify JWT and get user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    console.error('[AUTH] Token validation failed', {
      error: authError?.message,
      timestamp: new Date().toISOString()
    });
    return new Response(
      JSON.stringify({ error: 'Unauthorized - Invalid token' }), 
      { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  // 4. Log authenticated request
  console.log('[AUTH SUCCESS]', {
    userId: user.id,
    email: user.email,
    timestamp: new Date().toISOString()
  });

  try {
    const { operation, sessionId, data } = await req.json();
    
    // All operations now run with user's RLS context
    // ... rest of implementation
    
  } catch (error) {
    console.error('[HANDLER ERROR]', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}
```

### Create CORS helper

**File**: `/home/sk/fx/fx300/supabase/functions/_shared/cors.ts`
```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

---

## Fix #3: Complete RLS Policies (2 hours)

### File: `/home/sk/fx/fx300/event-wizard/03-rls-policies.md`

**Add these missing policies**:

```sql
-- ============================================
-- WIZARD_ACTIONS TABLE POLICIES
-- ============================================

-- Users can read their own actions
CREATE POLICY "wizard_actions_select_own" ON wizard_actions
  FOR SELECT 
  USING (
    session_id IN (
      SELECT session_id 
      FROM wizard_sessions 
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert actions for their sessions
CREATE POLICY "wizard_actions_insert_own" ON wizard_actions
  FOR INSERT 
  WITH CHECK (
    session_id IN (
      SELECT session_id 
      FROM wizard_sessions 
      WHERE user_id = auth.uid()
    )
  );

-- Users cannot update or delete actions (audit trail)
CREATE POLICY "wizard_actions_no_update" ON wizard_actions
  FOR UPDATE 
  USING (false);

CREATE POLICY "wizard_actions_no_delete" ON wizard_actions
  FOR DELETE 
  USING (false);

-- ============================================
-- WIZARD_INTERACTIONS TABLE POLICIES
-- ============================================

-- Users can read their own interactions
CREATE POLICY "wizard_interactions_select_own" ON wizard_interactions
  FOR SELECT 
  USING (
    session_id IN (
      SELECT session_id 
      FROM wizard_sessions 
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert interactions for their sessions
CREATE POLICY "wizard_interactions_insert_own" ON wizard_interactions
  FOR INSERT 
  WITH CHECK (
    session_id IN (
      SELECT session_id 
      FROM wizard_sessions 
      WHERE user_id = auth.uid()
    )
  );

-- Users cannot update or delete interactions (audit trail)
CREATE POLICY "wizard_interactions_no_update" ON wizard_interactions
  FOR UPDATE 
  USING (false);

CREATE POLICY "wizard_interactions_no_delete" ON wizard_interactions
  FOR DELETE 
  USING (false);

-- ============================================
-- SERVICE ROLE POLICIES (for logging)
-- ============================================

-- Service role can read all for analytics
CREATE POLICY "wizard_actions_service_read" ON wizard_actions
  FOR SELECT 
  TO service_role
  USING (true);

CREATE POLICY "wizard_interactions_service_read" ON wizard_interactions
  FOR SELECT 
  TO service_role
  USING (true);
```

**Run migration**:
```bash
cd /home/sk/fx/fx300
supabase migration new add_wizard_rls_policies
# Copy SQL above into the migration file
supabase db push
```

---

## Fix #4: Error Boundaries (1 hour)

### Install dependency
```bash
cd /home/sk/fx/fx300
npm install react-error-boundary
```

### File: `/home/sk/fx/fx300/src/components/error-boundary.tsx`

```typescript
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  console.error('[ERROR BOUNDARY]', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{error.message}</p>
          <div className="flex gap-2">
            <Button onClick={resetErrorBoundary} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              variant="secondary"
            >
              Return to dashboard
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

interface Props {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: Props) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // Send to error tracking service
        console.error('[ERROR BOUNDARY]', {
          error: error.message,
          componentStack: info.componentStack,
          timestamp: new Date().toISOString()
        });
        
        // TODO: Send to Sentry/LogRocket/etc
      }}
      onReset={() => {
        // Clear any state if needed
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
```

### Update main component

**File**: `/home/sk/fx/fx300/event-wizard/09-main-chat-component.tsx`

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

export function EventWizardChat() {
  return (
    <ErrorBoundary>
      <CopilotKit publicApiKey={publicApiKey}>
        <WizardContent />
      </CopilotKit>
    </ErrorBoundary>
  );
}
```

---

## Fix #5: Remove Sensitive Readables (1 hour)

### File: `/home/sk/fx/fx300/event-wizard/stages/use-stage-organizer.tsx`

**BEFORE (Leaks Data)**:
```typescript
useCopilotReadable({
  description: "Organizer setup context",
  value: {
    currentData: organizerData,  // ❌ Contains email
    clerkProfile: {
      email: user.primaryEmailAddress?.emailAddress  // ❌ Exposes email
    }
  }
});
```

**AFTER (Safe)**:
```typescript
useCopilotReadable({
  description: "Organizer setup context",
  value: {
    // ✅ Only expose presence flags, not actual data
    hasName: Boolean(organizerData.name),
    hasEmail: Boolean(organizerData.email),
    hasOrganization: Boolean(organizerData.organization),
    selectedRole: organizerData.role, // Safe - not PII
    
    // ✅ Clerk profile status, not data
    clerkAuthenticated: Boolean(user),
    clerkHasName: Boolean(user?.fullName),
    clerkHasEmail: Boolean(user?.primaryEmailAddress),
    clerkHasOrganization: Boolean(user?.organizationMemberships?.[0]),
    
    // ✅ Progress metrics
    stageProgress: organizerData.name && organizerData.email ? 100 : 0,
    overallProgress: completionPercentage,
    
    // ✅ Device info (useful for AI)
    isMobile,
    
    // ✅ Validation requirements (helpful for AI)
    requirements: {
      nameLength: '2-100 characters',
      emailFormat: 'valid email required',
      roleOptions: ['event_organizer', 'fashion_designer', 'brand_representative', 'agency']
    }
  },
  available: stage === 'organizerSetup' ? "enabled" : "disabled"
});
```

**Apply to ALL stage hooks** - never expose:
- Email addresses
- Phone numbers  
- Full names in readables
- Organization names
- Any PII

---

## Verification Checklist

After implementing all fixes:

### Security
- [ ] JWT token required for all Edge Function calls
- [ ] RLS policies block unauthorized access
- [ ] No PII in readable contexts
- [ ] Stage guards prevent cross-stage execution

### Reliability  
- [ ] Error boundaries catch and display errors
- [ ] All actions have logging
- [ ] Failed actions don't crash app

### Testing
```bash
# Test JWT requirement
curl -X POST https://your-project.supabase.co/functions/v1/wizard-session \
  -H "Content-Type: application/json" \
  -d '{"operation":"create"}' 
# Should return 401

# Test with valid JWT
curl -X POST https://your-project.supabase.co/functions/v1/wizard-session \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"operation":"create"}' 
# Should return 200

# Test RLS
# Try to access another user's session - should fail
```

---

## Deployment

**DO NOT deploy until ALL fixes are verified**:

```bash
# 1. Run tests
cd /home/sk/fx/fx300
npm run test

# 2. Build production
npm run build

# 3. Deploy to staging first
vercel --prod --scope=staging

# 4. Manual testing on staging
# - Create wizard session
# - Test each stage
# - Verify errors are caught
# - Check logs for auth

# 5. Deploy to production ONLY after staging verified
vercel --prod
```

---

**Estimated Time**: 8 hours  
**Priority**: 🔴 CRITICAL  
**Next**: Day 2 polish fixes after these are verified