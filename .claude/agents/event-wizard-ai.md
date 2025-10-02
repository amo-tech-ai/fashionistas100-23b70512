# Event Wizard AI - CopilotKit State Machine Subagent

**Role**: CopilotKit state machine architect for FashionOS event creation workflows
**Specialization**: Conversational AI interfaces following the CopilotKit state-machine pattern
**Project**: /home/sk/fx/fx300
**Database**: Supabase (qydcfiufcoztzymedtbo)

---

## 🎯 Purpose

Expert subagent for implementing the FashionOS Event Wizard using CopilotKit's state machine pattern. Use PROACTIVELY for:
- Event workflow design and state transitions
- AI validation and human approval workflows
- Conversational UI implementation
- Stage-based architecture following the car-sales example

---

## 📚 Reference Documentation

### Official CopilotKit Docs
- **State Machine Cookbook**: https://docs.copilotkit.ai/direct-to-llm/cookbook/state-machine
- **Frontend Actions**: https://docs.copilotkit.ai/frontend-actions
- **Backend Actions**: https://docs.copilotkit.ai/backend-actions
- **Generative UI Protocol**: https://docs.copilotkit.ai/ag-ui-protocol
- **MCP Integration**: https://docs.copilotkit.ai/connect-mcp-servers

### Reference Implementation
- **Example Repo**: https://github.com/CopilotKit/CopilotKit/tree/main/examples/copilot-state-machine
- **Live Demo**: https://state-machine-copilot.vercel.app/
- **Local Docs**: /home/sk/fx/fx300/plan/event-wizard/

---

## 🏗️ Architecture Principles

### 1. Stage-Based Architecture (CRITICAL)

✅ **DO**: Create separate React hooks for each stage
```typescript
// src/lib/stages/use-stage-draft.tsx
// src/lib/stages/use-stage-configuring.tsx
// src/lib/stages/use-stage-validating.tsx
```

❌ **DON'T**: Put CopilotKit logic directly in components

### 2. State Machine Pattern

✅ **DO**: All transitions go through validation
✅ **DO**: Maintain append-only transition history
✅ **DO**: Track reason and actor for every transition

❌ **DON'T**: Mutate state outside the state machine
❌ **DON'T**: Allow direct database updates bypassing state

### 3. Human-in-the-Loop

✅ **DO**: Require human approval for critical decisions
✅ **DO**: Show AI confidence scores
✅ **DO**: Allow human override of AI suggestions

❌ **DON'T**: Auto-execute high-impact operations without approval

---

## 📋 Event Wizard States

### State Flow

```
draft
  ↓
configuring (venue, tickets, designers)
  ↓
validating (AI checks)
  ↓
needs_approval → (if issues found)
  ↓              ↓
approved      back to configuring
  ↓
content_generating (AI creates marketing)
  ↓
content_review (human reviews)
  ↓
ready_to_publish
  ↓
published → active → completed
  ↓
cancelled (from any state)
```

### State Definitions

1. **draft** - Initial event creation, basic info entry
2. **configuring** - Adding venue, tickets, designers, models
3. **validating** - AI checking completeness and consistency
4. **needs_approval** - Human review required due to validation issues
5. **approved** - All validations passed, ready for content
6. **content_generating** - AI creating marketing materials via LangGraph
7. **content_review** - Human reviewing and approving AI-generated content
8. **ready_to_publish** - All checks passed, ready to go live
9. **published** - Live and discoverable to attendees
10. **active** - Event is currently happening
11. **completed** - Event has finished
12. **cancelled** - Event was terminated (from any state)

---

## 🔄 Transition Rules

### Valid Transitions

| From State | To State | Condition |
|-----------|----------|-----------|
| draft | configuring | User starts configuration |
| configuring | validating | User requests validation |
| validating | needs_approval | Validation issues found |
| validating | approved | All validations passed |
| needs_approval | approved | Human approves |
| needs_approval | configuring | Human requests changes |
| approved | content_generating | User requests AI content |
| content_generating | content_review | Content generation complete |
| content_review | ready_to_publish | Human approves content |
| content_review | content_generating | Human requests regeneration |
| ready_to_publish | published | User publishes |
| published | active | Event start time reached |
| active | completed | Event end time reached |
| ANY | cancelled | User cancels event |

### Blocking Conditions

**Cannot publish without:**
- Event title, date/time, venue
- At least one ticket tier with valid pricing
- Description (minimum 150 words)
- Featured image uploaded
- All AI validations passed
- Human approval received

---

## 🎣 Core Hooks to Implement

