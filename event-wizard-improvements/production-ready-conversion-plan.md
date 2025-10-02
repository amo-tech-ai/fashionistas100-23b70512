# Event Wizard Conversion Plan - PRODUCTION READY
## Updated After Code Audit

---

## 🎯 CRITICAL ISSUES TO FIX

### Red Flags from Audit
1. ❌ Contact → Car flow still hardcoded
2. ❌ Car inventory + actions still exposed  
3. ❌ Financing upsell branching present
4. ❌ Direct card collection (PCI risk)
5. ❌ Order confirmation loops to start
6. ❌ Prompt text is car/financing centric

---

## ✅ MINIMAL CHANGE-SET FOR PRODUCTION

### 1. Global Stage Renames
```typescript
// lib/stages.ts
type StageOld = 'getContactInfo' | 'buildCar' | 'sellFinancing' | 
                 'getFinancingInfo' | 'getPaymentInfo' | 'confirmOrder'

type StageNew = 'organizerSetup' | 'eventSetup' | 'ticketSetup' | 
                'venueSetup' | 'paymentSetup' | 'reviewPublish'
```

**Update Pattern:**
- Find: `stage === "getContactInfo"`
- Replace: `stage === "organizerSetup"`
- Repeat for all stages

---

## 📁 STAGE 1: Organizer Setup
**File:** `01-use-stage-get-contact-info.tsx` → `01-use-stage-organizer-setup.tsx`

### Required Changes
```typescript
// 1. Function rename
export function useStageOrganizerSetup() {
  const { setOrganizerInfo, stage, setStage } = useGlobalState();

  // 2. Update stage check
  available: stage === "organizerSetup" ? "enabled" : "disabled"

  // 3. Fix next stage
  onSubmit: (data) => {
    setOrganizerInfo(data);
    setStage("eventSetup"); // NOT buildCar
  }

  // 4. Update AI instructions
  instructions: `
    CURRENT STATE: Setting up event organizer profile.
    START: "Welcome to FashionOS! Let's create your fashion event. First, I need some basic info about you."
    COLLECT: Name, Email, Organization (optional), Role
    FEATURES: Mention we can auto-import brand details from your email domain
  `
}
```

### New Component
```typescript
<OrganizerProfile
  status={status}
  features={{
    socialLogin: true,
    brandAutoImport: true,
    roleSelection: ['organizer', 'designer', 'brand', 'agency']
  }}
  onSubmit={async (data) => {
    // Auto-import brand if business email
    if (data.email && !data.email.includes('@gmail')) {
      const brand = await importBrandFromDomain(data.email);
      if (brand) setBrandInfo(brand);
    }
    setOrganizerInfo(data);
    respond?.("Profile created! Moving to event setup.");
    setStage("eventSetup");
  }}
/>
```

---

## 📁 STAGE 2: Event Setup  
**File:** `02-use-stage-build-car.tsx` → `02-use-stage-event-setup.tsx`

### Critical Deletions
```typescript
// DELETE ALL:
- import { ShowCar, ShowCars }
- import { Car, cars }
- useCopilotReadable for cars
- showCar action
- showMultipleCars action
```

### New Implementation
```typescript
export function useStageEventSetup() {
  const { setEventDetails, stage, setStage } = useGlobalState();

  // New AI instructions
  useCopilotAdditionalInstructions({
    instructions: `
      CURRENT STATE: Creating fashion event.
      START: "Perfect! What type of fashion event are you planning?"
      SHOW: Event type cards immediately
      COLLECT: Event name, type, date, time
      ASSIST: Generate descriptions with AI
    `,
    available: stage === "eventSetup" ? "enabled" : "disabled"
  });

  // Replace car actions with event actions
  useCopilotAction({
    name: "selectEventType",
    description: "Choose event type",
    available: stage === "eventSetup" ? "enabled" : "disabled",
    renderAndWaitForResponse: ({ status, respond }) => (
      <EventTypeSelector
        types={['fashion_show', 'popup', 'exhibition', 'launch']}
        onSelect={(type) => {
          setEventDetails({ type });
          respond?.("Event type selected");
        }}
      />
    )
  });

  useCopilotAction({
    name: "configureEventDetails",
    description: "Set event details",
    parameters: [
      { name: "title", type: "string", required: true },
      { name: "date", type: "string", required: true },
      { name: "startTime", type: "string", required: true }
    ],
    handler: async (args) => {
      const description = await generateDescription(args);
      setEventDetails({ ...args, description });
      setStage("ticketSetup"); // NOT sellFinancing
      return "Event configured! Moving to ticketing.";
    }
  });
}
```

