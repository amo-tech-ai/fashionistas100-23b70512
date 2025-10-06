import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WizardStage = 
  | 'organizerSetup'
  | 'eventSetup'
  | 'venueSetup'
  | 'ticketSetup'
  | 'sponsorSetup'
  | 'reviewPublish'
  | 'published';

interface OrganizerInfo {
  name?: string;
  email?: string;
  organization?: string;
  role?: 'organizer' | 'designer' | 'brand' | 'agency';
  experience?: 'first_time' | 'occasional' | 'professional';
}

interface EventInfo {
  title?: string;
  type?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  description?: string;
}

interface VenueInfo {
  type?: 'physical' | 'virtual' | 'hybrid';
  name?: string;
  address?: string;
  capacity?: number;
}

interface TicketInfo {
  type?: 'simple' | 'tiered' | 'free';
  tiers?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

interface SponsorInfo {
  sponsors?: Array<{
    name: string;
    tier: string;
    amount: number;
  }>;
}

interface PaymentMethod {
  type?: 'stripe_connect' | 'manual';
  accountId?: string;
  onboarded?: boolean;
}

interface GlobalState {
  // Current state
  stage: WizardStage;
  sessionId: string;
  
  // Stage data
  organizerInfo: OrganizerInfo | null;
  eventInfo: EventInfo | null;
  venueInfo: VenueInfo | null;
  ticketInfo: TicketInfo | null;
  sponsorInfo: SponsorInfo | null;
  paymentMethod: PaymentMethod | null;
  brandInfo: any;
  eventPublished: any;
  
  // Actions
  setStage: (stage: WizardStage) => void;
  setOrganizerInfo: (info: OrganizerInfo) => void;
  setEventInfo: (info: EventInfo) => void;
  setVenueInfo: (info: VenueInfo) => void;
  setTicketInfo: (info: TicketInfo) => void;
  setSponsorInfo: (info: SponsorInfo) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setBrandInfo: (info: any) => void;
  setEventPublished: (data: any) => void;
  reset: () => void;
}

const initialState = {
  stage: 'organizerSetup' as WizardStage,
  sessionId: crypto.randomUUID(),
  organizerInfo: null,
  eventInfo: null,
  venueInfo: null,
  ticketInfo: null,
  sponsorInfo: null,
  paymentMethod: null,
  brandInfo: null,
  eventPublished: null,
};

export const useGlobalState = create<GlobalState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setStage: (stage) => set({ stage }),
      setOrganizerInfo: (organizerInfo) => set({ organizerInfo }),
      setEventInfo: (eventInfo) => set({ eventInfo }),
      setVenueInfo: (venueInfo) => set({ venueInfo }),
      setTicketInfo: (ticketInfo) => set({ ticketInfo }),
      setSponsorInfo: (sponsorInfo) => set({ sponsorInfo }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setBrandInfo: (brandInfo) => set({ brandInfo }),
      setEventPublished: (eventPublished) => set({ eventPublished, stage: 'published' }),
      reset: () => set({ ...initialState, sessionId: crypto.randomUUID() }),
    }),
    {
      name: 'event-wizard-storage',
    }
  )
);
