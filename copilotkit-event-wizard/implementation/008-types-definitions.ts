// ============================================
// TypeScript Type Definitions
// Version: 1.0.0
// Date: October 2, 2025
// ============================================

// ============================================
// Database Types
// ============================================

export type UserRole = 
  | 'organizer'
  | 'designer'
  | 'model'
  | 'venue'
  | 'vendor'
  | 'sponsor'
  | 'media'
  | 'buyer';

export type EventStatus = 
  | 'draft'
  | 'published'
  | 'cancelled'
  | 'completed';

export type WizardStage = 
  | 'organizerSetup'
  | 'eventSetup'
  | 'venueSetup'
  | 'ticketSetup'
  | 'sponsorSetup'
  | 'reviewPublish';

export type SessionStatus = 
  | 'active'
  | 'completed'
  | 'abandoned'
  | 'expired';

// ============================================
// Entity Types
// ============================================

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  role: UserRole;
  profile_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  event_type: string;
  status: EventStatus;
  organizer_id: string;
  venue_id?: string;
  start_date: string;
  end_date: string;
  capacity?: number;
  ticket_tiers: TicketTier[];
  featured_image?: string;
  gallery?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WizardSession {
  session_id: string;
  user_id: string;
  current_stage: WizardStage;
  status: SessionStatus;
  completion_percentage: number;
  data: WizardData;
  started_at: string;
  completed_at?: string;
  last_activity_at: string;
  event_id?: string;
}

export interface WizardAction {
  id: string;
  session_id: string;
  action_name: string;
  stage: WizardStage;
  params: Record<string, any>;
  result?: Record<string, any>;
  success: boolean;
  error_message?: string;
  duration_ms?: number;
  created_at: string;
}

export interface WizardInteraction {
  id: string;
  session_id: string;
  interaction_type: string;
  stage: WizardStage;
  user_message?: string;
  ai_response?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// ============================================
// Wizard Data Types
// ============================================

export interface WizardData {
  organizerSetup?: OrganizerSetupData;
  eventSetup?: EventSetupData;
  venueSetup?: VenueSetupData;
  ticketSetup?: TicketSetupData;
  sponsorSetup?: SponsorSetupData;
  reviewPublish?: ReviewPublishData;
}

export interface OrganizerSetupData {
  name: string;
  email: string;
  organization?: string;
  role: string;
  phone?: string;
  website?: string;
  bio?: string;
}

export interface EventSetupData {
  title: string;
  slug?: string;
  eventType: string;
  description: string;
  startDate: string;
  endDate: string;
  featuredImage?: string;
  gallery?: string[];
  tags?: string[];
  targetAudience?: string;
  expectedAttendance?: number;
}

export interface VenueSetupData {
  venueName: string;
  venueId?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  capacity: number;
  amenities?: string[];
  parkingAvailable?: boolean;
  accessibilityFeatures?: string[];
  venueType?: string;
  rentalCost?: number;
}

export interface TicketSetupData {
  tiers: TicketTier[];
  earlyBirdDiscount?: number;
  groupDiscountThreshold?: number;
  groupDiscountPercentage?: number;
  refundPolicy?: string;
  salesStartDate?: string;
  salesEndDate?: string;
}

export interface TicketTier {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  benefits?: string[];
  maxPerCustomer?: number;
  available?: boolean;
}

export interface SponsorSetupData {
  sponsors: Sponsor[];
  targetAmount?: number;
  sponsorshipTiers?: SponsorshipTier[];
  benefits?: string[];
  deadline?: string;
}

export interface Sponsor {
  id?: string;
  name: string;
  logo?: string;
  website?: string;
  tier: string;
  amount: number;
  benefits?: string[];
}

export interface SponsorshipTier {
  name: string;
  minAmount: number;
  maxAmount?: number;
  benefits: string[];
  spotsAvailable?: number;
}

export interface ReviewPublishData {
  reviewed: boolean;
  publishDate?: string;
  marketingConsent?: boolean;
  termsAccepted: boolean;
  notificationPreferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// ============================================
// CopilotKit Action Types
// ============================================

export interface CopilotActionParams {
  [key: string]: any;
}

export interface CopilotActionResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface CopilotReadableContext {
  stage: WizardStage;
  progress: number;
  hasName: boolean;
  hasEmail: boolean;
  hasOrganization: boolean;
  hasEvent: boolean;
  hasVenue: boolean;
  hasTickets: boolean;
  hasSponsors: boolean;
  isValid: boolean;
  canProceed: boolean;
  requirements: Record<string, string>;
}

// ============================================
// Form Types
// ============================================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  validation?: FieldValidation;
  options?: SelectOption[];
  defaultValue?: any;
  helperText?: string;
  disabled?: boolean;
}

export interface FieldValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ============================================
// State Management Types
// ============================================

export interface WizardState {
  // Session
  sessionId: string | null;
  userId: string | null;
  
  // Stage
  stage: WizardStage;
  completionPercentage: number;
  
  // Data
  organizerData: Partial<OrganizerSetupData>;
  eventData: Partial<EventSetupData>;
  venueData: Partial<VenueSetupData>;
  ticketData: Partial<TicketSetupData>;
  sponsorData: Partial<SponsorSetupData>;
  reviewData: Partial<ReviewPublishData>;
  
  // UI State
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successMessage: string | null;
  
  // Actions
  setStage: (stage: WizardStage) => void;
  setOrganizerData: (data: Partial<OrganizerSetupData>) => void;
  setEventData: (data: Partial<EventSetupData>) => void;
  setVenueData: (data: Partial<VenueSetupData>) => void;
  setTicketData: (data: Partial<TicketSetupData>) => void;
  setSponsorData: (data: Partial<SponsorSetupData>) => void;
  setReviewData: (data: Partial<ReviewPublishData>) => void;
  
  nextStage: () => void;
  previousStage: () => void;
  saveProgress: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  createSession: () => Promise<void>;
  completeWizard: () => Promise<Event>;
  
  reset: () => void;
}

// ============================================
// Utility Types
// ============================================

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type Nullable<T> = T | null;

export type AsyncFunction<T = any, R = any> = (args: T) => Promise<R>;

export type StageProgress = {
  [K in WizardStage]: number;
};

// ============================================
// Constants
// ============================================

export const WIZARD_STAGES: WizardStage[] = [
  'organizerSetup',
  'eventSetup',
  'venueSetup',
  'ticketSetup',
  'sponsorSetup',
  'reviewPublish'
];

export const STAGE_LABELS: Record<WizardStage, string> = {
  organizerSetup: 'Organizer Setup',
  eventSetup: 'Event Details',
  venueSetup: 'Venue Selection',
  ticketSetup: 'Ticketing',
  sponsorSetup: 'Sponsors',
  reviewPublish: 'Review & Publish'
};

export const STAGE_DESCRIPTIONS: Record<WizardStage, string> = {
  organizerSetup: 'Tell us about yourself and your organization',
  eventSetup: 'Provide details about your fashion event',
  venueSetup: 'Select or add a venue for your event',
  ticketSetup: 'Configure ticket tiers and pricing',
  sponsorSetup: 'Add sponsors and partnership details',
  reviewPublish: 'Review all details and publish your event'
};

export const EVENT_TYPES = [
  'Fashion Show',
  'Trunk Show',
  'Pop-up Shop',
  'Fashion Week',
  'Trade Show',
  'Workshop',
  'Conference',
  'Photoshoot',
  'Casting Call',
  'Other'
] as const;

export type EventType = typeof EVENT_TYPES[number];
