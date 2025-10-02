# 10. Deployment Guide & Best Practices

## Production Deployment Checklist

### Prerequisites
- [ ] Supabase project created
- [ ] Clerk account configured
- [ ] Stripe Connect enabled
- [ ] Vercel/Netlify account ready
- [ ] CopilotKit API key obtained

### Phase 1: Database Setup
```bash
# 1. Run migrations in order
supabase migration new wizard_schema
# Copy content from 01-database-schema.md

supabase migration new rpc_functions
# Copy content from 02-rpc-functions.md

supabase migration new rls_policies
# Copy content from 03-rls-policies.md

# 2. Apply migrations
supabase db push

# 3. Verify RPC functions
supabase functions list
```

### Phase 2: Edge Functions
```bash
# 1. Create function
supabase functions new wizard-session

# 2. Copy edge function code
# Copy content from 08-edge-function.ts

# 3. Deploy function
supabase functions deploy wizard-session

# 4. Set environment variables
supabase secrets set ALLOWED_ORIGINS="https://your-domain.com"
```

### Phase 3: Environment Configuration
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_key]

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[clerk_key]
CLERK_SECRET_KEY=[clerk_secret]
CLERK_WEBHOOK_SECRET=[webhook_secret]

NEXT_PUBLIC_COPILOTKIT_PUBLIC_KEY=[copilot_key]

STRIPE_SECRET_KEY=[stripe_secret]
STRIPE_WEBHOOK_SECRET=[webhook_secret]
STRIPE_CONNECT_CLIENT_ID=[connect_id]

# Optional
NEXT_PUBLIC_POSTHOG_KEY=[posthog_key]
SENTRY_DSN=[sentry_dsn]
```

### Phase 4: Frontend Setup
```bash
# 1. Install dependencies
npm install @copilotkit/react-core @copilotkit/react-ui
npm install @clerk/nextjs @clerk/themes
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand zod
npm install @radix-ui/react-* # UI components
npm install tailwindcss @tailwindcss/forms

# 2. Configure Clerk
# Add to app/layout.tsx
<ClerkProvider>
  <html>
    <body>{children}</body>
  </html>
</ClerkProvider>

# 3. Configure Supabase
# Create lib/supabase/client.ts
# Create lib/supabase/server.ts

# 4. Setup CopilotKit
# Add to app/layout.tsx or specific pages
<CopilotKit publicApiKey={process.env.NEXT_PUBLIC_COPILOTKIT_PUBLIC_KEY}>
  {children}
</CopilotKit>
```

### Phase 5: Testing
```bash
# 1. Test database
npm run test:db

# 2. Test Edge Functions
npm run test:functions

# 3. E2E testing
npm run test:e2e

# 4. Load testing
npm run test:load
```

### Phase 6: Monitoring Setup
```javascript
// lib/monitoring.ts
import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Initialize PostHog
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    }
  });
}

// Track wizard events
export function trackWizardEvent(event: string, properties?: any) {
  posthog?.capture(event, properties);
  Sentry.addBreadcrumb({
    message: event,
    category: 'wizard',
    data: properties,
  });
}
```

## CopilotKit State Machine Best Practices

### 1. Stage Isolation
Each stage MUST have its own hook with the `available` prop:
```typescript
useCopilotAction({
  name: "actionName",
  available: stage === "currentStage" ? "enabled" : "disabled",
  // ...
});
```

### 2. Complete Context Exposure
Always provide ALL relevant context via readables:
```typescript
useCopilotReadable({
  description: "Stage context",
  value: {
    currentData: stageData,
    validationRules: schema,
    progress: percentage,
    previousStages: completed,
    userProfile: userData
  },
  available: isActive ? "enabled" : "disabled"
});
```

### 3. Validation at Every Stage
Never skip validation:
```typescript
handler: async (params) => {
  try {
    const validated = StageSchema.parse(params);
    // Only proceed if valid
  } catch (error) {
    // Return errors, don't throw
    return { success: false, errors: [...] };
  }
}
```

### 4. Deterministic Idempotency
Always use stable keys:
```typescript
// GOOD
const idempotencyKey = `publish:${sessionId}`;

// BAD
const idempotencyKey = `publish:${Date.now()}`;
```

### 5. Progress from Database
Never guess progress:
```typescript
// GOOD - calculated from DB
const progress = await supabase.rpc('wizard_update_progress', {...});

// BAD - client-side guess
const progress = completedFields / totalFields * 100;
```

## Security Checklist

### Critical Security Requirements
- [ ] JWT verification in ALL Edge Functions
- [ ] RLS enabled on ALL tables
- [ ] Service role key ONLY for webhooks
- [ ] Idempotency keys for ALL mutations
- [ ] HTTPS only in production
- [ ] CORS properly configured
- [ ] Rate limiting on Edge Functions
- [ ] Input validation on EVERY field
- [ ] XSS protection on all outputs
- [ ] SQL injection impossible (using RPCs)

## Performance Optimization

### Database
- [ ] Indexes on all foreign keys
- [ ] Partial indexes for filtered queries
- [ ] JSONB GIN indexes if querying inside JSON
- [ ] Connection pooling configured
- [ ] Query performance monitored

### Frontend
- [ ] Code splitting by route
- [ ] Lazy loading for stage components
- [ ] Debounced autosave (1 second)
- [ ] Optimistic UI updates
- [ ] Image optimization with Next.js Image

### Edge Functions
- [ ] Response caching where appropriate
- [ ] Minimal payload sizes
- [ ] Proper error handling
- [ ] Timeout configuration
- [ ] Cold start optimization

## Common Issues & Solutions

### Issue: JSONB updates failing
**Solution**: Must use RPC functions, not direct updates

### Issue: Progress showing wrong percentage
**Solution**: Calculate from completion_details via RPC

### Issue: Double publish on click
**Solution**: Use deterministic idempotency keys

### Issue: Session not persisting
**Solution**: Check localStorage and cookie settings

### Issue: CopilotKit actions not available
**Solution**: Verify `available` prop matches current stage

## Support & Resources

- CopilotKit Docs: https://docs.copilotkit.ai
- Supabase Docs: https://supabase.com/docs
- Clerk Docs: https://clerk.com/docs
- Project Repository: [Your GitHub URL]
- Support Email: [Your Support Email]

## Final Notes

This implementation follows CopilotKit's official state machine pattern exactly as demonstrated in their car sales example. The key principles are:

1. **Single source of truth** for state
2. **Stage isolation** with `available` prop
3. **Complete context** via readables
4. **Deterministic transitions**
5. **Validation at every step**

The system is designed to be:
- **Secure**: JWT verification, RLS, idempotency
- **Scalable**: Proper indexes, caching, optimization
- **Maintainable**: Clear structure, documented patterns
- **User-friendly**: Autosave, progress tracking, error handling

Estimated time to production: **5 days** with focused execution.