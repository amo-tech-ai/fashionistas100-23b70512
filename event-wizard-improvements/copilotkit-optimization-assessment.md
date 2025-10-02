# Event Wizard Implementation Assessment & CopilotKit Optimization

## Assessment of Suggestions with CopilotKit Best Practices

### 1. Clerk Integration ✅ Correct with Improvements

**Current Suggestion:** Use Clerk's `<SignIn />` component
**Assessment:** Correct approach for auth

**CopilotKit Optimization:**
```typescript
// Add user context to CopilotKit immediately after auth
export function OrganizerSetup() {
  const { user } = useUser();
  
  // Make user data readable to AI
  useCopilotReadable({
    description: "Current user profile",
    value: {
      name: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      organization: user?.organizationMemberships?.[0]?.organization?.name
    }
  });
  
  // Let AI know auth state
  useCopilotAdditionalInstructions({
    instructions: user 
      ? `User is authenticated as ${user.fullName}. Pre-fill forms where possible.`
      : `User needs to sign in first before proceeding.`
  });
}
```

### 2. Progress Calculation ⚠️ Needs CopilotKit Integration

**Current Suggestion:** Weighted progress calculation
**Issue:** Not exposed to CopilotKit

**Correct Implementation:**
```typescript
// Make progress readable to AI
export function useWizardProgress() {
  const progress = calcProgress(session?.completion_details);
  
  useCopilotReadable({
    description: "Wizard completion progress",
    value: {
      percentage: progress,
      completedStages: session?.completed_stages || [],
      currentStage: session?.current_stage,
      stagesRemaining: stages.filter(s => !completed_stages.includes(s))
    }
  });
  
  // AI can now say: "You're 65% complete! Just 2 more stages to go."
}
```

### 3. Form Validation ✅ Correct, Add AI Validation

**Current Suggestion:** Zod validation
**Enhancement:** Let AI help with validation

```typescript
useCopilotAction({
  name: "validateEventDetails",
  description: "Validate event information before proceeding",
  available: stage === "eventSetup" ? "enabled" : "disabled",
  parameters: [
    { name: "title", type: "string" },
    { name: "date", type: "string" },
    { name: "startTime", type: "string" }
  ],
  handler: async (params) => {
    // AI-assisted validation
    const issues = [];
    
    // Check for conflicts
    const conflicts = await checkEventConflicts(params.date, params.startTime);
    if (conflicts.length > 0) {
      issues.push(`Warning: ${conflicts.length} other events on this date`);
    }
    
    // Validate with Zod
    const result = EventSchema.safeParse(params);
    if (!result.success) {
      issues.push(...result.error.errors.map(e => e.message));
    }
    
    return {
      valid: issues.length === 0,
      issues,
      suggestions: issues.length > 0 
        ? await generateAlternatives(params)
        : null
    };
  }
});
```

### 4. Autosave ⚠️ Missing CopilotKit Notification

**Current Suggestion:** Silent autosave
**Issue:** AI doesn't know about saves

**Correct Implementation:**
```typescript
const autosave = async () => {
  const saved = await saveDraft();
  
  // Notify CopilotKit
  if (saved) {
    // Update readable
    useCopilotReadable({
      description: "Last save status",
      value: {
        savedAt: new Date().toISOString(),
        sessionId: session.session_id
      }
    });
  }
};

// AI can now say: "I've saved your progress. You can safely close and return later."
```

### 5. Mobile Navigation ❌ Not CopilotKit Relevant

**Current Suggestion:** CSS-only solution
**Issue:** No AI adaptation for mobile

**Correct Implementation:**
```typescript
// Detect mobile and adjust AI behavior
const isMobile = useMediaQuery('(max-width: 768px)');

useCopilotAdditionalInstructions({
  instructions: isMobile 
    ? "User is on mobile. Keep responses brief. Guide one field at a time."
    : "User is on desktop. Can handle multiple fields at once."
});

// Adjust actions for mobile
useCopilotAction({
  name: "nextField",
  available: isMobile && stage === currentStage ? "enabled" : "disabled",
  description: "Move to next field on mobile",
  handler: () => {
    // Focus next input
    document.querySelector(`#field-${currentFieldIndex + 1}`)?.focus();
  }
});
```

### 6. AI Assist ⚠️ Too Generic

**Current Suggestion:** Single pricing suggestion
**Issue:** Not following CopilotKit state machine pattern

**Correct Implementation:**
```typescript
// Stage-specific AI assistance
export function useStageTicketSetup() {
  const { eventData, venueData } = useWizardState();
  
  // Expose ALL relevant context
  useCopilotReadable({
    description: "Event context for ticket pricing",
    value: {
      eventType: eventData?.type,
      eventDate: eventData?.date,
      venuaCapacity: venueData?.capacity,
      venueMode: venueData?.mode,
      similarEvents: [] // Could fetch from DB
    },
    available: stage === "ticketSetup" ? "enabled" : "disabled"
  });
  
  // Multiple granular actions
  useCopilotAction({
    name: "analyzeMarketPricing",
    available: stage === "ticketSetup" ? "enabled" : "disabled",
    handler: async () => {
      const analysis = await fetchMarketData(eventData.type);
      return {
        average: analysis.avgPrice,
        range: analysis.priceRange,
        recommendation: analysis.suggested
      };
    }
  });
  
  useCopilotAction({
    name: "calculateBreakeven",
    available: stage === "ticketSetup" ? "enabled" : "disabled",
    parameters: [
      { name: "fixedCosts", type: "number" },
      { name: "variableCosts", type: "number" }
    ],
    handler: ({ fixedCosts, variableCosts }) => {
      const breakeven = (fixedCosts + variableCosts) / venueData.capacity;
      return {
        minimumPrice: breakeven * 1.3, // 30% margin
        recommended: breakeven * 1.5
      };
    }
  });
}
```

### 7. Security ✅ Correct, Add AI Security Context

**Current Suggestion:** Standard security practices
**Enhancement:** Make AI security-aware

```typescript
// Let AI know about security constraints
useCopilotAdditionalInstructions({
  instructions: `
    Security constraints:
    - Never ask for or display full credit card numbers
    - Don't store sensitive data in readables
    - All payments go through Stripe Connect
    - Session expires in ${minutesUntilExpiry} minutes
  `
});

