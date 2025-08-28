import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { EventHero } from "@/components/events/EventHero";
import { BookingWidget } from "@/components/events/BookingWidget";
import { RelatedEvents } from "@/components/events/RelatedEvents";
import { ImageLightbox } from "@/components/events/ImageGallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, MapPin, Users, Star, MessageCircle, Sparkles } from "lucide-react";
import { EventSummary, getEventById } from "@/services/eventService";
import { supabase } from "@/integrations/supabase/client";

interface TicketTier {
  id: string;
  ticket_name: string;
  ticket_type: string;
  description: string | null;
  price: number;
  currency: string;
  total_quantity: number;
  sold_quantity: number;
  available_quantity: number;
  status: string;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [tickets, setTickets] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch event details
        const { data: eventData, error: eventError } = await getEventById(id);
        if (eventError) throw new Error(eventError);
        if (!eventData) throw new Error("Event not found");

        setEvent(eventData);

        // Fetch tickets for this event
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('event_tickets')
          .select('*')
          .eq('event_id', id)
          .eq('status', 'active')
          .order('price', { ascending: true });

        if (ticketsError) throw ticketsError;
        setTickets(ticketsData || []);

      } catch (err: any) {
        console.error('Error fetching event data:', err);
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const handleImageClick = (imageUrl: string, allImages: string[]) => {
    const index = allImages.findIndex(img => img === imageUrl);
    setCurrentImageIndex(index >= 0 ? index : 0);
    setLightboxImages(allImages);
    setLightboxOpen(true);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  const getCountdownDisplay = () => {
    if (!event) return null;
    
    const eventDate = new Date(event.startISO);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    
    if (diffTime <= 0) {
      return <Badge variant="secondary">Event has passed</Badge>;
    }
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return <Badge variant="destructive">{diffDays} days remaining</Badge>;
    } else if (diffHours > 0) {
      return <Badge variant="destructive">{diffHours} hours remaining</Badge>;
    } else {
      return <Badge variant="destructive">Starting soon!</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon={<CalendarDays className="w-8 h-8" />}
            title="Event not found"
            description={error || "The event you're looking for doesn't exist or has been removed."}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <EventHero event={event} onImageClick={handleImageClick} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Event Description */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    About This Event
                  </CardTitle>
                  {getCountdownDisplay()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {event.description || 'Join us for an unforgettable fashion experience featuring the latest trends and designs from talented creators.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Event Information */}
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-semibold">Date</p>
                        <p className="text-muted-foreground">{formatDate(event.startISO)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-semibold">Time</p>
                        <p className="text-muted-foreground">
                          {formatTime(event.startISO)}
                          {event.endISO && ` - ${formatTime(event.endISO)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-semibold">Venue</p>
                        <p className="text-muted-foreground">
                          {event.venue.name}
                          {event.venue.address && (
                            <>
                              <br />
                              <span className="text-sm">{event.venue.address}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-semibold">Capacity</p>
                        <p className="text-muted-foreground">
                          {event.capacity ? `${event.capacity} attendees` : 'Limited capacity'}
                          {event.ticketsSold > 0 && (
                            <span className="block text-sm">
                              {event.ticketsSold} tickets sold
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Designer Lineup Section */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Designers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Designer lineup will be announced soon. Stay tuned for updates!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Reviews & Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to share your experience!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingWidget event={event} tickets={tickets} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Events */}
      <Separator className="my-12" />
      <RelatedEvents 
        currentEventId={event.id} 
        currentEventCity={event.venue.city || undefined} 
      />

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
      />
    </div>
  );
};

export default EventDetail;