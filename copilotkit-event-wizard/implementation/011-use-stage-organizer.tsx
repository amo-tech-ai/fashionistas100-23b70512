// ============================================
// Organizer Setup Stage Hook
// Version: 1.0.0
// Date: October 2, 2025
// ============================================

"use client";

import { useCopilotAction, useCopilotAdditionalInstructions, useCopilotReadable } from "@copilotkit/react-core";
import { useEventWizard } from "./014-global-state";
import { organizerSetupSchema, validateStageData, getValidationErrors } from "./013-zod-schemas";
import type { OrganizerSetupData } from "./012-types-definitions";

export function useStageOrganizer() {
  const {
    stage,
    setStage,
    organizerData,
    setOrganizerData,
    nextStage,
    saveProgress,
    setError,
    setSuccessMessage,
  } = useEventWizard();

  // ============================================
  // Stage-Specific AI Instructions
  // CRITICAL: Include [stage] dependency array
  // ============================================

  useCopilotAdditionalInstructions(
    {
      instructions: `
CURRENT STATE: Organizer Setup Stage

You are helping the user set up their organizer profile for creating a fashion event.

Required Information:
- Name (2-100 characters)
- Email (valid email format)
- Role (2-100 characters)

Optional Information:
- Organization name
- Phone number
- Website URL
- Bio (max 1000 characters)

Instructions:
1. Greet the user warmly and explain this is the first step
2. Ask for their name, email, and role
3. Suggest adding organization details if they represent a company
4. Once all required fields are complete, suggest moving to event details
5. Be encouraging and professional

Do NOT proceed to the next stage without user confirmation.
      `,
      available: stage === "organizerSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Dependency array
  );

  // ============================================
  // Stage-Specific Readable Context
  // ============================================

  useCopilotReadable(
    {
      description: "Organizer Setup Progress - What information has been provided",
      value: {
        hasName: !!organizerData.name,
        hasEmail: !!organizerData.email,
        hasRole: !!organizerData.role,
        hasOrganization: !!organizerData.organization,
        hasPhone: !!organizerData.phone,
        hasWebsite: !!organizerData.website,
        hasBio: !!organizerData.bio,
        isComplete: !!(organizerData.name && organizerData.email && organizerData.role),
        missingFields: [
          !organizerData.name && "name",
          !organizerData.email && "email",
          !organizerData.role && "role",
        ].filter(Boolean),
      },
      available: stage === "organizerSetup" ? "available" : "disabled",
    },
    [stage, organizerData] // CRITICAL: Dependency array
  );

  // ============================================
  // CopilotKit Actions
  // ============================================

  // Action: Update Organizer Data
  useCopilotAction(
    {
      name: "updateOrganizerData",
      description: "Update organizer profile information including name, email, role, organization, phone, website, and bio",
      parameters: [
        {
          name: "name",
          type: "string",
          description: "Organizer's full name (2-100 characters)",
          required: false,
        },
        {
          name: "email",
          type: "string",
          description: "Organizer's email address (valid email format)",
          required: false,
        },
        {
          name: "role",
          type: "string",
          description: "Organizer's role or title (e.g., Event Coordinator, Fashion Director)",
          required: false,
        },
        {
          name: "organization",
          type: "string",
          description: "Organization or company name (optional)",
          required: false,
        },
        {
          name: "phone",
          type: "string",
          description: "Contact phone number (optional)",
          required: false,
        },
        {
          name: "website",
          type: "string",
          description: "Organization website URL (optional)",
          required: false,
        },
        {
          name: "bio",
          type: "string",
          description: "Brief biography or description (max 1000 characters, optional)",
          required: false,
        },
      ],
      handler: async ({ name, email, role, organization, phone, website, bio }) => {
        try {
          // Build update object
          const updates: Partial<OrganizerSetupData> = {};
          if (name !== undefined) updates.name = name;
          if (email !== undefined) updates.email = email;
          if (role !== undefined) updates.role = role;
          if (organization !== undefined) updates.organization = organization;
          if (phone !== undefined) updates.phone = phone;
          if (website !== undefined) updates.website = website;
          if (bio !== undefined) updates.bio = bio;

          // Validate the updated data
          const mergedData = { ...organizerData, ...updates };
          const validation = validateStageData(organizerSetupSchema, mergedData);

          if (!validation.success) {
            const errors = getValidationErrors(validation.errors);
            const errorMessages = Object.entries(errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            setError(`Validation failed: ${errorMessages}`);
            return `Validation errors: ${errorMessages}. Please fix these issues.`;
          }

          // Update state
          setOrganizerData(updates);

          // Auto-save progress
          try {
            await saveProgress();
          } catch (saveError) {
            console.error("Auto-save failed:", saveError);
          }

          setSuccessMessage("Organizer information updated successfully");

          // Check if stage is now complete
          if (mergedData.name && mergedData.email && mergedData.role) {
            return "Organizer information updated successfully! All required fields are complete. You can now proceed to Event Details.";
          }

          return "Organizer information updated successfully!";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to update organizer data";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "organizerSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  // Action: Proceed to Next Stage
  useCopilotAction(
    {
      name: "proceedToEventSetup",
      description: "Move to the Event Details stage after completing organizer setup. Only available when all required organizer fields are filled.",
      parameters: [],
      handler: async () => {
        try {
          // Validate before proceeding
          const validation = validateStageData(organizerSetupSchema, organizerData);

          if (!validation.success) {
            const errors = getValidationErrors(validation.errors);
            const errorMessages = Object.entries(errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            setError(`Cannot proceed: ${errorMessages}`);
            return `Please complete all required fields: ${errorMessages}`;
          }

          // Save before transitioning
          await saveProgress();

          // Transition to next stage
          nextStage();

          setSuccessMessage("Moving to Event Details");
          return "Great! Let's move on to setting up your event details.";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to proceed";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available:
        stage === "organizerSetup" &&
        !!(organizerData.name && organizerData.email && organizerData.role)
          ? "available"
          : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  // Action: Validate Current Data
  useCopilotAction(
    {
      name: "validateOrganizerData",
      description: "Check if the current organizer data is valid and complete",
      parameters: [],
      handler: async () => {
        const validation = validateStageData(organizerSetupSchema, organizerData);

        if (validation.success) {
          return "All organizer information is valid and complete!";
        } else {
          const errors = getValidationErrors(validation.errors);
          const errorMessages = Object.entries(errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join("\n");
          return `Validation errors:\n${errorMessages}`;
        }
      },
      available: stage === "organizerSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );
}
