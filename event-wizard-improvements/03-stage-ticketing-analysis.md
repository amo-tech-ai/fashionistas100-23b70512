# Stage 3: Sell Financing → Offer Ticketing - Analysis & Improvements

## Current File: `03-use-stage-sell-financing.tsx`

### Current Implementation Issues
1. **Financing focus** - Wrong context for events
2. **Binary choice** - Too simple for ticketing options
3. **No visual components** - Text-only interaction
4. **Poor user guidance** - Unclear value proposition
5. **No pricing logic** - Missing ticket tier system

### Required Changes for Event Wizard

#### 1. Complete Transformation
```typescript
// FROM: useStageSellFinancing
// TO: useStageOfferTicketing

// Update stage progression
setStage("getFinancingInfo") → setStage("getVenueInfo")
setStage("getPaymentInfo") → setStage("getVenueInfo")
```

#### 2. Ticket Tier Structure
```typescript
interface TicketTier {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  benefits: string[];
  salesStart?: Date;
  salesEnd?: Date;
  earlyBird?: {
    price: number;
    deadline: Date;
  };
}

interface TicketingStrategy {
  strategy: 'simple' | 'tiered' | 'vip' | 'free';
  tiers: TicketTier[];
  totalCapacity: number;
  potentialRevenue: number;
}
```

#### 3. Breef-Style Ticketing Cards
```typescript
// New component: TicketingTemplates
<TicketingTemplates
  eventType={eventDetails.type}
  onSelect={(strategy) => {
    const tiers = generateTicketTiers(strategy, eventDetails);
    setTicketingInfo({ strategy, tiers });
    respond?.("Ticketing strategy selected");
    setStage("getVenueInfo");
  }}
/>

// Templates Component
const templates = {
  simple: {
    title: "Simple",
    description: "One price for all",
    example: "$75",
    tiers: [{ name: "General Admission", price: 75, quantity: 200 }]
  },
  tiered: {
    title: "Tiered", 
    description: "VIP + General",
    example: "$200/$75",
    tiers: [
      { name: "VIP", price: 200, quantity: 50 },
      { name: "General", price: 75, quantity: 150 }
    ]
  },
  vip: {
    title: "VIP Only",
    description: "Exclusive event",
    example: "$500",
    tiers: [{ name: "VIP Experience", price: 500, quantity: 50 }]
  },
  free: {
    title: "Free",
    description: "RSVP only",
    example: "$0",
    tiers: [{ name: "RSVP", price: 0, quantity: 300 }]
  }
};
```

#### 4. Smart Pricing AI
```typescript
useCopilotAction({
  name: "suggestPricing",
  description: "AI suggests optimal ticket pricing",
  available: stage === "offerTicketing" ? "enabled" : "disabled",
  handler: async () => {
    const analysis = await analyzePricing({
      eventType: eventDetails.type,
      location: venueInfo?.city,
      date: eventDetails.date,
      similarEvents: await fetchSimilarEvents()
    });
    
    return {
      recommendedPrice: analysis.optimalPrice,
      reasoning: analysis.explanation,
      projectedSales: analysis.salesForecast,
      competitorPricing: analysis.marketComparison
    };
  }
});
```

#### 5. Revenue Calculator
```typescript
useCopilotReadable({
  description: "Revenue Projection",
  value: {
    tiers: ticketingInfo.tiers,
    potentialRevenue: ticketingInfo.tiers.reduce(
      (sum, tier) => sum + (tier.price * tier.quantity), 0
    ),
    breakEvenPoint: calculateBreakEven(eventCosts),
    profitMargin: calculateMargin(revenue, costs)
  },
  available: stage === "offerTicketing" ? "enabled" : "disabled"
});
```

### Visual Design (Breef-style)

#### Template Selection Grid
```css
.ticketing-templates {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .ticketing-templates {
    grid-template-columns: repeat(2, 1fr);
  }
}

.template-card {
  padding: 24px;
  background: white;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.template-card:hover {
  border-color: #E85C2B;
  transform: translateY(-2px);
}

.template-card.selected {
  border-color: #E85C2B;
  background: #FFF5F0;
}

.template-price {
  font-size: 24px;
  font-weight: 500;
  color: #E85C2B;
  margin-top: 8px;
}
```

#### Revenue Display
```css
.revenue-calculator {
  background: #F8F8F8;
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
}

.revenue-total {
  font-size: 32px;
  font-weight: 300;
  color: #2A9D3F;
}

.revenue-breakdown {
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}
```

### Implementation Tasks

1. **Remove financing logic**
   - Delete financing-related actions
   - Remove loan/credit references
   - Clean up financial terms

2. **Build ticketing system**
   - TicketingTemplates component
   - PriceSlider component
   - QuantitySelector component
   - RevenueCalculator component

3. **Add smart features**
   - AI pricing suggestions
   - Market comparison
   - Dynamic pricing rules
   - Early bird discounts

4. **Validation logic**
   - Minimum/maximum prices
   - Quantity vs venue capacity
   - Sales window validation