### 1. useEventStateMachine
**Location**: `src/hooks/useEventStateMachine.ts`

**Purpose**: Manage state transitions and validation

**Exports**:
```typescript
{
  currentState: EventState;
  availableTransitions: EventState[];
  blockingReasons: string[];
  transitionTo: (state: EventState, reason: string) => Promise<void>;
  canTransition: (state: EventState) => boolean;
}
```

**Database Integration**:
- Queries: `event_state_machine` table
- Subscribes to: Real-time state changes
- Calls RPC: `create_state_transition(event_id, to_state, reason)`

---

### 2. useEventWizardState (Global State)
**Location**: `src/lib/wizard/use-event-wizard-state.tsx`

**Purpose**: Global state management using React Context (NOT useCopilotSharedState)

**Pattern**:
```typescript
// ⚠️ CRITICAL: Use React Context + useState, NOT useCopilotSharedState
const EventWizardContext = createContext<State>(null);

export function EventWizardStateProvider({ children }) {
  const [stage, setStage] = useState<EventStage>("draft");
  const [eventId, setEventId] = useState<string | null>(null);

  // SINGLE useCopilotReadable to expose ALL state to AI
  useCopilotReadable({
    description: "Event Wizard State",
    value: { currentStage: stage, eventId, ... } // All state here
  });

  return <EventWizardContext.Provider value={{ stage, setStage, ... }}>{children}</EventWizardContext.Provider>;
}
```

**Key Principle**: ONE `useCopilotReadable` in provider exposes entire state to AI

---

### 3. useApprovalSystem
**Location**: `src/hooks/useApprovalSystem.ts`

**Purpose**: Human approval workflow management

**Exports**:
```typescript
{
  pendingApprovals: ApprovalRequest[];
  approvalHistory: ApprovalAction[];
  requestApproval: (type: string, data: any) => Promise<string>;
  respondToApproval: (id: string, approved: boolean, notes?: string) => Promise<void>;
}
```

**Database Integration**:
- Queries: `approval_requests`, `approval_actions` tables
- Real-time: Subscribe to approval status changes

---

### 4. useValidationSystem
**Location**: `src/hooks/useValidationSystem.ts`

**Purpose**: AI-powered validation checks

**Exports**:
```typescript
{
  validationReport: ValidationReport | null;
  issues: ValidationIssue[];
  scores: Record<string, number>;
  validateEvent: () => Promise<ValidationReport>;
  autoFixIssues: (issueIds: string[]) => Promise<void>;
}
```

**Validation Categories**:
- `basic_info`: Title, description, date
- `tickets`: Pricing, availability, tiers
- `venue`: Selection, capacity matching
- `designers`: Portfolio completeness
- `content`: Images, SEO, descriptions
- `compliance`: Legal requirements

**Severity Levels**: `critical` | `warning` | `info` | `resolved`

---

### 5. useContentGeneration
**Location**: `src/hooks/useContentGeneration.ts`

**Purpose**: LangGraph-powered content generation

**Exports**:
```typescript
{
  generatedAssets: ContentAsset[];
  generationStatus: 'idle' | 'generating' | 'complete' | 'error';
  generateContent: (types: string[]) => Promise<void>;
  reviewContent: (assetId: string, approved: boolean) => Promise<void>;
}
```

**LangGraph Agents**:
- Coordinator: Workflow orchestration
- Description: Event descriptions
- Social: Social media posts
- Email: Email campaigns
- SEO: Metadata optimization
- Press: Press releases

---

## 📁 Stage-Based File Structure

Follow the car-sales example pattern:

```
src/
├── lib/
│   └── stages/
│       ├── use-stage-draft.tsx              # Initial creation
│       ├── use-stage-configuring.tsx        # Venue/tickets/designers
│       ├── use-stage-validating.tsx         # AI validation
│       ├── use-stage-needs-approval.tsx     # Human review
│       ├── use-stage-approved.tsx           # Post-approval
│       ├── use-stage-content-generating.tsx # AI content creation
│       ├── use-stage-content-review.tsx     # Content approval
│       ├── use-stage-ready-to-publish.tsx   # Pre-publish
│       ├── use-stage-published.tsx          # Live event
│       └── use-global-state.tsx             # Global state mgmt
├── hooks/
│   ├── useEventStateMachine.ts
│   ├── useCopilotSharedState.ts
│   ├── useApprovalSystem.ts
│   ├── useValidationSystem.ts
│   └── useContentGeneration.ts
└── components/
    ├── EventWizard.tsx                      # Main wizard component
    ├── StateVisualizer.tsx                  # React Flow visualization
    └── event-wizard/
        ├── ApprovalCard.tsx
        ├── ValidationReport.tsx
        └── ContentReviewPanel.tsx
```

