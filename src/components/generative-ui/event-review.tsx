import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGlobalState } from "@/lib/stages";
import { Calendar, MapPin, Ticket, CreditCard, User } from "lucide-react";

interface EventReviewProps {
  status?: string;
  onPublish: (eventData: any) => void;
  onSaveDraft: () => void;
}

export function EventReview({ status, onPublish, onSaveDraft }: EventReviewProps) {
  const { 
    organizerInfo, 
    eventInfo, 
    venueInfo, 
    ticketInfo, 
    paymentMethod 
  } = useGlobalState();

  const handlePublish = () => {
    const eventData = {
      organizer: organizerInfo,
      event: eventInfo,
      venue: venueInfo,
      tickets: ticketInfo,
      payment: paymentMethod,
      publishedAt: new Date().toISOString()
    };
    onPublish(eventData);
  };

  const sections = [
    {
      icon: User,
      title: "Organizer",
      data: [
        { label: "Name", value: organizerInfo?.name || "—" },
        { label: "Email", value: organizerInfo?.email || "—" },
        { label: "Organization", value: organizerInfo?.organization || "—" }
      ]
    },
    {
      icon: Calendar,
      title: "Event Details",
      data: [
        { label: "Title", value: eventInfo?.title || "—" },
        { label: "Type", value: eventInfo?.type?.replace('_', ' ') || "—" },
        { label: "Date", value: eventInfo?.date || "—" },
        { label: "Time", value: eventInfo?.startTime ? `${eventInfo.startTime}${eventInfo.endTime ? ` - ${eventInfo.endTime}` : ''}` : "—" }
      ]
    },
    {
      icon: MapPin,
      title: "Venue",
      data: [
        { label: "Type", value: venueInfo?.type || "—" },
        { label: "Name", value: venueInfo?.name || "—" },
        { label: "Capacity", value: venueInfo?.capacity || "—" }
      ]
    },
    {
      icon: Ticket,
      title: "Tickets",
      data: [
        { label: "Pricing", value: ticketInfo?.type || "—" },
        { label: "Tiers", value: ticketInfo?.tiers?.length || 0 }
      ]
    },
    {
      icon: CreditCard,
      title: "Payment",
      data: [
        { label: "Method", value: paymentMethod?.type === 'stripe_connect' ? 'Stripe' : 'Manual' },
        { label: "Status", value: paymentMethod?.onboarded ? 'Connected' : 'Pending' }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">Review & Publish</h2>
        <p className="text-sm text-muted-foreground">
          Review your event details before publishing
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Card key={section.title} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <section.icon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{section.title}</h3>
            </div>
            <div className="space-y-2">
              {section.data.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}:</span>
                  <span className="font-medium capitalize">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={onSaveDraft}
          variant="outline"
          className="flex-1"
          disabled={status === "complete"}
        >
          Save as Draft
        </Button>
        <Button
          onClick={handlePublish}
          className="flex-1"
          disabled={status === "complete"}
        >
          Publish Event Now
        </Button>
      </div>

      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>✓ Your event will be visible immediately</p>
        <p>✓ Edit details anytime from dashboard</p>
      </div>
    </div>
  );
}
