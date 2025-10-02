// ============================================
// Zod Validation Schemas
// Version: 1.0.0
// Date: October 2, 2025
// ============================================

import { z } from "zod";

// ============================================
// Utility Validators
// ============================================

const phoneRegex = /^[\d\s\-\+\(\)]+$/;
const urlRegex = /^https?:\/\/.+/;

// ============================================
// Organizer Setup Schema
// ============================================

export const organizerSetupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must be less than 255 characters"),

  organization: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(200, "Organization name must be less than 200 characters")
    .optional(),

  role: z
    .string()
    .min(2, "Role must be at least 2 characters")
    .max(100, "Role must be less than 100 characters"),

  phone: z
    .string()
    .regex(phoneRegex, "Invalid phone number format")
    .optional(),

  website: z
    .string()
    .regex(urlRegex, "Invalid URL format")
    .optional()
    .or(z.literal("")),

  bio: z
    .string()
    .max(1000, "Bio must be less than 1000 characters")
    .optional(),
});

export type OrganizerSetupFormData = z.infer<typeof organizerSetupSchema>;

// ============================================
// Event Setup Schema
// ============================================

export const eventSetupSchema = z.object({
  title: z
    .string()
    .min(3, "Event title must be at least 3 characters")
    .max(200, "Event title must be less than 200 characters"),

  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200, "Slug must be less than 200 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),

  eventType: z
    .string()
    .min(1, "Please select an event type"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be less than 5000 characters"),

  startDate: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    }, "Start date must be in the future"),

  endDate: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid end date"),

  featuredImage: z
    .string()
    .regex(urlRegex, "Invalid image URL")
    .optional()
    .or(z.literal("")),

  gallery: z
    .array(z.string().regex(urlRegex, "Invalid image URL"))
    .max(10, "Maximum 10 gallery images")
    .optional(),

  tags: z
    .array(z.string().min(2).max(50))
    .max(10, "Maximum 10 tags")
    .optional(),

  targetAudience: z
    .string()
    .max(500, "Target audience description must be less than 500 characters")
    .optional(),

  expectedAttendance: z
    .number()
    .int("Expected attendance must be a whole number")
    .positive("Expected attendance must be positive")
    .max(100000, "Expected attendance seems unrealistic")
    .optional(),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

export type EventSetupFormData = z.infer<typeof eventSetupSchema>;

// ============================================
// Venue Setup Schema
// ============================================

export const venueSetupSchema = z.object({
  venueName: z
    .string()
    .min(2, "Venue name must be at least 2 characters")
    .max(200, "Venue name must be less than 200 characters"),

  venueId: z
    .string()
    .uuid("Invalid venue ID")
    .optional(),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be less than 500 characters"),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters"),

  state: z
    .string()
    .max(100, "State must be less than 100 characters")
    .optional(),

  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be less than 100 characters"),

  postalCode: z
    .string()
    .max(20, "Postal code must be less than 20 characters")
    .optional(),

  capacity: z
    .number()
    .int("Capacity must be a whole number")
    .positive("Capacity must be positive")
    .max(100000, "Capacity seems unrealistic"),

  amenities: z
    .array(z.string().min(2).max(100))
    .max(20, "Maximum 20 amenities")
    .optional(),

  parkingAvailable: z
    .boolean()
    .optional(),

  accessibilityFeatures: z
    .array(z.string().min(2).max(100))
    .max(15, "Maximum 15 accessibility features")
    .optional(),

  venueType: z
    .string()
    .max(100, "Venue type must be less than 100 characters")
    .optional(),

  rentalCost: z
    .number()
    .nonnegative("Rental cost cannot be negative")
    .max(1000000, "Rental cost seems unrealistic")
    .optional(),
});

export type VenueSetupFormData = z.infer<typeof venueSetupSchema>;

// ============================================
// Ticket Setup Schema
// ============================================

export const ticketTierSchema = z.object({
  id: z
    .string()
    .uuid()
    .optional(),

  name: z
    .string()
    .min(2, "Tier name must be at least 2 characters")
    .max(100, "Tier name must be less than 100 characters"),

  price: z
    .number()
    .nonnegative("Price cannot be negative")
    .max(100000, "Price seems unrealistic"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be positive")
    .max(100000, "Quantity seems unrealistic"),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),

  benefits: z
    .array(z.string().min(2).max(200))
    .max(20, "Maximum 20 benefits")
    .optional(),

  maxPerCustomer: z
    .number()
    .int("Max per customer must be a whole number")
    .positive("Max per customer must be positive")
    .max(100, "Max per customer seems unrealistic")
    .optional(),

  available: z
    .boolean()
    .optional()
    .default(true),
});

