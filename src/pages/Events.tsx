import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Calendar, MapPin, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCard } from "@/components/EventCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { listPublishedEvents, EventSummary } from "@/services/eventService";

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // URL-controlled filters
  const search = searchParams.get("search") || "";
  const city = searchParams.get("city") || "";
  const sortBy = searchParams.get("sort") || "date";

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await listPublishedEvents({
          city: city || undefined,
          fromDateISO: new Date().toISOString(),
          limit: 50
        });

        if (fetchError) {
          setError(fetchError);
          setEvents([]);
          return;
        }

        let filteredEvents = data;

        // Client-side search filter
        if (search) {
          const searchLower = search.toLowerCase();
          filteredEvents = filteredEvents.filter(event =>
            event.title.toLowerCase().includes(searchLower) ||
            event.description?.toLowerCase().includes(searchLower) ||
            event.venue.city?.toLowerCase().includes(searchLower)
          );
        }

        // Client-side sorting
        if (sortBy === "date") {
          filteredEvents.sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());
        } else if (sortBy === "price") {
          filteredEvents.sort((a, b) => (a.priceMin || 0) - (b.priceMin || 0));
        } else if (sortBy === "name") {
          filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
        }

        setEvents(filteredEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, city, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-playfair mb-4">Fashion Events</h1>
            <p className="text-lg text-muted-foreground">
              Discover upcoming fashion shows, exhibitions, and exclusive events
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={city} onValueChange={(value) => updateFilter("city", value)}>
                <SelectTrigger className="w-full md:w-48">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Cities</SelectItem>
                  <SelectItem value="Milan">Milan</SelectItem>
                  <SelectItem value="Paris">Paris</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="London">London</SelectItem>
                  <SelectItem value="Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => updateFilter("sort", value)}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              {(search || city || sortBy !== "date") && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <LoadingSkeleton variant="card" count={6} />
          ) : error ? (
            <EmptyState
              icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
              title="Failed to load events"
              description={error}
              action={{
                label: "Try Again",
                onClick: () => window.location.reload()
              }}
            />
          ) : events.length === 0 ? (
            <EmptyState
              icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
              title="No events found"
              description={
                search || city
                  ? "Try adjusting your filters to see more events"
                  : "No upcoming events are available at the moment"
              }
              action={
                search || city
                  ? {
                      label: "Clear Filters",
                      onClick: clearFilters
                    }
                  : undefined
              }
            />
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  {events.length} event{events.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Events;