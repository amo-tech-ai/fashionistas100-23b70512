import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, ArrowLeft, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getEventById, EventSummary } from "@/services/eventService";
import { format } from "date-fns";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
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
                  <CardTitle>Get Tickets</CardTitle>
                  <CardDescription>
                    Reserve your spot at this exclusive event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.priceMin !== null && (
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {event.currency || 'USD'} {event.priceMin}
                        {event.priceMax && event.priceMax !== event.priceMin && (
                          <span className="text-lg text-muted-foreground"> - {event.priceMax}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Starting price</p>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      Select Tickets
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Event
                    </Button>
                  </div>

                  {event.available !== null && event.available < 10 && (
                    <Badge variant="destructive" className="w-full justify-center">
                      Only {event.available} tickets left!
                    </Badge>
                  )}
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