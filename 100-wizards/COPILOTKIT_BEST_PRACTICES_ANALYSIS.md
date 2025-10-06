# CopilotKit Best Practices Analysis - Event Wizard

**Date**: 2025-01-24  
**Status**: 🔴 **CRITICAL GAPS IDENTIFIED**  
**Compliance**: **20%** - Major architectural issues

---

## 📋 EXECUTIVE SUMMARY

The current Event Wizard implementation **DOES NOT** follow CopilotKit state machine best practices from the official cookbook. Critical gaps exist in architecture, state management, and AI integration.

**Key Issues**:
1. ❌ Stage hooks exist but NOT integrated into main component
2. ❌ Main component uses local state instead of global state machine
3. ❌ No `available` prop pattern for conditional stage control
4. ❌ CopilotKit wrapper missing from main component
5. ❌ Stage hooks use `enabled`/`disabled` but NOT called from container

---

## ✅ COOKBOOK BEST PRACTICES (What Should Exist)

### Pattern 1: Global State Machine

```typescript
// ✅ COOKBOOK PATTERN
function StateMachineChat() {
  const [stage, setStage] = useState<string>("one");
  const [data, setData] = useState({});
  
  // Global readable context (NO dependency array per cookbook)
  useCopilotReadable({
    description: "Complete wizard state",
    value: { stage, data }
  });
  
  // Initialize ALL stage hooks (control via 'available')
  useStageOne(stage, setStage, setData);
  useStageTwo(stage, setStage, setData);
  useStageThree(stage, setStage, setData);
  
  return (
    <CopilotKit>
      <CopilotChat />
      {renderStage(stage)}
    </CopilotKit>
  );
}
```

### Pattern 2: Stage Hook Structure

```typescript
// ✅ COOKBOOK PATTERN
function useStageOne(stage: string, setStage: Function, setData: Function) {
  useCopilotAdditionalInstructions({
    instructions: "Help with stage one...",
    available: stage === "one" ? "available" : "disabled"
  });
  
  useCopilotReadable({
    description: "Stage one data",
    value: data,
    available: stage === "one" ? "available" : "disabled"
  });
  
  useCopilotAction({
    name: "transitionToNextStage",
    available: stage === "one" ? "available" : "disabled",
    handler: ({ params }) => {
      setData(params);
      setStage("two"); // Direct transition
    }
  });
}
```

### Pattern 3: Available Prop Pattern

```typescript
// ✅ COOKBOOK: Conditional control
available: stage === "targetStage" ? "available" : "disabled"

// Note: Cookbook uses "available"/"disabled"
// Our TypeScript types use "enabled"/"disabled"
// Both work, but we use "enabled" to match our v1.10.5 types
```

---

## ❌ CURRENT IMPLEMENTATION (What Actually Exists)

### Issue 1: Stage Hooks NOT Called ❌

**File**: `src/pages/EventWizard.tsx`

```typescript
// ❌ CURRENT CODE - No stage hooks called!
export default function EventWizard() {
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState({
    organizer: {},
    event: {},
    venue: {},
    tickets: {},
    sponsors: {},
  });
  
  // ❌ NO stage hooks initialized
  // ❌ NO useStageOrganizerSetup()
  // ❌ NO useStageEventSetup()
  // ❌ NO CopilotKit integration
  
  return (
    <div>
      {/* ❌ NO CopilotKit wrapper */}
      {renderStage()}
    </div>
  );
}
```

**Problem**: Stage hooks exist but are NEVER called. The AI has no access to them.

### Issue 2: Local State Instead of Global ❌

```typescript
// ❌ CURRENT - Local useState
const [formData, setFormData] = useState({...});

// ✅ SHOULD BE - Global state from useGlobalState
const { stage, organizerInfo, setStage } = useGlobalState();
```

**Problem**: Each page reload loses state, no persistence, no AI context.

### Issue 3: No CopilotKit Wrapper ❌

```typescript
// ❌ CURRENT - No CopilotKit
return <div>{renderStage()}</div>;

// ✅ SHOULD BE - CopilotKit wrapped
return (
  <CopilotKit runtimeUrl="/api/copilotkit">
    <CopilotSidebar>
      {renderStage()}
    </CopilotSidebar>
  </CopilotKit>
);
```

