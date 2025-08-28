import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, ArrowLeft, ExternalLink, Share2, Copy, Check, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navigation } from "@/components/Navigation";
import { getEventById, EventSummary } from "@/services/eventService";
import { format } from "date-fns";

// Ticket selection types
interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
}

interface TicketSelection {
  [tierID: string]: number;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<TicketSelection>({});
  const [shareSuccess, setShareSuccess] = useState(false);

  // Mock ticket tiers (in real app, this would come from the event data)
  const ticketTiers: TicketTier[] = [
    {
      id: 'general',
      name: 'General Admission',
      price: event?.priceMin || 150,
      description: 'Standard access to the event',
      available: Math.floor((event?.available || 100) * 0.6)
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: event?.priceMax || 350,
      description: 'Premium seating with exclusive perks',
      available: Math.floor((event?.available || 100) * 0.3)
    },
    {
      id: 'platinum',
      name: 'Platinum Access',
      price: (event?.priceMax || 350) * 2,
      description: 'Ultimate luxury experience with backstage access',
      available: Math.floor((event?.available || 100) * 0.1)
    }
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError("Invalid event ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await getEventById(id);

        if (fetchError) {
          setError(fetchError);
          return;
        }

        if (!data) {
          setError("Event not found");
          return;
        }

        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy");
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: event?.description || "",
          url: url,
        });
      } catch (err) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  const updateTicketQuantity = (tierId: string, quantity: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [tierId]: Math.max(0, Math.min(10, quantity))
    }));
  };

  const getTotalPrice = () => {
    return ticketTiers.reduce((total, tier) => {
      const quantity = selectedTickets[tier.id] || 0;
      return total + (tier.price * quantity);
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((total, quantity) => total + quantity, 0);
  };

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/events">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </Button>
            <LoadingSkeleton variant="detail" />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (error || !event) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/events">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </Button>
            <EmptyState
              icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
              title="Event not found"
              description={error || "The event you're looking for doesn't exist or has been removed."}
              action={{
                label: "Browse Events",
                onClick: () => window.location.href = "/events"
              }}
            />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navigation />
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-primary">
          {event.heroImage && (
            <img
              src={event.heroImage}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
            <div className="text-white">
              <Button variant="ghost" asChild className="mb-4 text-white hover:bg-white/20">
                <Link to="/events">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Link>
              </Button>
              <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {formatDate(event.startISO)}
                </div>
                {event.venue.city && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {event.venue.city}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {event.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Date & Time</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(event.startISO)}
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatTime(event.startISO)}
                          {event.endISO && ` - ${formatTime(event.endISO)}`}
                        </div>
                      </div>
                    </div>

                    {event.venue.name && (
                      <div>
                        <h3 className="font-semibold mb-3">Venue</h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            {event.venue.name}
                          </div>
                          {event.venue.address && (
                            <p className="text-sm text-muted-foreground pl-6">
                              {event.venue.address}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {event.capacity && (
                    <div>
                      <h3 className="font-semibold mb-3">Capacity</h3>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        {event.available} / {event.capacity} tickets available
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gallery */}
              {event.galleryImages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.galleryImages.slice(0, 6).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${event.title} gallery ${index + 1}`}
                          className="aspect-square object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ticket Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Tickets</CardTitle>
                  <CardDescription>
                    Choose your preferred ticket tier and quantity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {ticketTiers.map((tier) => (
                    <div key={tier.id} className="space-y-3 p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{tier.name}</h4>
                          <p className="text-sm text-muted-foreground">{tier.description}</p>
                          <p className="text-lg font-bold text-accent">
                            {event?.currency || 'USD'} {tier.price}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tier.available} available
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateTicketQuantity(tier.id, (selectedTickets[tier.id] || 0) - 1)}
                            disabled={!selectedTickets[tier.id] || selectedTickets[tier.id] === 0}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {selectedTickets[tier.id] || 0}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateTicketQuantity(tier.id, (selectedTickets[tier.id] || 0) + 1)}
                            disabled={(selectedTickets[tier.id] || 0) >= 10 || (selectedTickets[tier.id] || 0) >= tier.available}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {selectedTickets[tier.id] && selectedTickets[tier.id] > 0 && (
                          <div className="text-sm font-medium">
                            {event?.currency || 'USD'} {tier.price * selectedTickets[tier.id]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {getTotalTickets() > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total ({getTotalTickets()} tickets)</span>
                          <span>{event?.currency || 'USD'} {getTotalPrice()}</span>
                        </div>
                        <Button className="w-full" size="lg">
                          Proceed to Checkout
                        </Button>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full" onClick={handleShare}>
                      {shareSuccess ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Link Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Event
                        </>
                      )}
                    </Button>
                  </div>

                  {event?.available !== null && event?.available < 20 && (
                    <Badge variant="destructive" className="w-full justify-center">
                      Only {event.available} tickets left!
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Designer Lineup */}
              <Card>
                <CardHeader>
                  <CardTitle>Featured Designers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">AR</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Alessandro Rossi</h4>
                        <p className="text-sm text-muted-foreground">Haute Couture</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">SC</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Sofia Chen</h4>
                        <p className="text-sm text-muted-foreground">Emerging Talent</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">ML</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Maya Laurent</h4>
                        <p className="text-sm text-muted-foreground">Sustainable Fashion</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View All Designers
                  </Button>
                </CardContent>
              </Card>

              {/* Venue Info */}
              {event.venue.name && (
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium">{event.venue.name}</h4>
                      {event.venue.address && (
                        <p className="text-sm text-muted-foreground">
                          {event.venue.address}
                        </p>
                      )}
                      {event.venue.city && (
                        <p className="text-sm text-muted-foreground">
                          {event.venue.city}, {event.venue.country}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default EventDetail;