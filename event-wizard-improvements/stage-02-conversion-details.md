# Stage 2 Conversion: Event Setup
## File: 02-use-stage-build-car.tsx → 02-use-stage-event-setup.tsx

---

## CONVERSION CHECKLIST

### 1. File Rename
- [ ] Rename to `02-use-stage-event-setup.tsx`

### 2. Complete Import Overhaul
```typescript
// REMOVE ALL
import { ShowCar, ShowCars } from "@/components/generative-ui/show-car";
import { Car, cars } from "@/lib/types";

// ADD NEW
import { EventBuilder } from "@/components/generative-ui/event-builder";
import { EventTypeSelector } from "@/components/generative-ui/event-type-selector";
import { EventPreview } from "@/components/generative-ui/event-preview";
import { AIContentGenerator } from "@/services/ai-content";
import { EventTemplate } from "@/lib/event-types";
```

### 3. Function Replacement
```typescript
// CURRENT
export function useStageBuildCar()

// NEW
export function useStageEventSetup()
```

### 4. State Variables Update
```typescript
// CURRENT
const { setSelectedCar, stage, setStage } = useGlobalState();

// NEW
const { 
  setEventDetails,
  setEventType,
  organizerInfo,
  brandInfo,
  stage, 
  setStage 
} = useGlobalState();
```

### 5. Remove All Car Logic
```typescript
// DELETE ENTIRE BLOCKS:
- useCopilotReadable for cars
- showCar action
- showMultipleCars action
- All car-related handlers
```

### 6. New AI Instructions
```typescript
useCopilotAdditionalInstructions({
  instructions: `
    CURRENT STATE: Creating fashion event details.
    
    START MESSAGE: "Excellent! Now let's create your event. What type of fashion event are you planning?"
    
    GUIDANCE:
    1. Show event type options immediately
    2. Use AI to generate descriptions
    3. Suggest optimal dates based on fashion calendar
    4. Keep momentum - don't over-ask
    
    EVENT TYPES:
    - Fashion Show: Runway presentations
    - Pop-up Shop: Temporary retail experience
    - Exhibition: Art/fashion showcase
    - Launch Party: Product/collection debut
    
    AFTER TYPE SELECTION: "Great choice! What would you like to call your [event type]?"
  `,
  available: stage === "eventSetup" ? "enabled" : "disabled"
});
```

### 7. Event Type Selection Action
```typescript
useCopilotAction({
  name: "selectEventType",
  description: "Let user choose event type",
  available: stage === "eventSetup" ? "enabled" : "disabled",
  renderAndWaitForResponse: ({ status, respond }) => {
    return (
      <EventTypeSelector
        status={status}
        options={[
          { id: 'fashion_show', label: 'Fashion Show', icon: '👗', description: 'Runway & presentations' },
          { id: 'popup', label: 'Pop-up Shop', icon: '🛍️', description: 'Temporary retail space' },
          { id: 'exhibition', label: 'Exhibition', icon: '🎨', description: 'Showcase & gallery' },
          { id: 'launch', label: 'Launch Party', icon: '🥂', description: 'Product debuts' }
        ]}
        onSelect={(type) => {
          setEventType(type);
          respond?.(`User selected ${type}. Now collecting event details.`);
        }}
      />
    );
  }
});
```

### 8. Event Details Builder Action
```typescript
useCopilotAction({
  name: "buildEventDetails",
  description: "Configure event information",
  available: stage === "eventSetup" ? "enabled" : "disabled",
  parameters: [
    { name: "title", type: "string", required: true },
    { name: "date", type: "string", required: true },
    { name: "startTime", type: "string", required: true },
    { name: "description", type: "string", required: false }
  ],
  renderAndWaitForResponse: ({ args, status, respond }) => {
    return (
      <EventBuilder
        status={status}
        eventType={eventType}
        brandInfo={brandInfo}
        initialData={args}
        onSubmit={async (details) => {
          // Enhance with AI if needed
          if (!details.description) {
            details.description = await AIContentGenerator.generateDescription(details);
          }
          
          setEventDetails(details);
          respond?.("Event details configured! Moving to ticketing.");
          setStage("ticketSetup");
        }}
      />
    );
  }
});
```

### 9. AI Enhancement Actions
```typescript
useCopilotAction({
  name: "generateEventDescription",
  description: "AI generates compelling event description",
  available: stage === "eventSetup" ? "enabled" : "disabled",
  handler: async ({ title, type }) => {
    const description = await AIContentGenerator.generateDescription({
      title,
      type,
      brand: brandInfo?.name,
      style: brandInfo?.description
    });
    
    return {
      description,
      keywords: AIContentGenerator.extractKeywords(description),
      readingTime: Math.ceil(description.split(' ').length / 200)
    };
  }
});

useCopilotAction({
  name: "suggestOptimalDate",
  description: "AI suggests best event dates",
  available: stage === "eventSetup" ? "enabled" : "disabled",
  handler: async () => {
    const suggestions = await AIContentGenerator.analyzeDates({
      eventType,
      location: organizerInfo?.city,
      avoidDates: ['fashion_week', 'major_holidays']
    });
    
    return suggestions.map(date => ({
      date: date.date,
      reasoning: date.reason,
      competition: date.competingEvents,
      score: date.optimalityScore
    }));
  }
});
```

### 10. New Data Types
```typescript
interface EventDetails {
  title: string;
  type: 'fashion_show' | 'popup' | 'exhibition' | 'launch';
  date: Date;
  startTime: string;
  endTime: string;
  timezone: string;
  description: string;
  theme?: string;
  dressCode?: string;
  hashtags: string[];
  expectedAttendance?: number;
  aiGenerated?: {
    description: boolean;
    suggestions: string[];
  };
}
```

---

## NEW COMPONENTS NEEDED

### EventTypeSelector Component
```tsx
// Clean grid of 4 cards (2x2 on desktop, 2x2 on mobile)
// Each card: Icon, Title, Subtitle
// Hover: Border color change to orange
// Selected: Orange border + light background
```

### EventBuilder Component
```tsx
// Form sections:
// 1. Event name (large input)
// 2. Date picker (calendar widget)
// 3. Time selector (start/end dropdowns)
// 4. Description (textarea with AI button)
// 5. Theme/style (optional tags)