// ============================================
// Main Chat Component - CopilotKit State Machine Pattern
// Version: 1.0.0
// Date: October 2, 2025
// ============================================

"use client";

import { useState, useEffect } from "react";
import { CopilotKit, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useEventWizard } from "./014-global-state";
import { useStageOrganizer } from "./020-use-stage-organizer";
import { useStageEvent } from "./021-use-stage-event";
import { useStageVenue } from "./022-use-stage-venue";
import { useStageTicket } from "./023-use-stage-ticket";
import { useStageSponsor } from "./024-use-stage-sponsors";
import { useStageReview } from "./025-use-stage-review";
import type { WizardStage } from "./012-types-definitions";

// ============================================
// Stage Order (Official Pattern)
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
// Main Chat Component
// ============================================

interface EventWizardChatProps {
  userId: string;
  initialSessionId?: string;
  publicApiKey: string;
}

export function EventWizardChat({ 
  userId, 
  initialSessionId, 
  publicApiKey 
}: EventWizardChatProps) {
  // ============================================
  // State Management (Official Pattern)
  // ============================================
  
  const [stage, setStage] = useState<WizardStage>("organizerSetup");
  const [isInitialized, setIsInitialized] = useState(false);

  // ============================================
  // Global State Context
  // ============================================
  
  const wizardState = useEventWizard();

  // ============================================
  // Single Global Readable (Official Pattern)
  // ============================================
  
  useCopilotReadable({
    description: "Event Wizard State - Current stage, progress, and completion status",
    value: {
      currentStage: stage,
      progress: wizardState.completionPercentage,
      
      // Completion flags (NO PII - only booleans)
      hasOrganizerName: !!wizardState.organizerData.name,
      hasOrganizerEmail: !!wizardState.organizerData.email,
      hasOrganizerRole: !!wizardState.organizerData.role,
      
      hasEventTitle: !!wizardState.eventData.title,
      hasEventType: !!wizardState.eventData.eventType,
      hasEventDescription: !!wizardState.eventData.description,
      hasEventDates: !!wizardState.eventData.startDate && !!wizardState.eventData.endDate,
      
      hasVenueName: !!wizardState.venueData.venueName,
      hasVenueAddress: !!wizardState.venueData.address,
      hasVenueCapacity: !!wizardState.venueData.capacity,
      
      hasTicketTiers: !!(wizardState.ticketData.tiers && wizardState.ticketData.tiers.length > 0),
      ticketTiersCount: wizardState.ticketData.tiers?.length || 0,
      
      hasSponsors: !!(wizardState.sponsorData.sponsors && wizardState.sponsorData.sponsors.length > 0),
      sponsorsCount: wizardState.sponsorData.sponsors?.length || 0,
      
      hasReviewed: !!wizardState.reviewData.reviewed,
      hasAcceptedTerms: !!wizardState.reviewData.termsAccepted,
      
      // Validation status
      isOrganizerComplete: !!(
        wizardState.organizerData.name &&
        wizardState.organizerData.email &&
        wizardState.organizerData.role
      ),
      isEventComplete: !!(
        wizardState.eventData.title &&
        wizardState.eventData.eventType &&
        wizardState.eventData.description &&
        wizardState.eventData.startDate &&
        wizardState.eventData.endDate
      ),
      isVenueComplete: !!(
        wizardState.venueData.venueName &&
        wizardState.venueData.address &&
        wizardState.venueData.capacity
      ),
      isTicketComplete: !!(wizardState.ticketData.tiers && wizardState.ticketData.tiers.length > 0),
      isSponsorComplete: true, // Sponsors are optional
      isReviewComplete: !!(wizardState.reviewData.reviewed && wizardState.reviewData.termsAccepted),
      
      // Overall completion
      canProceedToNextStage: canProceedFromCurrentStage(),
      canPublish: isReadyToPublish(),
    },
  }, [stage, wizardState.completionPercentage, wizardState.organizerData, wizardState.eventData, wizardState.venueData, wizardState.ticketData, wizardState.sponsorData, wizardState.reviewData]);

  // ============================================
  // Helper Functions
  // ============================================
  
  const canProceedFromCurrentStage = (): boolean => {
    switch (stage) {
      case "organizerSetup":
        return !!(
          wizardState.organizerData.name &&
          wizardState.organizerData.email &&
          wizardState.organizerData.role
        );
      case "eventSetup":
        return !!(
          wizardState.eventData.title &&
          wizardState.eventData.eventType &&
          wizardState.eventData.description &&
          wizardState.eventData.startDate &&
          wizardState.eventData.endDate
        );
      case "venueSetup":
        return !!(
          wizardState.venueData.venueName &&
          wizardState.venueData.address &&
          wizardState.venueData.capacity
        );
      case "ticketSetup":
        return !!(wizardState.ticketData.tiers && wizardState.ticketData.tiers.length > 0);
      case "sponsorSetup":
        return true; // Sponsors are optional
      case "reviewPublish":
        return !!(
          wizardState.reviewData.reviewed &&
          wizardState.reviewData.termsAccepted
        );
      default:
        return false;
    }
  };

  const isReadyToPublish = (): boolean => {
    return !!(
      wizardState.organizerData.name &&
      wizardState.organizerData.email &&
      wizardState.eventData.title &&
      wizardState.eventData.eventType &&
      wizardState.eventData.startDate &&
      wizardState.eventData.endDate &&
      wizardState.venueData.venueName &&
      wizardState.venueData.address &&
      wizardState.ticketData.tiers &&
      wizardState.ticketData.tiers.length > 0 &&
      wizardState.reviewData.reviewed &&
      wizardState.reviewData.termsAccepted
    );
  };

  // ============================================
  // Stage Navigation
  // ============================================
  
  const nextStage = () => {
    const currentIndex = STAGE_ORDER.indexOf(stage);
    if (currentIndex < STAGE_ORDER.length - 1) {
      setStage(STAGE_ORDER[currentIndex + 1]);
    }
  };

  const previousStage = () => {
    const currentIndex = STAGE_ORDER.indexOf(stage);
    if (currentIndex > 0) {
      setStage(STAGE_ORDER[currentIndex - 1]);
    }
  };

  // ============================================
  // Initialize All Stage Hooks (Official Pattern)
  // ============================================
  
  // Each stage hook is initialized with the current stage and state setters
  useStageOrganizer();
  useStageEvent();
  useStageVenue();
  useStageTicket();
  useStageSponsor();
  useStageReview();

  // ============================================
  // Initialization
  // ============================================
  
  useEffect(() => {
    if (!isInitialized) {
      // Load session if provided
      if (initialSessionId) {
        wizardState.loadSession(initialSessionId);
      } else {
        // Create new session
        wizardState.createSession();
      }
      setIsInitialized(true);
    }
  }, [isInitialized, initialSessionId, wizardState]);

  // ============================================
  // Render
  // ============================================
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold text-gray-900">
          FashionOS Event Wizard
        </h1>
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Stage: {stage}</span>
            <span>Progress: {wizardState.completionPercentage}%</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${wizardState.completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex">
        <div className="flex-1">
          <CopilotKit publicApiKey={publicApiKey}>
            <CopilotChat
              labels={{
                title: "Event Creation Assistant",
                initial: "Hi! I'm here to help you create your fashion event. Let's start with your organizer information.",
              }}
              className="h-full"
            />
          </CopilotKit>
        </div>
      </div>

      {/* Error/Success Messages */}
      {wizardState.error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="text-red-700">{wizardState.error}</div>
        </div>
      )}
      
      {wizardState.successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="text-green-700">{wizardState.successMessage}</div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Export
// ============================================

export default EventWizardChat;
