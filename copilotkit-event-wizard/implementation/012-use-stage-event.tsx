// ============================================
// Event Setup Stage Hook
// Version: 1.0.0
// Date: October 2, 2025
// ============================================

"use client";

import { useCopilotAction, useCopilotAdditionalInstructions, useCopilotReadable } from "@copilotkit/react-core";
import { useEventWizard } from "./014-global-state";
import { eventSetupSchema, validateStageData, getValidationErrors } from "./013-zod-schemas";
import type { EventSetupData } from "./012-types-definitions";
import { EVENT_TYPES } from "./012-types-definitions";

export function useStageEvent() {
  const {
    stage,
    eventData,
    setEventData,
    nextStage,
    previousStage,
    saveProgress,
    setError,
    setSuccessMessage,
  } = useEventWizard();

  useCopilotAdditionalInstructions(
    {
      instructions: `
CURRENT STATE: Event Details Setup Stage

You are helping the user configure their fashion event details.

Required Information:
- Title (3-200 characters) - catchy and descriptive
- Event Type (from list: ${EVENT_TYPES.join(", ")})
- Description (20-5000 characters) - compelling event description
- Start Date (must be in the future)
- End Date (must be after start date)

Optional Information:
- Featured image URL
- Gallery images (up to 10)
- Tags (up to 10)
- Target audience description
- Expected attendance number

Instructions:
1. Ask about the event title and type
2. Help craft a compelling event description
3. Confirm event dates
4. Suggest adding visual content (images)
5. Recommend relevant tags for discoverability
6. Once complete, suggest proceeding to venue selection

Be creative and helpful in suggesting event descriptions and titles.
      `,
      available: stage === "eventSetup" ? "available" : "disabled",
    },
    [stage]
  );

  useCopilotReadable(
    {
      description: "Event Setup Progress - What event details have been provided",
      value: {
        hasTitle: !!eventData.title,
        hasEventType: !!eventData.eventType,
        hasDescription: !!eventData.description,
        hasStartDate: !!eventData.startDate,
        hasEndDate: !!eventData.endDate,
        hasFeaturedImage: !!eventData.featuredImage,
        hasGallery: !!(eventData.gallery && eventData.gallery.length > 0),
        hasTags: !!(eventData.tags && eventData.tags.length > 0),
        isComplete: !!(
          eventData.title &&
          eventData.eventType &&
          eventData.description &&
          eventData.startDate &&
          eventData.endDate
        ),
        missingFields: [
          !eventData.title && "title",
          !eventData.eventType && "event type",
          !eventData.description && "description",
          !eventData.startDate && "start date",
          !eventData.endDate && "end date",
        ].filter(Boolean),
      },
      available: stage === "eventSetup" ? "available" : "disabled",
    },
    [stage, eventData]
  );

  useCopilotAction(
    {
      name: "updateEventData",
      description: "Update event details including title, type, description, dates, and media",
      parameters: [
        {
          name: "title",
          type: "string",
          description: "Event title (3-200 characters)",
          required: false,
        },
        {
          name: "eventType",
          type: "string",
          description: `Event type from: ${EVENT_TYPES.join(", ")}`,
          required: false,
        },
        {
          name: "description",
          type: "string",
          description: "Event description (20-5000 characters)",
          required: false,
        },
        {
          name: "startDate",
          type: "string",
          description: "Event start date (ISO format, must be in future)",
          required: false,
        },
        {
          name: "endDate",
          type: "string",
          description: "Event end date (ISO format, must be after start date)",
          required: false,
        },
        {
          name: "featuredImage",
          type: "string",
          description: "Featured image URL (optional)",
          required: false,
        },
        {
          name: "tags",
          type: "string[]",
          description: "Event tags for discoverability (optional, max 10)",
          required: false,
        },
        {
          name: "targetAudience",
          type: "string",
          description: "Target audience description (optional)",
          required: false,
        },
        {
          name: "expectedAttendance",
          type: "number",
          description: "Expected number of attendees (optional)",
          required: false,
        },
      ],
      handler: async ({
        title,
        eventType,
        description,
        startDate,
        endDate,
        featuredImage,
        tags,
        targetAudience,
        expectedAttendance,
      }) => {
        try {
          const updates: Partial<EventSetupData> = {};
          if (title !== undefined) updates.title = title;
          if (eventType !== undefined) updates.eventType = eventType;
          if (description !== undefined) updates.description = description;
          if (startDate !== undefined) updates.startDate = startDate;
          if (endDate !== undefined) updates.endDate = endDate;
          if (featuredImage !== undefined) updates.featuredImage = featuredImage;
          if (tags !== undefined) updates.tags = tags;
          if (targetAudience !== undefined) updates.targetAudience = targetAudience;
          if (expectedAttendance !== undefined) updates.expectedAttendance = expectedAttendance;

          const mergedData = { ...eventData, ...updates };
          const validation = validateStageData(eventSetupSchema, mergedData);

          if (!validation.success) {
            const errors = getValidationErrors(validation.errors);
            const errorMessages = Object.entries(errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            setError(`Validation failed: ${errorMessages}`);
            return `Validation errors: ${errorMessages}. Please fix these issues.`;
          }

          setEventData(updates);

          try {
            await saveProgress();
          } catch (saveError) {
            console.error("Auto-save failed:", saveError);
          }

          setSuccessMessage("Event details updated successfully");

          if (
            mergedData.title &&
            mergedData.eventType &&
            mergedData.description &&
            mergedData.startDate &&
            mergedData.endDate
          ) {
            return "Event details updated successfully! All required fields are complete. You can now proceed to Venue Selection.";
          }

          return "Event details updated successfully!";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to update event data";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "eventSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "proceedToVenueSetup",
      description: "Move to the Venue Selection stage after completing event details",
      parameters: [],
      handler: async () => {
        try {
          const validation = validateStageData(eventSetupSchema, eventData);

          if (!validation.success) {
            const errors = getValidationErrors(validation.errors);
            const errorMessages = Object.entries(errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            setError(`Cannot proceed: ${errorMessages}`);
            return `Please complete all required fields: ${errorMessages}`;
          }

          await saveProgress();
          nextStage();
          setSuccessMessage("Moving to Venue Selection");
          return "Excellent! Let's select a venue for your event.";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to proceed";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available:
        stage === "eventSetup" &&
        !!(
          eventData.title &&
          eventData.eventType &&
          eventData.description &&
          eventData.startDate &&
          eventData.endDate
        )
          ? "available"
          : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "returnToOrganizerSetup",
      description: "Go back to the Organizer Setup stage",
      parameters: [],
      handler: async () => {
        try {
          await saveProgress();
          previousStage();
          return "Returning to Organizer Setup.";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to go back";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "eventSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );
}
