import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Clock } from "lucide-react";
import { EventSummary } from "@/services/eventService";

interface EventCardProps {
  event: EventSummary;
}

export const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };

  const getCategoryVariant = () => {
    // Since we don't have category in EventSummary, use a default
    return 'accent';
  };

  return (
    <Card className="group overflow-hidden bg-gradient-card hover:shadow-hover transition-smooth cursor-pointer">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={event.heroImage || "/placeholder.svg"} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute top-4 left-4">
          <Badge variant={getCategoryVariant() as any} className="font-inter">
            Event
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="destructive" className="font-inter">
            Featured
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-playfair text-xl font-bold text-foreground group-hover:text-accent transition-smooth">
            {event.title}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="font-inter text-sm">Designer TBD</span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="font-inter">{formatDate(event.startISO)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-inter">{formatTime(event.startISO)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="font-inter">{event.venue.name}, {event.venue.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-inter">From</p>
            <p className="text-lg font-bold text-accent font-playfair">
              {event.priceMin ? `${event.currency || '$'}${event.priceMin}` : 'TBD'}
            </p>
          </div>
          <Button variant="hero" size="sm" className="font-inter">
            Get Tickets
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};