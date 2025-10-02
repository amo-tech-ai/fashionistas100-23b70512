# Stage 1: Get Contact Info - Analysis & Improvements

## Current File: `01-use-stage-get-contact-info.tsx`

### Current Implementation Issues
1. **Car dealership context** - References "buildCar" as next stage
2. **Generic contact form** - Not tailored for event organizers
3. **Limited data collection** - Only name, email, phone
4. **No validation** - Missing input validation
5. **Poor UX messaging** - Generic instructions

### Required Changes for Event Wizard

#### 1. Rename & Refactor
```typescript
// FROM: useStageGetContactInfo
// TO: useStageGetOrganizerInfo

// Update stage progression
setStage("buildCar") → setStage("buildEvent")
```

#### 2. Enhanced Data Collection
```typescript
interface OrganizerInfo {
  // Basic Info
  name: string;
  email: string;
  phone?: string;
  
  // Event-Specific
  organization?: string;
  role: 'organizer' | 'designer' | 'brand' | 'agency';
  eventHistory?: 'first_time' | 'experienced';
  source?: 'google' | 'social' | 'referral';
}
```

#### 3. Breef-Style UI Component
```typescript
// New component: OrganizerInfoCard
<OrganizerInfoCard
  status={status}
  onSubmit={(info) => {
    setOrganizerInfo(info);
    respond?.("Organizer info collected successfully");
    setStage("buildEvent");
  }}
/>
```

#### 4. Improved Instructions
```typescript
useCopilotAdditionalInstructions({
  instructions: `
    CURRENT STATE: Getting event organizer information.
    
    GREETING: "Welcome to FashionOS! Let's create your fashion event in under 3 minutes."
    
    APPROACH:
    1. Be warm and encouraging
    2. Ask for essential info only
    3. Mention we'll auto-import brand details
    4. Keep it conversational
    
    EXAMPLE: "Hi! I'm here to help you create your fashion event. What's your name?"
  `,
  available: stage === "getOrganizerInfo" ? "enabled" : "disabled"
});
```

#### 5. Auto-Import Feature
```typescript
// Add after email collection
const autoImportBrandData = async (email: string) => {
  const domain = email.split('@')[1];
  if (domain && !domain.includes('gmail') && !domain.includes('yahoo')) {
    // Fetch brand data from domain
    const brandData = await fetchBrandFromDomain(domain);
    if (brandData) {
      setBrandInfo(brandData);
      return true;
    }
  }
  return false;
};
```

### Visual Design Updates

#### Card Layout (Breef-style)
```css
.organizer-card {
  background: white;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  padding: 32px;
  max-width: 640px;
}

.input-group {
  margin-bottom: 24px;
}

.input-field {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  font-size: 16px;
}

.input-field:focus {
  border-color: #E85C2B;
  outline: none;
}
```

### Implementation Priority
1. **High**: Rename functions and update stage flow
2. **High**: Create new OrganizerInfoCard component
3. **Medium**: Add brand auto-import logic
4. **Medium**: Update CopilotKit instructions
5. **Low**: Add analytics tracking

### Success Metrics
- Form completion rate > 95%
- Time to complete < 30 seconds
- Auto-import success rate > 60%
- User satisfaction score > 4.5/5
