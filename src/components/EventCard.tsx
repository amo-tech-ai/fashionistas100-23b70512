import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { EventSummary } from "@/hooks/useEventData";
import { useImageResolver } from "@/hooks/useImageResolver";
import { fashionImages } from "@/lib/cloudinary";

interface EventCardProps {
  event: EventSummary;
}

export const EventCard = ({ event }: EventCardProps) => {
  const { resolveImage } = useImageResolver();
  
  // Get a random Cloudinary image as fallback
  const getFallbackImage = () => {
    const randomIndex = Math.floor(Math.random() * fashionImages.events.length);
    return fashionImages.events[randomIndex];
  };
  
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
    <Link to={`/events/${event.id}`}>
      <Card className="group overflow-hidden bg-gradient-card hover:shadow-hover transition-smooth cursor-pointer h-full">
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          <img 
            src={event.heroImage ? resolveImage(event.heroImage) : getFallbackImage()} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getFallbackImage();
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <Badge variant={getCategoryVariant() as "default" | "secondary" | "destructive" | "outline"} className="font-inter text-xs">
              Event
            </Badge>
          </div>
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <Badge variant="destructive" className="font-inter text-xs">
              Featured
            </Badge>
          </div>
        </div>
      
      <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <h3 className="font-playfair text-lg sm:text-xl font-bold text-foreground group-hover:text-foreground transition-smooth line-clamp-2">
            {event.title}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="font-inter text-sm truncate">Designer TBD</span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="font-inter">{formatDate(event.startISO)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="font-inter">{formatTime(event.startISO)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="font-inter truncate">{event.venue.name}, {event.venue.city || event.venue.address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border mt-auto">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-inter">From</p>
            <p className="text-base sm:text-lg font-bold text-foreground font-playfair">
              {event.priceMin ? `${event.currency || '$'}${event.priceMin}` : 'TBD'}
            </p>
          </div>
          <Button variant="hero" size="sm" className="font-inter text-sm">
            Get Tickets
          </Button>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};