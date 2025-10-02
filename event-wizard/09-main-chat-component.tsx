# 9. Main Event Wizard Chat Component

```typescript
// src/components/event-wizard-chat.tsx
import { useEffect, useState } from 'react';
import { CopilotKit, useCopilotChat } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import { useGlobalState } from '@/hooks/use-global-state';
import { useUser } from '@clerk/nextjs';

// Import all stage hooks
import { useStageOrganizer } from '@/hooks/stages/use-stage-organizer';
import { useStageEvent } from '@/hooks/stages/use-stage-event';
import { useStageVenue } from '@/hooks/stages/use-stage-venue';
import { useStageTickets } from '@/hooks/stages/use-stage-tickets';
import { useStageSponsors } from '@/hooks/stages/use-stage-sponsors';
import { useStageReview } from '@/hooks/stages/use-stage-review';

// Import form components
import { OrganizerForm } from './forms/organizer-form';
import { EventForm } from './forms/event-form';
import { VenueForm } from './forms/venue-form';
import { TicketsForm } from './forms/tickets-form';
import { SponsorsForm } from './forms/sponsors-form';
import { ReviewForm } from './forms/review-form';

// Import state visualizer
import { StateVisualizer } from './state-visualizer';

interface EventWizardChatProps {
  publicApiKey?: string;
}

export function EventWizardChat({ publicApiKey }: EventWizardChatProps) {
  const { user } = useUser();
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  
  const {
    sessionId,
    stage,
    initSession,
    loadFromBackend,
    completionPercentage
  } = useGlobalState();

  // Initialize all stage hooks (following CopilotKit pattern)
  useStageOrganizer();
  useStageEvent();
  useStageVenue();
  useStageTickets();
  useStageSponsors();
  useStageReview();

  // Initialize session
  useEffect(() => {
    const initializeWizard = async () => {
      if (!user) return;

      // Check for existing session
      const savedSessionId = localStorage.getItem('wizard_session_id');
      
      if (savedSessionId) {
        // Try to resume
        await loadFromBackend(savedSessionId);
      } else {
        // Create new session
        const newSessionId = crypto.randomUUID();
        initSession(newSessionId, user.id);
        localStorage.setItem('wizard_session_id', newSessionId);
      }
    };

    initializeWizard();
  }, [user]);

  // Render stage-specific form
  const renderStageForm = () => {
    switch (stage) {
      case 'organizerSetup':
        return <OrganizerForm />;
      case 'eventSetup':
        return <EventForm />;
      case 'venueSetup':
        return <VenueForm />;
      case 'ticketSetup':
        return <TicketsForm />;
      case 'sponsorsMedia':
        return <SponsorsForm />;
      case 'reviewPublish':
        return <ReviewForm />;
      default:
        return null;
    }
  };

  return (
    <CopilotKit publicApiKey={publicApiKey}>
      <div className="flex h-screen">
        {/* Left Panel - Forms */}
        <div className="w-1/2 p-6 overflow-y-auto border-r">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {stage}</span>
              <span>{completionPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Stage Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderStageForm()}
          </div>

          {/* State Visualizer */}
          <div className="mt-6">
            <StateVisualizer />
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="w-1/2 h-full">
          <EventWizardChatInner />
        </div>
      </div>
    </CopilotKit>
  );
}

function EventWizardChatInner() {
  const { appendMessage, isLoading } = useCopilotChat();
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const { stage } = useGlobalState();

  // Send initial message
  useEffect(() => {
    if (initialMessageSent || isLoading) return;

    const stageMessages = {
      organizerSetup: "Welcome! I'm your AI assistant for creating fashion events. Let's start by setting up your organizer profile.",
      eventSetup: "Great! Now let's define your event details.",
      venueSetup: "Time to choose where your event will happen.",
      ticketSetup: "Let's set up your ticketing strategy.",
      sponsorsMedia: "Would you like to add sponsors or media partners?",
      reviewPublish: "Almost done! Let's review everything before publishing."
    };

    setTimeout(() => {
      appendMessage({
        role: 'assistant',
        content: stageMessages[stage]
      });
      setInitialMessageSent(true);
    }, 500);
  }, [stage, initialMessageSent, appendMessage, isLoading]);

  return (
    <CopilotChat
      className="h-full"
      labels={{
        title: "Event Wizard Assistant",
        initial: "How can I help you create your fashion event?"
      }}
      icons={{
        sendIcon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )
      }}
    />
  );
}
```