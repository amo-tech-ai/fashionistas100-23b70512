// ============================================
// Ticket Setup Stage Hook
// Version: 1.0.0
// Date: October 2, 2025
// ============================================

"use client";

import { useCopilotAction, useCopilotAdditionalInstructions, useCopilotReadable } from "@copilotkit/react-core";
import { useEventWizard } from "./014-global-state";
import { ticketSetupSchema, ticketTierSchema, validateStageData, getValidationErrors } from "./013-zod-schemas";
import type { TicketSetupData, TicketTier } from "./012-types-definitions";

export function useStageTicket() {
  const {
    stage,
    ticketData,
    setTicketData,
    nextStage,
    previousStage,
    saveProgress,
    setError,
    setSuccessMessage,
  } = useEventWizard();

  useCopilotAdditionalInstructions(
    {
      instructions: `
CURRENT STATE: Ticket Setup Stage

You are helping the user configure ticket tiers and pricing for their fashion event.

Required Information:
- At least one ticket tier with:
  - Name (2-100 characters)
  - Price (non-negative number)
  - Quantity (positive integer)

Optional Per-Tier Information:
- Description
- Benefits list
- Max per customer
- Availability status

Optional Global Settings:
- Early bird discount percentage
- Group discount threshold and percentage
- Refund policy
- Sales start/end dates

Instructions:
1. Suggest appropriate ticket tiers based on their event type (e.g., VIP, General Admission)
2. Help price tickets competitively
3. Recommend benefits for premium tiers
4. Suggest early bird or group discounts to boost sales
5. Once at least one tier is configured, they can proceed to sponsor setup

Be strategic in pricing recommendations based on the event type and expected attendance.
      `,
      available: stage === "ticketSetup" ? "available" : "disabled",
    },
    [stage]
  );

  useCopilotReadable(
    {
      description: "Ticket Setup Progress - What ticket tiers and pricing have been configured",
      value: {
        hasTiers: !!(ticketData.tiers && ticketData.tiers.length > 0),
        tiersCount: ticketData.tiers?.length || 0,
        hasEarlyBirdDiscount: !!ticketData.earlyBirdDiscount,
        hasGroupDiscount: !!(ticketData.groupDiscountThreshold && ticketData.groupDiscountPercentage),
        hasRefundPolicy: !!ticketData.refundPolicy,
        hasSalesDates: !!(ticketData.salesStartDate && ticketData.salesEndDate),
        isComplete: !!(ticketData.tiers && ticketData.tiers.length > 0),
        missingFields: [!(ticketData.tiers && ticketData.tiers.length > 0) && "at least one ticket tier"].filter(
          Boolean
        ),
      },
      available: stage === "ticketSetup" ? "available" : "disabled",
    },
    [stage, ticketData]
  );

  useCopilotAction(
    {
      name: "addTicketTier",
      description: "Add a new ticket tier with pricing and details",
      parameters: [
        {
          name: "name",
          type: "string",
          description: "Tier name (e.g., VIP, General Admission, Early Bird)",
          required: true,
        },
        {
          name: "price",
          type: "number",
          description: "Ticket price (non-negative)",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          description: "Number of tickets available (positive integer)",
          required: true,
        },
        {
          name: "description",
          type: "string",
          description: "Tier description (optional)",
          required: false,
        },
        {
          name: "benefits",
          type: "string[]",
          description: "List of benefits (optional, max 20)",
          required: false,
        },
        {
          name: "maxPerCustomer",
          type: "number",
          description: "Maximum tickets per customer (optional)",
          required: false,
        },
      ],
      handler: async ({ name, price, quantity, description, benefits, maxPerCustomer }) => {
        try {
          const newTier: TicketTier = {
            id: crypto.randomUUID(),
            name,
            price,
            quantity,
            description,
            benefits,
            maxPerCustomer,
            available: true,
          };

          const validation = validateStageData(ticketTierSchema, newTier);

          if (!validation.success) {
            const errors = getValidationErrors(validation.errors);
            const errorMessages = Object.entries(errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            setError(`Validation failed: ${errorMessages}`);
            return `Validation errors: ${errorMessages}. Please fix these issues.`;
          }

          const updatedTiers = [...(ticketData.tiers || []), newTier];
          setTicketData({ tiers: updatedTiers });

          try {
            await saveProgress();
          } catch (saveError) {
            console.error("Auto-save failed:", saveError);
          }

          setSuccessMessage(`Ticket tier "${name}" added successfully`);
          return `Ticket tier "${name}" added successfully! You now have ${updatedTiers.length} tier(s).`;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to add ticket tier";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "ticketSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "updateTicketSettings",
      description: "Update global ticket settings like discounts, refund policy, and sales dates",
      parameters: [
        {
          name: "earlyBirdDiscount",
          type: "number",
          description: "Early bird discount percentage (0-100, optional)",
          required: false,
        },
        {
          name: "groupDiscountThreshold",
          type: "number",
          description: "Minimum tickets for group discount (optional)",
          required: false,
        },
        {
          name: "groupDiscountPercentage",
          type: "number",
          description: "Group discount percentage (0-100, optional)",
          required: false,
        },
        {
          name: "refundPolicy",
          type: "string",
          description: "Refund policy description (optional)",
          required: false,
        },
        {
          name: "salesStartDate",
          type: "string",
          description: "Ticket sales start date (ISO format, optional)",
          required: false,
        },
        {
          name: "salesEndDate",
          type: "string",
          description: "Ticket sales end date (ISO format, optional)",
          required: false,
        },
      ],
      handler: async ({
        earlyBirdDiscount,
        groupDiscountThreshold,
        groupDiscountPercentage,
        refundPolicy,
        salesStartDate,
        salesEndDate,
      }) => {
        try {
          const updates: Partial<TicketSetupData> = {};
          if (earlyBirdDiscount !== undefined) updates.earlyBirdDiscount = earlyBirdDiscount;
          if (groupDiscountThreshold !== undefined) updates.groupDiscountThreshold = groupDiscountThreshold;
          if (groupDiscountPercentage !== undefined) updates.groupDiscountPercentage = groupDiscountPercentage;
          if (refundPolicy !== undefined) updates.refundPolicy = refundPolicy;
          if (salesStartDate !== undefined) updates.salesStartDate = salesStartDate;
          if (salesEndDate !== undefined) updates.salesEndDate = salesEndDate;

          setTicketData(updates);

          try {
            await saveProgress();
          } catch (saveError) {
            console.error("Auto-save failed:", saveError);
          }

          setSuccessMessage("Ticket settings updated successfully");
          return "Ticket settings updated successfully!";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to update ticket settings";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "ticketSetup" ? "available" : "disabled",
    },
    [stage, setTicketData, saveProgress, setError, setSuccessMessage]
  );

  useCopilotAction(
    {
      name: "proceedToSponsorSetup",
      description: "Move to the Sponsor Setup stage after configuring ticket tiers",
      parameters: [],
      handler: async () => {
        try {
          const validation = validateStageData(ticketSetupSchema, ticketData);

          if (!validation.success) {
            const errors = getValidationErrors(validation.errors);
            const errorMessages = Object.entries(errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            setError(`Cannot proceed: ${errorMessages}`);
            return `Please complete ticket setup: ${errorMessages}`;
          }

          await saveProgress();
          nextStage();
          setSuccessMessage("Moving to Sponsor Setup");
          return "Great! Now let's add sponsors to support your event.";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to proceed";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available:
        stage === "ticketSetup" && !!(ticketData.tiers && ticketData.tiers.length > 0)
          ? "available"
          : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "returnToVenueSetup",
      description: "Go back to the Venue Selection stage",
      parameters: [],
      handler: async () => {
        try {
          await saveProgress();
          previousStage();
          return "Returning to Venue Selection.";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to go back";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "ticketSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );
}