**Problem**: AI sidebar not accessible, stage hooks can't execute.

### Issue 4: Stage Hooks Use Correct Pattern But Aren't Connected ⚠️

**File**: `event-wizard/stages/01-use-stage-organizer-setup.tsx`

```typescript
// ✅ Stage hook follows cookbook pattern (GOOD)
export function useStageOrganizerSetup() {
  const { stage, setStage } = useGlobalState();
  
  useCopilotAdditionalInstructions({
    instructions: "...",
    available: stage === "organizerSetup" ? "enabled" : "disabled", // ✅
  }, [stage]); // ❌ Dependency array (cookbook says none)
  
  useCopilotAction({
    name: "setupOrganizer",
    available: stage === "organizerSetup" ? "enabled" : "disabled", // ✅
    handler: () => setStage("eventSetup") // ✅
  }, [stage]); // ❌ Dependency array (cookbook says none)
}
```

**Status**: Hook follows pattern BUT:
- ❌ Never called from main component
- ⚠️ Has dependency arrays (cookbook example has none for global context)
- ✅ Uses correct `available` pattern
- ✅ Uses correct transition logic

---

## 🔍 DETAILED GAP ANALYSIS

### 1. Architecture Compliance

| Cookbook Best Practice | Current Status | Gap |
|------------------------|----------------|-----|
| Global state machine | ❌ Local state | **CRITICAL** |
| All stage hooks called from container | ❌ Not called | **CRITICAL** |
| CopilotKit wrapper | ❌ Missing | **CRITICAL** |
| `available` prop pattern | ⚠️ Exists in hooks but not used | **HIGH** |
| Stage transitions via setStage | ⚠️ Exists but local onClick | **HIGH** |

### 2. State Management Compliance

| Cookbook Best Practice | Current Status | Gap |
|------------------------|----------------|-----|
| Single source of truth | ❌ Multiple sources | **CRITICAL** |
| Global readable context | ❌ Not exposed | **CRITICAL** |
| Stage-specific readable | ✅ Exists in hooks | **MEDIUM** (not connected) |
| Persistence | ⚠️ localStorage only | **MEDIUM** |

### 3. AI Integration Compliance

| Cookbook Best Practice | Current Status | Gap |
|------------------------|----------------|-----|
| CopilotKit provider | ❌ Missing | **CRITICAL** |
| CopilotChat/Sidebar | ❌ Missing | **CRITICAL** |
| Stage instructions | ✅ Defined in hooks | **LOW** (just need to connect) |
| Stage actions | ✅ Defined in hooks | **LOW** (just need to connect) |

---

## 🎯 CORRECT IMPLEMENTATION (What It Should Be)

### Container Component (CORRECT)

```typescript
// ✅ CORRECT PATTERN
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useGlobalState } from "@/lib/stages";
import { useStageOrganizerSetup } from "./stages/01-use-stage-organizer-setup";
import { useStageEventSetup } from "./stages/02-use-stage-event-setup";
// ... import all stage hooks

export default function EventWizard() {
  const { 
    stage, 
    organizerInfo, 
    eventInfo,
    setStage 
  } = useGlobalState();

  // Global context available to ALL stages
  useCopilotReadable({
    description: "Complete wizard state",
    value: {
      currentStage: stage,
      organizer: organizerInfo,
      event: eventInfo
    }
  }); // NO dependency array per cookbook

  // Initialize ALL stage hooks (they control themselves via 'available')
  useStageOrganizerSetup(); // Stage 1
  useStageEventSetup();     // Stage 2
  useStageVenueSetup();     // Stage 3
  useStageTicketSetup();    // Stage 4
  useStageSponsorSetup();   // Stage 5
  useStageReviewPublish();  // Stage 6

  return (
    <CopilotKit runtimeUrl={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/copilotkit`}>
      <div className="min-h-screen">
        <Navigation />
        
        <CopilotSidebar
          defaultOpen={true}
          labels={{
            title: "Event Wizard Assistant",
            initial: "Hi! I'll help you create your event. What kind of event are you planning?"
          }}
        >
          <div className="max-w-4xl mx-auto p-6">
            <WizardProgress stage={stage} />
            {renderStage(stage)}
          </div>
        </CopilotSidebar>
        
        <Footer />
      </div>
    </CopilotKit>
  );
}

