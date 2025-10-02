# Stage 2: Build Car → Build Event - Analysis & Improvements

## Current File: `02-use-stage-build-car.tsx`

### Current Implementation Issues
1. **Car inventory system** - Completely wrong context
2. **ShowCar components** - Need event display components
3. **Complex selection logic** - Overcomplicated for events
4. **No event-specific features** - Missing date, venue, type
5. **Poor stage naming** - "buildCar" doesn't fit

### Required Changes for Event Wizard

#### 1. Complete Refactor
```typescript
// FROM: useStageBuildCar
// TO: useStageBuildEvent

// Update stage progression
setStage("sellFinancing") → setStage("offerTicketing")
```

#### 2. Event Data Structure
```typescript
interface EventDetails {
  // Basic Info
  title: string;
  type: 'fashion_show' | 'popup' | 'exhibition' | 'launch';
  description?: string;
  
  // Timing
  date: Date;
  startTime: string;
  endTime: string;
  timezone: string;
  
  // Style
  theme?: string;
  dresscode?: string;
  tags: string[];
}
```

#### 3. New UI Components
```typescript
// Replace ShowCar with EventBuilder
<EventBuilder
  status={status}
  organizerInfo={organizerInfo}
  onSubmit={(eventDetails) => {
    setEventDetails(eventDetails);
    respond?.("Event details configured successfully");
    setStage("offerTicketing");
  }}
/>

// Event Type Selection Cards (Breef-style)
<EventTypeCards
  types={[
    { id: 'fashion_show', label: 'Fashion Show', icon: '👗' },
    { id: 'popup', label: 'Pop-up Shop', icon: '🛍️' },
    { id: 'exhibition', label: 'Exhibition', icon: '🎨' },
    { id: 'launch', label: 'Launch Party', icon: '🥂' }
  ]}
  selected={eventType}
  onSelect={setEventType}
/>
```

#### 4. Simplified Actions
```typescript
useCopilotAction({
  name: "configureEvent",
  description: "Set up event details",
  available: stage === "buildEvent" ? "enabled" : "disabled",
  parameters: [
    { name: "title", type: "string", required: true },
    { name: "type", type: "string", required: true },
    { name: "date", type: "string", required: true },
    { name: "description", type: "string", required: false }
  ],
  handler: async ({ title, type, date, description }) => {
    // AI can help fill in details
    const enhancedDescription = description || 
      await generateEventDescription(title, type);
    
    setEventDetails({
      title,
      type,
      date: new Date(date),
      description: enhancedDescription
    });
    
    return "Event details saved. Moving to ticketing setup.";
  }
});
```

#### 5. AI-Powered Assistance
```typescript
// Add AI suggestions
useCopilotAction({
  name: "suggestEventDetails",
  description: "Generate event suggestions based on brand",
  available: stage === "buildEvent" ? "enabled" : "disabled",
  handler: async () => {
    const suggestions = await generateEventSuggestions(brandInfo);
    return {
      title: suggestions.title,
      description: suggestions.description,
      recommendedDate: suggestions.optimalDate,
      expectedAttendance: suggestions.projectedAttendance
    };
  }
});
```

### Visual Updates (Breef-style)

#### Event Type Selection
```css
.event-type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.event-type-card {
  padding: 24px;
  background: white;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.event-type-card:hover {
  border-color: #E85C2B;
}

.event-type-card.selected {
  border-color: #E85C2B;
  background: #FFF5F0;
}
```

#### Date/Time Picker
```css
.datetime-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.date-picker {
  padding: 14px 16px;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
}
```

### Implementation Tasks

1. **Remove all car-related code**
   - Delete ShowCar components
   - Remove cars data structure
   - Clean up car selection logic

2. **Create event components**
   - EventTypeCards
   - EventDatePicker
   - EventDescriptionField
   - EventPreview

3. **Update CopilotKit integration**
   - New actions for event configuration
   - AI description generation
   - Smart date suggestions

4. **Add validation**
   - Future date requirement
   - Title uniqueness check
   - Capacity vs venue validation

### Success Metrics
- Event creation time < 45 seconds
- AI description usage > 70%
- Form abandonment < 5%
- User edits to AI content < 30%
