import { TicketConfiguration } from "@/components/generative-ui/ticket-configuration";
import { useGlobalState } from "@/lib/stages";
import {
  useCopilotAction,
  useCopilotAdditionalInstructions,
} from "@copilotkit/react-core";

/**
 * Stage 3: Configure ticketing
 * Replaces: sellFinancing
 * Next: venueSetup (no branching)
 */
export function useStageTicketSetup() {
  const { setTicketInfo, stage, setStage } = useGlobalState();

  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: Setting up event ticketing. Ask if they want Simple (one price), Tiered (VIP + General), or Free (RSVP only) ticketing.",
      available: stage === "ticketSetup" ? "enabled" : "disabled",
    },
    [stage],
  );

  useCopilotAction(
    {
      name: "configureTickets",
      description: "Set up ticket pricing and tiers",
      available: stage === "ticketSetup" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        return (
          <TicketConfiguration
            status={status}
            templates={[
              { id: 'simple', label: 'Simple', description: 'One price for all', price: '$75' },
              { id: 'tiered', label: 'Tiered', description: 'VIP + General', price: '$200/$75' },
              { id: 'free', label: 'Free', description: 'RSVP only', price: '$0' }
            ]}
            onComplete={(ticketData) => {
              setTicketInfo(ticketData);
              respond?.("Tickets configured successfully.");
              // Always go to venue setup (no branching)
              setStage("venueSetup");
            }}
          />
        );
      },
    },
    [stage],
  );
}
