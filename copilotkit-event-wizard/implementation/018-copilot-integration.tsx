// ============================================
// CopilotKit Integration Component
// Version: 1.0.0
// Date: October 2, 2025
// ============================================

"use client";

import { ReactNode } from "react";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

import { EventWizardProvider } from "./014-global-state";
import { useStageOrganizer } from "./020-use-stage-organizer";
import { useStageEvent } from "./021-use-stage-event";
import { useStageVenue } from "./022-use-stage-venue";
import { useStageTicket } from "./023-use-stage-ticket";
import { useStageSponsor } from "./024-use-stage-sponsors";
import { useStageReview } from "./025-use-stage-review";

// ============================================
// Stage Hooks Orchestrator
// This component calls all stage hooks
// CRITICAL: All hooks must be called at component level
// ============================================

function EventWizardStageHooks() {
  // Initialize ALL stage hooks
  // Each hook internally manages its own availability based on current stage
  useStageOrganizer();
  useStageEvent();
  useStageVenue();
  useStageTicket();
  useStageSponsor();
  useStageReview();

  return null; // This component only manages hooks
}

// ============================================
// CopilotKit Wrapper with Event Wizard State
// ============================================

interface EventWizardCopilotProps {
  children: ReactNode;
  userId: string;
  initialSessionId?: string;
  publicApiKey: string;
  showPopup?: boolean;
}

export function EventWizardCopilot({
  children,
  userId,
  initialSessionId,
  publicApiKey,
  showPopup = true,
}: EventWizardCopilotProps) {
  return (
    <CopilotKit publicApiKey={publicApiKey} runtimeUrl="/api/copilotkit">
      <EventWizardProvider userId={userId} initialSessionId={initialSessionId}>
        {/* Initialize all stage hooks */}
        <EventWizardStageHooks />

        {/* Render children (wizard UI) */}
        {children}

        {/* CopilotKit chat interface */}
        {showPopup && (
          <CopilotPopup
            labels={{
              title: "Event Wizard Assistant",
              initial: "Hi! I'm your AI assistant for creating fashion events. Let's get started with your organizer profile!",
            }}
            defaultOpen={true}
          />
        )}
      </EventWizardProvider>
    </CopilotKit>
  );
}

// ============================================
// Alternative: Inline Chat Integration
// For embedding chat directly in the wizard UI
// ============================================

import { CopilotChat } from "@copilotkit/react-ui";

interface EventWizardInlineChatProps {
  children: ReactNode;
  userId: string;
  initialSessionId?: string;
  publicApiKey: string;
}

export function EventWizardInlineChat({
  children,
  userId,
  initialSessionId,
  publicApiKey,
}: EventWizardInlineChatProps) {
  return (
    <CopilotKit publicApiKey={publicApiKey} runtimeUrl="/api/copilotkit">
      <EventWizardProvider userId={userId} initialSessionId={initialSessionId}>
        <EventWizardStageHooks />

        <div className="flex h-screen">
          {/* Left side: Wizard form */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>

          {/* Right side: AI chat */}
          <div className="w-96 border-l">
            <CopilotChat
              labels={{
                title: "Event Wizard Assistant",
                initial: "Hi! I'm your AI assistant. Let's create your fashion event together!",
              }}
              className="h-full"
            />
          </div>
        </div>
      </EventWizardProvider>
    </CopilotKit>
  );
}

// ============================================
// Simplified Wrapper for Basic Usage
// ============================================

interface SimpleEventWizardProps {
  children: ReactNode;
  userId: string;
  sessionId?: string;
}

export function SimpleEventWizard({ children, userId, sessionId }: SimpleEventWizardProps) {
  const publicApiKey = process.env.NEXT_PUBLIC_CPK_PUBLIC_API_KEY;

  if (!publicApiKey) {
    throw new Error("NEXT_PUBLIC_CPK_PUBLIC_API_KEY is not set in environment variables");
  }

  return (
    <EventWizardCopilot
      userId={userId}
      initialSessionId={sessionId}
      publicApiKey={publicApiKey}
      showPopup={true}
    >
      {children}
    </EventWizardCopilot>
  );
}

// ============================================
// Usage Examples
// ============================================

/*
// Example 1: Popup Chat (Recommended)
import { EventWizardCopilot } from "./044-copilot-integration";

function MyEventPage() {
  const { userId } = useAuth();

  return (
    <EventWizardCopilot
      userId={userId}
      publicApiKey={process.env.NEXT_PUBLIC_CPK_PUBLIC_API_KEY}
      showPopup={true}
    >
      <EventWizardForm />
    </EventWizardCopilot>
  );
}

// Example 2: Inline Chat
import { EventWizardInlineChat } from "./044-copilot-integration";

function MyEventPage() {
  const { userId } = useAuth();

  return (
    <EventWizardInlineChat
      userId={userId}
      publicApiKey={process.env.NEXT_PUBLIC_CPK_PUBLIC_API_KEY}
    >
      <EventWizardForm />
    </EventWizardInlineChat>
  );
}

// Example 3: Simplified (uses env var automatically)
import { SimpleEventWizard } from "./044-copilot-integration";

function MyEventPage() {
  const { userId } = useAuth();

  return (
    <SimpleEventWizard userId={userId}>
      <EventWizardForm />
    </SimpleEventWizard>
  );
}

// Example 4: Resume existing session
import { EventWizardCopilot } from "./044-copilot-integration";

function ResumeEventPage() {
  const { userId } = useAuth();
  const { sessionId } = useParams();

  return (
    <EventWizardCopilot
      userId={userId}
      initialSessionId={sessionId}
      publicApiKey={process.env.NEXT_PUBLIC_CPK_PUBLIC_API_KEY}
    >
      <EventWizardForm />
    </EventWizardCopilot>
  );
}
*/
