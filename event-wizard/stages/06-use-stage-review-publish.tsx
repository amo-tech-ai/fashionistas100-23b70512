import { EventReview } from "@/components/generative-ui/event-review";
import { useGlobalState } from "@/lib/stages";
import { useCopilotAction, useCopilotAdditionalInstructions } from "@copilotkit/react-core";

/**
 * Stage 6: Review and publish event
 * Replaces: confirmOrder (NO LOOP BACK)
 * Final: published state
 */
export function useStageReviewPublish() {
  const { setEventPublished, stage, setStage } = useGlobalState();

  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: Review and publish event. Show the complete event summary and ask if they want to publish now or save as draft.",
      available: stage === "reviewPublish" ? "enabled" : "disabled",
    },
    [stage],
  );

  useCopilotAction(
    {
      name: "reviewEvent",
      description: "Review and publish the event",
      available: stage === "reviewPublish" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ status, respond }) => {
        return (
          <EventReview
            status={status}
            onPublish={(eventData) => {
              setEventPublished(eventData);
              respond?.(
                "Event published successfully! Your event is now live.",
              );
              // NO LOOP BACK - stay in published state
              setStage("published");
            }}
            onSaveDraft={() => {
              respond?.(
                "Event saved as draft. You can publish it later from your dashboard.",
              );
              setStage("dashboard");
            }}
          />
        );
      },
    },
    [stage],
  );
}
