import { StripeConnectSetup } from "@/components/generative-ui/stripe-connect";
import { useGlobalState } from "@/lib/stages";
import { useCopilotAction, useCopilotAdditionalInstructions } from "@copilotkit/react-core";

/**
 * Stage 5: Payment setup with Stripe Connect
 * Replaces: getPaymentInfo (NO CARD COLLECTION)
 * Next: reviewPublish
 */
export function useStagePaymentSetup() {
  const { setPaymentMethod, stage, setStage } = useGlobalState();

  useCopilotAdditionalInstructions(
    {
      instructions:
        "CURRENT STATE: Setting up payment processing. Explain that we'll connect their Stripe account to receive payments directly. NO card collection.",
      available: stage === "paymentSetup" ? "enabled" : "disabled",
    },
    [stage],
  );

  useCopilotAction(
    {
      name: "connectPayments",
      description: "Connect Stripe for payment processing",
      available: stage === "paymentSetup" ? "enabled" : "disabled",
      renderAndWaitForResponse: ({ respond }) => {
        return (
          <StripeConnectSetup
            onSuccess={(accountId) => {
              setPaymentMethod({ 
                type: 'stripe_connect',
                accountId,
                onboarded: true 
              });
              respond?.("Payment processing connected successfully.");
              setStage("reviewPublish");
            }}
            onSkip={() => {
              setPaymentMethod({ type: 'manual' });
              respond?.("Skipped payment setup - you can connect later.");
              setStage("reviewPublish");
            }}
          />
        );
      },
    },
    [stage],
  );
}
