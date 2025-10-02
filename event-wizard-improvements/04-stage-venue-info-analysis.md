# Stage 4: Get Financing Info → Get Venue Info - Analysis & Improvements

## Current File: `04-use-stage-get-financing-info.tsx`

### Current Implementation Issues
1. **Financial forms** - Wrong context for venues
2. **Credit score collection** - Inappropriate for events
3. **Loan terms** - Not applicable
4. **No venue features** - Missing location, capacity, amenities
5. **Poor flow** - Goes straight to confirmOrder

### Required Changes for Event Wizard

#### 1. Complete Replacement
```typescript
// FROM: useStageGetFinancingInfo
// TO: useStageGetVenueInfo

// Update stage progression
setStage("confirmOrder") → setStage("setupPayments")
```

#### 2. Venue Data Structure
```typescript
interface VenueInfo {
  // Location
  mode: 'physical' | 'virtual' | 'hybrid';
  venueName?: string;
  venueId?: string;
  
  // Physical Details
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  capacity: number;
  
  // Virtual Details
  platform?: 'zoom' | 'teams' | 'custom';
  virtualUrl?: string;
  maxAttendees?: number;
  
  // Features
  amenities: string[];
  restrictions?: string[];
  parkingAvailable: boolean;
  accessibilityFeatures: string[];
  
  // Schedule
  setupTime?: string;
  eventTime: string;
  teardownTime?: string;
}
```

#### 3. Venue Selection Component
```typescript
// New component: VenueSelector
<VenueSelector
  eventDetails={eventDetails}
  ticketInfo={ticketingInfo}
  onSelect={(venue) => {
    setVenueInfo(venue);
    respond?.("Venue selected successfully");
    setStage("setupPayments");
  }}
/>

// Venue Mode Cards (Breef-style)
<VenueModeCards>
  <ModeCard 
    icon="📍" 
    title="Physical"
    description="In-person event at a venue"
    selected={mode === 'physical'}
  />
  <ModeCard 
    icon="💻" 
    title="Virtual"
    description="Online event with streaming"
    selected={mode === 'virtual'}
  />
  <ModeCard 
    icon="🔄" 
    title="Hybrid"
    description="Both in-person and online"
    selected={mode === 'hybrid'}
  />
</VenueModeCards>
```

#### 4. AI Venue Suggestions
```typescript
useCopilotAction({
  name: "suggestVenues",
  description: "AI suggests suitable venues",
  available: stage === "getVenueInfo" ? "enabled" : "disabled",
  parameters: [
    { name: "city", type: "string", required: true },
    { name: "capacity", type: "number", required: true },
    { name: "eventType", type: "string", required: true }
  ],
  handler: async ({ city, capacity, eventType }) => {
    const venues = await searchVenues({
      location: city,
      minCapacity: capacity,
      type: eventType,
      date: eventDetails.date
    });
    
    return venues.map(v => ({
      name: v.name,
      capacity: v.capacity,
      price: v.rentalPrice,
      available: v.isAvailable,
      amenities: v.features,
      rating: v.rating
    }));
  }
});
```

#### 5. Schedule Builder
```typescript
// Add schedule configuration
interface EventSchedule {
  segments: Array<{
    name: string;
    startTime: string;
    endTime: string;
    description?: string;
  }>;
}

// Default segments by event type
const defaultSchedules = {
  fashion_show: [
    { name: "Doors Open", time: "6:30 PM" },
    { name: "Cocktail Hour", time: "6:30 PM" },
    { name: "Runway Show", time: "7:30 PM" },
    { name: "Designer Meet & Greet", time: "8:30 PM" },
    { name: "After Party", time: "9:00 PM" }
  ],
  popup: [
    { name: "VIP Preview", time: "10:00 AM" },
    { name: "General Opening", time: "12:00 PM" },
    { name: "DJ Set", time: "2:00 PM" },
    { name: "Closing", time: "8:00 PM" }
  ]
};
```

### Visual Design (Breef-style)

#### Venue Mode Selection
```css
.venue-mode-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.mode-card {
  padding: 32px;
  background: white;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-card:hover {
  border-color: #E85C2B;
}

.mode-card.selected {
  border-color: #E85C2B;
  background: #FFF5F0;
}

.mode-icon {
  font-size: 32px;
  margin-bottom: 12px;
}
```

#### Venue Search Results
```css
.venue-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
}

.venue-item {
  padding: 16px;
  border-bottom: 1px solid #F5F5F5;
  cursor: pointer;
  transition: background 0.2s;
}

.venue-item:hover {
  background: #FAF8F5;
}

.venue-capacity {
  display: inline-block;
  padding: 4px 8px;
  background: #E85C2B;
  color: white;
  border-radius: 4px;
  font-size: 12px;
}
```

#### Schedule Timeline
```css
.schedule-timeline {
  position: relative;
  padding-left: 40px;
}

.timeline-item {
  position: relative;
  padding-bottom: 24px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -40px;
  top: 8px;
  width: 8px;
  height: 8px;
  background: #E85C2B;
  border-radius: 50%;
}

.timeline-item::after {
  content: '';
  position: absolute;
  left: -36px;
  top: 16px;
  width: 1px;
  height: calc(100% - 8px);
  background: #E5E5E5;
}
```

### Implementation Tasks

1. **Remove financing components**
   - Delete FinancingForm
   - Remove credit score logic
   - Clean up loan terms

2. **Build venue system**
   - VenueModeSelector
   - VenueSearch component
   - AddressAutocomplete
   - CapacitySlider
   - ScheduleBuilder

3. **Add smart features**
   - Venue availability checker
   - Price comparison
   - Distance calculator
   - Weather integration (for date)

4. **Validation**
   - Capacity vs tickets sold
   - Venue availability
   - Setup time requirements
