import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCard } from "@/components/EventCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { listPublishedEvents, EventSummary } from "@/services/eventService";
import { fashionImages } from "@/lib/cloudinary";

const EVENTS_PER_PAGE = 12;

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allEvents, setAllEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // URL-controlled filters
  const search = searchParams.get("search") || "";
  const city = searchParams.get("city") || "";
  const sortBy = searchParams.get("sort") || "date";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Fetch all events (runs only when city changes)
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await listPublishedEvents({
          city: city || undefined,
          fromDateISO: new Date().toISOString(),
          limit: 100
        });

        if (fetchError) {
          setError(fetchError);
          setAllEvents([]);
          return;
        }

        setAllEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
        setAllEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [city]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Memoized filtered and sorted events
  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.venue.city?.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    if (sortBy === "date") {
      events.sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());
    } else if (sortBy === "price") {
      events.sort((a, b) => (a.priceMin || 0) - (b.priceMin || 0));
    } else if (sortBy === "name") {
      events.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "relevance" && search) {
      // Simple relevance scoring based on title match
      events.sort((a, b) => {
        const aScore = a.title.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
        const bScore = b.title.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
        return bScore - aScore;
      });
    }

    return events;
  }, [allEvents, search, sortBy]);

  // Memoized pagination
  const { paginatedEvents, totalPages, hasNextPage, hasPrevPage } = useMemo(() => {
    const total = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    const endIndex = startIndex + EVENTS_PER_PAGE;
    
    return {
      paginatedEvents: filteredEvents.slice(startIndex, endIndex),
      totalPages: total,
      hasNextPage: currentPage < total,
      hasPrevPage: currentPage > 1
    };
  }, [filteredEvents, currentPage]);

  const updateFilter = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Handle special "all" values
    if (value === "all" || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    // Reset to page 1 when filters change (except page changes)
    if (key !== "page") {
      newParams.delete("page");
    }
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Debounced search to improve performance
  const handleSearchChange = useCallback((value: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      updateFilter("search", value);
    }, 300);
    
    setSearchTimeout(timeout);
  }, [searchTimeout, updateFilter]);

  const navigateToPage = useCallback((page: number) => {
    updateFilter("page", page.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateFilter]);

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section with Cloudinary Images - Adjusted for fixed nav */}
        <div className="relative h-[400px] overflow-hidden bg-black mt-16 lg:mt-20">
          <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-60">
            {fashionImages.events.slice(0, 3).map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                <img 
                  src={image} 
                  alt={`Fashion event ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90" />
          <div className="relative z-10 h-full flex items-center justify-center text-center">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white">
                Fashion Events
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto px-4">
                Discover upcoming fashion shows, exhibitions, and exclusive events worldwide
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <div className="text-white/80">
                  <span className="text-3xl font-bold">{allEvents.length}</span>
                  <span className="ml-2">Events Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Header - Updated */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              <span>Showing {filteredEvents.length} upcoming events</span>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search events..."
                    defaultValue={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={city || undefined} onValueChange={(value) => updateFilter("city", value)}>
                <SelectTrigger className="w-full md:w-48">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
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
                  <SelectItem value="relevance">Relevance</SelectItem>
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
            <LoadingSkeleton variant="grid" count={12} />
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
          ) : filteredEvents.length === 0 ? (
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
              <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-muted-foreground">
                  Showing {((currentPage - 1) * EVENTS_PER_PAGE) + 1}-{Math.min(currentPage * EVENTS_PER_PAGE, filteredEvents.length)} of {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                </p>
                
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToPage(currentPage - 1)}
                      disabled={!hasPrevPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => navigateToPage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToPage(currentPage + 1)}
                      disabled={!hasNextPage}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {paginatedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              
              {/* Bottom Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigateToPage(currentPage - 1)}
                      disabled={!hasPrevPage}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    
                    <span className="text-sm text-muted-foreground px-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      onClick={() => navigateToPage(currentPage + 1)}
                      disabled={!hasNextPage}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </ErrorBoundary>
  );
};

export default Events;