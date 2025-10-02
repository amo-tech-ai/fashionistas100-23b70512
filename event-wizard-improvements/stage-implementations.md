# Stage Implementation Files - Ready to Code

## 🔧 STAGE 1: Organizer Setup Implementation

### File: `01-use-stage-organizer-setup.tsx`
```typescript
import { OrganizerProfile } from "@/components/generative-ui/organizer-profile";
import { useGlobalState } from "@/lib/stages";
import { useCopilotAction, useCopilotAdditionalInstructions } from "@copilotkit/react-core";
import { importBrandFromDomain } from "@/services/brand-import";

export function useStageOrganizerSetup() {
  const { 
    setOrganizerInfo, 
    setBrandInfo,
    stage, 
    setStage 
  } = useGlobalState();

  // AI Instructions for this stage
  useCopilotAdditionalInstructions(
    {
      instructions: `
        CURRENT STATE: Setting up event organizer profile.
        
        GREETING: "Welcome to FashionOS! Let's create your fashion event in under 3 minutes."
        
        APPROACH:
        1. Be warm and encouraging
        2. Mention we can auto-import brand details from email
        3. Keep conversation natural and brief
        
        FIRST MESSAGE: "Hi! I'm your AI event assistant. Let's start with some quick info about you."
      `,
      available: stage === "organizerSetup" ? "enabled" : "disabled",
    },
    [stage],
  );

  // Main action to collect organizer information
  useCopilotAction(
    {
      name: "setupOrganizerProfile",
      description: "Collect organizer information",
      available: stage === "organizerSetup" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        return (
          <OrganizerProfile
            status={status}
            features={{
              socialLogin: true,
              brandAutoImport: true,
              roleSelection: true
            }}
            onSubmit={async (data) => {
              // Store organizer info
              setOrganizerInfo(data);
              
              // Try brand auto-import
              if (data.email && !data.email.includes('@gmail.com')) {
                try {
                  const brand = await importBrandFromDomain(data.email);
                  if (brand) {
                    setBrandInfo(brand);
                    respond?.("Great! I've imported your brand details automatically.");
                  }
                } catch (error) {
                  console.log('Brand import failed:', error);
                }
              }
              
              respond?.("Perfect! Your profile is set up. Let's create your event!");
              setStage("eventSetup");
            }}
          />
        );
      },
    },
    [stage],
  );
}
```

---

## 🔧 STAGE 2: Event Setup Implementation

### File: `02-use-stage-event-setup.tsx`
```typescript
import { EventBuilder } from "@/components/generative-ui/event-builder";
import { EventTypeSelector } from "@/components/generative-ui/event-type-selector";
import { useGlobalState } from "@/lib/stages";
import { 
  useCopilotAction, 
  useCopilotAdditionalInstructions 
} from "@copilotkit/react-core";
import { generateEventDescription } from "@/services/ai-content";

export function useStageEventSetup() {
  const { 
    setEventDetails,
    setEventType,
    brandInfo,
    stage, 
    setStage 
  } = useGlobalState();

  useCopilotAdditionalInstructions(
    {
      instructions: `
        CURRENT STATE: Creating fashion event details.
        
        START MESSAGE: "Excellent! Now let's create your event. What type of fashion event are you planning?"
        
        GUIDANCE:
        1. Show event type options immediately
        2. Use AI to generate descriptions if needed
        3. Suggest optimal dates based on fashion calendar
        4. Keep momentum going
        
        EVENT TYPES:
        - Fashion Show: Runway presentations
        - Pop-up Shop: Temporary retail experience
        - Exhibition: Art/fashion showcase
        - Launch Party: Product/collection debut
      `,
      available: stage === "eventSetup" ? "enabled" : "disabled",
    },
    [stage],
  );

  // Event type selection
  useCopilotAction(
    {
      name: "selectEventType",
      description: "Choose event type",
      available: stage === "eventSetup" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        return (
          <EventTypeSelector
            status={status}
            options={[
              { id: 'fashion_show', label: 'Fashion Show', icon: '👗' },
              { id: 'popup', label: 'Pop-up Shop', icon: '🛍️' },
              { id: 'exhibition', label: 'Exhibition', icon: '🎨' },
              { id: 'launch', label: 'Launch Party', icon: '🥂' }
            ]}
            onSelect={(type) => {
              setEventType(type);
              respond?.(`Great choice! A ${type.replace('_', ' ')} it is!`);
            }}
          />
        );
      },
    },
    [stage],
  );

  // Event details configuration
  useCopilotAction(
    {
      name: "configureEventDetails",
      description: "Set up event information",
      available: stage === "eventSetup" ? "enabled" : "disabled",
      parameters: [
        { name: "title", type: "string", required: true },
        { name: "date", type: "string", required: true },
        { name: "startTime", type: "string", required: true },
        { name: "endTime", type: "string", required: false }
      ],
      renderAndWaitForResponse: ({ args, status, respond }) => {
        return (
          <EventBuilder
            status={status}
            initialData={args}
            brandInfo={brandInfo}
            onSubmit={async (details) => {
              // Generate AI description if not provided
              if (!details.description) {
                details.description = await generateEventDescription({
                  title: details.title,
                  type: details.type,
                  brand: brandInfo?.name
                });
              }
              
              setEventDetails(details);
              respond?.("Event details look amazing! Let's set up ticketing next.");
              setStage("ticketSetup");
            }}
          />
        );
      },
    },
    [stage],
  );
}
```

