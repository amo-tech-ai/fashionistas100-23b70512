// ============================================
// Venue Setup Stage Hook
// Version: 1.0.0
// Date: October 2, 2025
// ============================================

"use client";

import { useCopilotAction, useCopilotAdditionalInstructions, useCopilotReadable } from "@copilotkit/react-core";
import { useEventWizard } from "./014-global-state";
import { venueSetupSchema, validateStageData, getValidationErrors } from "./013-zod-schemas";
import type { VenueSetupData } from "./012-types-definitions";

export function useStageVenue() {
  const {
    stage,
    venueData,
    setVenueData,
    nextStage,
    previousStage,
    saveProgress,
    setError,
    setSuccessMessage,
  } = useEventWizard();

  useCopilotAdditionalInstructions(
    {
      instructions: `
CURRENT STATE: Venue Selection Stage

You are helping the user select or add a venue for their fashion event.

Required Information:
- Venue Name (2-200 characters)
- Full Address (5-500 characters)
- City (2-100 characters)
- Country (2-100 characters)
- Capacity (positive integer)

Optional Information:
- State/Province
- Postal Code
- Amenities (max 20)
- Parking availability (boolean)
- Accessibility features (max 15)
- Venue type
- Rental cost

Instructions:
1. Ask if they have a venue in mind or need suggestions
2. Help them search for suitable venues based on their event type and expected attendance
3. Collect all required venue details
4. Confirm capacity matches expected attendance
5. Suggest adding amenities and accessibility features for better attendee experience
6. Once complete, proceed to ticket setup

Be helpful in suggesting venue types that match their event.
      `,
      available: stage === "venueSetup" ? "available" : "disabled",
    },
    [stage]
  );

  useCopilotReadable(
    {
      description: "Venue Setup Progress - What venue details have been provided",
      value: {
        hasVenueName: !!venueData.venueName,
        hasAddress: !!venueData.address,
        hasCity: !!venueData.city,
        hasCountry: !!venueData.country,
        hasCapacity: !!venueData.capacity,
        hasAmenities: !!(venueData.amenities && venueData.amenities.length > 0),
        hasAccessibility: !!(venueData.accessibilityFeatures && venueData.accessibilityFeatures.length > 0),
        isComplete: !!(
          venueData.venueName &&
          venueData.address &&
          venueData.city &&
          venueData.country &&
          venueData.capacity
        ),
        missingFields: [
          !venueData.venueName && "venue name",
          !venueData.address && "address",
          !venueData.city && "city",
          !venueData.country && "country",
          !venueData.capacity && "capacity",
        ].filter(Boolean),
      },
      available: stage === "venueSetup" ? "available" : "disabled",
    },
    [stage, venueData]
  );

  useCopilotAction(
    {
      name: "updateVenueData",
      description: "Update venue information including name, location, capacity, and amenities",
      parameters: [
        {
          name: "venueName",
          type: "string",
          description: "Name of the venue (2-200 characters)",
          required: false,
        },
        {
          name: "venueId",
          type: "string",
          description: "Venue ID if selecting from existing venues (UUID)",
          required: false,
        },
        {
          name: "address",
          type: "string",
          description: "Full street address (5-500 characters)",
          required: false,
        },
        {
          name: "city",
          type: "string",
          description: "City (2-100 characters)",
          required: false,
        },
        {
          name: "state",
          type: "string",
          description: "State or province (optional)",
          required: false,
        },
        {
          name: "country",
          type: "string",
          description: "Country (2-100 characters)",
          required: false,
        },
        {
          name: "postalCode",
          type: "string",
          description: "Postal/ZIP code (optional)",
          required: false,
        },
        {
          name: "capacity",
          type: "number",
          description: "Maximum capacity (positive integer)",
          required: false,
        },
        {
          name: "amenities",
          type: "string[]",
          description: "Available amenities (optional, max 20)",
          required: false,
        },
        {
          name: "parkingAvailable",
          type: "boolean",
          description: "Whether parking is available (optional)",
          required: false,
        },
        {
          name: "accessibilityFeatures",
          type: "string[]",
          description: "Accessibility features (optional, max 15)",
          required: false,
        },
        {
          name: "venueType",
          type: "string",
          description: "Type of venue (e.g., Hotel Ballroom, Convention Center)",
          required: false,
        },
        {
          name: "rentalCost",
          type: "number",
          description: "Rental cost (optional)",
          required: false,
        },
      ],
      handler: async ({
        venueName,
        venueId,
        address,
        city,
        state,
        country,
        postalCode,
        capacity,
        amenities,
        parkingAvailable,
        accessibilityFeatures,
        venueType,
        rentalCost,
      }) => {
        try {
          const updates: Partial<VenueSetupData> = {};
          if (venueName !== undefined) updates.venueName = venueName;
          if (venueId !== undefined) updates.venueId = venueId;
          if (address !== undefined) updates.address = address;
          if (city !== undefined) updates.city = city;
          if (state !== undefined) updates.state = state;
          if (country !== undefined) updates.country = country;
          if (postalCode !== undefined) updates.postalCode = postalCode;
          if (capacity !== undefined) updates.capacity = capacity;
          if (amenities !== undefined) updates.amenities = amenities;
          if (parkingAvailable !== undefined) updates.parkingAvailable = parkingAvailable;
          if (accessibilityFeatures !== undefined) updates.accessibilityFeatures = accessibilityFeatures;
          if (venueType !== undefined) updates.venueType = venueType;
          if (rentalCost !== undefined) updates.rentalCost = rentalCost;

          const mergedData = { ...venueData, ...updates };
          const validation = validateStageData(venueSetupSchema, mergedData);

          if (!validation.success) {
            const errors = getValidationErrors(validation.errors);
            const errorMessages = Object.entries(errors)
              .map(([field, message]) => `${field}: ${message}`)
              .join(", ");
            setError(`Validation failed: ${errorMessages}`);
            return `Validation errors: ${errorMessages}. Please fix these issues.`;
          }

          setVenueData(updates);

          try {
            await saveProgress();
          } catch (saveError) {
            console.error("Auto-save failed:", saveError);
          }

          setSuccessMessage("Venue details updated successfully");

          if (
            mergedData.venueName &&
            mergedData.address &&
            mergedData.city &&
            mergedData.country &&
            mergedData.capacity
          ) {
            return "Venue details updated successfully! All required fields are complete. You can now proceed to Ticket Setup.";
          }

          return "Venue details updated successfully!";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to update venue data";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "venueSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "proceedToTicketSetup",
      description: "Move to the Ticket Setup stage after completing venue details",
      parameters: [],
      handler: async () => {
        try {
          const validation = validateStageData(venueSetupSchema, venueData);

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
          setSuccessMessage("Moving to Ticket Setup");
          return "Perfect! Let's configure your ticket tiers and pricing.";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to proceed";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available:
        stage === "venueSetup" &&
        !!(
          venueData.venueName &&
          venueData.address &&
          venueData.city &&
          venueData.country &&
          venueData.capacity
        )
          ? "available"
          : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );

  useCopilotAction(
    {
      name: "returnToEventSetup",
      description: "Go back to the Event Details stage",
      parameters: [],
      handler: async () => {
        try {
          await saveProgress();
          previousStage();
          return "Returning to Event Details.";
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to go back";
          setError(message);
          return `Error: ${message}`;
        }
      },
      available: stage === "venueSetup" ? "available" : "disabled",
    },
    [stage] // CRITICAL: Only stage dependency per official pattern
  );
}
