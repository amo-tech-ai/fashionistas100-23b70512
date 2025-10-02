# Event Wizard Architecture - Correct vs Current

## Current Architecture (BROKEN)

```
┌─────────────────────────────────────────────┐
│         Frontend (CopilotKit)               │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  Stage Hooks (All Active at Once)    │  │ ❌ No isolation
│  │  - useStageOrganizer()               │  │ ❌ Actions leak
│  │  - useStageEvent()                   │  │ ❌ available prop
│  │  - useStageVenue()                   │  │    doesn't enforce
│  │  └─ All listen to same global state  │  │
│  └──────────────────────────────────────┘  │
│           │                                 │
│           │ No stage guards                 │
│           ▼                                 │
│  ┌──────────────────────────────────────┐  │
│  │    Global State (Zustand)            │  │
│  │    - stage: 'organizerSetup'         │  │
│  │    - All data stored together        │  │
│  └──────────────────────────────────────┘  │
│           │                                 │
└───────────┼─────────────────────────────────┘
            │ No JWT token ❌
            ▼
┌─────────────────────────────────────────────┐
│         Edge Function                       │
│                                             │
│  ❌ No authentication                       │
│  ❌ Uses SERVICE_ROLE_KEY                   │
│  ❌ Bypasses RLS completely                 │
│                                             │
└───────────┼─────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────┐
│         Supabase Database                   │
│                                             │
│  ❌ Incomplete RLS policies                 │
│  ❌ Anyone can access any session           │
│  ❌ No user isolation                       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Correct Architecture (SECURE)

```
┌─────────────────────────────────────────────┐
│         Frontend (CopilotKit)               │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  Stage Hooks (Conditional Rendering) │  │ ✅ Isolated
│  │                                       │  │
│  │  {stage === 'organizerSetup' &&      │  │ ✅ Only active
│  │    <useStageOrganizer />}            │  │    hook renders
│  │                                       │  │
│  │  {stage === 'eventSetup' &&          │  │ ✅ available prop
│  │    <useStageEvent />}                │  │    + stage guards
│  │  ...                                  │  │
│  └──────────────────────────────────────┘  │
│           │                                 │
│           │ Action calls with stage checks  │
│           ▼                                 │
│  ┌──────────────────────────────────────┐  │
│  │    Global State (Zustand)            │  │
│  │    - stage: 'organizerSetup'         │  │
│  │    - Stage-specific validation       │  │
│  │    - Action logging                  │  │
│  └──────────────────────────────────────┘  │
│           │                                 │
└───────────┼─────────────────────────────────┘
            │ JWT token in header ✅
            │ Authorization: Bearer <token>
            ▼
┌─────────────────────────────────────────────┐
│         Edge Function                       │
│                                             │
│  ✅ Extracts JWT from header                │
│  ✅ Verifies token with Supabase            │
│  ✅ Gets user context                       │
│  ✅ Uses ANON_KEY (RLS enforced)            │
│                                             │
│  if (!user) {                               │
│    return 401 Unauthorized                  │
│  }                                          │
│                                             │
└───────────┼─────────────────────────────────┘
            │ Authenticated user context
            ▼
┌─────────────────────────────────────────────┐
│         Supabase Database                   │
│                                             │
│  ✅ Complete RLS policies                   │
│  ✅ User can only access own sessions       │
│  ✅ Audit trail immutable                   │
│  ✅ Service role for analytics only         │
│                                             │
│  Policy: wizard_sessions_select_own         │
│    USING (user_id = auth.uid())            │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Stage Flow (Correct Implementation)

