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
import { EventSummary, useEvents } from "@/hooks/useEventData";
import { fashionImages } from "@/lib/cloudinary";

const EVENTS_PER_PAGE = 12;

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // URL-controlled filters
  const city = searchParams.get('city') || '';
  const eventType = searchParams.get('type') || '';
  const date = searchParams.get('date') || '';
  const query = searchParams.get('search') || '';
  
  // Fetch events using the new hook
  const { events: allEvents, loading, error } = useEvents({
    city: city || undefined,
    limit: 100
  });

  // Derived state
  const search = useMemo(() => query, [query]);
  const sortBy = useMemo(() => searchParams.get('sort') || 'date', [searchParams]);
  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    return Math.max(1, page);
  }, [searchParams]);

  // Handle URL state changes
  const updateSearchParams = useCallback((newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Reset to page 1 when filters change
    if (Object.keys(newParams).some(key => key !== 'page')) {
      params.delete('page');
    }
    
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Search functionality with debouncing
  const handleSearchChange = useCallback((value: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      updateSearchParams({ search: value || null });
    }, 300);
    
    setSearchTimeout(timeout);
  }, [searchTimeout, updateSearchParams]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.venue?.city?.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    if (sortBy === "date") {
      events.sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());
    } else if (sortBy === "price") {
      events.sort((a, b) => (a.priceMin || 0) - (b.priceMin || 0));
    } else if (sortBy === "name") {
      events.sort((a, b) => a.title.localeCompare(b.title));
    }

    return events;
  }, [allEvents, search, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    const endIndex = startIndex + EVENTS_PER_PAGE;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, currentPage]);

  const navigateToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateSearchParams({ page: page.toString() });
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages, updateSearchParams]);

  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-playfair font-bold mb-4">Loading Events...</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            icon={<Calendar className="w-8 h-8" />}
            title="Error Loading Events"
            description={error}
            action={
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            }
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent/20 via-background to-accent/10 py-16 px-4">
        <div className="absolute inset-0 opacity-10">
          <img 
            src={fashionImages.heroes[0]} 
            alt="Fashion Events" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto text-center">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Fashion Events
            <span className="block text-accent">Around the World</span>
          </h1>
          <p className="font-inter text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover exclusive fashion shows, runway events, and designer showcases. 
            From emerging talent to haute couture, find your next fashion experience.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search events, designers, or cities..."
                defaultValue={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg font-inter bg-background/80 backdrop-blur-sm border-accent/20 focus:border-accent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex flex-1 gap-4">
              <Select value={sortBy} onValueChange={(value) => updateSearchParams({ sort: value })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
              
              {(search || city || eventType || date) && (
                <Button variant="outline" onClick={resetFilters} className="whitespace-nowrap">
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
            
              <div className="text-sm text-muted-foreground">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                {search && ` for "${search}"`}
              </div>
          </div>

          {/* Events Grid */}
          <ErrorBoundary>
            {paginatedEvents.length === 0 ? (
              <EmptyState
                icon={<Calendar className="w-8 h-8" />}
                title="No Events Found"
                description={
                  search || city || eventType || date
                    ? "Try adjusting your search criteria or clear filters to see all events."
                    : "No events are currently available. Check back soon for upcoming fashion shows!"
                }
                action={
                  (search || city || eventType || date) ? (
                    <Button onClick={resetFilters}>Clear Filters</Button>
                  ) : undefined
                }
              />
            ) : (
              <div>
                {/* Top Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigateToPage(currentPage - 1)}
                        disabled={!hasPrevPage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </span>
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
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
                              className="w-10 h-10"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => navigateToPage(currentPage + 1)}
                        disabled={!hasNextPage}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ErrorBoundary>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;