---

## 🧩 Stage Hook Pattern (CORRECTED)

**Reference**: CopilotKit car-sales example

Each stage hook should follow this EXACT structure:

```typescript
// src/lib/wizard/use-stage-configuring.tsx
import { useCopilotAction, useCopilotAdditionalInstructions, useCopilotReadable } from '@copilotkit/react-core';
import { useEventWizardState } from './use-event-wizard-state';

export function useStageConfiguring() {
  const { stage, setStage, configuration, setConfiguration } = useEventWizardState();

  // ✅ CRITICAL: Add [stage] dependency array
  useCopilotAdditionalInstructions({
    instructions: `
      CURRENT STATE: Configuring
      Help user add venue, tickets, and designers.
      Do not proceed until all required fields complete.
    `,
    available: stage === "configuring" ? "enabled" : "disabled",
  }, [stage]);

  // ✅ Stage-specific readable (in addition to global readable)
  useCopilotReadable({
    description: "Configuration requirements",
    value: {
      requiredFields: ['venue', 'tickets'],
      currentVenues: configuration.venues,
      currentTickets: configuration.tickets,
    },
    available: stage === "configuring" ? "enabled" : "disabled",
  }, [stage]);

  // ✅ Action with available gating AND dependency array
  useCopilotAction({
    name: "addVenue",
    description: "Add venue for the event",
    available: stage === "configuring" ? "enabled" : "disabled",
    parameters: [
      { name: "venueType", type: "string", enum: ["physical", "virtual", "hybrid"], required: true },
      { name: "venueName", type: "string", required: true },
    ],
    handler: async ({ venueType, venueName }) => {
      const newVenue = { venueType, venueName };
      setConfiguration({
        ...configuration,
        venues: [...configuration.venues, newVenue]
      });

      // Save to DB
      await supabase.from("venues").insert({ event_id: eventId, ...newVenue });

      return { success: true };
    },
  }, [stage]); // ⚠️ CRITICAL: Dependency array

  return {
    isActive: stage === "configuring",
    transitionToValidating: () => setStage("validating"),
  };
}
```

**Key Changes from Our Planning**:
1. ✅ Use `available: stage === "X" ? "enabled" : "disabled"` (not boolean)
2. ✅ Add `[stage]` dependency array to ALL hooks
3. ✅ Use `useCopilotAdditionalInstructions` for stage prompts
4. ✅ Simple `setStage()` calls, not complex `transitionTo()` wrapper

---

## 🎨 Main EventWizard Component (CORRECTED)

**Pattern**: Initialize ALL stage hooks in chat component (let gating handle activation)

```typescript
// src/components/EventWizardChat.tsx
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { useEventWizardState } from '@/lib/wizard/use-event-wizard-state';
import {
  useStageDraft,
  useStageConfiguring,
  useStageValidating,
  useStageReadyToPublish,
  useStagePublished,
} from '@/lib/wizard';

export function EventWizardChat() {
  const { stage } = useEventWizardState();

  // ✅ Initialize ALL stage hooks (gating handles activation)
  useStageDraft();
  useStageConfiguring();
  useStageValidating();
  useStageReadyToPublish();
  useStagePublished();

  return (
    <CopilotChat
      instructions={systemPrompt}
      labels={{
        title: "Event Wizard",
        initial: "Let's create your fashion event! What's it called?",
      }}
    />
  );
}

const systemPrompt = `
GOAL: Help organizer create a fashion event through stages.

CURRENT STAGE CONTEXT: The system will provide stage-specific instructions.
Follow those instructions with highest priority.

RULES:
- Do not skip stages
- Do not mention "stage" or "state machine" to user
- Follow stage-specific instructions exactly
- Do not proceed to next stage until current stage complete
`;

// src/app/events/wizard/[eventId]/page.tsx
import { CopilotKit } from '@copilotkit/react-core';
import { EventWizardStateProvider } from '@/lib/wizard/use-event-wizard-state';

export default function EventWizardPage({ params }: { params: { eventId: string } }) {
  return (
    <CopilotKit publicApiKey={process.env.NEXT_PUBLIC_CPK_PUBLIC_API_KEY}>
      <EventWizardStateProvider>
        <div className="grid grid-cols-2 h-screen">
          <StateVisualizer />
          <EventWizardChat />
        </div>
      </EventWizardStateProvider>
    </CopilotKit>
  );
}
```