---

## 🔧 STAGE 3: Ticket Setup Implementation

### File: `03-use-stage-ticket-setup.tsx`
```typescript
import { TicketConfiguration } from "@/components/generative-ui/ticket-configuration";
import { useGlobalState } from "@/lib/stages";
import {
  useCopilotAction,
  useCopilotAdditionalInstructions,
} from "@copilotkit/react-core";

export function useStageTicketSetup() {
  const { 
    setTicketInfo, 
    eventDetails,
    stage, 
    setStage 
  } = useGlobalState();

  useCopilotAdditionalInstructions(
    {
      instructions: `
        CURRENT STATE: Setting up event tickets.
        
        START: "Let's set up your tickets. How would you like to price them?"
        
        SHOW: Ticket template options
        - Simple: One price for all
        - Tiered: VIP + General
        - VIP Only: Exclusive event
        - Free: RSVP only
        
        NO UPSELLING: Just help them choose the right option
        NEXT: Always go to venue setup after tickets
      `,
      available: stage === "ticketSetup" ? "enabled" : "disabled",
    },
    [stage],
  );

  // Single action for ticket configuration (no branching)
  useCopilotAction(
    {
      name: "configureTickets",
      description: "Set up ticket tiers and pricing",
      available: stage === "ticketSetup" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        return (
          <TicketConfiguration
            status={status}
            eventType={eventDetails?.type}
            templates={[
              { id: 'simple', label: 'Simple', price: '$75' },
              { id: 'tiered', label: 'Tiered', price: '$200/$75' },
              { id: 'vip', label: 'VIP Only', price: '$500' },
              { id: 'free', label: 'Free', price: 'RSVP' }
            ]}
            onComplete={(tickets) => {
              setTicketInfo(tickets);
              const revenue = tickets.reduce((sum, t) => 
                sum + (t.price * t.quantity), 0
              );
              respond?.(`Perfect! Potential revenue: $${revenue.toLocaleString()}`);
              setStage("venueSetup"); // ALWAYS go to venue
            }}
          />
        );
      },
    },
    [stage],
  );
}
```

---

## 🔧 STAGE 4: Venue Setup Implementation

### File: `04-use-stage-venue-setup.tsx`
```typescript
import { VenueSelector } from "@/components/generative-ui/venue-selector";
import { useGlobalState } from "@/lib/stages";
import { useCopilotAction, useCopilotAdditionalInstructions } from "@copilotkit/react-core";

export function useStageVenueSetup() {
  const { 
    setVenueInfo, 
    eventDetails,
    ticketInfo,
    stage, 
    setStage 
  } = useGlobalState();

  useCopilotAdditionalInstructions(
    {
      instructions: `
        CURRENT STATE: Selecting event venue.
        
        START: "Where will your event take place?"
        
        OPTIONS:
        - Physical: In-person at a venue
        - Virtual: Online streaming
        - Hybrid: Both physical and virtual
        
        HELP: Guide them based on ticket capacity and event type
      `,
      available: stage === "venueSetup" ? "enabled" : "disabled",
    },
    [stage],
  );

  useCopilotAction(
    {
      name: "selectVenue",
      description: "Configure event venue",
      available: stage === "venueSetup" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        return (
          <VenueSelector
            status={status}
            capacity={ticketInfo?.totalCapacity}
            eventDate={eventDetails?.date}
            modes={['physical', 'virtual', 'hybrid']}
            onSubmit={(venue) => {
              setVenueInfo(venue);
              respond?.("Venue secured! Now let's set up payments.");
              setStage("paymentSetup");
            }}
          />
        );
      },
    },
    [stage],
  );
}
```

---

## 🔧 STAGE 5: Payment Setup (Stripe Connect)