---

## 📁 STAGE 3: Ticket Setup
**File:** `03-use-stage-sell-financing.tsx` → `03-use-stage-ticket-setup.tsx`

### Remove Financing Logic
```typescript
export function useStageTicketSetup() {
  const { setTicketInfo, stage, setStage } = useGlobalState();

  // NO BRANCHING - deterministic flow
  useCopilotAdditionalInstructions({
    instructions: `
      CURRENT STATE: Setting up event tickets.
      START: "Let's set up your tickets. How would you like to price them?"
      SHOW: Ticket templates (Simple, Tiered, VIP, Free)
      NO UPSELL: Just help configure tickets
    `,
    available: stage === "ticketSetup" ? "enabled" : "disabled"
  });

  // Single path forward (no financing branch)
  useCopilotAction({
    name: "configureTickets",
    description: "Set ticket tiers and pricing",
    renderAndWaitForResponse: ({ status, respond }) => (
      <TicketConfiguration
        templates={['simple', 'tiered', 'vip', 'free']}
        onComplete={(tickets) => {
          setTicketInfo(tickets);
          respond?.("Tickets configured!");
          setStage("venueSetup"); // ALWAYS goes to venue
        }}
      />
    )
  });
}
```

---

## 📁 STAGE 4: Venue Setup
**File:** `04-use-stage-get-financing-info.tsx` → `04-use-stage-venue-setup.tsx`

### Replace Financial Forms
```typescript
export function useStageVenueSetup() {
  const { setVenueInfo, stage, setStage } = useGlobalState();

  // Delete FinancingForm, add VenueSelector
  useCopilotAction({
    name: "selectVenue",
    description: "Configure event venue",
    renderAndWaitForResponse: ({ status, respond }) => (
      <VenueSelector
        modes={['physical', 'virtual', 'hybrid']}
        onSubmit={(venue) => {
          setVenueInfo(venue);
          respond?.("Venue selected!");
          setStage("paymentSetup");
        }}
      />
    )
  });
}
```

---

## 📁 STAGE 5: Payment Setup (STRIPE CONNECT)
**File:** `05-use-stage-get-payment-info.tsx` → `05-use-stage-payment-setup.tsx`

### CRITICAL: Remove PCI Risk
```typescript
// DELETE ALL:
- import { PaymentCards }
- import { CardInfo }
- Any raw card collection

// NEW: Stripe Connect OAuth
export function useStagePaymentSetup() {
  const { setPaymentMethod, stage, setStage } = useGlobalState();

  useCopilotAdditionalInstructions({
    instructions: `
      CURRENT STATE: Setting up payment processing.
      EXPLAIN: "To receive ticket payments, we'll connect your Stripe account."
      SECURE: OAuth flow, no card numbers
      ASSURE: "Payments go directly to your bank"
    `,
    available: stage === "paymentSetup" ? "enabled" : "disabled"
  });

  useCopilotAction({
    name: "connectStripe",
    description: "Connect Stripe for payments",
    renderAndWaitForResponse: ({ status, respond }) => (
      <StripeConnectOnboarding
        onSuccess={(accountId) => {
          setPaymentMethod({ 
            type: 'stripe_connect',
            accountId,
            onboarded: true
          });
          respond?.("Payment processing connected!");
          setStage("reviewPublish");
        }}
        onSkip={() => {
          setPaymentMethod({ type: 'manual' });
          setStage("reviewPublish");
        }}
      />
    )
  });
}
```