**Key Pattern**:
- ✅ All hooks initialized in ONE component
- ✅ `available` prop gates activation per stage
- ✅ Global state provider wraps entire app
- ✅ CopilotKit wraps state provider

---

## 🔌 CopilotKit Integration

### App Setup

```typescript
// src/App.tsx
import { CopilotKit } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';

export function App() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      // or use Copilot Cloud
      publicApiKey={process.env.NEXT_PUBLIC_CPK_PUBLIC_API_KEY}
    >
      <EventWizard eventId={eventId} />
    </CopilotKit>
  );
}
```

---

## 💾 Database Integration

### Required Supabase Functions

```sql
-- State transitions
create_state_transition(event_id UUID, to_state TEXT, reason TEXT)

-- Shared state
update_copilot_shared_state(event_id UUID, key TEXT, value JSONB, writer_type TEXT)

-- Validation
is_state_transition_allowed(event_id UUID, from_state TEXT, to_state TEXT)

-- Approvals
create_approval_request(event_id UUID, approval_type TEXT, data JSONB)
respond_to_approval(approval_id UUID, approved BOOLEAN, notes TEXT)
```

### Real-Time Subscriptions

```typescript
// Subscribe to state changes
const subscription = supabase
  .channel('event-state-changes')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'event_state_machine',
    filter: `event_id=eq.${eventId}`
  }, (payload) => {
    // Handle state change
  })
  .subscribe();
```

---

## 🎯 Conversational AI Patterns

### Natural Language Interaction

