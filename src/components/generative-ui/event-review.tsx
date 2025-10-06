import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EventReviewProps {
  status?: string;
  onPublish: (eventData: any) => void;
  onSaveDraft: () => void;
}

export function EventReview({ status, onPublish, onSaveDraft }: EventReviewProps) {
  const handlePublish = () => {
    const eventData = {
      published: true,
      publishedAt: new Date().toISOString()
    };
    onPublish(eventData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">Review & Publish</h2>
        <p className="text-sm text-muted-foreground">
          Review your event details before publishing
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-2">Event Summary</h3>
          <p className="text-sm text-muted-foreground">
            Your event is ready to go live. Review all details and publish when ready.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm font-medium text-foreground">Status</span>
            <span className="text-sm text-muted-foreground">Ready to Publish</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm font-medium text-foreground">Tickets</span>
            <span className="text-sm text-muted-foreground">Configured</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm font-medium text-foreground">Venue</span>
            <span className="text-sm text-muted-foreground">Configured</span>
          </div>
          
          <div className="flex justify-between py-2">
            <span className="text-sm font-medium text-foreground">Payment</span>
            <span className="text-sm text-muted-foreground">Ready</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handlePublish} className="flex-1">
            Publish Event
          </Button>
          <Button variant="outline" onClick={onSaveDraft}>
            Save as Draft
          </Button>
        </div>
      </Card>

      {status && (
        <p className="text-xs text-muted-foreground text-center">Status: {status}</p>
      )}
    </div>
  );
}
