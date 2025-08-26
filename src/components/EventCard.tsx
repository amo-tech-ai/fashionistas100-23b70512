import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Clock } from "lucide-react";
import { Event } from "@/data/sampleEvents";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'Haute Couture':
        return 'hero';
      case 'VIP':
        return 'accent';
      case 'Emerging Designers':
        return 'olive';
      default:
        return 'sand';
    }
  };

  return (
    <Card className="group overflow-hidden bg-gradient-card hover:shadow-hover transition-smooth cursor-pointer">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute top-4 left-4">
          <Badge variant={getCategoryVariant(event.category) as any} className="font-inter">
            {event.category}
          </Badge>
        </div>
        {event.featured && (
          <div className="absolute top-4 right-4">
            <Badge variant="destructive" className="font-inter">
              Featured
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-playfair text-xl font-bold text-foreground group-hover:text-accent transition-smooth">
            {event.title}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="font-inter text-sm">{event.designer}</span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="font-inter">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-inter">{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="font-inter">{event.venue}, {event.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-inter">From</p>
            <p className="text-lg font-bold text-accent font-playfair">
              ${event.price.general}
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