```
User opens wizard
     │
     ▼
┌─────────────────────┐
│  Stage: organizer   │  ← Only useStageOrganizer active
│  Progress: 0%       │
└──────┬──────────────┘
       │ completeOrganizerSetup()
       │ ✅ Stage guard checks
       │ ✅ Validation runs
       │ ✅ Backend saves
       ▼
┌─────────────────────┐
│  Stage: event       │  ← Only useStageEvent active  
│  Progress: 15%      │     (organizer hook unmounted)
└──────┬──────────────┘
       │ completeEventSetup()
       │ ✅ Stage guard checks
       │ ✅ AI helps if needed
       │ ✅ Backend saves
       ▼
┌─────────────────────┐
│  Stage: venue       │  ← Only useStageVenue active
│  Progress: 35%      │
└──────┬──────────────┘
       │ 
       ▼
     (continues through all stages)
       │
       ▼
┌─────────────────────┐
│  Stage: review      │  ← Final stage
│  Progress: 85%      │
└──────┬──────────────┘
       │ publishEvent()
       │ ✅ All validation passes
       │ ✅ Event created in DB
       │ ✅ Status: published
       ▼
┌─────────────────────┐
│  Success!           │
│  Event ID: xyz123   │
│  Progress: 100%     │
└─────────────────────┘
```

---

## Error Handling Flow (Correct)

```
User triggers action
     │
     ▼
┌─────────────────────────────────────┐
│  ErrorBoundary Component            │
│                                     │
│  Try:                               │
│    ┌─────────────────────────────┐ │
│    │ CopilotKit                  │ │
│    │   ┌──────────────────────┐  │ │
│    │   │ Action Handler       │  │ │
│    │   │                      │  │ │
│    │   │ 1. Stage guard ✅    │  │ │
│    │   │ 2. Validation ✅     │  │ │
│    │   │ 3. Business logic ✅ │  │ │
│    │   │ 4. Save to DB ✅     │  │ │
│    │   └──────────────────────┘  │ │
│    └─────────────────────────────┘ │
│  Catch:                             │
│    ┌─────────────────────────────┐ │
│    │ Error Fallback UI           │ │
│    │ - Shows error message       │ │
│    │ - Offers retry button       │ │
│    │ - Logs to console           │ │
│    │ - Sends to monitoring       │ │
│    └─────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Data Flow (Secure)

```
User Input
     │
     ▼
┌──────────────────┐
│  Frontend        │
│  Validation      │  ← Zod schemas
│  (Client-side)   │
└────┬─────────────┘
     │ Valid data + JWT
     ▼
┌──────────────────┐
│  Edge Function   │
│  - Verify JWT ✅  │  ← Authentication
│  - Get user ✅    │
│  - Log action ✅  │
└────┬─────────────┘
     │ Authenticated request
     ▼
┌──────────────────┐
│  RPC Function    │  ← Business logic
│  - Merge data    │
│  - Calculate %   │
│  - Transition    │
└────┬─────────────┘
     │ RLS enforced
     ▼
┌──────────────────┐
│  Database        │
│  - Only user's   │  ← RLS policies
│    data visible  │
│  - Audit logged  │
└──────────────────┘
```

---

## Key Differences

| Aspect | Current (WRONG) | Correct |
|--------|----------------|---------|
| Stage Isolation | ❌ All hooks active | ✅ Conditional rendering |
| Action Guards | ❌ None | ✅ Stage checks in handlers |
| Authentication | ❌ None | ✅ JWT verification |
| Authorization | ❌ Service role | ✅ RLS enforced |
| Error Handling | ❌ None | ✅ Error boundaries |
| Data Exposure | ❌ PII in readables | ✅ Only flags |
| Logging | ❌ None | ✅ All actions logged |

---

## Security Layers (Defense in Depth)

```
Layer 1: Frontend Validation
  ↓ Zod schemas, type checking
  
Layer 2: Stage Guards  
  ↓ Action handlers check current stage
  
Layer 3: JWT Authentication
  ↓ Edge Function verifies token
  
Layer 4: User Context
  ↓ Get authenticated user from JWT
  
Layer 5: RLS Policies
  ↓ Database enforces user isolation
  
Layer 6: Audit Logging
  ↓ All actions recorded immutably
```

Each layer provides protection even if previous layers fail.

---

**Result**: Secure, maintainable, production-ready wizard