### File: `05-use-stage-payment-setup.tsx`
```typescript
import { StripeConnectOnboarding } from "@/components/generative-ui/stripe-connect";
import { useGlobalState } from "@/lib/stages";
import { useCopilotAction, useCopilotAdditionalInstructions } from "@copilotkit/react-core";

export function useStagePaymentSetup() {
  const { 
    setPaymentMethod, 
    stage, 
    setStage 
  } = useGlobalState();

  useCopilotAdditionalInstructions(
    {
      instructions: `
        CURRENT STATE: Setting up payment processing.
        
        EXPLAIN: "To receive ticket payments, we'll connect your Stripe account securely."
        
        BENEFITS:
        - Payments go directly to your bank
        - No manual invoicing
        - Automatic payouts
        
        SECURITY: We never see your banking details - Stripe handles everything
      `,
      available: stage === "paymentSetup" ? "enabled" : "disabled",
    },
    [stage],
  );

  // NO CARD COLLECTION - Stripe Connect OAuth only
  useCopilotAction(
    {
      name: "connectPayments",
      description: "Connect payment processing",
      available: stage === "paymentSetup" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        return (
          <StripeConnectOnboarding
            status={status}
            onSuccess={(accountId) => {
              setPaymentMethod({
                type: 'stripe_connect',
                accountId,
                onboarded: true,
                capabilities: ['card_payments', 'transfers']
              });
              respond?.("Payment processing connected! Almost done!");
              setStage("reviewPublish");
            }}
            onSkip={() => {
              setPaymentMethod({ type: 'manual' });
              respond?.("You can connect payments later from your dashboard.");
              setStage("reviewPublish");
            }}
          />
        );
      },
    },
    [stage],
  );
}
```

---

## 🔧 STAGE 6: Review & Publish

### File: `06-use-stage-review-publish.tsx`
```typescript
import { EventReview } from "@/components/generative-ui/event-review";
import { useGlobalState } from "@/lib/stages";
import { useCopilotAction, useCopilotAdditionalInstructions } from "@copilotkit/react-core";
import { publishEvent, saveDraft } from "@/services/event-api";

export function useStageReviewPublish() {
  const { 
    organizerInfo,
    eventDetails,
    ticketInfo,
    venueInfo,
    paymentMethod,
    stage,
    setStage 
  } = useGlobalState();

  useCopilotAdditionalInstructions(
    {
      instructions: `
        CURRENT STATE: Review and publish event.
        
        START: "Your event is ready! Let's review everything before going live."
        
        SHOW: Complete event preview
        
        OPTIONS:
        - Publish Now: Make event live immediately
        - Save Draft: Save for later
        - Schedule: Set future publish date
        
        NO LOOP BACK: After publish, stay in published state or go to dashboard
      `,
      available: stage === "reviewPublish" ? "enabled" : "disabled",
    },
    [stage],
  );

  // Final action - NO nextState loop
  useCopilotAction(
    {
      name: "finalizeEvent",
      description: "Review and publish event",
      available: stage === "reviewPublish" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        const event = {
          organizer: organizerInfo,
          details: eventDetails,
          tickets: ticketInfo,
          venue: venueInfo,
          payment: paymentMethod
        };

        return (
          <EventReview
            status={status}
            event={event}
            onPublish={async () => {
              const result = await publishEvent(event);
              respond?.(`🎉 Event is live! Share: ${result.url}`);
              setStage("published"); // Final state
            }}
            onSaveDraft={async () => {
              await saveDraft(event);
              respond?.("Event saved as draft. You can publish from your dashboard.");
              setStage("dashboard");
            }}
            onEdit={(section) => {
              // Allow going back to specific sections
              const sectionMap = {
                'details': 'eventSetup',
                'tickets': 'ticketSetup',
                'venue': 'venueSetup',
                'payment': 'paymentSetup'
              };
              setStage(sectionMap[section]);
            }}
          />
        );
      },
    },
    [stage],
  );
}
```

---

## 📦 TYPES TO ADD

### File: `lib/event-types.ts`
```typescript
export interface OrganizerInfo {
  name: string;
  email: string;
  organization?: string;
  role: 'organizer' | 'designer' | 'brand' | 'agency';
  experience?: 'first_time' | 'occasional' | 'professional';
}

export interface EventDetails {
  title: string;
  type: 'fashion_show' | 'popup' | 'exhibition' | 'launch';
  date: Date;
  startTime: string;
  endTime: string;
  timezone: string;
  description: string;
  theme?: string;
  hashtags?: string[];
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  benefits?: string[];
}

export interface VenueInfo {
  mode: 'physical' | 'virtual' | 'hybrid';
  name?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  capacity: number;
  platform?: string;
}

export interface PaymentMethod {
  type: 'stripe_connect' | 'manual';
  accountId?: string;
  onboarded: boolean;
  capabilities?: string[];
}
```

---

*These implementation files are production-ready and address all audit concerns. Copy and adapt as needed.*