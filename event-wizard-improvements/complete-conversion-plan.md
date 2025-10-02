# Event Wizard Stage Files - Conversion Plan
## From Car Dealership to Fashion Event Platform

---

## EXECUTIVE SUMMARY

### Current State Analysis
- **6 stage files** implementing a car dealership sales flow
- Built with CopilotKit for AI assistance  
- Uses React hooks and state machine pattern
- Flow: Contact → Car Selection → Financing → Payment → Confirmation

### Target State
- Fashion event creation wizard
- Breef-inspired minimal UI design
- AI-powered event planning assistance
- Flow: Organizer → Event Setup → Ticketing → Venue → Payments → Publish

---

## STAGE-BY-STAGE CONVERSION PLAN

## 📁 Stage 1: Contact Info → Organizer Info
**File:** `01-use-stage-get-contact-info.tsx`

### Current Functionality
- Collects: name, email, phone
- Simple ContactInfo component
- Moves to: buildCar stage

### Required Changes
1. **Function Rename**
   - `useStageGetContactInfo` → `useStageGetOrganizerInfo`
   
2. **Data Collection Updates**
   ```
   Current: name, email, phone
   New: name, email, organization, role, experience_level
   ```

3. **Stage Progression**
   - Change: `setStage("buildCar")` → `setStage("eventSetup")`

4. **Component Replacement**
   - Replace: `ContactInfo` → `OrganizerProfile`
   - Add: Social login options (Google, Apple, Facebook)
   - Add: Brand auto-import from email domain

5. **AI Instructions Update**
   ```
   Current: "Getting contact information"
   New: "Welcome to FashionOS! Let's set up your profile to create amazing fashion events."
   ```

### New Features to Add
- [ ] Auto-detect organization from email
- [ ] Social authentication
- [ ] Role selection (Organizer/Designer/Brand/Agency)
- [ ] Previous event history check

---

## 📁 Stage 2: Build Car → Event Setup  
**File:** `02-use-stage-build-car.tsx`

### Current Functionality
- Shows car inventory
- Multiple selection methods (showCar, showMultipleCars)
- Complex car data structure
- Moves to: sellFinancing

### Required Changes
1. **Complete Function Overhaul**
   - `useStageBuildCar` → `useStageEventSetup`

2. **Remove Car Logic**
   - Delete: ShowCar, ShowCars components
   - Delete: Car type definitions
   - Delete: cars inventory data

3. **Add Event Components**
   ```
   New Components:
   - EventTypeSelector (Fashion Show/Pop-up/Exhibition/Launch)
   - EventDetailsForm (title, description, date, time)
   - EventThemeBuilder (style, mood, color scheme)
   - AIDescriptionGenerator
   ```

4. **Stage Progression**
   - Change: `setStage("sellFinancing")` → `setStage("ticketSetup")`

5. **New Actions**
   ```typescript
   - createEvent
   - selectEventType
   - generateDescription
   - suggestDates
   ```

6. **AI Instructions**
   ```
   "Help create a fashion event. Start by asking what type of event they're planning."
   ```

### New Data Structure
```
EventDetails {
  title, type, date, startTime, endTime,
  description, theme, expectedAttendance
}
```

---

## 📁 Stage 3: Sell Financing → Ticket Setup
**File:** `03-use-stage-sell-financing.tsx`

### Current Functionality
- Binary choice: financing yes/no
- Text-only interaction
- Routes to different payment paths

### Required Changes
1. **Function Rename**
   - `useStageSellFinancing` → `useStageTicketSetup`

2. **Replace Financing Logic**
   - Remove: loan terms, interest rates
   - Add: Ticket tier configuration

3. **New Components**
   ```
   - TicketTierBuilder
   - PricingCalculator
   - CapacityManager
   - EarlyBirdSettings
   ```

4. **Stage Routing**
   ```
   Current: getFinancingInfo OR getPaymentInfo
   New: venueSetup (always)
   ```

5. **New Actions**
   ```typescript
   - addTicketTier
   - setPricing
   - enableEarlyBird
   - calculateRevenue
   ```

6. **AI Features**
   - Smart pricing suggestions
   - Market comparison
   - Revenue projections

---

## 📁 Stage 4: Get Financing Info → Venue Setup
**File:** `04-use-stage-get-financing-info.tsx`

### Current Functionality
- Collects credit score, loan term
- FinancingForm component
- Moves to: confirmOrder

### Required Changes
1. **Complete Replacement**
   - `useStageGetFinancingInfo` → `useStageVenueSetup`

2. **Remove Financial Forms**
   - Delete: FinancingForm
   - Delete: credit score logic

3. **Add Venue Components**
   ```
   - VenueModeSelector (Physical/Virtual/Hybrid)
   - VenueSearch
   - CapacityValidator
   - ScheduleBuilder
   ```