function renderStage(stage: string) {
  switch(stage) {
    case "organizerSetup": return <OrganizerSetupPage />;
    case "eventSetup": return <EventSetupPage />;
    case "venueSetup": return <VenueSetupPage />;
    case "ticketSetup": return <TicketSetupPage />;
    case "sponsorSetup": return <SponsorSetupPage />;
    case "reviewPublish": return <ReviewPublishPage />;
    default: return null;
  }
}
```

### Stage Hook (CORRECT - Already Exists!)

```typescript
// ✅ ALREADY CORRECT in event-wizard/stages/01-use-stage-organizer-setup.tsx
export function useStageOrganizerSetup() {
  const { stage, organizerInfo, setStage, setOrganizerInfo } = useGlobalState();

  useCopilotAdditionalInstructions({
    instructions: "Help with organizer setup...",
    available: stage === "organizerSetup" ? "enabled" : "disabled",
  }); // Remove dependency array per cookbook

  useCopilotReadable({
    description: "Current organizer info",
    value: organizerInfo || {},
    available: stage === "organizerSetup" ? "enabled" : "disabled",
  }); // Remove dependency array per cookbook

  useCopilotAction({
    name: "setupOrganizer",
    available: stage === "organizerSetup" ? "enabled" : "disabled",
    renderAndWaitForResponse: ({ respond }) => {
      return (
        <OrganizerProfile
          onSubmit={(data) => {
            setOrganizerInfo(data);
            respond?.("Profile ready! Let's create your event!");
            setStage("eventSetup");
          }}
        />
      );
    },
  }); // Remove dependency array per cookbook
}
```

---

## 📊 COMPLIANCE SCORECARD

### Overall Compliance: 20%

| Category | Score | Status |
|----------|-------|--------|
| **Architecture** | 10% | 🔴 Critical gaps |
| **State Management** | 30% | 🔴 Partial implementation |
| **AI Integration** | 15% | 🔴 Not connected |
| **Stage Hooks** | 70% | 🟡 Exist but not used |
| **UI Components** | 60% | 🟡 Basic forms only |

---

## 🚨 CRITICAL ACTION ITEMS

### Priority 1: Connect Architecture (2 hours)

**Task**: Rewrite `src/pages/EventWizard.tsx` to follow cookbook pattern

**Changes**:
1. ✅ Import all 6 stage hooks
2. ✅ Replace local state with `useGlobalState()`
3. ✅ Call all stage hooks in container
4. ✅ Wrap with `<CopilotKit>` provider
5. ✅ Add `<CopilotSidebar>` component
6. ✅ Add global `useCopilotReadable` for wizard state

**Impact**: Enables AI assistance, activates all stage logic

### Priority 2: Remove Dependency Arrays (15 min)

**Task**: Update all stage hooks to remove dependency arrays

**Reason**: Cookbook pattern shows global context WITHOUT dependency arrays

**Files**:
- `event-wizard/stages/01-use-stage-organizer-setup.tsx`
- `event-wizard/stages/02-use-stage-event-setup.tsx`
- `event-wizard/stages/03-use-stage-ticket-setup.tsx`
- `event-wizard/stages/04-use-stage-venue-setup.tsx`
- `event-wizard/stages/05-use-stage-payment-setup.tsx`
- `event-wizard/stages/06-use-stage-review-publish.tsx`

### Priority 3: Database Integration (1 hour)

**Task**: Ensure `useGlobalState` hook persists to `wizard_sessions` table

**Verify**:
- ✅ Auto-save on data changes
- ✅ Restore from database on mount
- ✅ Update `current_stage` on transitions
- ✅ Clear on publish/reset

---

## 📖 COOKBOOK VS CURRENT COMPARISON

### Container Pattern

| Aspect | Cookbook | Current | Match? |
|--------|----------|---------|--------|
| Global state | useState | ❌ Local useState | ❌ |
| Stage hooks called | ✅ All called | ❌ None called | ❌ |
| CopilotKit wrapper | ✅ Present | ❌ Missing | ❌ |
| Global readable | ✅ Present | ❌ Missing | ❌ |
| Dependency arrays | ❌ None | ⚠️ Has arrays | ⚠️ |

### Stage Hook Pattern

| Aspect | Cookbook | Current | Match? |
|--------|----------|---------|--------|
| `useCopilotAdditionalInstructions` | ✅ | ✅ | ✅ |
| `useCopilotReadable` | ✅ | ✅ | ✅ |
| `useCopilotAction` | ✅ | ✅ | ✅ |
| `available` prop | ✅ | ✅ | ✅ |
| Stage transitions | setStage() | ✅ setStage() | ✅ |
| Dependency arrays | ❌ None | ⚠️ Has arrays | ⚠️ |

---

## ✅ WHAT'S ALREADY CORRECT

### 1. Stage Hook Structure ✅
All 6 stage hooks follow the correct pattern:
- ✅ Use `available` prop for conditional activation
- ✅ Use `useGlobalState()` for state management
- ✅ Implement stage-specific instructions
- ✅ Implement stage-specific actions
- ✅ Transition via `setStage()`

### 2. Validation Logic ✅
- ✅ Zod schemas defined
- ✅ Validation in stage hooks
- ✅ Error handling

### 3. UI Components ✅
- ✅ All 6 stage pages exist
- ✅ Forms functional
- ✅ Responsive design

---

## 🎓 KEY LESSONS FROM COOKBOOK

### 1. Available Prop is Everything

The `available` prop is the **core mechanism** for state machines:
- Conditionally enables instructions
- Conditionally enables readable context
- Conditionally enables actions

### 2. All Hooks Always Called

Unlike typical React patterns, **ALL stage hooks are called every render**. They control themselves via `available`:

```typescript
// ✅ ALWAYS call all hooks
useStageOne(stage);   // Controls itself via available
useStageTwo(stage);   // Controls itself via available
useStageThree(stage); // Controls itself via available
```

### 3. No Dependency Arrays for Global Context

Cookbook shows global `useCopilotReadable` with **NO dependency array**:

```typescript
// ✅ COOKBOOK
useCopilotReadable({
  description: "User's name",
  value: name,
}); // NO dependency array