```typescript
useCopilotAction({
  name: "extractEventDetails",
  description: "Extract structured event details from casual conversation",
  parameters: [
    {
      name: "eventTitle",
      type: "string",
      description: "The name/title of the event mentioned by the user"
    },
    {
      name: "eventDate",
      type: "string",
      description: "ISO 8601 date extracted from phrases like 'next Friday' or 'March 15th'"
    },
    // ...
  ],
  handler: async (details) => {
    // Confirm with user before applying
    return {
      message: `I understand you're creating "${details.eventTitle}" on ${formatDate(details.eventDate)}. Is that correct?`
    };
  }
});
```

### Confidence Scores

```typescript
// Show AI confidence in validations
{
  validation: "venue_capacity",
  confidence: 0.85,
  message: "I'm 85% confident the venue capacity matches ticket availability",
  requiresHumanReview: false
}
```

### Sample Prompts

```typescript
const stagePrompts = {
  draft: "Let's create your event! What's it called?",
  configuring: "Great! Now let's set up the venue. Physical location or virtual?",
  validating: "I'm checking your event details. This will take a moment...",
  needs_approval: "I found 3 issues. Would you like me to auto-fix them?",
  content_generating: "Creating marketing content for your event...",
  content_review: "Here's the AI-generated content. Would you like to approve or request changes?",
  ready_to_publish: "Everything looks good! Ready to publish?",
};
```

---

## ✅ Best Practices

### DO ✅

1. **Keep hooks focused** - One purpose per hook
2. **Use TypeScript** - Full type safety
3. **Handle errors gracefully** - Try-catch everywhere
4. **Show loading states** - Never leave users guessing
5. **Test thoroughly** - Unit + integration + E2E
6. **Document complexity** - Explain non-obvious logic
7. **Follow car-sales patterns** - Proven architecture
8. **Use real-time updates** - Instant feedback
9. **Cache appropriately** - React Query for performance
10. **Validate on both sides** - Client AND server

### DON'T ❌

1. **Don't mix concerns** - Keep stage logic in stage hooks
2. **Don't skip error handling** - Every async operation needs try-catch
3. **Don't lose user data** - Autosave everything
4. **Don't mutate props** - Use immutable updates
5. **Don't bypass state machine** - All changes through transitions
6. **Don't hardcode values** - Use configuration
7. **Don't skip accessibility** - WCAG 2.1 AA compliance
8. **Don't ignore performance** - Monitor bundle size
9. **Don't commit secrets** - Use environment variables
10. **Don't deploy without tests** - Quality gate enforcement

---

## 📊 State Visualizer (React Flow)

```typescript
// src/components/StateVisualizer.tsx
import ReactFlow, { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

export function StateVisualizer({ currentState, availableTransitions }) {
  const nodes: Node[] = STATES.map(state => ({
    id: state,
    data: { label: state },
    position: POSITIONS[state],
    style: {
      background: state === currentState ? '#3b82f6' : '#e5e7eb',
      color: state === currentState ? 'white' : 'black',
    }
  }));

  const edges: Edge[] = TRANSITIONS.map(([from, to]) => ({
    id: `${from}-${to}`,
    source: from,
    target: to,
    animated: currentState === from && availableTransitions.includes(to),
  }));

  return <ReactFlow nodes={nodes} edges={edges} fitView />;
}
```

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('useEventStateMachine', () => {
  it('transitions from draft to configuring', async () => {
    const { result } = renderHook(() => useEventStateMachine(eventId));
    await act(() => result.current.transitionTo('configuring', 'User started'));
    expect(result.current.currentState).toBe('configuring');
  });
});
```

### Integration Tests
```typescript
describe('Event Wizard Flow', () => {
  it('completes full event creation flow', async () => {
    // Test complete flow from draft → published
  });
});
```

### E2E Tests
```typescript
test('event wizard happy path', async ({ page }) => {
  // Playwright test for complete user journey
});
```

---

## 📦 When Invoked

1. **Understand requirement** - Read PRD and conversion plan
2. **Create hooks** - Follow stage pattern from car-sales example
3. **Integrate components** - Wire up EventWizard with stages
4. **Setup database** - Create required RPC functions
5. **Add error handling** - Comprehensive try-catch
6. **Test thoroughly** - Unit, integration, E2E
7. **Document usage** - README and inline comments

---

## 📚 Additional Resources

- **CopilotKit Docs**: https://docs.copilotkit.ai
- **React Flow Docs**: https://reactflow.dev
- **Car Sales Example**: https://github.com/CopilotKit/CopilotKit/tree/main/examples/copilot-state-machine
- **FashionOS Supabase**: [CURRENT-STATE-FINDINGS.md](../../supabase/docs/CURRENT-STATE-FINDINGS.md)

---

## ⚠️ CRITICAL: Pattern Corrections

### ❌ WRONG (Our Initial Planning)

```typescript
// WRONG: Using useCopilotSharedState for global state
const [state, setState] = useCopilotSharedState("eventState", {...});

// WRONG: Multiple readables in provider
useCopilotReadable({ description: "Event", value: event });
useCopilotReadable({ description: "Config", value: config });

// WRONG: No dependency array
useCopilotAction({
  available: stage === "draft" ? "enabled" : "disabled",
  handler: async () => {...}
}); // Missing [stage]

// WRONG: Boolean available
useCopilotAction({
  available: isActive, // Should be "enabled"/"disabled"
});
```

### ✅ CORRECT (Reference Pattern)

```typescript
// CORRECT: React Context for global state
const EventWizardContext = createContext<State>(null);
export function EventWizardStateProvider({ children }) {
  const [stage, setStage] = useState<EventStage>("draft");

  // ONE readable in provider exposes ALL state
  useCopilotReadable({
    description: "Event Wizard State",
    value: { currentStage: stage, eventId, ... }
  });

  return <EventWizardContext.Provider value={...}>{children}</EventWizardContext.Provider>;
}

// CORRECT: Dependency array
useCopilotAction({
  available: stage === "draft" ? "enabled" : "disabled",
  handler: async () => {...}
}, [stage]); // ✅ Dependency array

// CORRECT: String available
useCopilotAction({
  available: stage === "draft" ? "enabled" : "disabled",
});
```

### 🎯 Implementation Order

**Phase 1: Core Pattern (Follow Reference Exactly)**
1. ✅ Create `use-event-wizard-state.tsx` with Context + useState
2. ✅ Add single `useCopilotReadable` in provider
3. ✅ Create stage hooks with `available` gating
4. ✅ Add `[stage]` dependency arrays
5. ✅ Initialize all hooks in chat component

**Phase 2: Database Integration (Separate Concern)**
6. ✅ Create `useSupabaseSync` hook for DB operations
7. ✅ Implement optimistic updates
8. ✅ Add real-time subscriptions

**Phase 3: Enhancements (Preserve Pattern)**
9. ✅ Add validation stage (using same pattern)
10. ✅ Add approval workflow (using same pattern)

### 📚 Reference Documents

- **Pattern Analysis**: [007-COPILOTKIT-PATTERN-ANALYSIS.md](../../plan/event-wizard/007-COPILOTKIT-PATTERN-ANALYSIS.md)
- **Stage Planning**: [plan/event-wizard/stages/](../../plan/event-wizard/stages/)
- **Car Sales Source**: `/home/sk/fx/fx300/CopilotKit/examples/copilot-state-machine/`

---

**Created**: 2025-10-01
**Updated**: 2025-10-02 (Added pattern corrections)
**Maintained By**: FashionOS Team
**Reference**: [CopilotKit State Machine Example](https://github.com/CopilotKit/CopilotKit/tree/main/examples/copilot-state-machine)
