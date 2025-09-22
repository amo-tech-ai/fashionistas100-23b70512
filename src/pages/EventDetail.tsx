import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { withErrorHandling } from "@/utils/errorHandling";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/EmptyState";
import { EventHero } from "@/components/events/EventHero";
import BookingWidgetMock from "@/components/events/BookingWidgetMock";
import { RelatedEvents } from "@/components/events/RelatedEvents";
import { ImageLightbox } from "@/components/events/ImageGallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, MapPin, Users, Star, MessageCircle, Sparkles, User } from "lucide-react";
import { EventSummary, useEvent } from "@/hooks/useEventData";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

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
  const { event, loading, error } = useEvent(id || "");
  const [tickets, setTickets] = useState<TicketTier[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTickets = async () => {
      if (!id) return;

      const ticketsData = await withErrorHandling(
        async () => {
            const { data, error } = await supabase
              .from('tickets')
              .select('*')
              .eq('event_id', id)
              .order('price', { ascending: true });
          
          if (error) throw error;
          return data || [];
        },
        toast,
        "Failed to load ticket information"
      );

      if (ticketsData) {
        // Map database schema to TicketTier interface
        const mappedTickets = ticketsData.map(ticket => ({
          id: ticket.id,
          ticket_name: ticket.ticket_type || 'General Admission',
          ticket_type: ticket.ticket_type || 'general',
          description: null,
          price: ticket.price,
          currency: 'USD',
          total_quantity: ticket.quantity,
          sold_quantity: ticket.sold,
          available_quantity: ticket.quantity - ticket.sold,
          status: 'active'
        }));
        setTickets(mappedTickets);
      }
    };

    fetchTickets();
  }, [id, toast]);

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
      
      {/* Hero Section - Dark Background with Image */}
      <EventHero event={event} onImageClick={handleImageClick} />

      {/* Quick Info + Pricing Widget - White Background */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Quick Event Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Event Overview
                    </CardTitle>
                    {getCountdownDisplay()}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-semibold">Date</p>
                          <p className="text-muted-foreground">{formatDate(event.startISO)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
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
                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
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
                        <Users className="w-5 h-5 text-primary mt-0.5" />
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
            </div>

            {/* Right Column - Booking Widget */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BookingWidgetMock eventId={event.id} eventTitle={event.event_name} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section - White Background with Dark Headers */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-foreground">
              <TabsTrigger value="overview" className="text-background data-[state=active]:bg-background data-[state=active]:text-foreground">Overview</TabsTrigger>
              <TabsTrigger value="schedule" className="text-background data-[state=active]:bg-background data-[state=active]:text-foreground">Schedule</TabsTrigger>
              <TabsTrigger value="designers" className="text-background data-[state=active]:bg-background data-[state=active]:text-foreground">Designers</TabsTrigger>
              <TabsTrigger value="venue" className="text-background data-[state=active]:bg-background data-[state=active]:text-foreground">Venue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {event.description || 'Join us for an unforgettable fashion experience featuring the latest trends and designs from talented creators.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Detailed schedule will be available soon. Stay tuned for updates!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="designers" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Featured Designers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Designer lineup will be announced soon. Stay tuned for updates!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="venue" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Venue Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">{event.venue.name}</h4>
                      {event.venue.address && (
                        <p className="text-muted-foreground">{event.venue.address}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Events - Dark Background */}
      <section className="py-12 bg-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-playfair font-bold text-background mb-4">Related Events</h2>
            <p className="text-background/80 max-w-2xl mx-auto">
              Discover similar fashion events you might be interested in
            </p>
          </div>
           <RelatedEvents 
            currentEventId={event.id} 
            currentEventCity={event.venue?.city || undefined} 
          />
        </div>
      </section>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
      />
      
      <Footer />
    </div>
  );
};

export default EventDetail;