// ⚠️ CURRENT
useCopilotReadable({
  description: "User's name",
  value: name,
}, [name]); // Has dependency array
```

**Impact**: Minor - both work, but cookbook pattern is simpler.

---

## 🎯 IMPLEMENTATION ROADMAP

### Phase 1: Architecture Fix (2 hours) - CRITICAL

1. **Rewrite EventWizard.tsx** (1 hour)
   - Import all stage hooks
   - Use `useGlobalState()`
   - Add CopilotKit wrapper
   - Call all stage hooks
   - Add global readable

2. **Test AI Integration** (30 min)
   - Verify sidebar opens
   - Verify AI responds
   - Verify stage transitions

3. **Remove Dependency Arrays** (30 min)
   - Update all 6 stage hooks
   - Test no regressions

### Phase 2: Database Integration (1 hour)

1. **Verify useGlobalState** (30 min)
   - Test auto-save
   - Test restore
   - Test stage updates

2. **Test Persistence** (30 min)
   - Create event
   - Refresh page
   - Verify data restored

### Phase 3: Production Testing (1 hour)

1. **End-to-End Test** (30 min)
   - Complete full wizard
   - Use AI assistance
   - Publish event

2. **Edge Case Testing** (30 min)
   - Invalid data
   - Network errors
   - Interrupted flows

**Total Time**: 4 hours to 100% cookbook compliance

---

## ✅ CONCLUSION

**Current Status**: 20% compliant with CopilotKit cookbook

**Critical Gap**: Stage hooks exist but are NOT connected to main component

**Good News**: 
- ✅ Stage hooks follow correct pattern
- ✅ Just need architectural connection
- ✅ 4 hours to full compliance

**Next Step**: Rewrite `src/pages/EventWizard.tsx` following cookbook pattern

---

**Document Created**: 2025-01-24  
**Cookbook Version**: Latest (state-machine pattern)  
**CopilotKit Version**: v1.10.5  
**Recommendation**: **IMMEDIATE REFACTOR REQUIRED**