// Add security action
useCopilotAction({
  name: "checkSessionSecurity",
  description: "Verify session is still valid",
  handler: async () => {
    const valid = await verifySession(sessionId);
    if (!valid) {
      return "Session expired. Please refresh to continue.";
    }
    return "Session valid";
  }
});
```

### 8. Database Corrections ✅ Critical Fixes

**RPC for JSONB Updates - CORRECT:**
```sql
-- Required RPC functions
CREATE OR REPLACE FUNCTION wizard_merge_stage_data(
  p_session_id text,
  p_stage text,
  p_data jsonb
) RETURNS void AS $$
BEGIN
  UPDATE wizard_sessions
  SET 
    stage_data = stage_data || jsonb_build_object(p_stage, p_data),
    updated_at = NOW()
  WHERE session_id = p_session_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION wizard_update_completion(
  p_session_id text,
  p_stage text,
  p_percentage integer
) RETURNS void AS $$
BEGIN
  UPDATE wizard_sessions
  SET 
    completion_details = completion_details || 
      jsonb_build_object(p_stage, p_percentage),
    completion_percentage = (
      SELECT SUM(value::integer * 
        CASE key 
          WHEN 'organizerSetup' THEN 0.15
          WHEN 'eventSetup' THEN 0.20
          WHEN 'venueSetup' THEN 0.15
          WHEN 'ticketSetup' THEN 0.20
          WHEN 'sponsorsMedia' THEN 0.15
          WHEN 'reviewPublish' THEN 0.15
        END
      )::integer
      FROM jsonb_each_text(completion_details || 
        jsonb_build_object(p_stage, p_percentage))
    ),
    updated_at = NOW()
  WHERE session_id = p_session_id;
END;
$$ LANGUAGE plpgsql;
```

## Optimal CopilotKit Pattern Summary

### ✅ DO THIS (Production-Ready):

```typescript
// 1. One hook per stage with ALL context
export function useStage[Name]() {
  const { session, updateStageData, nextStage } = useWizardState();
  const stage = session?.current_stage;
  
  // Stage instructions
  useCopilotAdditionalInstructions({
    instructions: STAGE_SPECIFIC_GUIDANCE,
    available: stage === "thisStage" ? "enabled" : "disabled"
  });
  
  // ALL relevant readables
  useCopilotReadable({
    description: "Stage context",
    value: {
      currentData: session?.stage_data?.[stage],
      previousStages: session?.completed_stages,
      progress: session?.completion_percentage,
      validationRules: STAGE_VALIDATION_SCHEMA
    },
    available: stage === "thisStage" ? "enabled" : "disabled"
  });
  
  // Primary action for stage completion
  useCopilotAction({
    name: "complete[Stage]",
    available: stage === "thisStage" ? "enabled" : "disabled",
    parameters: STAGE_PARAMETERS,
    handler: async (params) => {
      // Validate
      const validated = await validateWithSchema(params);
      if (!validated.success) return validated.error;
      
      // Save via RPC (not direct SQL)
      await supabase.rpc('wizard_merge_stage_data', {
        p_session_id: session.session_id,
        p_stage: stage,
        p_data: validated.data
      });
      
      // Update completion
      await supabase.rpc('wizard_update_completion', {
        p_session_id: session.session_id,
        p_stage: stage,
        p_percentage: 100
      });
      
      // Log action
      await logAction(session.session_id, `complete_${stage}`);
      
      // Transition
      nextStage();
    }
  });
  
  // Helper actions (optional)
  useCopilotAction({
    name: "suggest[Stage]Options",
    available: stage === "thisStage" ? "enabled" : "disabled",
    handler: async () => {
      // Context-aware suggestions
      return await generateSuggestions(session.stage_data);
    }
  });
}
```

### ❌ AVOID THESE:

1. **Multiple state sources** - Use single `wizard_sessions` table
2. **SQL in JavaScript** - Use RPC functions
3. **Silent failures** - Always notify AI of save/error states
4. **Generic actions** - Make them stage-specific with `available`
5. **Missing context** - Include ALL relevant data in readables

## Final Implementation Priority:

1. **First:** Fix database with RPC functions
2. **Second:** Implement Clerk with prefill
3. **Third:** Add stage-specific CopilotKit hooks
4. **Fourth:** Add progress tracking
5. **Fifth:** Mobile optimizations
6. **Sixth:** Security hardening

This approach ensures CopilotKit has full context at each stage while maintaining clean separation of concerns and security.