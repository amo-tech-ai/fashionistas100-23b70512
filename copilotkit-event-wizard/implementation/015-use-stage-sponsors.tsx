// ============================================
// Sponsor Setup Stage Hook
// Version: 1.0.0
// Date: October 2, 2025
// ============================================

"use client";

import { useCopilotAction, useCopilotAdditionalInstructions, useCopilotReadable } from "@copilotkit/react-core";
import { useEventWizard } from "./014-global-state";
import { sponsorSetupSchema, sponsorSchema, validateStageData, getValidationErrors } from "./013-zod-schemas";
import type { SponsorSetupData, Sponsor } from "./012-types-definitions";

export function useStageSponsor() {
  const {
    stage,
    sponsorData,
    setSponsorData,
    nextStage,
    previousStage,
    saveProgress,
    setError,
    setSuccessMessage,
  } = useEventWizard();

  useCopilotAdditionalInstructions(
    {
      instructions: `
CURRENT STATE: Sponsor Setup Stage

You are helping the user add sponsors and configure sponsorship tiers for their fashion event.

IMPORTANT: Sponsors are OPTIONAL. The user can skip this stage if they don't have sponsors yet.

Optional Information:
- Sponsors list (max 50):
  - Name (required)
  - Tier (required)
  - Amount (required)
  - Logo URL
  - Website URL
  - Benefits list
- Target sponsorship amount
- Sponsorship tiers with benefits
- Application deadline

Instructions:
1. Explain that sponsors are optional but can help fund the event
2. If they want sponsors, help them define sponsorship tiers (e.g., Platinum, Gold, Silver)
3. Suggest appropriate sponsorship amounts based on event scale
4. Help them articulate sponsor benefits
5. They can always skip this stage and come back later
6. Once done (or skipped), proceed to review and publish

Be encouraging but not pushy about sponsorships.
      `,
      available: stage === "sponsorSetup" ? "available" : "disabled",
    },
    [stage]
  );

  useCopilotReadable(
    {
      description: "Sponsor Setup Progress - What sponsorship details have been configured",
      value: {
        hasSponsors: !!(sponsorData.sponsors && sponsorData.sponsors.length > 0),
        sponsorsCount: sponsorData.sponsors?.length || 0,
        hasTargetAmount: !!sponsorData.targetAmount,
        hasSponsorshipTiers: !!(sponsorData.sponsorshipTiers && sponsorData.sponsorshipTiers.length > 0),
        hasDeadline: !!sponsorData.deadline,
        isComplete: true, // Always complete because sponsors are optional
        totalCommitted: sponsorData.sponsors?.reduce((sum, s) => sum + s.amount, 0) || 0,
      },
      available: stage === "sponsorSetup" ? "available" : "disabled",
    },
    [stage, sponsorData]
  );

  useCopilotAction(
    {
      name: "addSponsor",
      description: "Add a new sponsor with their details and commitment amount",
      parameters: [
        {
          name: "name",
          type: "string",
          description: "Sponsor company name",
          required: true,
        },
        {
          name: "tier",
          type: "string",
          description: "Sponsorship tier (e.g., Platinum, Gold, Silver, Bronze)",
          required: true,
        },
        {
          name: "amount",
          type: "number",
          description: "Sponsorship amount committed",
          required: true,
        },
        {
          name: "logo",
          type: "string",
          description: "Sponsor logo URL (optional)",
          required: false,
        },
        {
          name: "website",
          type: "string",
          description: "Sponsor website URL (optional)",
          required: false,
        },
        {
          name: "benefits",
          type: "string[]",
          description: "Benefits provided to this sponsor (optional)",
          required: false,
        },
      ],
      handler: async ({ name, tier, amount, logo, website, benefits }) => {
        try {
          const newSponsor: Sponsor = {
            id: crypto.randomUUID(),
            name,
            tier,
            amount,
            logo,
            website,
            benefits,
          };

          const validation = validateStageData(sponsorSchema, newSponsor);

          if (!validation.success) {
            const errors = getValidationErrors(validation.errors);
            const errorMessages = Object.entries(errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            setError(`Validation failed: ${errorMessages}`);
            return `Validation errors: ${errorMessages}. Please fix these issues.`;
          }

          const updatedSponsors = [...(sponsorData.sponsors || []), newSponsor];
          setSponsorData({ sponsors: updatedSponsors });

          try {
            await saveProgress();
          } catch (saveError) {
            console.error("Auto-save failed:", saveError);
          }

          const totalAmount = updatedSponsors.reduce((sum, s) => sum + s.amount, 0);

          setSuccessMessage(`Sponsor "${name}" added successfully`);
          return `Sponsor "${name}" added successfully! You now have ${updatedSponsors.length} sponsor(s) with total commitment of $${totalAmount}.`;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to add sponsor";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "sponsorSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "updateSponsorSettings",
      description: "Update sponsorship settings like target amount and deadline",
      parameters: [
        {
          name: "targetAmount",
          type: "number",
          description: "Target total sponsorship amount (optional)",
          required: false,
        },
        {
          name: "deadline",
          type: "string",
          description: "Sponsorship application deadline (ISO format, optional)",
          required: false,
        },
      ],
      handler: async ({ targetAmount, deadline }) => {
        try {
          const updates: Partial<SponsorSetupData> = {};
          if (targetAmount !== undefined) updates.targetAmount = targetAmount;
          if (deadline !== undefined) updates.deadline = deadline;

          setSponsorData(updates);

          try {
            await saveProgress();
          } catch (saveError) {
            console.error("Auto-save failed:", saveError);
          }

          setSuccessMessage("Sponsorship settings updated successfully");
          return "Sponsorship settings updated successfully!";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to update sponsor settings";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "sponsorSetup" ? "available" : "disabled",
    },
    [stage, setSponsorData, saveProgress, setError, setSuccessMessage]
  );

  useCopilotAction(
    {
      name: "proceedToReviewPublish",
      description: "Move to the Review & Publish stage. Sponsors are optional, so you can proceed even without any sponsors.",
      parameters: [],
      handler: async () => {
        try {
          // Validate if there are any sponsors
          if (sponsorData.sponsors && sponsorData.sponsors.length > 0) {
            const validation = validateStageData(sponsorSetupSchema, sponsorData);

            if (!validation.success) {
              const errors = getValidationErrors(validation.errors);
              const errorMessages = Object.entries(errors)
                .map(([field, message]) => `${field}: ${message}`)
                .join(", ");
              setError(`Validation failed: ${errorMessages}`);
              return `Validation errors: ${errorMessages}. Please fix these issues or remove invalid sponsors.`;
            }
          }

          await saveProgress();
          nextStage();
          setSuccessMessage("Moving to Review & Publish");

          if (sponsorData.sponsors && sponsorData.sponsors.length > 0) {
            return `Excellent! You have ${sponsorData.sponsors.length} sponsor(s). Let's review everything and publish your event!`;
          } else {
            return "No problem! You can add sponsors later. Let's review everything and publish your event!";
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to proceed";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "sponsorSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "returnToTicketSetup",
      description: "Go back to the Ticket Setup stage",
      parameters: [],
      handler: async () => {
        try {
          await saveProgress();
          previousStage();
          return "Returning to Ticket Setup.";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to go back";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "sponsorSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );
}