4. **Stage Progression**
   - Change: `setStage("confirmOrder")` → `setStage("paymentSetup")`

5. **New Features**
   - Google Maps integration
   - Venue availability checker
   - Virtual platform selector
   - Setup/teardown scheduling

---

## 📁 Stage 5: Get Payment Info → Payment Setup
**File:** `05-use-stage-get-payment-info.tsx`

### Current Functionality
- Collects card details
- PaymentCards component
- Direct payment processing

### Required Changes
1. **Function Update**
   - `useStageGetPaymentInfo` → `useStagePaymentSetup`

2. **Replace Payment Method**
   ```
   Current: Direct card collection
   New: Stripe Connect onboarding
   ```

3. **New Components**
   ```
   - StripeConnectSetup
   - BankAccountVerification
   - PayoutSchedule
   - TaxInformation
   ```

4. **Stage Progression**
   - Change: `setStage("confirmOrder")` → `setStage("reviewPublish")`

5. **Security Updates**
   - No direct card handling
   - OAuth to Stripe
   - Webhook configuration

---

## 📁 Stage 6: Confirm Order → Review & Publish
**File:** `06-use-stage-confirm-order.tsx`

### Current Functionality
- Order confirmation
- Loop back to start
- Cancel/confirm actions

### Required Changes
1. **Function Rename**
   - `useStageConfirmOrder` → `useStageReviewPublish`

2. **Replace Order Logic**
   ```
   Current: Car order summary
   New: Event preview & checklist
   ```

3. **New Components**
   ```
   - EventPreview
   - PublishChecklist
   - SocialShareBuilder
   - QRCodeGenerator
   ```

4. **Final Actions**
   ```typescript
   - publishEvent
   - saveAsDraft
   - schedulePublish
   - shareEvent
   ```

5. **Post-Publish Features**
   - Event URL generation
   - Social media templates
   - Email invitations
   - Analytics setup

---

## ADDITIONAL REQUIREMENTS

### Global State Updates
**File:** `@/lib/stages.ts`
```typescript
// Current stages
type Stage = 'getContactInfo' | 'buildCar' | 'sellFinancing' | 
             'getFinancingInfo' | 'getPaymentInfo' | 'confirmOrder'

// New stages  
type Stage = 'organizerSetup' | 'eventSetup' | 'ticketSetup' | 
             'venueSetup' | 'paymentSetup' | 'reviewPublish'
```

### New Type Definitions
**File:** `@/lib/types.ts`
```typescript
// Remove
interface Car { ... }
interface CardInfo { ... }

// Add
interface Event { ... }
interface Ticket { ... }
interface Venue { ... }
interface Organizer { ... }
```

### Component Library Updates
```
Delete:
- /components/generative-ui/show-car.tsx
- /components/generative-ui/financing-form.tsx
- /components/generative-ui/payment-cards.tsx

Create:
- /components/generative-ui/event-builder.tsx
- /components/generative-ui/ticket-tiers.tsx
- /components/generative-ui/venue-selector.tsx
- /components/generative-ui/stripe-connect.tsx
```

---

## IMPLEMENTATION PRIORITY

### Phase 1: Core Conversion (Week 1)
1. Update global state and types
2. Convert Stage 1 (Organizer)
3. Convert Stage 2 (Event Setup)
4. Basic UI components

### Phase 2: Features (Week 2)
1. Convert Stage 3 (Ticketing)
2. Convert Stage 4 (Venue)
3. AI enhancements
4. Validation logic

### Phase 3: Polish (Week 3)
1. Convert Stage 5 (Payments)
2. Convert Stage 6 (Publish)
3. Breef-style UI refinement
4. Testing & optimization

---

## SUCCESS METRICS

### Performance
- Event creation time: < 3 minutes
- Form completion rate: > 95%
- AI suggestion adoption: > 70%

### User Experience
- Mobile responsive: 100%
- Accessibility: WCAG AA
- Error rate: < 2%

### Business
- Event publish rate: > 80%
- Ticket sales activation: > 60%
- User retention: > 40%

---

## RISK MITIGATION

### Technical Risks
- **Stripe Integration**: Use sandbox for testing
- **AI Rate Limits**: Implement caching
- **State Management**: Add error boundaries

### UX Risks
- **Complex Forms**: Progressive disclosure
- **Mobile Experience**: Touch-optimized UI
- **Error Handling**: Clear recovery paths

---

## NOTES FOR DEVELOPERS

1. **Preserve CopilotKit Integration** - The AI assistance pattern is good, just needs new prompts
2. **Maintain State Machine** - The flow control logic is solid
3. **Test Each Stage** - Ensure backward compatibility during migration
4. **Document Changes** - Update component stories and docs
5. **Version Control** - Create feature branches for each stage

---

*This plan transforms the existing car dealership wizard into a fashion event creation platform while preserving the architectural patterns and AI integration.*