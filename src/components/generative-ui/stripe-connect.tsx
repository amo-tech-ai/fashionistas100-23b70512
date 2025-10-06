import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface StripeConnectSetupProps {
  onSuccess: (accountId: string) => void;
  onSkip: () => void;
}

export function StripeConnectSetup({ onSuccess, onSkip }: StripeConnectSetupProps) {
  const handleConnect = () => {
    // Simulated Stripe Connect flow
    const mockAccountId = `acct_${Math.random().toString(36).substr(2, 9)}`;
    onSuccess(mockAccountId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">Payment Setup</h2>
        <p className="text-sm text-muted-foreground">
          Connect your Stripe account to receive payments directly
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">Connect with Stripe</h3>
          <p className="text-sm text-muted-foreground">
            Stripe will securely process payments and transfer funds directly to your account.
          </p>
        </div>

        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
          <li>Secure payment processing</li>
          <li>Direct deposits to your bank account</li>
          <li>Support for Colombian payment methods (PSE, Nequi)</li>
          <li>Real-time transaction tracking</li>
        </ul>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleConnect} className="flex-1">
            Connect Stripe Account
          </Button>
          <Button variant="outline" onClick={onSkip}>
            Skip for Now
          </Button>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        You can set up payments later from your dashboard
      </p>
    </div>
  );
}
