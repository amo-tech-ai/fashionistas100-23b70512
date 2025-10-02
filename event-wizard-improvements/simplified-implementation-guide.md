# CopilotKit Event Wizard - Simplified Implementation Guide

## ✅ CORRECT APPROACH (Based on Analysis)

### 1. **Simplified Database Schema**
Instead of 6 tables, use just 2:

```sql
-- Main session table
CREATE TABLE wizard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  
  -- Single source of truth for stage
  current_stage VARCHAR(50) DEFAULT 'organizerSetup',
  completed_stages TEXT[] DEFAULT '{}',
  
  -- Store each stage's data separately
  organizer_data JSONB DEFAULT '{}',
  event_data JSONB DEFAULT '{}', 
  ticket_data JSONB DEFAULT '{}',
  venue_data JSONB DEFAULT '{}',
  payment_data JSONB DEFAULT '{}',
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'draft',
  event_id UUID REFERENCES events(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Action logging (optional)
CREATE TABLE wizard_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) REFERENCES wizard_sessions(session_id),
  action VARCHAR(100),
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. **CopilotKit Best Practices**

#### ✅ DO THIS:
```typescript
// Single state management hook
export function useWizardState() {
  const [session, setSession] = useState<WizardSession>();
  
  // One place to track stages
  const stages = [
    'organizerSetup',
    'eventSetup', 
    'ticketSetup',
    'venueSetup',
    'paymentSetup',
    'reviewPublish'
  ];
  
  // Clear stage transitions
  const nextStage = () => {
    const currentIndex = stages.indexOf(session.currentStage);
    if (currentIndex < stages.length - 1) {
      setStage(stages[currentIndex + 1]);
    }
  };
}
```

#### ❌ DON'T DO THIS:
```typescript
// Multiple overlapping state sources
const [conversations, setConversations] = useState();
const [forms, setForms] = useState();  
const [states, setStates] = useState();
const [context, setContext] = useState();
// This creates sync problems!
```

### 3. **Stage Implementation Pattern**

```typescript
// Clean pattern for each stage
export function useStageOrganizerSetup() {
  const { session, updateSession, nextStage } = useWizardState();
  
  // Simple readable for AI
  useCopilotReadable({
    description: "Current organizer data",
    value: session?.organizer_data || {}
  });
  
  // Single action per stage
  useCopilotAction({
    name: "completeOrganizerSetup",
    handler: async (data) => {
      // Validate
      const validated = OrganizerSchema.parse(data);
      
      // Save to session
      await updateSession({
        organizer_data: validated,
        current_stage: 'eventSetup'
      });
      
      // Move forward
      nextStage();
    }
  });
}
```

---

## 🚨 RED FLAGS TO AVOID

### 1. **Over-Engineering**
❌ **Bad:** 6 tables for what's essentially a form wizard
✅ **Good:** 1-2 tables maximum

### 2. **Multiple State Sources**
❌ **Bad:** conversations + forms + states + context tables
✅ **Good:** Single wizard_sessions table

### 3. **Complex Relationships**
❌ **Bad:** Self-referencing foreign keys, unclear relationships
✅ **Good:** Simple user → session → event flow

### 4. **Missing Basics**
❌ **Bad:** No validation, no error handling, no autosave
✅ **Good:** Zod validation, try-catch blocks, localStorage backup

---

## 📋 PRODUCTION CHECKLIST

### Database
- [ ] Use single sessions table
- [ ] Add RLS policies
- [ ] Create update trigger function
- [ ] Add proper indexes

### Frontend
- [ ] One state management hook
- [ ] Validation on each stage
- [ ] Autosave to localStorage
- [ ] Error boundaries

### CopilotKit Integration
- [ ] One readable per stage
- [ ] One main action per stage
- [ ] Clear stage progression
- [ ] Simple AI instructions

---

## 🎯 SIMPLE IS BETTER

### Current Complexity: 🔴 HIGH
- 6 tables
- Overlapping state
- Complex relationships
- High maintenance

### Recommended: 🟢 SIMPLE
- 1-2 tables
- Single state source
- Clear relationships
- Low maintenance

---

## 💡 KEY TAKEAWAY

CopilotKit works best with **simple, clear state management**. Don't over-architect. The wizard just needs to:

1. Track where the user is (current_stage)
2. Save their inputs (stage_data)
3. Move forward/backward (stage transitions)

That's it. Keep it simple.

---

*The provided schema is over-engineered. For a production Event Wizard with CopilotKit, use the simplified approach above.*