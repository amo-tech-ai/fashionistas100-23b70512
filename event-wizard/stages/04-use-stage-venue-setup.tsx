import { VenueSelector } from "@/components/generative-ui/venue-selector";
import { useGlobalState } from "@/lib/stages";
import { useCopilotAction, useCopilotAdditionalInstructions } from "@copilotkit/react-core";

/**
 * Stage 4: Select venue
 * Replaces: getFinancingInfo
 * Next: paymentSetup
 */
export function useStageVenueSetup() {
  const { setVenueInfo, stage, setStage } = useGlobalState();

  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: Selecting event venue. Ask if they want Physical (in-person), Virtual (online), or Hybrid (both) event.",
      available: stage === "venueSetup" ? "enabled" : "disabled",
    },
    [stage],
  );

  useCopilotAction(
    {
      name: "selectVenue",
      description: "Configure event venue",
      available: stage === "venueSetup" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        return (
          <VenueSelector
            status={status}
            modes={['physical', 'virtual', 'hybrid']}
            onSubmit={(venue) => {
              setVenueInfo(venue);
              respond?.("Venue configured successfully.");
              setStage("paymentSetup");
            }}
          />
        );
      },
    },
    [stage],
  );
}