export const ticketSetupSchema = z.object({
  tiers: z
    .array(ticketTierSchema)
    .min(1, "At least one ticket tier is required")
    .max(10, "Maximum 10 ticket tiers allowed"),

  earlyBirdDiscount: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional(),

  groupDiscountThreshold: z
    .number()
    .int("Threshold must be a whole number")
    .positive("Threshold must be positive")
    .max(1000, "Threshold seems unrealistic")
    .optional(),

  groupDiscountPercentage: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional(),

  refundPolicy: z
    .string()
    .max(1000, "Refund policy must be less than 1000 characters")
    .optional(),

  salesStartDate: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid sales start date")
    .optional(),

  salesEndDate: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid sales end date")
    .optional(),
}).refine(
  (data) => {
    if (data.salesStartDate && data.salesEndDate) {
      const start = new Date(data.salesStartDate);
      const end = new Date(data.salesEndDate);
      return end > start;
    }
    return true;
  },
  {
    message: "Sales end date must be after sales start date",
    path: ["salesEndDate"],
  }
);

export type TicketTierFormData = z.infer<typeof ticketTierSchema>;
export type TicketSetupFormData = z.infer<typeof ticketSetupSchema>;

// ============================================
// Sponsor Setup Schema
// ============================================

export const sponsorSchema = z.object({
  id: z
    .string()
    .uuid()
    .optional(),

  name: z
    .string()
    .min(2, "Sponsor name must be at least 2 characters")
    .max(200, "Sponsor name must be less than 200 characters"),

  logo: z
    .string()
    .regex(urlRegex, "Invalid logo URL")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .regex(urlRegex, "Invalid website URL")
    .optional()
    .or(z.literal("")),

  tier: z
    .string()
    .min(2, "Tier must be at least 2 characters")
    .max(50, "Tier must be less than 50 characters"),

  amount: z
    .number()
    .nonnegative("Amount cannot be negative")
    .max(10000000, "Amount seems unrealistic"),

  benefits: z
    .array(z.string().min(2).max(200))
    .max(20, "Maximum 20 benefits")
    .optional(),
});

export const sponsorshipTierSchema = z.object({
  name: z
    .string()
    .min(2, "Tier name must be at least 2 characters")
    .max(100, "Tier name must be less than 100 characters"),

  minAmount: z
    .number()
    .nonnegative("Minimum amount cannot be negative")
    .max(10000000, "Amount seems unrealistic"),

  maxAmount: z
    .number()
    .positive("Maximum amount must be positive")
    .max(10000000, "Amount seems unrealistic")
    .optional(),

  benefits: z
    .array(z.string().min(2).max(200))
    .min(1, "At least one benefit is required")
    .max(20, "Maximum 20 benefits"),

  spotsAvailable: z
    .number()
    .int("Spots must be a whole number")
    .positive("Spots must be positive")
    .max(100, "Spots seems unrealistic")
    .optional(),
}).refine(
  (data) => {
    if (data.maxAmount) {
      return data.maxAmount > data.minAmount;
    }
    return true;
  },
  {
    message: "Maximum amount must be greater than minimum amount",
    path: ["maxAmount"],
  }
);

export const sponsorSetupSchema = z.object({
  sponsors: z
    .array(sponsorSchema)
    .max(50, "Maximum 50 sponsors allowed"),

  targetAmount: z
    .number()
    .nonnegative("Target amount cannot be negative")
    .max(10000000, "Target amount seems unrealistic")
    .optional(),

  sponsorshipTiers: z
    .array(sponsorshipTierSchema)
    .max(10, "Maximum 10 sponsorship tiers")
    .optional(),

  benefits: z
    .array(z.string().min(2).max(200))
    .max(30, "Maximum 30 benefits")
    .optional(),

  deadline: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid deadline date")
    .optional(),
});

export type SponsorFormData = z.infer<typeof sponsorSchema>;
export type SponsorshipTierFormData = z.infer<typeof sponsorshipTierSchema>;
export type SponsorSetupFormData = z.infer<typeof sponsorSetupSchema>;

// ============================================
// Review & Publish Schema
// ============================================

export const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

export const reviewPublishSchema = z.object({
  reviewed: z
    .boolean()
    .refine((val) => val === true, "You must review all details before publishing"),

  publishDate: z
    .string()
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid publish date")
    .optional(),

  marketingConsent: z
    .boolean()
    .optional(),

  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),

  notificationPreferences: notificationPreferencesSchema.optional(),
});

export type NotificationPreferencesFormData = z.infer<typeof notificationPreferencesSchema>;
export type ReviewPublishFormData = z.infer<typeof reviewPublishSchema>;

// ============================================
// Complete Wizard Data Schema
// ============================================

export const completeWizardDataSchema = z.object({
  organizerSetup: organizerSetupSchema.optional(),
  eventSetup: eventSetupSchema.optional(),
  venueSetup: venueSetupSchema.optional(),
  ticketSetup: ticketSetupSchema.optional(),
  sponsorSetup: sponsorSetupSchema.optional(),
  reviewPublish: reviewPublishSchema.optional(),
});

export type CompleteWizardFormData = z.infer<typeof completeWizardDataSchema>;

// ============================================
// Validation Helpers
// ============================================

export function validateStageData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });

  return errors;
}

// ============================================
// Export All Schemas
// ============================================

export const wizardSchemas = {
  organizerSetup: organizerSetupSchema,
  eventSetup: eventSetupSchema,
  venueSetup: venueSetupSchema,
  ticketSetup: ticketSetupSchema,
  sponsorSetup: sponsorSetupSchema,
  reviewPublish: reviewPublishSchema,
  complete: completeWizardDataSchema,
};
