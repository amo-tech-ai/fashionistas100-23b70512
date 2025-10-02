// ============================================
// Global State Provider (React Context) - CopilotKit State Machine Pattern
// Version: 1.0.0
// Date: October 2, 2025
// ============================================

"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { useCopilotReadable } from "@copilotkit/react-core";
import type {
  WizardStage,
  OrganizerSetupData,
  EventSetupData,
  VenueSetupData,
  TicketSetupData,
  SponsorSetupData,
  ReviewPublishData,
} from "./012-types-definitions";

// ============================================
// Context Types
// ============================================

interface EventWizardState {
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
  completeWizard: () => Promise<any>;

  reset: () => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
}

// ============================================
// Context Definition
// ============================================

const EventWizardContext = createContext<EventWizardState | null>(null);

// ============================================
// Stage Order
// ============================================

const STAGE_ORDER: WizardStage[] = [
  "organizerSetup",
  "eventSetup",
  "venueSetup",
  "ticketSetup",
  "sponsorSetup",
  "reviewPublish",
];

// ============================================
// Provider Component
// ============================================

interface EventWizardProviderProps {
  children: ReactNode;
  userId: string;
  initialSessionId?: string;
}

export function EventWizardProvider({
  children,
  userId,
  initialSessionId,
}: EventWizardProviderProps) {
  // Session state
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);

  // Stage state
  const [stage, setStage] = useState<WizardStage>("organizerSetup");
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Form data state
  const [organizerData, setOrganizerDataState] = useState<Partial<OrganizerSetupData>>({});
  const [eventData, setEventDataState] = useState<Partial<EventSetupData>>({});
  const [venueData, setVenueDataState] = useState<Partial<VenueSetupData>>({});
  const [ticketData, setTicketDataState] = useState<Partial<TicketSetupData>>({});
  const [sponsorData, setSponsorDataState] = useState<Partial<SponsorSetupData>>({});
  const [reviewData, setReviewDataState] = useState<Partial<ReviewPublishData>>({});

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ============================================
  // CopilotKit Readable Context - SINGLE GLOBAL READABLE
  // Official pattern: One readable in main component, not in stage hooks
  // ============================================

  useCopilotReadable({
    description: "Event Wizard State - Current stage, progress, and completion status",
    value: {
      // Current stage
      currentStage: stage,
      progress: completionPercentage,

      // Completion flags (NO PII - only booleans)
      hasOrganizerName: !!organizerData.name,
      hasOrganizerEmail: !!organizerData.email,
      hasOrganizerRole: !!organizerData.role,

      hasEventTitle: !!eventData.title,
      hasEventType: !!eventData.eventType,
      hasEventDescription: !!eventData.description,
      hasEventDates: !!eventData.startDate && !!eventData.endDate,

      hasVenueName: !!venueData.venueName,
      hasVenueAddress: !!venueData.address,
      hasVenueCapacity: !!venueData.capacity,

      hasTicketTiers: !!(ticketData.tiers && ticketData.tiers.length > 0),
      ticketTiersCount: ticketData.tiers?.length || 0,

      hasSponsors: !!(sponsorData.sponsors && sponsorData.sponsors.length > 0),
      sponsorsCount: sponsorData.sponsors?.length || 0,

      hasReviewed: !!reviewData.reviewed,
      hasAcceptedTerms: !!reviewData.termsAccepted,

      // Validation status
      isOrganizerComplete: !!(
        organizerData.name &&
        organizerData.email &&
        organizerData.role
      ),
      isEventComplete: !!(
        eventData.title &&
        eventData.eventType &&
        eventData.description &&
        eventData.startDate &&
        eventData.endDate
      ),
      isVenueComplete: !!(
        venueData.venueName &&
        venueData.address &&
        venueData.capacity
      ),
      isTicketComplete: !!(ticketData.tiers && ticketData.tiers.length > 0),
      isSponsorComplete: true, // Sponsors are optional
      isReviewComplete: !!(reviewData.reviewed && reviewData.termsAccepted),

      // Overall completion
      canProceedToNextStage: canProceedFromCurrentStage(),
      canPublish: isReadyToPublish(),
    },
  }, [stage, completionPercentage, organizerData, eventData, venueData, ticketData, sponsorData, reviewData]);

  // ============================================
  // Helper Functions
  // ============================================

  const canProceedFromCurrentStage = useCallback((): boolean => {
    switch (stage) {
      case "organizerSetup":
        return !!(organizerData.name && organizerData.email && organizerData.role);
      case "eventSetup":
        return !!(
          eventData.title &&
          eventData.eventType &&
          eventData.description &&
          eventData.startDate &&
          eventData.endDate
        );
      case "venueSetup":
        return !!(venueData.venueName && venueData.address && venueData.capacity);
      case "ticketSetup":
        return !!(ticketData.tiers && ticketData.tiers.length > 0);
      case "sponsorSetup":
        return true; // Sponsors are optional
      case "reviewPublish":
        return !!(reviewData.reviewed && reviewData.termsAccepted);
      default:
        return false;
    }
  }, [stage, organizerData, eventData, venueData, ticketData, sponsorData, reviewData]);

  const isReadyToPublish = useCallback((): boolean => {
    return !!(
      organizerData.name &&
      organizerData.email &&
      eventData.title &&
      eventData.eventType &&
      eventData.startDate &&
      eventData.endDate &&
      venueData.venueName &&
      venueData.address &&
      ticketData.tiers &&
      ticketData.tiers.length > 0 &&
      reviewData.reviewed &&
      reviewData.termsAccepted
    );
  }, [organizerData, eventData, venueData, ticketData, reviewData]);

  const calculateCompletionPercentage = useCallback((): number => {
    let completed = 0;
    const total = 6;

    if (organizerData.name && organizerData.email && organizerData.role) completed++;
    if (
      eventData.title &&
      eventData.eventType &&
      eventData.description &&
      eventData.startDate &&
      eventData.endDate
    )
      completed++;
    if (venueData.venueName && venueData.address && venueData.capacity) completed++;
    if (ticketData.tiers && ticketData.tiers.length > 0) completed++;
    if (sponsorData.sponsors && sponsorData.sponsors.length > 0) completed++;
    if (reviewData.reviewed && reviewData.termsAccepted) completed++;

    return Math.round((completed / total) * 100);
  }, [organizerData, eventData, venueData, ticketData, sponsorData, reviewData]);

  // Update completion percentage when data changes
  useEffect(() => {
    const percentage = calculateCompletionPercentage();
    setCompletionPercentage(percentage);
  }, [calculateCompletionPercentage]);

  // ============================================
  // Data Setters
  // ============================================

  const setOrganizerData = useCallback((data: Partial<OrganizerSetupData>) => {
    setOrganizerDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const setEventData = useCallback((data: Partial<EventSetupData>) => {
    setEventDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const setVenueData = useCallback((data: Partial<VenueSetupData>) => {
    setVenueDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const setTicketData = useCallback((data: Partial<TicketSetupData>) => {
    setTicketDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const setSponsorData = useCallback((data: Partial<SponsorSetupData>) => {
    setSponsorDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const setReviewData = useCallback((data: Partial<ReviewPublishData>) => {
    setReviewDataState((prev) => ({ ...prev, ...data }));
  }, []);

  // ============================================
  // Stage Navigation
  // ============================================

  const nextStage = useCallback(() => {
    if (!canProceedFromCurrentStage()) {
      setError("Please complete all required fields before proceeding");
      return;
    }

    const currentIndex = STAGE_ORDER.indexOf(stage);
    if (currentIndex < STAGE_ORDER.length - 1) {
      setStage(STAGE_ORDER[currentIndex + 1]);
      setError(null);
    }
  }, [stage, canProceedFromCurrentStage]);

  const previousStage = useCallback(() => {
    const currentIndex = STAGE_ORDER.indexOf(stage);
    if (currentIndex > 0) {
      setStage(STAGE_ORDER[currentIndex - 1]);
      setError(null);
    }
  }, [stage]);

  // ============================================
  // API Functions
  // ============================================

  const createSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/wizard/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const { sessionId: newSessionId } = await response.json();
      setSessionId(newSessionId);
      setSuccessMessage("Session created successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadSession = useCallback(async (loadSessionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/wizard/session/${loadSessionId}`);

      if (!response.ok) {
        throw new Error("Failed to load session");
      }

      const session = await response.json();

      // Restore state from session
      setSessionId(session.session_id);
      setStage(session.current_stage);
      setCompletionPercentage(session.completion_percentage);

      if (session.data.organizerSetup) setOrganizerDataState(session.data.organizerSetup);
      if (session.data.eventSetup) setEventDataState(session.data.eventSetup);
      if (session.data.venueSetup) setVenueDataState(session.data.venueSetup);
      if (session.data.ticketSetup) setTicketDataState(session.data.ticketSetup);
      if (session.data.sponsorSetup) setSponsorDataState(session.data.sponsorSetup);
      if (session.data.reviewPublish) setReviewDataState(session.data.reviewPublish);

      setSuccessMessage("Session loaded successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load session");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProgress = useCallback(async () => {
    if (!sessionId) {
      await createSession();
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/wizard/session/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          data: {
            organizerSetup: organizerData,
            eventSetup: eventData,
            venueSetup: venueData,
            ticketSetup: ticketData,
            sponsorSetup: sponsorData,
            reviewPublish: reviewData,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save progress");
      }

      setSuccessMessage("Progress saved successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save progress");
    } finally {
      setIsSaving(false);
    }
  }, [sessionId, stage, organizerData, eventData, venueData, ticketData, sponsorData, reviewData, createSession]);

  const completeWizard = useCallback(async () => {
    if (!sessionId) {
      throw new Error("No active session");
    }

    if (!isReadyToPublish()) {
      throw new Error("Please complete all required fields");
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/wizard/session/${sessionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to publish event");
      }

      const event = await response.json();
      setSuccessMessage("Event published successfully!");
      return event;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish event");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isReadyToPublish]);

  const reset = useCallback(() => {
    setSessionId(null);
    setStage("organizerSetup");
    setCompletionPercentage(0);
    setOrganizerDataState({});
    setEventDataState({});
    setVenueDataState({});
    setTicketDataState({});
    setSponsorDataState({});
    setReviewDataState({});
    setError(null);
    setSuccessMessage(null);
  }, []);

  // ============================================
  // Context Value
  // ============================================

  const value: EventWizardState = {
    sessionId,
    userId,
    stage,
    completionPercentage,
    organizerData,
    eventData,
    venueData,
    ticketData,
    sponsorData,
    reviewData,
    isLoading,
    isSaving,
    error,
    successMessage,
    setStage,
    setOrganizerData,
    setEventData,
    setVenueData,
    setTicketData,
    setSponsorData,
    setReviewData,
    nextStage,
    previousStage,
    saveProgress,
    loadSession,
    createSession,
    completeWizard,
    reset,
    setError,
    setSuccessMessage,
  };

  return <EventWizardContext.Provider value={value}>{children}</EventWizardContext.Provider>;
}

// ============================================
// Hook to use the context
// ============================================

export function useEventWizard() {
  const context = useContext(EventWizardContext);

  if (!context) {
    throw new Error("useEventWizard must be used within EventWizardProvider");
  }

  return context;
}
