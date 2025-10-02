# 4. Validation Schemas (All Stages)

```typescript
// src/lib/validation/schemas.ts
import { z } from 'zod';

// ============= Stage 1: Organizer Setup =============
export const OrganizerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  
  email: z.string()
    .email("Valid email required")
    .toLowerCase(),
  
  organization: z.string()
    .min(2, "Organization name too short")
    .max(100, "Organization name too long")
    .optional(),
  
  role: z.enum([
    "event_organizer",
    "fashion_designer", 
    "brand_representative",
    "agency"
  ], {
    errorMap: () => ({ message: "Please select a valid role" })
  })
});

// ============= Stage 2: Event Details =============
export const EventSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title too long"),
  
  type: z.enum([
    "fashion_show",
    "popup",
    "exhibition",
    "launch"
  ], {
    errorMap: () => ({ message: "Please select a valid event type" })
  }),
  
  date: z.string()
    .refine((date) => {
      const eventDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate > today;
    }, "Event date must be in the future"),
  
  startTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  
  endTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format")
    .optional(),
  
  timezone: z.string()
    .min(3, "Please select a valid timezone"),
  
  description: z.string()
    .max(500, "Description too long")
    .optional()
}).refine(
  (data) => {
    if (!data.endTime) return true;
    return data.endTime > data.startTime;
  },
  { 
    message: "End time must be after start time",
    path: ["endTime"]
  }
);

// ============= Stage 3: Venue Configuration =============
export const VenueSchema = z.object({
  mode: z.enum(["physical", "virtual", "hybrid"]),
  
  // Physical venue fields
  venueName: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  zipCode: z.string().optional(),
  capacity: z.number()
    .min(1, "Capacity must be at least 1")
    .max(100000, "Capacity too large")
    .optional(),
  
  // Virtual fields
  streamingPlatform: z.enum([
    "custom",
    "youtube",
    "zoom",
    "teams",
    "other"
  ]).optional(),
  streamingUrl: z.string().url("Valid URL required").optional(),
  
  // Additional options
  accessibility: z.boolean().optional(),
  parking: z.boolean().optional(),
  cateringAvailable: z.boolean().optional()
}).superRefine((data, ctx) => {
  // Validate based on mode
  if (data.mode === "physical" || data.mode === "hybrid") {
    if (!data.venueName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Venue name is required for physical events",
        path: ["venueName"]
      });
    }
    if (!data.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address is required for physical events",
        path: ["address"]
      });
    }
    if (!data.capacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Capacity is required for physical events",
        path: ["capacity"]
      });
    }
  }
  
  if (data.mode === "virtual" || data.mode === "hybrid") {
    if (!data.streamingUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Streaming URL is required for virtual events",
        path: ["streamingUrl"]
      });
    }
  }
});

// ============= Stage 4: Ticket Setup =============
export const TicketTierSchema = z.object({
  name: z.string()
    .min(1, "Tier name required")
    .max(50, "Tier name too long"),
  
  price: z.number()
    .min(0, "Price cannot be negative")
    .max(10000, "Price too high"),
  
  quantity: z.number()
    .min(1, "Must have at least 1 ticket")
    .max(10000, "Quantity too large"),
  
  description: z.string()
    .max(200, "Description too long")
    .optional(),
  
  earlyBird: z.boolean().optional(),
  
  benefits: z.array(z.string()).optional()
});

export const TicketSchema = z.object({
  tiers: z.array(TicketTierSchema)
    .min(1, "At least one ticket tier required")
    .max(10, "Too many ticket tiers"),
  
  totalCapacity: z.number()
    .min(1, "Total capacity must be at least 1"),
  
  salesStartDate: z.string().optional(),
  salesEndDate: z.string().optional(),
  
  refundPolicy: z.enum([
    "no_refunds",
    "7_days",
    "14_days",
    "30_days",
    "custom"
  ]).optional(),
  
  transferable: z.boolean().optional()
}).refine(
  (data) => {
    const totalTierCapacity = data.tiers.reduce((sum, tier) => sum + tier.quantity, 0);
    return totalTierCapacity <= data.totalCapacity;
  },
  {
    message: "Total tier quantity cannot exceed venue capacity",
    path: ["totalCapacity"]
  }
);

// ============= Stage 5: Sponsors & Media =============
export const SponsorSchema = z.object({
  name: z.string()
    .min(1, "Sponsor name required")
    .max(100, "Name too long"),
  
  tier: z.enum([
    "title",
    "gold",
    "silver",
    "bronze",
    "partner"
  ]),
  
  logoUrl: z.string()
    .url("Valid logo URL required")
    .optional(),
  
  website: z.string()
    .url("Valid website URL required")
    .optional(),
  
  amount: z.number()
    .min(0)
    .optional()
});

export const SponsorsMediaSchema = z.object({
  sponsors: z.array(SponsorSchema)
    .max(20, "Too many sponsors")
    .optional(),
  
  mediaPartners: z.array(z.string())
    .max(10, "Too many media partners")
    .optional(),
  
  pressRelease: z.string()
    .max(1000, "Press release too long")
    .optional(),
  
  photographyAllowed: z.boolean().optional(),
  
  livestreaming: z.boolean().optional(),
  
  mediaKit: z.string()
    .url("Valid media kit URL required")
    .optional()
});

// ============= Stage 6: Review & Publish =============
export const ReviewSchema = z.object({
  confirmed: z.boolean()
    .refine(val => val === true, "You must confirm all details are correct"),
  
  termsAccepted: z.boolean()
    .refine(val => val === true, "You must accept the terms and conditions"),
  
  cancellationPolicy: z.boolean()
    .refine(val => val === true, "You must acknowledge the cancellation policy"),
  
  marketingConsent: z.boolean().optional(),
  
  notes: z.string()
    .max(500, "Notes too long")
    .optional()
});

// ============= Combined Event Data Schema =============
export const CompleteEventSchema = z.object({
  organizer: OrganizerSchema,
  event: EventSchema,
  venue: VenueSchema,
  tickets: TicketSchema,
  sponsorsMedia: SponsorsMediaSchema,
  review: ReviewSchema
});

// Type exports
export type OrganizerData = z.infer<typeof OrganizerSchema>;
export type EventData = z.infer<typeof EventSchema>;
export type VenueData = z.infer<typeof VenueSchema>;
export type TicketData = z.infer<typeof TicketSchema>;
export type SponsorsMediaData = z.infer<typeof SponsorsMediaSchema>;
export type ReviewData = z.infer<typeof ReviewSchema>;
export type CompleteEventData = z.infer<typeof CompleteEventSchema>;
```