---

## 📁 STAGE 6: Review & Publish
**File:** `06-use-stage-confirm-order.tsx` → `06-use-stage-review-publish.tsx`

### No Loop Back
```typescript
export function useStageReviewPublish() {
  const { event, stage, setStage } = useGlobalState();

  // Remove nextState loop
  useCopilotAction({
    name: "publishEvent",
    description: "Publish event live",
    renderAndWaitForResponse: ({ status, respond }) => (
      <EventReview
        event={event}
        onPublish={async () => {
          const url = await publishEvent(event);
          respond?.(`Event live at: ${url}`);
          // NO LOOP - stay here or go to dashboard
          setStage("published");
        }}
        onSaveDraft={() => {
          saveDraft(event);
          respond?.("Saved as draft");
        }}
      />
    )
  });
}
```

---

## 🔒 SECURITY & COMPLIANCE

### PCI Compliance
```typescript
// NEVER DO THIS:
<input type="text" name="cardNumber" />

// ALWAYS USE:
<StripeElements /> // or
<StripeConnectOAuth />
```

### Environment Variables
```bash
# .env.local (CLIENT)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# .env (SERVER ONLY)
CLERK_SECRET_KEY=sk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

---

## 📊 ANALYTICS & OBSERVABILITY

### Track Every Stage
```typescript
// In each stage hook
useEffect(() => {
  analytics.track('wizard_enter_stage', {
    stage: stage,
    timestamp: Date.now(),
    sessionId: sessionId
  });
}, [stage]);

// On each action
onSubmit: (data) => {
  analytics.track('wizard_submit', {
    stage: stage,
    duration: Date.now() - stageStartTime,
    data: sanitize(data)
  });
}
```

### Autosave Pattern
```typescript
// Add to global state
const autoSave = debounce(() => {
  localStorage.setItem('wizard_draft', JSON.stringify({
    stage,
    data: getAllStateData(),
    timestamp: Date.now()
  }));
}, 1000);

// Call on every state change
useEffect(() => {
  autoSave();
}, [organizerInfo, eventDetails, ticketInfo, venueInfo]);
```

---

## ✅ PRODUCTION CHECKLIST

### Immediate (Before Deploy)
- [ ] All stages renamed in code
- [ ] All `setStage()` calls updated
- [ ] All `available:` conditions updated
- [ ] Car/financing language removed
- [ ] PaymentCards component deleted
- [ ] Stripe Connect integrated
- [ ] Environment variables set correctly

### Testing Required
- [ ] Happy path: Organizer → Event → Tickets → Venue → Payment → Publish
- [ ] Back navigation works
- [ ] Autosave/resume works
- [ ] Social login works
- [ ] Brand auto-import works
- [ ] Stripe Connect OAuth completes
- [ ] Event publishes successfully

### Post-Launch
- [ ] Analytics dashboard configured
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] A/B test ticket templates
- [ ] User feedback collection

---

## 🚀 DEPLOYMENT STRATEGY

### Phase 1: Core Flow (Week 1)
1. Deploy stage renames
2. Test with internal team
3. Fix any stage transition bugs

### Phase 2: Integrations (Week 2)
1. Enable Clerk social login
2. Connect Stripe OAuth
3. Test payment flows

### Phase 3: Polish (Week 3)
1. Add autosave
2. Implement analytics
3. Optimize performance
4. Launch to beta users

---

## 🛡️ RISK MITIGATION

### Technical Risks
- **Stripe Integration**: Test in sandbox first
- **State Management**: Add error boundaries
- **AI Rate Limits**: Implement caching

### Business Risks
- **Abandoned Wizards**: Track drop-off points
- **Payment Failures**: Clear error messaging
- **Event Publishing**: Preview before live

---

*This production-ready plan addresses all audit findings and provides a clear path to deployment.*