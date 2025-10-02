// ============================================
// Review & Publish Stage Hook
// Version: 1.0.0
// Date: October 2, 2025
// ============================================

"use client";

import { useCopilotAction, useCopilotAdditionalInstructions, useCopilotReadable } from "@copilotkit/react-core";
import { useEventWizard } from "./014-global-state";
import { reviewPublishSchema, validateStageData, getValidationErrors } from "./013-zod-schemas";
import type { ReviewPublishData } from "./012-types-definitions";

export function useStageReview() {
  const {
    stage,
    reviewData,
    setReviewData,
    previousStage,
    completeWizard,
    organizerData,
    eventData,
    venueData,
    ticketData,
    sponsorData,
    saveProgress,
    setError,
    setSuccessMessage,
    isLoading,
  } = useEventWizard();

  useCopilotAdditionalInstructions(
    {
      instructions: `
CURRENT STATE: Review & Publish Stage

You are helping the user review all their event details and publish the event.

Required Actions:
- Confirm they have reviewed all details (reviewed: true)
- Accept terms and conditions (termsAccepted: true)

Optional Settings:
- Publish date (defaults to immediate)
- Marketing consent
- Notification preferences

Summary of Event:
- Organizer: ${organizerData.name || "Not set"}
- Event: ${eventData.title || "Not set"} (${eventData.eventType || "Not set"})
- Dates: ${eventData.startDate || "Not set"} to ${eventData.endDate || "Not set"}
- Venue: ${venueData.venueName || "Not set"} (Capacity: ${venueData.capacity || "Not set"})
- Ticket Tiers: ${ticketData.tiers?.length || 0}
- Sponsors: ${sponsorData.sponsors?.length || 0}

Instructions:
1. Present a clear summary of all event details
2. Ask them to review each section
3. Confirm they accept the terms and conditions
4. Offer to make any last-minute changes
5. Once confirmed, publish the event immediately
6. Celebrate their success!

Be thorough in the review to catch any errors before publishing.
      `,
      available: stage === "reviewPublish" ? "available" : "disabled",
    },
    [stage, organizerData, eventData, venueData, ticketData, sponsorData]
  );

  useCopilotReadable(
    {
      description: "Review & Publish Progress - Final checklist before publishing event",
      value: {
        hasReviewed: !!reviewData.reviewed,
        hasAcceptedTerms: !!reviewData.termsAccepted,
        hasMarketingConsent: !!reviewData.marketingConsent,
        hasPublishDate: !!reviewData.publishDate,
        hasNotificationPreferences: !!reviewData.notificationPreferences,
        isReadyToPublish: !!(reviewData.reviewed && reviewData.termsAccepted),
        isPublishing: isLoading,
        completionSummary: {
          hasOrganizer: !!(organizerData.name && organizerData.email),
          hasEvent: !!(eventData.title && eventData.startDate),
          hasVenue: !!(venueData.venueName && venueData.capacity),
          hasTickets: !!(ticketData.tiers && ticketData.tiers.length > 0),
          hasSponsors: !!(sponsorData.sponsors && sponsorData.sponsors.length > 0),
        },
        missingFields: [
          !reviewData.reviewed && "review confirmation",
          !reviewData.termsAccepted && "terms acceptance",
        ].filter(Boolean),
      },
      available: stage === "reviewPublish" ? "available" : "disabled",
    },
    [stage, reviewData, isLoading, organizerData, eventData, venueData, ticketData, sponsorData]
  );

  useCopilotAction(
    {
      name: "confirmReview",
      description: "Confirm that the user has reviewed all event details and accepts terms",
      parameters: [
        {
          name: "reviewed",
          type: "boolean",
          description: "User confirms they have reviewed all details (required)",
          required: true,
        },
        {
          name: "termsAccepted",
          type: "boolean",
          description: "User accepts terms and conditions (required)",
          required: true,
        },
        {
          name: "marketingConsent",
          type: "boolean",
          description: "User consents to marketing communications (optional)",
          required: false,
        },
        {
          name: "publishDate",
          type: "string",
          description: "When to publish the event (ISO format, optional, defaults to now)",
          required: false,
        },
      ],
      handler: async ({ reviewed, termsAccepted, marketingConsent, publishDate }) => {
        try {
          const updates: Partial<ReviewPublishData> = {
            reviewed,
            termsAccepted,
            marketingConsent,
            publishDate,
          };

          const mergedData = { ...reviewData, ...updates };
          const validation = validateStageData(reviewPublishSchema, mergedData);

          if (!validation.success) {
            const errors = getValidationErrors(validation.errors);
            const errorMessages = Object.entries(errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            setError(`Validation failed: ${errorMessages}`);
            return `Cannot proceed: ${errorMessages}`;
          }

          setReviewData(updates);

          try {
            await saveProgress();
          } catch (saveError) {
            console.error("Auto-save failed:", saveError);
          }

          if (reviewed && termsAccepted) {
            setSuccessMessage("Review confirmed! Ready to publish.");
            return "Perfect! You've confirmed everything and accepted the terms. You're ready to publish your event!";
          } else {
            setError("You must review all details and accept terms to publish");
            return "Please review all details and accept the terms and conditions to proceed.";
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to confirm review";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "reviewPublish" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "publishEvent",
      description: "Publish the event after review confirmation. This creates the event in the database and makes it live.",
      parameters: [],
      handler: async () => {
        try {
          // Final validation
          const validation = validateStageData(reviewPublishSchema, reviewData);

          if (!validation.success) {
            const errors = getValidationErrors(validation.errors);
            const errorMessages = Object.entries(errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            setError(`Cannot publish: ${errorMessages}`);
            return `Please complete review: ${errorMessages}`;
          }

          if (!reviewData.reviewed || !reviewData.termsAccepted) {
            setError("You must review all details and accept terms before publishing");
            return "Please confirm you've reviewed everything and accept the terms first.";
          }

          // Publish the event
          setSuccessMessage("Publishing your event...");
          const event = await completeWizard();

          return `🎉 Congratulations! Your event "${eventData.title}" has been published successfully!

Event URL: /events/${event.slug}
Event ID: ${event.id}

Your event is now live and attendees can start registering. Good luck with your fashion event!`;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to publish event";
          setError(message);
          return `Error publishing event: ${message}. Please try again or contact support if the issue persists.`;
        }
      },
      available:
        stage === "reviewPublish" && !!(reviewData.reviewed && reviewData.termsAccepted) && !isLoading
          ? "available"
          : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "updateNotificationPreferences",
      description: "Set notification preferences for event updates",
      parameters: [
        {
          name: "emailNotifications",
          type: "boolean",
          description: "Receive email notifications",
          required: false,
        },
        {
          name: "smsNotifications",
          type: "boolean",
          description: "Receive SMS notifications",
          required: false,
        },
        {
          name: "pushNotifications",
          type: "boolean",
          description: "Receive push notifications",
          required: false,
        },
        {
          name: "marketingEmails",
          type: "boolean",
          description: "Receive marketing emails",
          required: false,
        },
      ],
      handler: async ({ emailNotifications, smsNotifications, pushNotifications, marketingEmails }) => {
        try {
          const preferences = {
            emailNotifications: emailNotifications ?? true,
            smsNotifications: smsNotifications ?? false,
            pushNotifications: pushNotifications ?? true,
            marketingEmails: marketingEmails ?? false,
          };

          setReviewData({ notificationPreferences: preferences });

          try {
            await saveProgress();
          } catch (saveError) {
            console.error("Auto-save failed:", saveError);
          }

          setSuccessMessage("Notification preferences updated");
          return "Notification preferences saved successfully!";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to update preferences";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "reviewPublish" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "returnToSponsorSetup",
      description: "Go back to the Sponsor Setup stage to make changes",
      parameters: [],
      handler: async () => {
        try {
          await saveProgress();
          previousStage();
          return "Returning to Sponsor Setup to make changes.";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to go back";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "reviewPublish" && !isLoading ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "getSummary",
      description: "Get a complete summary of all event details for review",
      parameters: [],
      handler: async () => {
        return `
📋 Event Summary

👤 Organizer:
- Name: ${organizerData.name || "Not set"}
- Email: ${organizerData.email || "Not set"}
- Organization: ${organizerData.organization || "None"}

🎭 Event Details:
- Title: ${eventData.title || "Not set"}
- Type: ${eventData.eventType || "Not set"}
- Description: ${eventData.description?.substring(0, 100) || "Not set"}...
- Start Date: ${eventData.startDate || "Not set"}
- End Date: ${eventData.endDate || "Not set"}

📍 Venue:
- Name: ${venueData.venueName || "Not set"}
- Address: ${venueData.address || "Not set"}, ${venueData.city || "Not set"}
- Capacity: ${venueData.capacity || "Not set"}

🎫 Tickets:
- Tiers: ${ticketData.tiers?.length || 0}
${ticketData.tiers?.map((t) => `  - ${t.name}: $${t.price} (${t.quantity} available)`).join("\n") || "  None configured"}

💎 Sponsors:
- Count: ${sponsorData.sponsors?.length || 0}
${sponsorData.sponsors?.map((s) => `  - ${s.name} (${s.tier}): $${s.amount}`).join("\n") || "  None yet"}

✅ Review Status:
- Reviewed: ${reviewData.reviewed ? "Yes" : "No"}
- Terms Accepted: ${reviewData.termsAccepted ? "Yes" : "No"}
- Ready to Publish: ${reviewData.reviewed && reviewData.termsAccepted ? "✅ Yes" : "❌ No"}
        `;
      },
      available: stage === "reviewPublish" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );
}
